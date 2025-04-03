import { Interaction, ButtonInteraction, Message } from 'discord.js';
import { Components, Render } from './utils';
import { Map, Options } from './interfaces';
import Client from '../../client';

export default class Puzzle {
    private gameId: string = Math.random().toString(36).substring(2);
    private client: Client;
    private onFinish: number[] = [];

    public gameMessage: Message;
    public killCount: number = 0;
    public options: Options;
    public view: string;
    public map: Map;

    public finished: 'WIN' | 'DEATH' | 'EXIT' | false = false;
    public started: boolean = false;
    public blocks: Map['blocks'];
    public tiles: Map['tiles'];

    constructor(client: Client, options: Options) {
        this.client = client;
        this.options = options;
        this.killCount = options.kill_count || 0;
        this.map = this.options.map;
        this.tiles = this.map.tiles;
        this.blocks = this.map.blocks;
    };

    start = (): Promise<Boolean> => new Promise(async (resolve, reject) => {
        this.gameMessage = await (this.options.loading_message || this.options.message)[this.options.loading_message ? 'edit' : 'reply']({
            embeds: Render(this),
            components: Components([this.options.message.author.id, this.gameId]),
            allowedMentions: {
                repliedUser: false
            }
        }).catch(err => {
            return reject(err)
        }) as Message<boolean>;

        this.started = true;
        this.client.puzzleGames.set(this.gameMessage.id, this);
        return resolve(true);
    });

    handleButton = async (interaction: Interaction): Promise<void> => {
        if (!interaction.isButton()) return;
        if (!interaction.customId.match(new RegExp(`DISCORD-MINIGAME-(EXIT|UP|LEFT|DOWN|RIGHT)-${this.options.message.author.id}-${this.gameId}`))) return this.deferButton(interaction);
        if (interaction.user.id !== this.options.message.author.id) return await interaction.deferUpdate().catch(() => { }) && void 0;
        const action = interaction.customId.split('-')[2];

        if (action === 'EXIT') {
            const i = this.tiles.indexOf(this.blocks.character);
            this.finished = 'EXIT';
            this.tiles[i] = this.blocks['dead'];

            await Promise.all([
                this.options.funcs.delete(),
                this.options.on?.death?.(this)
            ]);

            this.gameMessage.edit({
                embeds: Render(this, 'exit'),
                components: Components([this.options.message.author.id, this.gameId], true)
            }).catch(() => { }).finally(() => {
                interaction.deferUpdate().catch(() => { });
            });
            return;
        };

        this.move(
            interaction,
            <'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>action
        );
    };

    deferButton = (interaction: ButtonInteraction): void => {
        if (interaction.customId.match(/DISCORD-MINIGAME-(EXIT|UP|LEFT|DOWN|RIGHT)/g)) {
            interaction.deferUpdate().catch(() => { });
        };
    };

    move = async (interaction: ButtonInteraction, d: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): Promise<void> => {
        const i = this.tiles.indexOf(this.blocks.character);
        const mapWidth = Number(this.map.width);

        let b = this.blocks,
            t = this.tiles,
            p = {
                UP: [mapWidth, mapWidth * 2, mapWidth * 3],
                DOWN: [-mapWidth, -mapWidth * 2, -mapWidth * 3],
                LEFT: [1, 2, 3],
                RIGHT: [-1, -2, -3]
            };

        const isBlocked = (index: number, to: keyof typeof p) => {
            const blocked: string[] = [];
            index = index - p[to][0];

            Object.keys(p).forEach((dir: keyof typeof p) => {
                if (t[index - p[dir][0]] === b['wall']) {
                    blocked.push(dir);
                } else if (t[index - p[dir][0]] === b['box']) {
                    if (t[index - p[dir][1]] === b['wall'] || (t[index - p[dir][1]] === b['box'] && [b['box'], b['wall']].includes(t[index - p[dir][2]]))) {
                        blocked.push(dir);
                    };
                };
            });

            return blocked;
        };

        if (![b['wall'], b['enemy']].includes(t[i - p[d][0]])) {
            if (t[i - p[d][0]] === b['box']) {
                if (t[i - p[d][1]] !== b['wall']) {
                    if (t[i - p[d][1]] === b['box']) {
                        if (![b['wall'], b['box']].includes(t[i - p[d][2]])) {
                            const finishCheck = t[i - p[d][2]];
                            t[i - p[d][2]] = finishCheck === b['target'] ? b['wall'] : b['box'];
                            t[i - p[d][1]] = b['box'];
                            t[i - p[d][0]] = b['character'];
                            if (finishCheck === b['enemy']) this.killCount++;

                            if (this.onFinish.includes(i)) {
                                this.onFinish = this.onFinish.filter(tile => tile !== i);
                                t[i] = b['target'];
                            } else {
                                t[i] = b['blank'];
                            };

                            const isFinished = (
                                finishCheck === b['target'] &&
                                !t.find(tile => tile === b['target'])
                            );

                            if (isFinished) this.finished = 'WIN';
                            if (isFinished && this.options.on?.finish) await this.options.on.finish(this);

                            this.gameMessage.edit({
                                embeds: Render(this, isFinished ? 'finish' : null),
                                components: Components([this.options.message.author.id, this.gameId], isFinished, isBlocked(i, d))
                            }).catch(() => { }).finally(() => {
                                interaction.deferUpdate().catch(() => { });
                            });
                        } else {
                            interaction.deferUpdate().catch(() => { });
                        };
                    } else {
                        const finishCheck = t[i - p[d][1]];
                        t[i - p[d][1]] = finishCheck === b['target'] ? b['wall'] : b['box'];
                        t[i - p[d][0]] = b['character'];
                        if (finishCheck === b['enemy']) this.killCount++;

                        if (this.onFinish.includes(i)) {
                            this.onFinish = this.onFinish.filter(tile => tile !== i);
                            t[i] = b['target'];
                        } else {
                            t[i] = b['blank'];
                        };

                        const isFinished = (
                            finishCheck === b['target'] &&
                            !t.find(tile => tile === b['target'])
                        );

                        if (isFinished) this.finished = 'WIN';
                        if (isFinished && this.options.on?.finish) await this.options.on.finish(this);

                        this.gameMessage.edit({
                            embeds: Render(this, isFinished ? 'finish' : null),
                            components: Components([this.options.message.author.id, this.gameId], isFinished, isBlocked(i, d))
                        }).catch(() => { }).finally(() => {
                            interaction.deferUpdate().catch(() => { });
                        });
                    };
                } else {
                    interaction.deferUpdate().catch(() => { });
                };
            } else {
                if (t[i - p[d][0]] === b['target']) this.onFinish.push(i - p[d][0]);
                t[i - p[d][0]] = b['character'];

                if (this.onFinish.includes(i)) {
                    this.onFinish = this.onFinish.filter(tile => tile !== i);
                    t[i] = b['target'];
                } else {
                    t[i] = b['blank'];
                };

                this.gameMessage.edit({
                    embeds: Render(this),
                    components: Components([this.options.message.author.id, this.gameId], false, isBlocked(i, d))
                }).catch(() => { }).finally(() => {
                    interaction.deferUpdate().catch(() => { });
                });
            };
        } else if (t[i - p[d][0]] === b['enemy']) {
            t[i] = b['dead'];
            this.finished = 'DEATH';
            if (this.options.on?.death) await this.options.on.death(this);

            this.gameMessage.edit({
                embeds: Render(this, 'death'),
                components: Components([this.options.message.author.id, this.gameId], true)
            }).catch(() => { }).finally(() => {
                interaction.deferUpdate().catch(() => { });
            });
        } else {
            interaction.deferUpdate().catch(() => { });
        };

        this.options.funcs.save(this.killCount, {
            ...this.map,
            tiles: this.tiles,
            blocks: this.blocks
        });
    };
};