import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, TextInputBuilder, TextInputStyle, ModalBuilder } from 'discord.js';
import { Options } from './interfaces';
import { pageLetters } from './utils';
import Dark from '../../client';
import Configs from '../../configs';
import * as Managers from '../../managers';

export default class HangMan {
    public client: Dark;
    public options: Options;

    public miniGameId: string = Math.random().toString(36).substring(2);

    public letters: string[] = [];
    public damage: number = 0;
    public finished: boolean = false;

    public word: string = '';
    public finishReason: 'WIN' | 'LOSE' | 'EXIT' | 'TIMEISUP' | 'GUESS-CORRECT' | 'GUESS-INCORRECT' | false = false;
    public page = 0;

    constructor(client: Dark, options: Options) {
        this.client = client;
        this.options = options;

        this.letters = [];
        this.damage = 0;
        this.finished = false;

        this.word = this.options.words[Math.floor(Math.random() * this.options.words.length)];
        this.page = 0;
    };

    getBoard = (): string => {
        let board = '```\n  _________\n    |    |    \n    |   ';

        const manParts = [
            this.options.man.hat,
            this.options.man.head,
            this.options.man.shirt,
            this.options.man.pants,
            this.options.man.feets,
        ];

        for (let i = 0; i < manParts.length; i++) {
            if (this.damage > i) {
                board += manParts[i] + '   \n    |   ';
            } else {
                board += '    \n    |   ';
            };
        };

        board += '  \n    |\n```';

        return board;
    };

    components = (): any[] => {
        if (this.finished) return [];

        const c: ActionRowBuilder[] = [];
        const letters = pageLetters(this.page, this.options.locale);
        const id = `DISCORD-MINIGAME-HANGMAN-${this.options.message.author.id}-${this.miniGameId}`;

        if (typeof letters === 'string') return;
        letters.forEach((letter, i) => {
            if (i % 4 === 0) c.push(new ActionRowBuilder());

            const isGuessed = this.letters.includes(letter);
            const isDisabled = isGuessed || this.finished;

            c[c.length - 1].addComponents(
                new ButtonBuilder()
                    .setCustomId(`${id}-${letter}`)
                    .setLabel(letter)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(isDisabled)
            );
        });

        return c.push(new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`${id}-GUESS`)
                .setEmoji('🤔')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`${id}-PREV`)
                .setEmoji('⬅️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(this.page === 0),
            new ButtonBuilder()
                .setCustomId(`${id}-NEXT`)
                .setEmoji('➡️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(this.page === 1),
            new ButtonBuilder()
                .setCustomId(`${id}-EXIT`)
                .setEmoji('➖')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(this.finished)
        )), c;
    };

    render = (message: Message): void => {
        const collector = message.createMessageComponentCollector({
            filter: (i) => i.user.id === this.options.message.author.id,
            time: 300000
        });

        collector.on('collect', async (i) => {
            if (!i.isButton()) return;

            if (i.customId.split('-')[5] !== 'GUESS') await i.deferUpdate().catch(() => { });

            const letter = i.customId.split('-')[5];
            if (letter === 'EXIT') {
                this.finished = true;

                this.finishReason = 'EXIT';
                collector.stop();

                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Configs.colors.error)
                            .setAuthor({ name: this.options.message.author.displayName + ' — ' + this.options.locale('minigame.hangman.exit'), iconURL: this.options.message.author.displayAvatarURL() })
                            .setDescription(this.getBoard())
                            .addFields({
                                name: this.options.locale('minigame.hangman.word'),
                                value: this.word + ' *(' + this.options.locale('minigame.hangman.exit') + ')*',
                                inline: true
                            }, {
                                name: this.options.locale('minigame.hangman.letters') + ` (${this.letters.length})`,
                                value: this.letters.join(', ') || this.options.locale('minigame.hangman.no'),
                                inline: true
                            })
                    ],
                    components: []
                });

                return;
            };

            if (letter === 'GUESS') {
                const create_modal = new Managers.ModalManager(this.client, i);
                const modal = await create_modal.build(`DISCORD-MINIGAME-HANGMAN-GUESS-${Math.floor(Math.random() * 1000)}`, {
                    modal: new ModalBuilder()
                        .setTitle(this.options.locale('minigame.hangman.guess_modal.title'))
                        .addComponents(
                            new ActionRowBuilder<TextInputBuilder>()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('DISCORD-MINIGAME-HANGMAN-GUESS-INPUT')
                                        .setLabel(this.options.locale('minigame.hangman.guess_modal.label'))
                                        .setPlaceholder(this.options.locale('minigame.hangman.guess_modal.label'))
                                        .setStyle(TextInputStyle.Short)
                                        .setMaxLength(this.word.length)
                                        .setRequired(true)
                                )
                        )
                });

                const g = modal.fields.getTextInputValue('DISCORD-MINIGAME-HANGMAN-GUESS-INPUT');
                await modal.deferUpdate().catch(() => { });

                if (g.toLocaleLowerCase() !== this.word.toLowerCase()) {
                    this.finished = true;
                    this.damage = 5;
                    this.finishReason = 'GUESS-INCORRECT';
                    collector.stop();

                    await i.message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Configs.colors.error)
                                .setAuthor({ name: this.options.message.author.displayName + ' ' + this.options.locale('minigame.hangman.lose_author'), iconURL: this.options.message.author.displayAvatarURL() })
                                .setDescription(this.getBoard())
                                .addFields({
                                    name: this.options.locale('minigame.hangman.word'),
                                    value: this.word + ' *(' + this.options.locale('minigame.hangman.guess_incorrect') + ')*',
                                    inline: true
                                }, {
                                    name: this.options.locale('minigame.hangman.letters') + ` (${this.letters.length})`,
                                    value: this.letters.join(', ') || this.options.locale('minigame.hangman.no'),
                                    inline: true
                                })
                        ],
                        components: []
                    });

                    return;
                };

                this.finished = true;
                this.finishReason = 'GUESS-CORRECT';

                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Configs.colors.main)
                            .setAuthor({ name: this.options.message.author.displayName + ' ' + this.options.locale('minigame.hangman.finished_author'), iconURL: this.options.message.author.displayAvatarURL() })
                            .setDescription(this.letters.length === 0 ? this.options.locale('minigame.hangman.finished_desc_first_guess', { word: this.word }) : this.options.locale('minigame.hangman.finished_desc', { word: this.word }))
                            .addFields({
                                name: this.options.locale('minigame.hangman.word'),
                                value: this.word,
                                inline: true
                            }, {
                                name: this.options.locale('minigame.hangman.letters') + ` (${this.letters.length})`,
                                value: this.letters.join(', ') || this.options.locale('minigame.hangman.no'),
                                inline: true
                            })
                    ],
                    components: []
                });

                collector.stop();
                if (this.options.funcs?.finish) await this.options.funcs.finish(this.word, this.finishReason, this.letters);

                return;
            };

            if (letter === 'PREV') {
                if (this.page === 0) return;

                this.page--;
                await i.message.edit({
                    embeds: [new EmbedBuilder()
                        .setColor(Configs.colors.blank)
                        .setAuthor({ name: this.options.message.author.displayName + ' ' + this.options.locale('minigame.hangman.author'), iconURL: this.options.message.author.displayAvatarURL() })
                        .setDescription(this.getBoard())
                        .addFields({
                            name: this.options.locale('minigame.hangman.word'),
                            value: this.transformWord(),
                            inline: true
                        }, {
                            name: this.options.locale('minigame.hangman.letters') + ` (${this.letters.length})`,
                            value: this.letters.join(', ') || this.options.locale('minigame.hangman.no'),
                            inline: true
                        })
                    ],
                    components: this.components()
                });
                return;
            };

            if (letter === 'NEXT') {
                if (this.page === 2) return;

                this.page++;
                await i.message.edit({
                    embeds: [new EmbedBuilder()
                        .setColor(Configs.colors.blank)
                        .setAuthor({ name: this.options.message.author.displayName + ' ' + this.options.locale('minigame.hangman.author'), iconURL: this.options.message.author.displayAvatarURL() })
                        .setDescription(this.getBoard())
                        .addFields({
                            name: this.options.locale('minigame.hangman.word'),
                            value: this.transformWord(),
                            inline: true
                        }, {
                            name: this.options.locale('minigame.hangman.letters') + ` (${this.letters.length})`,
                            value: this.letters.join(', ') || this.options.locale('minigame.hangman.no'),
                            inline: true
                        })
                    ],
                    components: this.components()
                });
                return;
            };

            if (this.letters.includes(letter)) return;

            this.letters.push(letter);

            const l = letter === 'İ' ? 'I' : letter;
            if (!this.word.toUpperCase().split('').includes(l)) this.damage++;
            if (this.damage === 5) {
                this.finished = true;
                this.finishReason = 'LOSE';
                collector.stop();

                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Configs.colors.error)
                            .setAuthor({ name: this.options.message.author.displayName + ' ' + this.options.locale('minigame.hangman.lose_author'), iconURL: this.options.message.author.displayAvatarURL() })
                            .setDescription(this.getBoard())
                            .addFields({
                                name: this.options.locale('minigame.hangman.word'),
                                value: this.word + ' *(' + this.options.locale('minigame.hangman.lost') + ')*',
                                inline: true
                            }, {
                                name: this.options.locale('minigame.hangman.letters') + ` (${this.letters.length})`,
                                value: this.letters.join(', '),
                                inline: true
                            })
                    ],
                    components: []
                });

                if (this.options.funcs?.finish) await this.options.funcs.finish(this.word, this.finishReason, this.letters);

                return;
            };

            const e = new EmbedBuilder()
                .setColor(Configs.colors.blank)
                .setAuthor({ name: this.options.message.author.displayName + ' ' + this.options.locale('minigame.hangman.author'), iconURL: this.options.message.author.displayAvatarURL() })
                .setDescription(this.getBoard())
                .addFields({
                    name: this.options.locale('minigame.hangman.word'),
                    value: this.transformWord(),
                    inline: true
                }, {
                    name: this.options.locale('minigame.hangman.letters') + ` (${this.letters.length})`,
                    value: this.letters.join(', ') || this.options.locale('minigame.hangman.no'),
                    inline: true
                })

            await i.message.edit({
                embeds: [e],
                components: this.components()
            });

            const cleanWord = this.word.toUpperCase().replace(/ /g, '');
            const isEveryLetterIncluded = cleanWord.split('').every((l) => this.letters.includes(l));

            if (isEveryLetterIncluded) {
                this.finished = true;
                this.finishReason = 'WIN';
                collector.stop();

                if (this.options.funcs?.finish) await this.options.funcs.finish(this.word, this.finishReason, this.letters);
            };

            if (this.finished && this.damage !== 5) {
                await this.options.funcs.delete();

                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Configs.colors.main)
                            .setAuthor({ name: this.options.message.author.displayName + ' ' + this.options.locale('minigame.hangman.finished_author'), iconURL: this.options.message.author.displayAvatarURL() })
                            .setDescription(this.options.locale('minigame.hangman.finished_desc'))
                            .addFields({
                                name: this.options.locale('minigame.hangman.word'),
                                value: this.word,
                                inline: true
                            }, {
                                name: this.options.locale('minigame.hangman.letters') + ` (${this.letters.length})`,
                                value: this.letters.join(', ') || this.options.locale('minigame.hangman.no'),
                                inline: true
                            })
                    ],
                    components: []
                });
            };
        });

        collector.on('end', async (_, __) => {
            if (this.finished) return;

            if (__ === 'time') {
                this.finished = true;
                this.finishReason = 'TIMEISUP';

                await message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Configs.colors.main)
                            .setAuthor({ name: this.options.message.author.displayName + ' ' + this.options.locale('minigame.hangman.finished_author'), iconURL: this.options.message.author.displayAvatarURL() })
                            .setDescription(this.getBoard())
                            .addFields({
                                name: this.options.locale('minigame.hangman.word'),
                                value: this.word + ' *(' + this.options.locale('minigame.hangman.time_is_up') + ')*',
                                inline: true
                            }, {
                                name: this.options.locale('minigame.hangman.letters') + ` (${this.letters.length})`,
                                value: this.letters.join(', ') || this.options.locale('minigame.hangman.no'),
                                inline: true
                            })
                    ],
                    components: []
                });
            };

            this.finished = true;
        });
    };

    transformWord = (): string => {
        return this.word
            .toUpperCase()
            .split('')
            .map((l) =>
                this.letters.includes(l)
                    ? pageLetters(l, this.options.locale)
                    : l === ' '
                        ? '❓'
                        : '❓'
            )
            .join(' ');
    };

    start = async (): Promise<void> => {
        const e = new EmbedBuilder()
            .setColor(Configs.colors.blank)
            .setAuthor({ name: this.options.message.author.tag + ' ' + this.options.locale('minigame.hangman.author'), iconURL: this.options.message.author.displayAvatarURL() })
            .setDescription(this.getBoard())
            .addFields({
                name: this.options.locale('minigame.hangman.word'),
                value: this.transformWord()
            }, {
                name: this.options.locale('minigame.hangman.letters') + ` (${this.letters.length})`,
                value: this.letters.join(', ') || this.options.locale('minigame.hangman.no')
            })

        const msg = await this.options.message.nmReply({
            embeds: [e],
            components: this.components()
        });

        this.render(msg);
    };
};