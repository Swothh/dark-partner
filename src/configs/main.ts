export default {
    tokens: {
        development: 'development bot token',
        production: 'prod bot token',
        user: 'discord user token',
        topgg: 'topgg token (uzun)'
    },
    __development: true,
    __whitelist: {
        enabled: false,
        bot_id: '1157779657467379823',
        role_id: '1171081297624576010',
        support_server_id: '1144557139512266772',
        whitelist_channel_id: '1172618079558185080',
        enabled_commands: ['partner', 'balance', 'botbilgi', 'avatar', 'shard', 'guide']
    },
    __apikeys: {
        hastebin: [
            'api key 1',
            'api key 2 (yedek)',
            'api key 3 (yedek)'
        ],
        github: {
            guide: 'github api key'
        }
    },
    guide_update_webhook: {
        guild: '123456789123456789',
        channel: '123456789123456789',
        author: '123456789123456789'
    },
    puzzle_private_key: '64-digit random key',
    shard_timeout: 5000,
    default_timeout: 3000,
    global_prefix: '!',
    development_prefix: '.',
    socket: {
        port: 6379,
        auth: '128-digit random key'
    },
    default_locale: 'tr',
    owners: [
        '924710858171486228', // Loiren
        '680479917820870734', // swôth
        '603868522195714049', // Bilal
    ],
    staffs: {
        support_server_id: '1144557139512266772', // staff komutu için
        moderator_id: '816980862373593089',
        badwords_log: '1174264809819209778'
    },
    intervals: {
        guilds: 10 * 60 * 1000
    },
    version: 'BETA 6.4.0',
    presence: '🐼 King Panda. (BETA) | !help | Shard: #{shard_no}',
    filtered_top: [
        '924710858171486228', // Loiren
        '680479917820870734', // swôth
        '603868522195714049', // Bilal
        '481425230636646419' // Lucian
    ],
    topgg_token: 'top.gg token (kısa)',
    support: 'https://discord.gg/kXrygcCVhy'
};