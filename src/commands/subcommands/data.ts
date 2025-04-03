import { Commands } from '../../structures';
import { Guild } from '../../models';
import { EmbedBuilder } from 'discord.js';
import moment from 'moment';
import 'moment-duration-format';

export const Data: Commands['run'] = async (client, message, args, locale) => {
    const db = await Guild.findOne({ guildId: message.guild.id }, { partner: true, updatedAt: true, createdAt: true });
    const last_update = new Date(db.updatedAt).getTime();
    const date = new Date(db.createdAt).getTime();

    let time: any;
    const remain = db.partner?.specialUrlMs - (Date.now() - db.partner?.specialUrlDate);

    if (remain < 1) time = locale('commands.shop.end_soon');
    else time = (moment.duration(remain) as any).format(locale('format'))

    await message.channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setAuthor({ name: message.guild.name + locale('commands.partner.data.author'), iconURL: message.guild.iconURL() })
                .setFooter({ text: locale('commands.partner.data.footer'), iconURL: client.config.icons.warning })
                .setTimestamp()
                .setDescription(locale('commands.partner.data.description', { created_date: `<t:${Math.floor(date / 1000)}:R>`, date: `<t:${Math.floor(last_update / 1000)}:R>` }))
                .addFields((locale as any)('commands.partner.data.fields').map((field: any) => ({
                    name: field.name,
                    value: field.value
                        .replace('{channel}', db?.partner?.channel ?? locale('commands.partner.data.no_data'))
                        .replace('{log}', db.partner?.log ?? locale('commands.partner.data.no_data'))
                        .replace('{staff}', db.partner?.staff ?? locale('commands.partner.data.no_data'))
                        .replace('{text}', db.partner?.text?.slice(0, 70) ?? locale('commands.partner.data.no_data'))
                        .replace('{status}', db.partner?.status ? locale('commands.partner.data.open') : locale('commands.partner.data.closed'))
                        .replace('{url}', db?.partner?.specialUrl ? db.partner?.specialUrl : db?.partner?.url ? db.partner?.url : locale('commands.partner.data.no_url'))
                        .replace('{url_time}', db?.partner?.specialUrl ? time : locale('commands.partner.data.no_url'))
                        .replace('{must}', db?.partner?.must?.member ?? 0)
                        .replace('{category}', `${client.config.categories(client.managers.Localizer(client, db)).find(x => x.value === db?.partner?.category ?? '??')?.label ?? '??'}`)
                        .replace('{total}', db.partner?.total ?? 0),
                    inline: true
                })))
        ]
    });
};