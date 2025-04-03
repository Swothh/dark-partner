import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Events } from '../structures';
import { User, Global, Guild } from '../models';
import { Localizer } from '../managers';

export const Event: Events = {
    name: 'messageCreate',
    on: 'on',
    run: async (client, message: Message) => {
        try {
            if (message.author.bot) return;
            if (message.mentions.users.size === 0) return;
            if (message.mentions.repliedUser?.id) return;
            if (message.mentions.users.first().id !== client.user.id) return;

            const args = message.content.slice(message.content.startsWith('<@!') ? 3 : 2).trim().split(/ +/g);
            if (client.commands.find(cmd => [cmd.name, ...(cmd.aliases || [])].includes(args[1]))) return;

            let user = await User.findOne({ user: message.author.id }, { banned: 1, locale: 1, localeSelected: 1, vote: 1, _id: 0 });
            if (!user?.localeSelected || user?.banned?.ban) return;

            const locale = Localizer(client, user);
            const guild = await Guild.findOne({ guildID: message.guild.id }, { prefix: 1, _id: 0 });
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.main)
                        .setAuthor({ name: locale('events.mention.author', { user: message.author.globalName }), iconURL: message.author.displayAvatarURL() })
                        .setTitle(locale('events.mention.title'))
                        .setDescription(locale('events.mention.description', { prefix: guild?.prefix ?? client.config.main.global_prefix }))
                        .addFields((locale as any)('events.mention.fields').map((field: any) => ({
                            name: field.name,
                            value: field.value
                                .replace('{guilds}', client.guilds.cache.size.toLocaleString())
                                .replace('{ping}', client.ws.ping)
                                .replace('{prefix}', guild?.prefix ?? client.config.main.global_prefix),
                            inline: true
                        })) as any)
                        .setFooter({ text: locale('events.mention.footer'), iconURL: client.user.displayAvatarURL() })
                        .setTimestamp()
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(locale('events.mention.buttons.invite'))
                                .setStyle(ButtonStyle.Link)
                                .setURL('https://discord.com/oauth2/authorize?client_id=' + client.user.id + '&scope=bot&permissions=8'),
                            new ButtonBuilder()
                                .setLabel(locale('events.mention.buttons.support'))
                                .setStyle(ButtonStyle.Link)
                                .setURL(client.config.main.support),
                            new ButtonBuilder()
                                .setLabel(locale('events.mention.buttons.vote'))
                                .setStyle(ButtonStyle.Link)
                                .setURL('https://top.gg/bot/' + client.user.id + '/vote')
                        )
                ]
            });
        } catch (err) {
            console.error(err);
        };
    }
};