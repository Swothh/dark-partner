import { Commands } from '../../structures';
import { Guild } from '../../models';

export const Staff: Commands['run'] = async (client, message, args, locale) => {
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) return await message.error(locale('commands.partner.staff.no_role', {
        image: locale('images.partner_staff_no_role')
    }));

    await Guild.updateOne({ guildId: message.guild.id }, {
        $set: {
            'partner.staff': role.id
        }
    }, { upsert: true });

    await message.success(locale('commands.partner.staff.success', { role: role.id }));
};