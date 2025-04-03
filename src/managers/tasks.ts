import configs from '../configs';
import { User } from '../models';

export class Tasks {
    public async set(user: string) {
        const tasks = configs.tasks;
        const db = await User.findOne({ user: user }, { quests: 1, amount: 1 });

        /////////////////////////////////////////
        if (db?.quests.length === 3) return false;
        /////////////////////////////////////////

        const all_tasks_type = db?.quests?.map((task: any) => task.type);
        const task = tasks.filter((task: any) => !all_tasks_type?.includes(task.type));
        const random = task[Math.floor(Math.random() * task.length)];

        const amount = random.amount[Math.floor(Math.random() * random.amount.length)];
        const amount_index = random.amount.indexOf(amount);
        const count = random.count[amount_index];
        const difficulty = random.difficulty[amount_index];

        await User.updateOne({ user: user }, {
            $set: {
                lastQuest: Date.now()
            },
            $push: {
                quests: {
                    type: random.type,
                    id: random.id + '-' + db?.quests.length + Math.floor(Math.random() * 1000),
                    collected: 0,
                    prize: amount,
                    amount: count,
                    date: Date.now(),
                    difficulty: difficulty
                }
            }
        }, { upsert: true });

        return random;
    };

    public async removeAll(user: string) {
        await User.updateOne({ user: user }, { $set: { quests: [] } });
        return true;
    };

    public async remove(user: string, type: string) {
        await User.updateOne({ user: user }, { $pull: { quests: { type: type } } });
        return true;
    };

    public async get(user: string, type?: string) {
        const db = await User.findOne({ user: user }, { quests: 1 });

        if (type) {
            const task = db?.quests.find((task: any) => task.type === type);
            return task;
        } else {
            return db?.quests;
        };
    };

    public async update(user: string, type: string, collected: number) {
        const db = await User.findOne({ user: user }, { quests: 1 });

        const task = db?.quests.find((task: any) => task.type === type);
        const task_index = db?.quests.findIndex((task: any) => task.type === type);

        if (task) {
            if (task.collected + collected >= task.amount) {
                await User.updateOne({ user: user }, {
                    $pull: {
                        quests: {
                            type: type,
                        }
                    },
                    $inc: {
                        amount: task.prize
                    },
                    $push: {
                        history: {
                            reason: 'quest',
                            amount: task.prize,
                            staff: 'System',
                            date: Date.now()
                        }
                    }
                }, { upsert: true });
            } else {
                await User.updateOne({ user: user }, {
                    $set: {
                        [`quests.${task_index}.collected`]: task.collected + collected
                    },
                }, { upsert: true });
            };
        } else {
            return {
                status: false,
                finished: false,
                prize: 0,
                collected: 0,
                amount: 0,
                difficulty: 0
            };
        };

        return {
            status: true,
            finished: task?.collected + collected >= task?.amount,
            prize: task?.prize,
            collected: task?.collected + collected,
            amount: task?.amount,
            difficulty: task?.difficulty
        };
    };
};