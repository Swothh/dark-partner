import { model, Schema } from 'mongoose';

export const Global = model('global', new Schema({
    globalId: { type: String, required: true },
    stats: {
        type: Object, default: {
            commandUsage: 0,
            totalReboot: 0,
            totalError: 0,
            totalCrash: 0,
            lastReboot: null
        }
    },
    update: { type: String, default: null },
    maintenance: { type: String, default: null }
}));