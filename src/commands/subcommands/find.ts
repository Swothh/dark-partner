import { Commands } from '../../structures';
import { Guild } from '../../models';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType } from 'discord.js';

export const Find: Commands['run'] = async (client, message, args, locale) => {
    let db = await Guild.findOne({ guildId: message.guild.id });

    let requests = client.collectionGuilds.get('database_requests');
    let timeouts = client.collectionGuilds.get('database_timeouts');
    let guilds = client.collectionGuilds.get('database_guild')
        .filter(g => g.guildId !== message.guild.id)
        .filter(g => g.partner?.status === 1)
        .filter(g => message.guild.memberCount >= (g.partner?.must?.member ?? 0))
        .filter(g => !g.partner?.blacklists?.categories?.includes(db?.partner?.category ?? '??'))
        .filter(g => !g.partner?.blacklists?.guilds?.includes(message.guild.id))
        .filter(g => typeof g.partner?.text !== undefined)
        .filter(g => typeof g.partner?.category !== undefined)
        .filter(g => typeof g.partner?.channel !== undefined)
        .filter(g => typeof g.partner?.log !== undefined)
        .filter(g => typeof g.partner?.staff !== undefined)
        .filter(g => !requests.find(r => (r.guild === message.guild.id && r.target === g.guildId) || (r.target === message.guild.id && r.guild === g.guildId)))
        .filter(g => !timeouts.find(t => (t.guild === message.guild.id && t.target === g.guildId) || (t.target === message.guild.id && t.guild === g.guildId)))
        .filter(async g => !(await client.shardManager.eval('GET_GUILD', { guild: g.guildId })));

    const per_page = 9;
    const max_page = Math.ceil(guilds.length / per_page);

    let page = 1;

    const get_embed = async () => {
        const fields = await Promise.all(guilds.sort((a, b) => b.partner?.point - a.partner?.point).slice((page - 1) * per_page, page * per_page).map(async g => {
            const guildData = (await client.shardManager.eval('GET_GUILD', { guild: g.guildId }))?.data;

            return {
                name: '‧' + ' ' + (guildData?.name ?? 'Unknown'),
                value: locale('commands.partner.find.fields_value', {
                    url: g.partner?.specialUrl ? g.partner?.specialUrl : g.partner?.url ? g.partner?.url : locale('commands.partner.data.no_url'),
                    category: locale(`categories.${g.partner?.category.replace('_server', '').replace('botlist', 'botlist_code').replace('global', 'public')}`) ?? locale('commands.partner.data.no_data'),
                    total: g.partner?.total ?? 0,
                    point: g.partner?.point ?? 0,
                }),
                inline: true
            };
        }));

        return new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setAuthor({ name: message.guild.name + ' ' + locale('commands.partner.find.author'), iconURL: message.guild.iconURL() })
            .setFooter({ text: locale('commands.partner.find.footer', { page, max_page } as any), iconURL: client.config.icons.info })
            .setTimestamp()
            .addFields(fields);
    };

    const get_components = () => new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('auto_page.previous_10')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1 || max_page < 10)
                .setEmoji(client.config.emojis.previous)
                .setLabel('10'),
            new ButtonBuilder()
                .setCustomId('find.previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1)
                .setEmoji(client.config.emojis.previous),
            new ButtonBuilder()
                .setCustomId('find.next')
                .setDisabled(page === max_page)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(client.config.emojis.next),
            new ButtonBuilder()
                .setCustomId('find.next_10')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === max_page || max_page < 10)
                .setEmoji(client.config.emojis.next)
                .setLabel('10')
        );

    const msg = await message.nmReply({
        embeds: [
            await get_embed()
        ],
        components: [
            get_components()
        ]
    });

    const collector = client.managers.Collector({
        msg,
        channel: message.channel,
        componentType: ComponentType.Button,
        time: 60000,
        filter: i => i.user.id === i.user.id && i.message.id === msg.id,
    });

    collector.on('collect', async i => {
        if (i.customId === 'find.previous') {
            page = Math.max(page - 1, 1);
        } else if (i.customId === 'find.next') {
            page = Math.min(page + 1, max_page);
        } else if (i.customId === 'find.next_10') {
            page = Math.min(page + 10, max_page);
        } else if (i.customId === 'find.previous_10') {
            page = Math.max(page - 10, 1);
        }

        await i.update({
            embeds: [await get_embed()],
            components: [get_components()]
        });
    });

};