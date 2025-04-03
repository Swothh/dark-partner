import { model, Schema } from 'mongoose';
import botEvents from '../botEvents';

const schema = new Schema({
    user: { type: String, required: true },
    locale: { type: String, default: null },
    localeSelected: { type: Boolean, default: false },

    badges: { type: Array, default: [] },
    amount: { type: Number, default: 0 },
    darkium: { type: Number, default: 0 },
    history: { type: Array, default: [] },
    total_badwords: { type: Number, default: 0 },
    daily: { type: Number, default: 0 },

    captcha: {
        type: {
            success: { type: Number, default: 0 },
            failed: { type: Number, default: 0 },
            banned: { type: Number, default: null },
            last_success: { type: Number, default: 0 }
        },
        default: {
            success: 0,
            failed: 0,
            banned: null,
            last_success: 0
        }
    },

    beta: {
        type: Object, default: {
            access: false,
            type: null,
            date: null
        }
    },

    banned: {
        type: {
            ban: { type: Boolean, default: false },
            reason: { type: String, default: null },
            date: { type: Number, default: null }
        }, default: {
            ban: false,
            reason: null,
            date: null
        }
    },

    vote: {
        type: {
            amount: { type: Number, default: 0 },
            streak: { type: Number, default: 0 },
            max_streak: { type: Number, default: 0 },
            date: { type: Number, default: 0 },
        }, default: {
            amount: 0,
            streak: 0,
            date: 0
        }
    },

    experiments: { type: Array, default: [] },
    inventory: {
        type: [
            {
                type: { type: String, required: true },
                id: { type: String, required: true },
                total: { type: Number, required: true }
            }
        ], default: []
    },
    quests: {
        type: [
            {
                type: { type: String, required: true }, // Quest type
                id: { type: String, required: true }, // Quest id
                amount: { type: Number, required: true }, // Amount of quest
                collected: { type: Number, required: true }, // Amount of collected
                prize: { type: Number, required: true }, // Amount of coins
                date: { type: Number, required: true }, // Date of quest
                difficulty: { type: Number, required: true } // Difficulty of quest
            }
        ], default: []
    },
    lastQuest: { type: Number, default: 0 },
}, {
    versionKey: false,
    timestamps: true
}).index({ user: 1 }, { unique: true });

schema.post(botEvents.regexp, () => {
    botEvents.triggerRefetch('User');
});

export const User = model('user', schema);