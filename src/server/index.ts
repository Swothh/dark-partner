import '../utils/logger';
import { Tasks } from '../managers';
import { createServer } from 'http';
import { ShardingManager } from 'discord.js';
import { Webhook } from '@top-gg/sdk';
import { User } from '../models';
import express from 'express';
import axios from 'axios';
import config from '../configs';

export const Server = (manager: ShardingManager) => {
    const app = express();
    const server = createServer(app);
    const webhook = new Webhook(config.main.topgg_token);

    app.set('trust proxy', 1);
    /*app.use(RateLimit);
    app.use(Security);
    app.use(Session);

    app.use(Passport.initialize());
    app.use(Passport.session());
    Loader(app, manager);*/

    app.post('/dblwebhook', webhook.listener(async vote => {
        const db = await User.findOne({ user: vote.user }, { vote: true, amount: true });
        const c = 1000 * 60 * 60 * 12;
        const past = typeof db?.vote?.date !== 'undefined' ? (Date.now() - db?.vote?.date) : 0;

        const revokeStreak = past >= (c * 2);
        const multipler = revokeStreak ? 1 : (1 + Math.min((db?.vote?.streak ?? 0), 80) * config.prices.vote.multipler);
        const reward = (config.prices.vote.reward * multipler).toFixed(1);

        const $set = {
            ...(!revokeStreak ? {} : {
                'vote.streak': 1,
                'vote.max_streak': Math.max(db?.vote?.streak ?? 0, db?.vote?.max_streak ?? 0),
            }),
            'vote.date': Date.now()
        };

        const $inc = {
            ...(revokeStreak ? {} : {
                'vote.streak': 1
            }),
            'vote.amount': 1,
            amount: reward,
        };

        await User.updateOne({
            user: vote.user
        }, { $set, $inc, $push: { history: { amount: reward, reason: 'vote', staff: 'System', date: Date.now() } } }, {
            upsert: true
        });

        const task = new Tasks();
        await task.update(vote.user, 'vote', 1);

        await axios.post('https://webhook.votetracker.bot/topgg/guild/1144557139512266772/bot/1157779657467379823', {
            user: vote.user,
            query: '',
            bot: '1157779657467379823'
        }, {
            headers: {
                Authorization: 'vote tracker auth (silindi)'
            }
        }).catch(() => { });
    }));

    server.listen(process.env.PORT ?? config.server.port, () => {
        console.info(`Server is listening on port http://localhost:${process.env.PORT ?? config.server.port}`);
    });
};