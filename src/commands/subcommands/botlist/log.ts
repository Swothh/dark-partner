import { Commands } from '../../../structures';
import { Guild } from '../../../models';

export const Log: Commands['run'] = async (client, message, args, locale) => {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) return await message.error(locale('commands.botlist.log.no_channel', {
        image: locale('images.partner_channel_no_channel')
    }));

    await Guild.updateOne({ guildId: message.guild.id }, {
        $set: {
            'botlist.log': channel.id
        }
    }, { upsert: true });

    await message.success(locale('commands.botlist.log.success', { channel: channel.id }));
};