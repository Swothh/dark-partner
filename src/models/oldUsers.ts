import { model, Schema } from 'mongoose';

export const oldUsers = model('oldUsers', new Schema({
    user: { type: String, required: true },
    amount: { type: Number, default: 0 },
    darkium: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    lastCredits: { type: Object, default: {} },
    explored: { type: Array, default: [] },
    history: { type: Array, default: [] },
    rpsWin: { type: Number, default: 0 },

    silverBox: { type: Number, default: 0 },
    silverBoxMS: { type: Number, default: 0 },
    goldBox: { type: Number, default: 0 },
    goldBoxMS: { type: Number, default: 0 },

    dailyKeys: { type: Number, default: 0 },
    silverKeys: { type: Number, default: 0 },
    goldKeys: { type: Number, default: 0 },

    mainQuest: { type: Number, default: null },
    dailyQuest: { type: Number, default: null },
    mainProgress: { type: Number, default: 0 },
    dailyProgress: { type: Number, default: 0 },
}));

interface History {
    amount: number;
    reason: string;
    staff: string;
    date: number;
};

export interface ICoin {
    user: string;
    amount: number;
    darkium: number;
    credits: number;
    lastCredits: any;
    explored: string[];
    history: History[];
    rpsWin: number;
    silverBox: number;
    silverBoxMS: number;
    goldBox: number;
    goldBoxMS: number;
    dailyKeys: number;
    silverKeys: number;
    goldKeys: number;
    mainQuest: number;
    dailyQuest: number;
    mainProgress: number;
    dailyProgress: number;
};