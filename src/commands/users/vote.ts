import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Commands } from '../../structures';
import { User } from '../../models';

export const Command: Commands = {
    name: 'vote',
    description: 'oy verion',
    aliases: ['oy', 'streak', 'oylarım', 'oylarim', 'votes'],
    category: 'users',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const db = await User.findOne({ user: message.author.id }, { vote: true, amount: true });
        const c = 1000 * 60 * 60 * 12;

        if (typeof db?.vote?.date !== 'undefined' && (Date.now() - db?.vote?.date) >= c) db.vote.streak = 0;
        const past = typeof db?.vote?.date !== 'undefined' ? (Date.now() - db?.vote?.date) : 0;

        let show = false;
        if (past < (c / 2)) show = true;
        const formatted = new Date(c / 2 - past).toISOString().slice(11, 19);

        const buttons = [
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel(locale('commands.vote.btn_url'))
                .setURL(`https://top.gg/bot/${client.user.id}/vote`)
        ];
        if (show) buttons.push(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🕐')
                .setLabel(formatted ?? 'N/A')
                .setCustomId('vote.time')
                .setDisabled(true)
        );

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setAuthor({ name: `${message.author.displayName} ${locale('commands.vote.author')}`, iconURL: client.user.displayAvatarURL() })
            .setFooter({ text: locale('commands.vote.footer'), iconURL: client.config.icons.warning })
            .setTimestamp()
            .addFields((locale as any)('commands.vote.fields').map((field: any) => ({
                name: field.name,
                value: field.value
                    .replace('{votes}', db?.vote?.amount ?? 0)
                    .replace('{streak}', db?.vote?.streak ?? 0)
                    .replace('{highest_streak}', db?.vote?.max_streak ? db.vote.max_streak : db?.vote?.streak ?? 0)
                    .replace('{amount}', (client.config.prices.vote.reward * (1 + Math.min((db?.vote?.streak ?? 0), 80) * client.config.prices.vote.multipler)).toFixed(1))
                    .replace('{streak_amount}', client.config.prices.vote.multipler),
                inline: field.inline ?? false
            })));

        await message.nmReply({
            embeds: [embed],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)]
        });
    }
};