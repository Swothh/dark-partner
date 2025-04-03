import configs from '../configs';
import { model, Schema } from 'mongoose';
import botEvents from '../botEvents';

const schema = new Schema({
    guildId: { type: String, required: true },
    locale: { type: String, default: 'tr' },
    localeSelected: { type: Boolean, default: false },
    prefix: { type: String, default: configs.main.global_prefix },

    ratings: {
        type: [
            {
                user: { type: String, required: true },
                guild: { type: String, required: true },
                rate: { type: Number, required: true },
                date: { type: Number, default: Date.now() },
            }
        ], default: []
    },

    plus: {
        type: {
            active: { type: Boolean, default: false },
            history: { type: Array, default: [] },
            started_at: { type: Number, default: null },
            ms: { type: Number, default: 0 }
        },
        default: {
            active: false,
            history: [],
            started_at: null,
            ms: 0
        }
    },

    savePermissions: {
        type: {
            isFirst: { type: Boolean, default: true },
            partners: { type: Boolean, default: false },
            guildCaseHistory: { type: Boolean, default: false }
        }, default: {
            isFirst: true,
            partners: false,
            guildCaseHistory: false
        },
    },

    vault: {
        type: {
            total: { type: Number, default: 0 },
            history: { type: Array, default: [] }
        }, default: {
            total: 0,
            history: []
        }
    },

    partner: {
        type: {
            channel: { type: String, default: null },
            log: { type: String, default: null },
            staff: { type: String, default: null },
            text: { type: String, default: null },
            category: { type: String, default: null },
            url: { type: String, default: null },
            specialUrl: { type: String, default: null },
            specialUrlMs: { type: Number, default: null },
            specialUrlDate: { type: Number, default: null },
            status: { type: Number, default: 0 },
            point: { type: Number, default: 0 },
            blacklists: {
                type: {
                    guilds: { type: Array, default: [] },
                    categories: { type: Array, default: [] }
                }
            },
            must: {
                type: {
                    member: { type: Number, default: 0 }
                }
            },
            embeds: {
                type: {
                    author: {
                        type: {
                            name: { type: String, default: null },
                            icon: { type: String, default: null }
                        }, default: null
                    },
                    image: { type: String, default: null },
                    thumbnail: { type: String, default: null },
                    joinButton: { type: Boolean, default: false },
                    status: { type: Boolean, default: false },
                }
            },
            total: { type: Number, default: 0 },
            users: [
                {
                    user: { type: String, required: true },
                    total: { type: Number, default: 0 },
                    data: { type: Object, default: {} },
                }
            ],
            access: { type: Array, default: [] }
        }, default: {
            channel: null,
            log: null,
            staff: null,
            text: null,
            category: null,
            url: null,
            specialUrl: null,
            specialUrlMs: null,
            status: 0,
            point: 0,
            blacklists: {
                guilds: [],
                categories: []
            },
            must: {
                member: 0,
                category: null,
            },
            embeds: {
                color: null,
                title: null,
                image: null,
                thumbnail: null,
                joinButton: false,
                status: false,
                author: {}
            },
            total: 0,
            users: [],
            access: []
        }
    },

    botlist: {
        type: {
            channel: { type: String, default: null },
            log: { type: String, default: null },
            staff: { type: String, default: null },
            status: { type: Number, default: 0 },
            message: { type: String, default: null },
            embeds: {
                author: { type: String, default: null },
                description: { type: String, default: null },
                image: { type: String, default: null },
            },
            blacklists: { type: Array, default: [] },
            must: {
                server: { type: Number, default: 0 },
                topgg: { type: Boolean, default: false },
                topggVote: { type: Number, default: 0 },
            },
            queue: {
                type: [
                    {
                        id: { type: String, default: null },
                        messageId: { type: String, default: null },
                        owner: { type: String, default: null },
                    }
                ], default: []
            },
            bots: {
                type: [
                    {
                        botID: { type: String, default: null },
                        messageID: { type: String, default: null },
                        botOwner: { type: String, default: null }
                    }
                ], default: []
            },
            autorole: {
                type: {
                    bot: { type: String, default: null },
                    user: { type: String, default: null },
                }, default: {
                    bot: null,
                    user: null,
                }
            },
            addType: { type: Number, default: 0 },
            pin: { type: String, default: null },
        }, default: {
            channel: null,
            log: null,
            staff: null,
            status: 0,
            embeds: {
                author: null,
                description: null,
                image: null,
            },
            blacklists: [],
            must: {
                server: 0,
                topgg: false,
                topggVote: 0,
            },
            addType: 0,
            pin: null,
            queue: [],
            bots: [],
            message: null,
            autorole: {
                bot: null,
                user: null,
            },
        }
    },

    subscriptions: {
        type: {
            partner_random: { type: Number, default: 0 },
        }, default: {
            partner_random: 0,
        }
    },
    total_badwords: { type: Number, default: 0 },
}, {
    versionKey: false,
    timestamps: true
}).index({ guildId: 1 }, { unique: true });

schema.post(botEvents.regexp, () => {
    botEvents.triggerRefetch('Guild');
});

export const Guild = model('guild', schema);