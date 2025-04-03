import { Commands } from '../../../structures';
import { Guild } from '../../../models';

export const Channel: Commands['run'] = async (client, message, args, locale) => {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) return await message.error(locale('commands.botlist.channel.no_channel', {
        image: locale('images.partner_channel_no_channel')
    }));

    await Guild.updateOne({ guildId: message.guild.id }, {
        $set: {
            'botlist.channel': channel.id
        }
    }, { upsert: true });

    await message.success(locale('commands.botlist.channel.success', { channel: channel.id }));
};