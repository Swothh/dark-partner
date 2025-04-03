import { Commands } from '../../../structures';
import { Guild } from '../../../models';

export const Check: Commands['run'] = async (client, message, args, locale) => {
    let guild_db = await Guild.findOne({ guildId: '1077948443567345706' }, { botlist: true });
    let array = [];

    guild_db?.botlist?.bots.forEach(async (bot: any) => {
        if (bot.botID === client.user.id) return;

        const check = message.guild?.members.cache.get(bot.botOwner);
        if (!check) {
            array.push(bot.botID);

            const check_bot = message.guild?.members.cache.get(bot.botID);
            if (check_bot) {
                await Guild.updateOne({ guildId: message.guild?.id }, {
                    $pull: {
                        'botlist.bots': {
                            botID: bot.botID
                        }
                    }
                }, { upsert: true });

                await check_bot.kick('BOTLIST_CHECK_COMMAND').catch(() => { });
            };
        };
    });

    if (array.length === 0) return message.success(locale('commands.botlist.check.error'));
    await message.success(locale('commands.botlist.check.success', { count: guild_db?.botlist?.bots?.length.toLocaleString() ?? '0', count_2: array.length.toLocaleString() ?? '0' }));
};