import { model, Schema } from 'mongoose';

export const Games = model('game', new Schema({
    user: { type: String, required: true },
    puzzle: { type: Array, default: null }
}).index({
    user: 1
}, {
    unique: true
}));