import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, UserFlagsBitField } from 'discord.js';
import { Commands } from '../../structures';
import { Guild } from '../../models';
import { Localizer } from '../../managers';

export const Command: Commands = {
    name: 'add-bot',
    description: 'add-bot-description',
    aliases: ['addbot', 'botekle', 'bot-ekle', 'botadd', 'bot-add'],
    category: 'users',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const guild_db = await Guild.findOne({ guildId: message.guild.id }, { botlist: true });
        if (!guild_db || guild_db?.botlist?.status !== 1 || guild_db?.botlist.addType !== 1 || guild_db?.botlist?.channel !== message.channel.id) return;

        const guild_locale = Localizer(client, guild_db);
        const err = (content: string, code: string) => message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.error)
                    .setAuthor({ name: locale('commands.botlist.addbot.err.author', { user: message.author.displayName }), iconURL: message.author.avatarURL() })
                    .setDescription(content)
                    .setFooter({ text: `err.code: ${code}`, iconURL: client.config.icons.error })
                    .setTimestamp()
            ]
        }).then(m => setTimeout(() => m.delete().catch(() => { }), 5000));

        const success = (content: string, code: string) => message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.success)
                    .setAuthor({ name: locale('commands.botlist.addbot.success.author', { user: message.author.displayName }), iconURL: message.author.avatarURL() })
                    .setDescription(content)
                    .setFooter({ text: `code: ${code}`, iconURL: client.config.icons.success })
                    .setTimestamp()
            ]
        }).then(m => setTimeout(() => m.delete().catch(() => { }), 5000));

        const [bot_id, prefix] = args;
        if (!bot_id) return await err(locale('commands.botlist.addbot.err.types.MISSING_ID'), 'MISSING_ID');
        if (!prefix) return await err(locale('commands.botlist.addbot.err.types.MISSING_PREFIX'), 'MISSING_PREFIX');

        /////////////////////////////
        if (message.guild.members.cache.get(bot_id)) return await err(locale('commands.botlist.addbot.err.types.BOT_IN_SERVER'), 'BOT_IN_SERVER');
        if (guild_db?.botlist?.queue?.find(b => b.id === bot_id)) return await err(locale('commands.botlist.addbot.err.types.BOT_IN_QUEUE'), 'BOT_IN_QUEUE');
        if (guild_db?.botlist?.blacklists.includes(bot_id)) return await err(locale('commands.botlist.addbot.err.types.BOT_BLACKLISTED'), 'BOT_BLACKLISTED');
        /////////////////////////////

        const get_bot = await client.utils.GetBot.DISCORD(bot_id);
        message.delete().catch(() => { });

        if (!get_bot) return await err(locale('commands.botlist.addbot.err.types.INVALID_BOT_ID'), 'INVALID_BOT_ID');
        if (!get_bot.application.bot_public) return await err(locale('commands.botlist.addbot.err.types.BOT_NOT_PUBLIC'), 'BOT_NOT_PUBLIC');
        if (get_bot.bot.approximate_guild_count < guild_db?.botlist?.must?.server) return await err(locale('commands.botlist.addbot.err.types.BOT_NOT_ENOUGH_SERVER'), 'BOT_NOT_ENOUGH_SERVER');

        const get_bot_topgg = await client.utils.GetBot.TOPGG(bot_id);
        if (guild_db?.botlist?.must?.topgg && !get_bot_topgg) return await err(locale('commands.botlist.addbot.err.types.BOT_NOT_IN_TOPGG'), 'BOT_NOT_IN_TOPGG');

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${get_bot.bot.id}/${get_bot.bot.avatar}.png`)
            .setAuthor({ name: `${get_bot.bot.username} — ${guild_locale('events.botlist.addBot.request.author')}`, iconURL: `https://cdn.discordapp.com/avatars/${get_bot.bot.id}/${get_bot.bot.avatar}.png` })
            .addFields((guild_locale as any)('events.botlist.addBot.request.fields').map((field: any) => ({
                name: field.name,
                value: field.value
                    .replace('{bot_name}', get_bot.bot.username)
                    .replace('{bot_prefix}', prefix)
                    .replace('{bot_id}', get_bot.bot.id)
                    .replace('{bot_guilds}', get_bot.bot.approximate_guild_count)
                    .replace('{bot_dbl}', get_bot_topgg ? guild_locale('events.botlist.addBot.request.approved') : guild_locale('events.botlist.addBot.request.unapproved'))
                    .replace('{bot_owner}', `${message.author.displayName} *(${message.author.username})*`)
                    .replace('{bot_terms}', get_bot.application?.terms_of_service_url ? `[${guild_locale('events.botlist.addBot.request.click')}](${get_bot.application.terms_of_service_url})` : guild_locale('events.botlist.addBot.request.no'))
                    .replace('{bot_privacy}', get_bot.application?.privacy_policy_url ? `[${guild_locale('events.botlist.addBot.request.click')}](${get_bot.application.privacy_policy_url})` : guild_locale('events.botlist.addBot.request.no'))
                    .replace('{bot_website}', get_bot_topgg?.website ? `[${guild_locale('events.botlist.addBot.request.click')}](${get_bot_topgg.website})` : guild_locale('events.botlist.addBot.request.no'))
                    .replace('{bot_support}', get_bot_topgg?.support ? `[${guild_locale('events.botlist.addBot.request.click')}](https://discord.com/${get_bot_topgg.support})` : guild_locale('events.botlist.addBot.request.no'))
                    .replace('{bot_discord_verified}', new UserFlagsBitField(get_bot.bot.public_flags).toArray().includes('VerifiedBot') ? guild_locale('events.botlist.addBot.request.approved') : guild_locale('events.botlist.addBot.request.unapproved'))
                    .replace('{bot_github}', get_bot_topgg?.github ? `[${guild_locale('events.botlist.addBot.request.click')}](${get_bot_topgg.github})` : guild_locale('events.botlist.addBot.request.no'))
                    .replace('{bot_description}', get_bot_topgg?.shortdesc ? get_bot_topgg.shortdesc : get_bot.application.description ? get_bot.application.description : guild_locale('events.botlist.addBot.request.no'))
                    .replace('{bot_tags}', get_bot?.application?.tags?.length ? get_bot.application.tags.map((tag: string) => `\`${tag}\``).join(', ') : get_bot_topgg?.tags?.length ? get_bot_topgg.tags.map((tag: string) => `\`${tag}\``).join(', ') : guild_locale('events.botlist.addBot.request.no')),
                inline: field.inline
            })))
            .setFooter({ text: guild_locale('events.botlist.addBot.request.footer'), iconURL: client.config.icons.info })
            .setTimestamp();

        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('botlist.add_bot_interaction.approve')
                    .setLabel(locale('events.botlist.addBot.request.approve'))
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('botlist.add_bot_interaction.deny')
                    .setLabel(locale('events.botlist.addBot.request.deny'))
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel(locale('events.botlist.addBot.request.view'))
                    .setURL(`https://discord.com/oauth2/authorize?client_id=${get_bot.bot.id}&permissions=0&scope=bot%20applications.commands`)
            );

        const channel = await client.channels.fetch(guild_db.botlist.log);
        if (!channel || !channel.isTextBased()) return await err(locale('events.botlist.addBot.errors.INVALID_CHANNEL'), 'INVALID_CHANNEL');

        const msg = await channel.send({
            content: `<@&${guild_db.botlist.staff}>`,
            embeds: [embed],
            components: [buttons]
        });

        await Guild.updateOne({ guildId: message.guild.id }, { $push: { 'botlist.queue': { id: get_bot.bot.id, owner: message.author.id, prefix, messageId: msg.id } } }, { upsert: true });
        await success(locale('commands.botlist.addbot.success.types.SUCCESS', { name: get_bot.bot.username }), 'SUCCESS0x000');
    }
};