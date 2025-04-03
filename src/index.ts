import './utils/logger';
import * as Sentry from '@sentry/node';
import { ActivityType, Routes } from 'discord.js';
import config from './configs';
import Dark from './client';

const temp = console.error;
console.error = (message: string, title?: string) => {
    if (String(message).includes('ExperimentalWarning')) return;
    if (title !== 'HANDLED ERROR') Sentry.captureException(message);
    temp(message, title ?? '');
};

const bot = new Dark();
bot.init();
bot.setMaxListeners(0);

bot.on('ready', async () => {
    bot.user?.setPresence({
        activities: [
            {
                name: config.main.presence.replace('{shard_no}', String(bot.shard?.ids[0])),
                type: ActivityType.Playing
            }
        ]
    });

    bot.REST.put(Routes.applicationCommands(bot.user.id), {
        body: bot.context_commands.toJSON().flatMap((contextMenu) => {
            return {
                name: contextMenu.name,
                type: 3,
                name_localizations: contextMenu.name_localizations,
                options: contextMenu.options
            };
        }).concat((bot.slash_commands.toJSON() as any))
    }).then(() => {
        console.success('Slash Commands/Context menus have been posted!');
    }).catch((err) => {
        console.error(err);
    });

    console.info('Presence set successfully.');
});

Sentry.init(config.sentry);
const sentryHandler = (error: Error | string) => {
    console.error(error, 'HANDLED ERROR');
    const hub = Sentry.getCurrentHub();

    hub.withScope(scope => {
        scope.setLevel('fatal');
        hub.captureException(error, { originalException: error });
    });
};

global.process
    .on('uncaughtException', sentryHandler)
    .on('unhandledRejection', sentryHandler);