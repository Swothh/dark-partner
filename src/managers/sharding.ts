
import { Channel, Guild, GuildMember, Serialized, PermissionsString, MessageCreateOptions, Message, Client, TextChannel, User, ChannelType } from 'discord.js';
import * as Sentry from '@sentry/node';
import config from '../configs';
import Dark from '../client';
import './displayName';

type Func<T, C> = (client: Dark, ctx: Serialized<C>) => T;
Sentry.init(config.sentry);

const builtInEval = {
    GET_GUILD: async (client: Dark, { guild }: any) => {
        const has = client.guilds.cache.get(guild);

        const [g, own] = await Promise.all([
            client.guilds.fetch(guild).catch(() => null),
            (has ? has.fetchOwner() : false)
        ]);

        if (!g) return null;

        (g as any).owner = typeof own !== 'boolean' ? {
            id: own.id,
            name: own.displayName,
            username: own.user.username
        } : false;

        return g;
    },
    GET_MEMBER: (client: Dark, { guild, member }: any) => client.guilds.cache.get(guild)?.members?.fetch?.(member),
    CHECK_PERM: (client: Dark, { guild, member, perm }: any) => client.guilds.cache.get(guild)?.members?.fetch?.(member)?.then(member => member?.permissions?.has?.(perm)),
    GET_CHANNEL: async (client: Dark, { guild, channel, perm }: any) => {
        const c = client.guilds.cache.get(guild)?.channels?.cache?.get?.(channel);
        return [c] //[c, (perm && c) ? (await c).permissionsFor(client.user.id).has(perm) : false];
    },
    SEND_MESSAGE: (client: Dark, { guild, channel, payload }: any) => {
        const c = client.guilds.cache.get(guild)?.channels?.cache?.get?.(channel);
        if (!c?.isTextBased?.()) return null;
        return c?.send?.(payload);
    },
    EDIT_MESSAGE: async (client: Dark, { guild, channel, message, payload }: any) => {
        const c = client.guilds.cache.get(guild)?.channels?.cache?.get?.(channel);
        if (!c?.isTextBased?.()) return null;
        const m = await c?.messages?.fetch?.(message).catch(() => null);
        if (!m) return null;
        return m?.edit?.(payload).catch(() => false);
    },
    GET_ALL_MEMBERS: (client: Dark, { guild }: any) => client.guilds.cache.get(guild)?.members?.fetch?.(),
    GET_CHANNEL_MEMBERS: async (client: Dark, { guild, channel }: any) => {
        const c = await client.channels.fetch(channel).catch(() => null) as TextChannel;
        if (!c || !c.isTextBased()) return null;

        return c.members.size ?? null;
    },
    GET_PRESENCES: async (client: Dark, { guild }: any) => {
        const g = await client.guilds.fetch(guild).catch(() => null);
        if (!g) return { dnd: 0, idle: 0, online: 0, offline: 0, bot: 0, filtered: 0, total: 0 };

        const dnd = g.members.cache.filter((m: any) => m.presence?.status === 'dnd').size;
        const idle = g.members.cache.filter((m: any) => m.presence?.status === 'idle').size;
        const online = g.members.cache.filter((m: any) => m.presence?.status === 'online').size;
        const offline = g.members.cache.filter((m: any) => m.presence?.status === 'offline').size;
        const bot = g.members.cache.filter((m: any) => m.user.bot).size;
        const filtered = g.members.cache.filter((m: any) => !m.user.bot).size;
        const total = g.memberCount;

        return { dnd, idle, online, offline, bot, filtered, total };
    },
    CLIENT_CHECK_PERM: (client: Dark, { channel, perm }: any) => client.channels.fetch(channel).then((g: any) => g?.permissionsFor(client.user.id).has(perm)).catch(() => false),
    DELETE_MESSAGE: async (client: Dark, { guild, channel, message }: any) => {
        const c = client.guilds.cache.get(guild)?.channels?.cache?.get?.(channel);
        if (!c?.isTextBased?.()) return null;
        const m = await c?.messages?.fetch?.(message);
        console.log(m)
        if (!m) return null;
        return m?.delete?.();
    },
    GET_USER: (client: Dark, { user }: any) => client.users.fetch(user, { force: true }).catch(() => null),
    GET_GUILD_COUNT: (client: Dark) => client.guilds.cache.size,
    GET_USERS_COUNT: (client: Dark) => client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    GET_CHANNEL_COUNT: (client: Dark) => client.channels.cache.size,
    GET_EMOJI_COUNT: (client: Dark) => client.emojis.cache.size
};

export class Eval {
    constructor(public client: Client) { };

    public eval: funcEval = (fn, ctx, id) => new Promise<any>(async r => {
        const initFn = fn;
        let resolved = false;

        const timeout = setTimeout(() => {
            Sentry.captureException(new Error(`Broadcast eval timed-out: ${typeof initFn === 'function' ? initFn.toString() : initFn} (${JSON.stringify(ctx ?? {})})`));
            resolved = true;
            r({ id: null, data: null });
        }, config.main.shard_timeout);

        if (typeof fn !== 'function') fn = builtInEval[fn];

        const shards = (await this.client.shard.broadcastEval(fn, {
            context: ctx
        })).map((el, i) => [i, (id && String(i) !== String(id)) ? null : el]);

        clearTimeout(timeout);
        const shard = shards.find(s => s[1] !== null && s[1]);
        if (!resolved) r({ id: shard?.[0] ?? null, data: shard?.[1] ?? null });
    })

    public shardEval: funcShardEval = (id, fn, ctx) => new Promise<any>(async r => {
        const initFn = fn;
        let resolved = false;

        const timeout = setTimeout(() => {
            Sentry.captureException(new Error(`Shard (#${id}) eval timed-out: ${typeof initFn === 'function' ? initFn.toString() : initFn} (${JSON.stringify(ctx ?? {})})`));
            resolved = true;
            r(null);
        }, config.main.shard_timeout);

        if (typeof fn !== 'function') fn = builtInEval[fn];
        const res = await this.eval(fn, { ...ctx, fn }, String(id)).catch(() => { });
        clearTimeout(timeout);
        if (!resolved) r(res?.data);
    });

    public getGuild = async (guild: string) => {
        const g = await this.client.shard.broadcastEval(async (c, { guild }) => {
            const g = await c.guilds.fetch(guild).catch(() => null);
            return g;
        }, {
            context: {
                guild
            }
        });

        // Shard sayısı yükseltilince bura da değiştirilecek.
        if (!g[0] && !g[1]) return null;

        ////////////////////
        let a: Guild;
        g.map((el, i) => {
            if (typeof el.shardId === 'number') a = el;
        });
        ////////////////////
        return a;
    };

    public deleteMessage = async (guild: string, channel: string, message: string, id: number) => {
        const g = (await this.client.shard.broadcastEval(async (c, { guild, channel, message }) => {
            const $g = await c.guilds.fetch(guild);
            if (!$g) return null;

            const $c = await $g.channels.fetch(channel);
            if (!$c || !$c.isTextBased()) return null;

            const m = await $c.messages.fetch(message).catch(() => null);
            if (!m) return null;

            return m.delete().catch(() => false);
        }, {
            context: {
                guild,
                channel,
                message
            }
        })).map((el, i) => [i, (id && String(i) !== String(id)) ? null : el]);

        return g
    };

    public sendMessage = async (guild: string, channel: string, payload: any) => {
        const g = async (shard: number) => await this.client.shard.broadcastEval(async (c, { guild, channel, payload, no }) => {
            if (c.shard.ids[0] !== no) return;

            const $g = await c.guilds.fetch(guild);
            if (!$g) return null;

            const $c = await $g.channels.fetch(channel);
            if (!$c || !$c.isTextBased()) return null;

            const m = await $c.send(payload).catch(() => null);

            return m;
        }, {
            context: {
                guild,
                channel,
                payload,
                no: shard
            }
        });

        let sends = await g(0);
        if (sends.filter(s => typeof s === 'object' && s !== null).length === 0) sends = await g(1);

        return (sends ?? []).find(s => typeof s === 'object' && s !== null) as Message;
    };

    public getGuildCount = async () => {
        const g = await this.client.shard.broadcastEval(async c => c.guilds.cache.size);
        return g.reduce((a, b) => a + b, 0);
    };

    public getUsersCount = async () => {
        const g = await this.client.shard.broadcastEval(async c => c.guilds.cache.reduce((a, b) => a + b.memberCount, 0));
        return g.reduce((a, b) => a + b, 0);
    };

    public getChannelCount = async () => {
        const g = await this.client.shard.broadcastEval(async c => c.channels.cache.size);
        return g.reduce((a, b) => a + b, 0);
    };

    public getEmojiCount = async () => {
        const g = await this.client.shard.broadcastEval(async c => c.emojis.cache.size);
        return g.reduce((a, b) => a + b, 0);
    };
};

type funcEval<T = any, C = {}> = (
    ((fn: 'GET_GUILD', ctx: { guild: string }, id?: string) => Promise<{ id: number, data: Guild }>) &
    ((fn: 'GET_MEMBER', ctx: { guild: string, member: string }, id?: string) => Promise<{ id: number, data: GuildMember }>) &
    ((fn: 'GET_CHANNEL', ctx: { guild: string, channel: string, perm?: string }, id?: string) => Promise<{ id: number, data: [Channel, boolean] }>) &
    ((fn: 'CHECK_PERM', ctx: { guild: string, member: string, perm: PermissionsString }, id?: string) => Promise<{ id: number, data: boolean }>) &
    ((fn: 'SEND_MESSAGE', ctx: { guild: string, channel: string, payload: MessageCreateOptions }, id?: string) => Promise<{ id: number, data: Message }>) &
    ((fn: 'EDIT_MESSAGE', ctx: { guild: string, channel: string, message: string, payload: MessageCreateOptions }, id?: string) => Promise<{ id: number, data: Message }>) &
    ((fn: 'GET_ALL_MEMBERS', ctx: { guild: string }, id?: string) => Promise<{ id: number, data: [GuildMember] }>) &
    ((fn: 'GET_CHANNEL_MEMBERS', ctx: { guild: string, channel: string }, id?: string) => Promise<{ id: number, data: number }>) &
    ((fn: 'GET_PRESENCES', ctx: { guild: string }, id?: string) => Promise<{ id: number, data: { dnd: number, idle: number, online: number, offline: number, bot: number, total: number } }>) &
    ((fn: 'CLIENT_CHECK_PERM', ctx: { channel: string, perm: PermissionsString }, id?: string) => Promise<{ id: number, data: boolean }>) &
    ((fn: 'DELETE_MESSAGE', ctx: { guild: string, channel: string, message: string }, id?: string) => Promise<{ id: number, data: boolean }>) &
    ((fn: 'GET_USER', ctx: { user: string }, id?: string) => Promise<{ id: number, data: User }>) &
    ((fn: 'GET_GUILD_COUNT', ctx?: {}, id?: string) => Promise<{ id: number, data: number }>) &
    ((fn: 'GET_USERS_COUNT', ctx?: {}, id?: string) => Promise<{ id: number, data: number }>) &
    ((fn: 'GET_CHANNEL_COUNT', ctx?: {}, id?: string) => Promise<{ id: number, data: number }>) &
    ((fn: 'GET_EMOJI_COUNT', ctx?: {}, id?: string) => Promise<{ id: number, data: number }>) &
    ((fn: Func<T, C>, ctx?: C, id?: string) => ReturnType<typeof fn>)
);

type funcShardEval<T = any, C = {}> = (
    ((id: number, fn: 'GET_GUILD', ctx: { guild: string }, shardId?: string) => Promise<Guild>) &
    ((id: number, fn: 'GET_MEMBER', ctx: { guild: string, member: string }, shardId?: string) => Promise<GuildMember>) &
    ((id: number, fn: 'GET_CHANNEL', ctx: { guild: string, channel: string, perm?: string }, shardId?: string) => Promise<[Channel, boolean]>) &
    ((id: number, fn: 'CHECK_PERM', ctx: { guild: string, member: string, perm: PermissionsString }, shardId?: string) => Promise<boolean>) &
    ((id: number, fn: 'SEND_MESSAGE', ctx: { guild: string, channel: string, payload: MessageCreateOptions }, shardId?: string) => Promise<Message>) &
    ((id: number, fn: 'EDIT_MESSAGE', ctx: { guild: string, channel: string, message: string, payload: MessageCreateOptions }, shardId?: string) => Promise<Message>) &
    ((id: number, fn: 'GET_ALL_MEMBERS', ctx: { guild: string }, shardId?: string) => Promise<[GuildMember]>) &
    ((id: number, fn: 'GET_CHANNEL_MEMBERS', ctx: { guild: string, channel: string }, shardId?: string) => Promise<number>) &
    ((id: number, fn: 'GET_PRESENCES', ctx: { guild: string }, shardId?: string) => Promise<{ dnd: number, idle: number, online: number, offline: number, bot: number, total: number }>) &
    ((id: number, fn: 'CLIENT_CHECK_PERM', ctx: { channel: string, perm: PermissionsString }, shardId?: string) => Promise<boolean>) &
    ((id: number, fn: 'DELETE_MESSAGE', ctx: { guild: string, channel: string, message: string }, shardId?: string) => Promise<boolean>) &
    ((id: number, fn: 'GET_USER', ctx: { user: string }, shardId?: string) => Promise<User>) &
    ((id: number, fn: Func<T, C>, ctx?: C, shardId?: string) => ReturnType<typeof fn>)
);