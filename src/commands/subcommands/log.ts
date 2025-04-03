import { Commands } from '../../structures';
import { Guild } from '../../models';

export const Log: Commands['run'] = async (client, message, args, locale) => {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) return await message.error(locale('commands.partner.channel.no_channel'), {
        image: locale('images.partner_log_no_channel')
    });

    await Guild.updateOne({ guildId: message.guild.id }, {
        $set: {
            'partner.log': channel.id
        }
    }, { upsert: true });

    await message.success(locale('commands.partner.log.success', { channel: channel.id }));
};