import { EmbedBuilder, Guild, ButtonBuilder, ButtonStyle, GuildMember } from 'discord.js';
import Dark from '../client';

export const PartnerText = async (
    client: Dark,
    db: any,
    guild: Guild,
    target: Guild,
    presence: any
): Promise<{ text?: string, embed?: EmbedBuilder, button?: ButtonBuilder }> => {
    const locale = client.locales.get(db?.locale);
    const variables = async (text: string): Promise<string> => {
        const owner = await client.shardManager.shardEval(guild.shardId, 'GET_MEMBER', {
            guild: guild.id,
            member: guild.ownerId
        });

        return text
            .replace('{guild_name}', guild.name)
            .replace('{guild_owner}', owner ? (owner as any)?.displayName ?? guild.ownerId : guild.ownerId)
            .replace('{member_count}', guild.memberCount.toString() ?? 'N/A')
            .replace('{member_count.filter}', presence.filtered)
            .replace('{member_count.online}', presence.online)
            .replace('{member_count.offline}', presence.offline)
            .replace('{total_partners}', String(db?.partner?.total))
    };

    if (db?.partner?.embeds?.status) {
        const embed = new EmbedBuilder();

        embed.setColor(client.config.colors.blank);
        embed.setDescription(await variables(db?.partner?.text));
        embed.setFooter({ text: locale.__.events.partner.approve_title.replace('{guild}', target.name), iconURL: client.user.avatarURL() });
        embed.setTimestamp();

        if (db?.partner?.embeds?.author) {
            if (db?.partner?.embeds?.author?.icon === '{guild_icon}') {
                embed.setAuthor({
                    name: db?.partner?.embeds?.author?.name,
                    iconURL: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=1024`
                });
            } else {
                embed.setAuthor({
                    name: db?.partner?.embeds?.author?.name,
                    iconURL: db?.partner?.embeds?.author?.icon ?? null
                });
            };
        };

        if (db?.partner?.embeds?.image) embed.setImage(db?.partner?.embeds?.image);
        if (db?.partner?.embeds?.thumbnail) embed.setThumbnail(db?.partner?.embeds?.thumbnail);

        const regex = /discord\.gg\/[0-9A-Za-z_-]+/;
        if (db?.partner?.embeds?.joinButton && !db?.partner?.text?.match(regex) === null) {
            const button = new ButtonBuilder();
            button.setStyle(ButtonStyle.Link);
            button.setURL(db?.partner?.text?.match(regex)[0]);
            button.setLabel(locale.__.events.partner.join_button);

            return {
                embed: embed,
                button: button
            };
        } else {
            return {
                embed: embed
            };
        };
    } else {
        const regex = /discord\.gg\/[0-9A-Za-z_-]+/;
        if (db?.partner?.embeds?.joinButton && !db?.partner?.text?.match(regex) === null) {
            const button = new ButtonBuilder();
            button.setStyle(ButtonStyle.Link);
            button.setURL(db?.partner?.text?.match(regex)[0]);
            button.setLabel(locale.__.events.partner.join_button);

            return {
                text: await variables(db?.partner?.text),
                button: button
            };
        } else {
            return {
                text: await variables(db?.partner?.text)
            };
        };
    };
};