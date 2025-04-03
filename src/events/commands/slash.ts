import { ActivityType, Interaction, EmbedBuilder, PermissionsBitField, PermissionFlagsBits, CommandInteraction } from 'discord.js';
import { Events } from '../../structures';
import { isAsyncFunction } from 'util/types';
import { InteractionUtils } from '../../utils';
import { User } from '../../models';
import { Localizer } from '../../managers';
import { nanoid } from 'nanoid';

export const Event: Events = {
    name: 'interactionCreate',
    on: 'on',
    run: async (client, interaction: Interaction) => {
        try {
            if (!interaction.isCommand()) return;
            let user_db = await User.findOne({ user: interaction.user.id }, { banned: 1, locale: 1, badges: 1, localeSelected: 1, vote: 1, _id: 0 });

            const get_locale = user_db?.localeSelected ? user_db.locale : interaction.locale === 'tr' ? 'tr' : 'en';
            const locale = Localizer(client, { locale: get_locale });
            const command = client.slash_commands.get(interaction.commandName);
            if (!command) return;

            const int = await InteractionUtils(client, interaction);
            const permissions = (command.requireds?.permissions ?? (() => []))(PermissionFlagsBits).filter((p) => !interaction.memberPermissions.has(p));

            if (client.config.main.__development && !client.config.main.owners.includes(interaction.user.id)) {
                const fail = () => int.error(locale('errors.mode_development'));

                if (client.config.main.__whitelist?.enabled && client.user.id === client.config.main.__whitelist.bot_id) {
                    const support = client.guilds.cache.get(client.config.main.__whitelist.support_server_id);
                    const member = await (support ? support.members.fetch(interaction.user.id).catch(() => { }) : null);
                    if (!support || !member) return await fail();

                    const hasAccess = member.roles.cache.has(client.config.main.__whitelist.role_id);
                    if (!hasAccess) return await fail();
                    if (interaction.guild?.id !== client.whitelistedGuilds.get(interaction.user.id)) return await int.error(locale('errors.not_whitelisted').replace('{channel}', `<#${client.config.main.__whitelist.whitelist_channel_id}>`));
                    if (![command.name].find(el => client.config.main.__whitelist.enabled_commands.includes(el))) return await int.error(locale('errors.not_allowed'));
                } else {
                    return await int.error(locale('errors.mode_development'));
                };
            };

            if (user_db?.banned?.ban) return await int.error(locale('errors.user_banned', { reason: user_db.banned.reason }));
            if (permissions.length > 0 && !client.config.main.owners.includes(interaction.user.id)) return await int.error(locale('errors.missing_permissions', { permissions: permissions.map((p) => `\`${p}\``).join(', ') }));
            if (command.requireds?.owner && !client.config.main.owners.includes(interaction.user.id)) return await int.error(locale('errors.owner_only'));
            if (command.requireds?.vote && !client.config.main.owners.includes(interaction.user.id)) {
                if (!user_db?.vote?.date || (Date.now() - user_db?.vote?.date) >= 1000 * 60 * 60 * 12) return await int.error(locale('errors.vote'));
            };

            ///////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////

            const errorHandler = async (err: any) => {
                const code = Math.random().toString().slice(2, 8);
                console.error(code, err);

                await int.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.error)
                            .setAuthor({ name: locale('errors.error_occured_author', { user: interaction.user.displayName }), iconURL: interaction.user.displayAvatarURL() })
                            .setDescription(locale('errors.error_occured', { code }))
                            .setFooter({ text: locale('errors.error_occured_footer'), iconURL: client.config.icons.warning })
                            .setTimestamp()
                    ]
                }).catch(() => { });
            };

            if (isAsyncFunction(command.run)) await command.run(client, (int as CommandInteraction), locale).catch(errorHandler);
            else await command.run(client, (int as CommandInteraction), locale);

        } catch (err) {
            console.error(err);
        };
    }
};