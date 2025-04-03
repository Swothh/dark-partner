import { model, Schema } from 'mongoose';
import botEvents from '../botEvents';

const schema = new Schema({
    guild: { type: String, required: true },
    target: { type: String, required: true },
    message: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Number, required: true }
});

schema.post(botEvents.regexp, () => {
    botEvents.triggerRefetch('Requests');
});

export const Requests = model('request', schema);