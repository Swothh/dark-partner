import { EmbedBuilder, WebhookClient, version } from 'discord.js';
import { Manager } from './managers';
import { dbManager } from './utils';
import { Global } from './models';
import { Server } from './server';
import startStateServer from './state';
import config from './configs';
import chalk from 'chalk';
import './utils/logger';

const ascii = `
██████╗  █████╗ ██████╗ ██╗  ██╗  ${chalk.gray('-')} ${chalk.blue('CLIENT VERSION')}           :  v${chalk.cyan(config.main.version)}
██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝  ${chalk.gray('-')} ${chalk.blue('NODE_JS VERSION')}          :  ${chalk.cyan(process.version)}
██║  ██║███████║██████╔╝█████╔╝   ${chalk.gray('-')} ${chalk.blue('DISCORD_JS VERSION')}       :  v${chalk.cyan(version)}
██║  ██║██╔══██║██╔══██╗██╔═██╗   ${chalk.gray('-')} ${chalk.blue('BUILD MODE')}               :  ${chalk.cyan(config.main.__development ? 'Development' : 'Production')}
██████╔╝██║  ██║██║  ██║██║  ██╗  ${chalk.gray('-')} ${chalk.blue('GLOBAL PREFIX')}            :  ${chalk.cyan(config.main.global_prefix)}
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝  ${chalk.gray('-')} ${chalk.blue('PORT')}                     :  ${chalk.cyan('80')}                
`;

const logLine = () => console.log(chalk.gray('---------------------------------------------------------'));
console.log(chalk.gray('-------------------- CLIENT STARTING --------------------'));
console.log(config.main.__development ? chalk.yellow(ascii) : chalk.red(ascii));
logLine();

if (!config.main.__development && config.main.__whitelist?.enabled) {
    console.error('Whitelist mode cannot be turned on when development mode is off.');
    process.exit(1);
};

if (config.main.__whitelist?.enabled) {
    console.log('');
    console.log(` ${chalk.bgRed.white(' WARNING ')} ${chalk.underline('White list')} mode is active, users can ${chalk.underline('USE')} the bot.`);
    console.log('');
    logLine();
};

const manager = new Manager('./src/index.ts', {
    token: config.main.tokens[config.main.__development ? 'development' : 'production'],
    totalShards: 2,
    respawn: true,
    execArgv: ['-r', 'ts-node/register']
});

try {
    Server(manager);
} catch (err) {
    console.error('[shard.ts] Error:', err);
};

const webhook = new WebhookClient(config.webhooks.shard);
console.info('Discord Client is starting...');

startStateServer();
dbManager();

manager.on('shardCreate', shard => {
    console.info(`Shard #${shard.id} is created.`);

    webhook.send({
        content: `⏳ **${shard.id}** kimlikli **Shard** başlatılıyor...`
    });

    shard.on('message', msg => {
        if (typeof msg !== 'string') return;

        if (msg === 'invalid_test_bot') {
            console.error('The bot ID specified for the whitelist mode does not match the current bot ID.');
            process.exit(1);
        } else if (msg?.startsWith('respawn:')) {
            const id = msg.slice(8);
            if (id === 'all') {
                manager.respawnAll({ timeout: -1 });
                return;
            };

            const shardId = Number(id);
            if (isNaN(shardId) || !manager.shards.get(shardId)) return;

            manager.shards.get(shardId).respawn({ timeout: -1 });
        } if (msg.startsWith('reload:')) {
            const file = msg.slice(7);
            if (file === 'locales') {
                manager.shards.forEach(async s => {
                    await s.eval('this.reloadLocale()');
                });
                return;
            };

            const arg = file !== 'all' ? `"${file}"` : '';
            manager.shards.forEach(async s => {
                await s.eval('this.reloadCommand(' + arg + ')');
            });
        };
    });

    shard.on('death', async () => {
        console.error(`Shard #${shard.id} is down.`);
        await Global.updateOne({ globalId: 'global' }, { $inc: { 'stats.totalCrash': 1 } }, { upsert: true });

        webhook.send({
            content: `🔴 **${shard.id}** kimlikli **Shard** düştü.`
        });
    });

    shard.on('disconnect', () => {
        console.error(`Shard #${shard.id} is disconnected.`);

        webhook.send({
            content: `🔴 **${shard.id}** kimlikli **Shard'ın** bağlantısı koptu.`
        });
    });

    shard.on('error', async error => {
        await Global.updateOne({ globalId: 'global' }, { $inc: { 'stats.totalError': 1 } }, { upsert: true });
        console.error(error, `SHARD #${shard.id}`);
    });

    shard.on('ready', async () => {
        const notReady = shard.manager.shards.filter(s => !s.ready);
        console.success(`Shard #${shard.id} is ready. (${shard.manager.shards.size - notReady.size}/${shard.manager.shards.size ?? 0})`);
        if (notReady.size === 0) console.success('All shards are initialized, the bot is ready.');

        await Global.updateOne({ globalId: 'global' }, { $inc: { 'stats.totalReboot': 1 }, $set: { 'stats.lastReboot': Date.now() } }, { upsert: true });
        webhook.send({
            content: `🟢 **${shard.id}** kimlikli **Shard** başarıyla başlatıldı.`
        });
    });
}).spawn({ timeout: -1 });