import { Puzzle, generate } from '../../lib';
import { Tasks } from '../../managers';
import { Commands } from '../../structures';
import axios, { AxiosPromise } from 'axios';
import { EmbedBuilder } from 'discord.js';
import { Games, User } from '../../models';
import * as ed from '@noble/ed25519';
let i = 0;

export const Command: Commands = {
    name: 'puzzle',
    description: 'Puzzle oyunu oyna ve coin kazan.',
    aliases: [],
    category: 'games',
    cooldown: 300000,
    requireds: {
        vote: true
    },
    run: async (client, message, args, locale) => {
        const waiting = await client.state.get<boolean>(`${message.author.id}:puzzle_waiting`);
        if (waiting) return message.error(locale('minigame.puzzle.waiting'));
        client.state.set(`${message.author.id}:puzzle_waiting`, true, Date.now() + 10000);

        const randomMap = generate();
        let store = await Games.findOne({ user: message.author.id }).select('puzzle').lean();
        if (store && store?.puzzle && store?.puzzle[1]?.tiles?.find((t: any) => t === store.puzzle[1].blocks.box) === undefined && store?.puzzle[1]?.tiles?.find((t: any) => t === store.puzzle[1].blocks.target) === undefined) {
            await Games.updateOne({ user: message.author.id }, {
                $set: {
                    puzzle: null
                }
            }).exec();
            store = null;
        };

        let key: string = store?.puzzle?.[2];
        let gameMessage = message;

        if (!store?.puzzle) {
            const msg = await message.nmReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.blank)
                        .setDescription(client.config.emojis.loading + ' ' + locale('minigame.puzzle.loading'))
                ]
            });

            const apikey = client.config.main.__apikeys.hastebin[i];
            i = (i + 1) % client.config.main.__apikeys.hastebin.length;

            const signature = await ed.sign(Buffer.from(JSON.stringify(randomMap.map)), new Uint8Array(Buffer.from(client.config.main.puzzle_private_key, 'base64')));
            const body = [randomMap.map, Buffer.from(signature).toString('base64')];

            const upload = await axios.post('https://hastebin.com/documents', body, {
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${apikey}`
                }
            }).catch((err): AxiosPromise => err?.response);

            if (!upload?.data?.key) return message.error(locale('minigame.puzzle.error'));
            Games.updateOne({ user: message.author.id }, { $set: { puzzle: [0, randomMap.map, upload.data.key] } }, { upsert: true }).exec();

            key = upload.data.key;
            gameMessage = msg;
        };

        if (!(await client.state.get<boolean>(`${message.author.id}:puzzle_waiting`))) return;
        client.state.delete(`${message.author.id}:puzzle_waiting`);

        new Puzzle(client, {
            locale: locale,
            map: store?.puzzle ? store.puzzle[1] : randomMap.map,
            kill_count: store?.puzzle ? store.puzzle[0] : 0,
            message,
            loading_message: message.id === gameMessage.id ? null : gameMessage,
            funcs: {
                save: (k, m) => {
                    Games.updateOne({ user: message.author.id }, {
                        $set: {
                            puzzle: [k, m, key]
                        }
                    }).exec();
                },
                delete: async () => {
                    await Games.updateOne({ user: message.author.id }, {
                        $set: {
                            puzzle: null
                        }
                    }).exec();
                }
            },
            messages: {
                death: (minigame) => new EmbedBuilder()
                    .setColor(client.config.colors.error)
                    .setTitle(locale('minigame.puzzle.dead'))
                    .setDescription(
                        locale('minigame.puzzle.dead_desc') +
                        '\n\n' +
                        minigame.view
                    ),
                exit: (minigame) => new EmbedBuilder()
                    .setColor(client.config.colors.error)
                    .setTitle(locale('minigame.puzzle.exit'))
                    .setDescription(
                        locale('minigame.puzzle.exit_desc') +
                        '\n\n' +
                        minigame.view
                    ),
                finish: (minigame) => new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setTitle(locale('minigame.puzzle.win'))
                    .setDescription(
                        locale('minigame.puzzle.win_desc', { killCount: String(minigame.killCount) }) +
                        '\n\n' +
                        minigame.view
                    )
            },
            on: {
                finish: async (minigame) => {
                    const randomNum = Math.floor(Math.random() * client.config.prices.puzzle.luck_bonus);
                    const amount = client.config.prices.puzzle.base + randomNum + (minigame.killCount * client.config.prices.puzzle.kill_bonus);

                    Promise.all([
                        await Games.updateOne({ user: message.author.id }, {
                            $set: {
                                puzzle: null
                            }
                        }, { upsert: true }).exec(),

                        await User.updateOne({ user: message.author.id }, {
                            $inc: {
                                amount: amount
                            },
                            $push: {
                                history: {
                                    reason: 'puzzle',
                                    amount: amount,
                                    staff: 'System',
                                    date: Date.now()
                                }
                            }
                        }, { upsert: true })
                    ]);
                },
                death: async (minigame) => {
                    await Games.updateOne({ user: message.author.id }, {
                        $set: {
                            puzzle: null
                        }
                    }, { upsert: true }).exec();
                }
            }
        }).start();

        const task = new Tasks();
        await task.update(message.author.id, 'play_puzzle', 1).then(d => {
            if (d.finished) {
                message.sendTask('play_puzzle', d.difficulty, d.prize);
            };
        });
    }
};