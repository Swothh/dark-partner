import { Commands } from '../../../structures';
import { Guild } from '../../../models';

export const AutoRole: Commands['run'] = async (client, message, args, locale) => {
    const [v] = args;
    const bot = (locale as any)('commands.botlist.autorole.array_bot');
    const user = (locale as any)('commands.botlist.autorole.array_user');

    if (!bot.includes(v) && !user.includes(v)) return await message.error(locale('commands.botlist.autorole.no_value'));
    if (user.includes(v)) {
        const role = message.mentions.roles.first();
        if (!role) return await message.error(locale('commands.botlist.autorole.no_role'));

        await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'botlist.autorole.user': role.id } }, { upsert: true });
        return await message.success(locale('commands.botlist.autorole.success_user', { role: role.id }));
    } else if (bot.includes(v)) {
        const role = message.mentions.roles.first();
        if (!role) return await message.error(locale('commands.botlist.autorole.no_role'));

        await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'botlist.autorole.bot': role.id } }, { upsert: true });
        return await message.success(locale('commands.botlist.autorole.success_bot', { role: role.id }));
    };
};