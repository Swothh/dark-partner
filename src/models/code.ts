import { model, Schema } from 'mongoose';
import botEvents from '../botEvents';

const schema = new Schema({
    code: { type: String, required: true },
    usage: { type: Number, default: 0 },
    type: { type: String, default: 'coin' },
    amount: { type: Number, default: 0 },
    totalUsage: { type: Number, default: 0 },
    users: { type: Array, default: [] }
}, {
    versionKey: false,
    timestamps: true
}).index({ code: 1 }, { unique: true });

export const Code = model('code', schema);