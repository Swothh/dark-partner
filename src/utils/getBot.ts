import config from '../configs/main';
import axios from 'axios';

interface InstallParams {
    scopes: string[];
    permissions: string;
}

interface Application {
    id: string;
    name: string;
    icon: string;
    description: string;
    summary: string;
    type: string | null;
    hook: boolean;
    guild_id: string;
    bot_public: boolean;
    bot_require_code_grant: boolean;
    terms_of_service_url: string;
    privacy_policy_url: string;
    install_params: InstallParams;
    verify_key: string;
    flags: number;
    tags: string[];
}

interface User {
    id: string;
    username: string;
    global_name: string;
    avatar: string | null;
    avatar_decoration_data: any | null;
    discriminator: string;
    public_flags: number;
}

interface Bot {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string;
    avatar_decoration_data: any | null;
    discriminator: string;
    public_flags: number;
    bot: boolean;
    approximate_guild_count: number;
}

interface Guild {
    id: string;
    name: string;
    icon: string;
    mfa_level: number;
    permissions: string;
}

interface DataStructure {
    application: Application;
    user: User;
    authorized: boolean;
    bot: Bot;
    guilds: Guild[];
}

interface Topgg {
    defAvatar: string;
    invite: string;
    website: string;
    support: string;
    github: string | null;
    longdesc: string;
    shortdesc: string;
    prefix: string;
    lib: string;
    clientid: string;
    avatar: string;
    id: string;
    discriminator: string;
    username: string;
    date: string;
    server_count: number;
    shard_count: number;
    guilds: string[];
    shards: any | null;
    monthlyPoints: number;
    points: number;
    certifiedBot: boolean;
    owners: string[];
    tags: string[];
    bannerUrl: string | null;
    donatebotguildid: string | null;
}

export class GetBot {
    public static async DISCORD(id: string): Promise<DataStructure | null> {
        const t = config.tokens.user;
        const r = await axios.get('https://discord.com/api/v8/oauth2/authorize?client_id=' + id + '&scope=bot', {
            headers: {
                'Authorization': t
            }
        }).catch(err => {
            return null;
        });

        if (!r) return null;

        return r.data;
    };

    public static async TOPGG(id: string): Promise<Topgg | null> {
        const r = await axios.get('https://top.gg/api/bots/' + id, {
            headers: {
                'Authorization': config.tokens.topgg
            }
        }).catch(() => {
            return null;
        });

        if (r?.data?.error) return null;

        return r?.data;
    };

    public static async GET_DARK_VOTE() {
        const r = await axios.get('https://top.gg/api/bots/1157779657467379823', {
            headers: {
                'Authorization': config.tokens.topgg
            }
        }).catch(() => {
            return null;
        });

        if (r?.data?.error) return null;

        return r?.data;
    };
};