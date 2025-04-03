import { model, Schema } from 'mongoose';
import botEvents from '../botEvents';

const schema = new Schema({
    guild: { type: String, required: true },
    skipped: { type: Boolean, default: false },
});

export const Skipped = model('skipSetup', schema);