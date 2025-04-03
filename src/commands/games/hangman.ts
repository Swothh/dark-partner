import { User } from '../../models';
import { HangMan } from '../../lib';
import { Commands } from '../../structures';
import { EmbedBuilder } from 'discord.js';


export const Command: Commands = {
    name: 'hangman',
    description: 'adam asıon.',
    aliases: ['adamasmaca', 'adam-asmaca', 'adam-asmaça', 'adam-asma', 'adamasmaca', 'aa'],
    category: 'games',
    cooldown: 300000,
    requireds: {
        vote: true
    },
    run: async (client, message, args, locale) => {
        new HangMan(client, {
            locale,
            message,
            words: (locale as any)('minigame.hangman.words'),
            man: {
                hat: '🎩',
                head: '😫',
                shirt: '👕',
                pants: '👖',
                feets: '🥾'
            },
            funcs: {
                delete: async () => { },
                finish: async (word, reason, letters) => {
                    if (reason === 'GUESS-CORRECT') {
                        let L = word.length;
                        let B: number = 25;

                        if (letters.length === 0) {
                            const reward = word.length + 5;

                            await User.updateOne({ user: message.author.id }, {
                                $inc: {
                                    'amount': reward
                                },
                                $push: {
                                    history: {
                                        reason: 'hangman',
                                        amount: reward,
                                        staff: 'System',
                                        date: Date.now()
                                    }
                                }
                            }, { upsert: true });

                            return;
                        };

                        const reward = L - letters.length + 6;
                        await User.updateOne({ user: message.author.id }, {
                            $inc: {
                                'amount': reward
                            },
                            $push: {
                                history: {
                                    reason: 'hangman',
                                    amount: reward,
                                    staff: 'System',
                                    date: Date.now()
                                }
                            }
                        }, { upsert: true });
                    } else if (reason === 'WIN') {
                        let L = word.length;

                        const reward = L - letters.length + 2;
                        await User.updateOne({ user: message.author.id }, {
                            $inc: {
                                'amount': reward
                            },
                            $push: {
                                history: {
                                    reason: 'hangman',
                                    amount: reward,
                                    staff: 'System',
                                    date: Date.now()
                                }
                            }
                        }, { upsert: true });
                    };
                }
            }
        }).start();
    }
};