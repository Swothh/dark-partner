import { Commands } from '../../structures';
import { Guild } from '../../models';
import { InferSchemaType } from 'mongoose';

export const Send: Commands['run'] = async (client, message, args, locale) => {
    const [code] = args;
    if (!code) return message.error(locale('commands.partner.send.code_not_found'));

    const target_db = client.collectionGuilds.get('database_guild').find((g: InferSchemaType<typeof Guild['schema']>) => g.partner?.url === code || g.partner?.specialUrl === code) as InferSchemaType<typeof Guild['schema']>;
    if (!target_db) return message.error(locale('commands.partner.send.guild_not_found', {
        code
    }));

    const guild_db = client.collectionGuilds.get('database_guild').find((g: InferSchemaType<typeof Guild['schema']>) => g.guildId === message.guild.id) as InferSchemaType<typeof Guild['schema']>;
    if (!guild_db || guild_db?.partner?.status !== 1) return message.error(locale('commands.partner.send.status_disabled'));

    if (guild_db?.partner?.blacklists?.guilds?.includes(target_db?.guildId ?? '??') || guild_db?.partner?.blacklists?.categories?.includes(target_db?.partner?.category ?? '??')) return message.error(locale('commands.partner.send.blacklist_error_message_guild'));
    if (target_db?.partner?.blacklists?.guilds?.includes(message.guild.id) || target_db?.partner?.blacklists?.categories?.includes(guild_db?.partner?.category ?? '??')) return message.error(locale('commands.partner.send.blacklist_error'));
    if (target_db?.guildId === message.guild.id) return message.error(locale('commands.partner.send.self_error'));

    const target_guild = await client.shardManager.getGuild(target_db.guildId);
    if (!target_guild) return message.error(locale('commands.partner.send.guild_not_found'));

    client.utils.Partner.SEND_PARTNER_REQUEST(client, {
        this: {
            guild: message.guild,
            guild_db
        },
        target: {
            guild: target_guild,
            guild_db: target_db
        },
        locale,
        message
    }).then(d => {
        if (!d.ok) return message.error(d.message);
        message.success(d.message);
    });
};