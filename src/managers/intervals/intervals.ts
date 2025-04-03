import { Guild, Timeouts, User } from '../../models';
import { Tasks } from '../tasks';
import { connection } from 'mongoose';
import Dark from '../../client';

export const Interval = (client: Dark) => setInterval(async () => {
    if (connection.readyState !== 1) return;

    const guilds = await Guild.find({}).lean();
    guilds.forEach(async g => {
        if (g?.partner?.specialUrl && g?.partner?.specialUrlDate && g?.partner?.specialUrlMs) {
            const time = g.partner.specialUrlMs;
            const past = Date.now() - g.partner.specialUrlDate;

            if (past >= time) {
                await Guild.updateOne({ guildId: g.guildId }, {
                    $set: {
                        'partner.specialUrl': null,
                        'partner.specialUrlMs': null,
                        'partner.specialUrlDate': null
                    }
                });
            };
        };
    });

    const timeouts = await Timeouts.find({}).lean();
    timeouts.forEach(async t => {
        const past = Date.now() - t.date;
        const ms = 1000 * 60 * 60 * 12;

        if (past >= ms) {
            await Timeouts.deleteOne({ _id: t._id });
        };
    });

    const users = await User.find({}, { quests: 1, lastQuest: 1, user: 1 }).lean();
    users.filter(u => u?.lastQuest).forEach(async u => {
        const past = Date.now() - u.lastQuest;
        const ms = 1000 * 60 * 60 * 12 /*1000 * 60 * 60 * 24*/;

        if (past >= ms && u?.quests?.length < 3) {
            const task = new Tasks();
            await task.set(u.user);
        };
    });
}, 1000 * 60 * 5);