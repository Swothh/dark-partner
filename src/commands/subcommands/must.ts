import { Commands } from '../../structures';
import { Guild } from '../../models';

export const Must: Commands['run'] = async (client, message, args, locale) => {
    let [ must ] = args;
    must === locale('commands.partner.must.reset') ? locale('commands.partner.must.reset') : must;

    if (must === locale('commands.partner.must.reset')) {
        await Guild.updateOne({ guildId: message.guild.id }, {
            $set: {
                'partner.must.member': 0
            }
        }, { upsert: true });

        await message.success(locale('commands.partner.must.reset_success'));
        
        return;
    };

    if (typeof must === 'undefined') return await message.error(locale('commands.partner.must.no_number'));
    if (isNaN(Number(must))) return await message.error(locale('commands.partner.must.no_number'));
    if (Number(must) < 0) return await message.error(locale('commands.partner.must.no_number'));
    if (Number(must) > message.guild.memberCount) return await message.error(locale('commands.partner.must.member_count_error'));
    if (Number(must) > client.config.limits.partner_must_max) return await message.error(locale('commands.partner.must.max_error', { max: client.config.limits.partner_must_max as any }));

    await Guild.updateOne({ guildId: message.guild.id }, {
        $set: {
            'partner.must.member': Number(must)
        }
    }, { upsert: true });

    await message.success(Number(must) < 1 ? locale('commands.partner.must.reset_success') : locale('commands.partner.must.success', { must: must }));
};