import { User } from '../models';

interface History {
    reason: string;
    staff: string;
};

export class Coin {
    public static async add(user: string, amount: number, history: History, darkium: boolean = false): Promise<boolean> {
        if (!darkium) {
            await User.updateOne({ user }, {
                $inc: {
                    amount
                },
                $push: {
                    history: {
                        ...history,
                        amount,
                        date: Date.now()
                    }
                }
            }, { upsert: true });
        } else {
            await User.updateOne({ user }, {
                $inc: {
                    darkium: amount
                }
            }, { upsert: true });
        };

        return true;
    };
    
    public static async remove(user: string, amount: number, history: History, darkium: boolean = false): Promise<number> {
        if (!darkium) {
            const wallet = await User.findOne({ user }, { amount: 1 });
            amount = -(amount > (wallet?.amount ?? 0) ? (wallet?.amount ?? 0) : amount);

            await User.updateOne({ user }, {
                $inc: {
                    amount
                },
                $push: {
                    history: {
                        ...history,
                        amount,
                        date: Date.now()
                    }
                }
            }, { upsert: true });
        } else {
            const wallet = await User.findOne({ user });
            amount = -(amount > (wallet?.darkium ?? 0) ? (wallet?.darkium ?? 0) : amount);

            await User.updateOne({ user }, {
                $inc: {
                    darkium: amount
                }
            }, {
                upsert: true
            });
        };

        return amount;
    };
};