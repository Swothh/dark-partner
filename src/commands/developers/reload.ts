import { Commands } from '../../structures';
import { EmbedBuilder } from 'discord.js';

export const Command: Commands = {
    name: 'reload',
    description: 'Reload a command/events',
    aliases: ['yenile', 'r'],
    category: 'developers',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        const [name] = args;
        if (!name) return message.error('Please specify a command name. `(__e for events, _locales for locales)`');

        if (name === '__e') {
            const loading = await message.nmReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.blank)
                        .setDescription(`${client.config.emojis.loading} Please wait, reloading events...`)
                ]
            });

            client.events.clear();
            client.loadEvents(true);

            return await loading.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.success)
                        .setDescription(`${client.config.emojis.success} All Events reloaded. (\`${client.events.size}\` e_r)`)
                ]
            });
        } else if (name === '__locales') {
            const loading = await message.nmReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.blank)
                        .setDescription(`${client.config.emojis.loading} Please wait, reloading locales...`)
                ]
            });

            const r = client.requestReload('locales') ?? 0;
            return await loading.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.success)
                        .setDescription(`${client.config.emojis.success} All Locales reloaded. (\`${client.locales.size}\` l_r)`)
                ]
            });
        };

        const loading = await message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.blank)
                    .setDescription(`${client.config.emojis.loading} Please wait, a reload request is being sent...`)
            ]
        });

        const r = await client.requestReload(name ?? 'all') ?? 0;
        if (r === 0) return loading.edit({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.error)
                    .setDescription(`${client.config.emojis.error} There is already a reload request for this command.`)
            ]
        });
        if (r === 1) return loading.edit({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.error)
                    .setDescription(`${client.config.emojis.error} There is no command with this name.`)
            ]
        });

        return loading.edit({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.success)
                    .setDescription(`${client.config.emojis.success} Reload request sent. (\`${name ?? 'ALL_COMMANDS'} SUCCESS\`)`)
            ]
        });
    }
};