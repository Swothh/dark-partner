import { Channel, Guild, GuildMember, Serialized, ShardingManager, PermissionsString, MessageCreateOptions, Message } from 'discord.js';
import * as Sentry from '@sentry/node';
import config from '../configs';
import Dark from '../client';

type Func<T, C> = (client: Dark, ctx: Serialized<C>) => T;
Sentry.init(config.sentry);

const builtInEval = {
    GET_GUILD: (client: Dark, { guild }: any) => client.guilds.cache.get(guild),
    GET_MEMBER: (client: Dark, { guild, member }: any) => client.guilds.cache.get(guild)?.members?.fetch?.(member),
    CHECK_PERM: (client: Dark, { guild, member, perm }: any) => client.guilds.cache.get(guild)?.members?.fetch?.(member)?.then(member => member?.permissions?.has?.(perm)),
    GET_CHANNEL: (client: Dark, { guild, channel, perm }: any) => {
        const c = client.guilds.cache.get(guild)?.channels?.cache?.get?.(channel);
        return [c, (perm && c) ? c.permissionsFor(client.user.id).has(perm) : false];
    },
    SEND_MESSAGE: (client: Dark, { guild, channel, payload }: any) => {
        const c = client.guilds.cache.get(guild)?.channels?.cache?.get?.(channel);
        if (!c?.isTextBased?.()) return null;
        return c?.send?.(payload).catch(() => null);
    },
    EDIT_MESSAGE: async (client: Dark, { guild, channel, message, payload }: any) => {
        const c = client.guilds.cache.get(guild)?.channels?.cache?.get?.(channel);
        if (!c?.isTextBased?.()) return null;
        const m = await c?.messages?.fetch?.(message).catch(() => null);
        if (!m) return null;
        return m?.edit?.(payload).catch(() => false);
    }
};

export class Manager extends ShardingManager {
    public eval: funcEval = (fn, ctx) => new Promise<any>(async r => {
        const initFn = fn;
        let resolved = false;

        const timeout = setTimeout(() => {
            Sentry.captureException(new Error(`Broadcast eval timed-out: ${typeof initFn === 'function' ? initFn.toString() : initFn} (${JSON.stringify(ctx ?? {})})`));
            resolved = true;
            r({ id: null, data: null });
        }, config.main.shard_timeout);

        const shards = await Promise.all(this.shards.map(async shard => {
            const result: [number, any] = [shard.id] as any;

            if (!shard.ready) {
                result.push(null);
                return result;
            };

            if (typeof fn !== 'function') fn = builtInEval[fn];
            const res = await shard.eval(fn, ctx).catch(() => null);

            result.push(res);
            return result;
        }));

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

        const shard = this.shards.get(id);
        if (!shard || !shard.ready) return null;

        if (typeof fn !== 'function') fn = builtInEval[fn];
        const res = await shard.eval(fn, ctx).catch(() => null);
        clearTimeout(timeout);
        if (!resolved) r(res);
    });
};

type funcEval<T = any, C = {}> = (
    ((fn: 'GET_GUILD', ctx: { guild: string }) => Promise<{ id: number, data: Guild }>) &
    ((fn: 'GET_MEMBER', ctx: { guild: string, member: string }) => Promise<{ id: number, data: GuildMember }>) &
    ((fn: 'GET_CHANNEL', ctx: { guild: string, channel: string, perm?: string }) => Promise<{ id: number, data: [Channel, boolean] }>) &
    ((fn: 'CHECK_PERM', ctx: { guild: string, member: string, perm: PermissionsString }) => Promise<{ id: number, data: boolean }>) &
    ((fn: 'SEND_MESSAGE', ctx: { guild: string, channel: string, payload: MessageCreateOptions }) => Promise<{ id: number, data: Message }>) &
    ((fn: 'EDIT_MESSAGE', ctx: { guild: string, channel: string, message: string, payload: MessageCreateOptions }) => Promise<{ id: number, data: Message }>) &
    ((fn: Func<T, C>, ctx?: C) => ReturnType<typeof fn>)
);

type funcShardEval<T = any, C = {}> = (
    ((id: number, fn: 'GET_GUILD', ctx: { guild: string }) => Promise<Guild>) &
    ((id: number, fn: 'GET_MEMBER', ctx: { guild: string, member: string }) => Promise<GuildMember>) &
    ((id: number, fn: 'GET_CHANNEL', ctx: { guild: string, channel: string, perm?: string }) => Promise<[Channel, boolean]>) &
    ((id: number, fn: 'CHECK_PERM', ctx: { guild: string, member: string, perm: PermissionsString }) => Promise<boolean>) &
    ((id: number, fn: 'SEND_MESSAGE', ctx: { guild: string, channel: string, payload: MessageCreateOptions }) => Promise<Message>) &
    ((id: number, fn: 'EDIT_MESSAGE', ctx: { guild: string, channel: string, message: string, payload: MessageCreateOptions }) => Promise<Message>) &
    ((id: number, fn: Func<T, C>, ctx?: C) => ReturnType<typeof fn>)
);