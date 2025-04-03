import { Client, GatewayIntentBits, Collection, REST, Guild as DiscordGuild, Channel, Message, MessagePayload, ChannelType, MessageCreateOptions } from 'discord.js';
import { Commands, Events, DeclareOptions, SlashCommands } from '../structures';
import { CacheManager } from '../managers/cache';
import { StateManager } from '../managers/state';
import * as Locale from '../languages/tr';
import * as managers from '../managers';
import { connect, set } from 'mongoose';
import botEvents from '../botEvents';
import * as utils from '../utils';
import { Puzzle } from '../lib';
import config from '../configs';
import { globSync } from 'glob';
import { join } from 'path';
import chalk from 'chalk';
import '../managers/displayName';
import NLP from '../nlp';

export default class Dark extends Client {
    public readonly REST = new REST({ version: '10' }).setToken(config.main.tokens[config.main.__development ? 'development' : 'production']);
    public readonly config = config;
    public guide: Awaited<ReturnType<typeof utils.fetchGuide>>;
    public shardManager = new managers.Eval(this);
    public cache = new CacheManager(this);
    public state = new StateManager();
    public managers = managers;
    public utils = utils;
    public nlp = new NLP();

    public readonly whitelistedGuilds = new Collection<string, string>();
    public readonly commands = new Collection<string, Commands>();
    public readonly slash_commands = new Collection<string, SlashCommands>();
    public readonly context_commands = new Collection<string, SlashCommands>();
    public readonly events = new Collection<string, Events>();
    public readonly locales = new Collection<string, typeof Locale>();
    public readonly caseWaiting = new Collection<string, boolean>();
    public readonly bjGames = new Collection<string, string>();
    public requestable: any = true;
    public collectionGuilds = new Collection<string, any[]>();
    public puzzleGames = new Collection<string, Puzzle>();

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildPresences
            ]
        });
    };

    public async init(): Promise<void> {
        this.fetchGuide();
        await this.connectDatabase();
        await this.discordLogin();

        this.loadCommands()
            .registerIntervals();

        botEvents.on('cache_loaded', () => (
            this.loadEvents()
                .loadLocales()
        ));
    };

    public async fetchGuide() {
        const data = await this.utils.fetchGuide().catch(() => { });
        if (data) this.guide = data;
    };

    public discordLogin(): Promise<void> {
        const token = this.config.main.tokens[this.config.main.__development ? 'development' : 'production'];

        return new Promise((resolve, reject) => {
            this.login(token)
                .then(() => resolve())
                .catch(reject);
        });
    };

    public connectDatabase(): Promise<void> {
        set('strictQuery', true);

        return new Promise(resolve => {
            connect(this.config.database.uri)
                .then(() => resolve());
        });
    };

    public loadCommands(r?: boolean): Dark {
        const files = globSync('**/*.ts', { cwd: join(__dirname, '../commands') });
        const slash_files = globSync('**/*.ts', { cwd: join(__dirname, '../commands/slash') });
        const context_files = globSync('**/*.ts', { cwd: join(__dirname, '../commands/context') });

        if (files.length === 0) {
            console.warn('No commands were found in the commands file, this part is skipped.');

            return this;
        };

        if (slash_files.length === 0) {
            console.warn('No slash commands were found in the slash commands file, this part is skipped.');
        };

        if (context_files.length === 0) {
            console.warn('No context commands were found in the context commands file, this part is skipped.');
        };

        if (r) this.commands.clear();

        files.forEach(async file => {
            const { Command }: { Command: Commands } = await import(`../commands/${file}`);
            if (!file.startsWith('subcommands') && !file.startsWith('slash') && !file.startsWith('context')) this.commands.set(Command.name, Command);
        });

        slash_files.forEach(async file => {
            const { Command }: { Command: SlashCommands } = await import(`../commands/slash/${file}`);
            this.slash_commands.set(Command.name, Command);
        });

        context_files.forEach(async file => {
            const { Command }: { Command: SlashCommands } = await import(`../commands/context/${file}`);
            this.context_commands.set(Command.name, Command);
        });

        console.info(`Loaded ${files.length} default commands.`);
        console.info(`Loaded ${slash_files.length} slash commands.`);
        console.info(`Loaded ${context_files.length} context commands.`);

        return this;
    };

    public loadEvents(r?: boolean): Dark {
        const files = globSync('**/*.ts', { cwd: join(__dirname, '../events') });
        if (files.length === 0) {
            console.warn('No events were found in the events file, this part is skipped.');
            return this;
        };

        files.forEach(async file => {
            if (r) delete require.cache[require.resolve(`../events/${file}`)];

            const { Event }: { Event: Events } = await import(`../events/${file}`);
            this[Event.on](Event.name, Event.run.bind(null, this));
            this.events.set(Event.name, Event);
        });

        if (!r) console.info(`Loaded ${files.length} events.`);

        return this;
    };

    public loadLocales(): Dark {
        const files = globSync('**/*.ts', { cwd: join(__dirname, '../languages') });
        if (files.length === 0) {
            console.warn('No locales were found in the languages file, this part is skipped.');

            return this;
        };

        files.forEach(async (file, i) => {
            const Locales: typeof Locale = await import(`../languages/${file}`);
            console.info(`Loading language: ${chalk.yellow(`${Locales.config.iso.toUpperCase()}`)} (${i + 1}/${files.length})`);
            Locales.config.availableFor.forEach(iso => this.locales.set(iso, Locales));
        });

        console.info(`Loaded ${files.length} languages.`);

        return this;
    };

    public registerIntervals(): Dark {
        try {
            const files = globSync('**/*.ts', { cwd: join(__dirname, '../managers/intervals') });
            if (files.length === 0) {
                console.warn('No intervals were found in the intervals file, this part is skipped.');

                return this;
            };

            files.forEach(async file => {
                const { Interval }: { Interval: (client: Dark) => void } = await import(`../managers/intervals/${file}`);
                Interval(this);
            });

            console.info(`Loaded ${files.length} intervals.`);
        } catch (error) {
            console.error(error);
        };

        return this;
    };

    public requestReload(type: string): Promise<number> {
        return new Promise(r => {
            if (this.requestable !== true) return r(0);
            this.requestable = r;
            this.shard.send(`reload:${type}`);
        });
    };

    public async reloadCommand(target?: string): Promise<void> {
        try {
            if (this.requestable === true) this.requestable = false;
            let get;

            const getCommand = (): Promise<boolean> => new Promise(async resolve => {
                try {
                    delete require.cache[require.resolve('../commands/' + target + '.ts')];
                    const { Command }: { Command: Commands } = await import('../commands/' + target + '.ts').catch(() => { });
                    if (!Command) return resolve(false);
                    this.commands.set(Command.name, Command);
                    return resolve(true);
                } catch {
                    return resolve(false);
                };
            });

            if (target) get = getCommand;
            else get = this.loadCommands.bind(this, true);
            const result = await get();

            if (!result && target) {
                if (typeof this.requestable === 'function') this.requestable(1);
                this.requestable = true;
                return;
            };

            if (typeof this.requestable === 'function') this.requestable(2);
            this.requestable = true;
            return;
        } catch {
            if (typeof this.requestable === 'function') this.requestable(0);
            this.requestable = true;
        };
    };

    public async reloadLocale(): Promise<void> {
        try {
            if (this.requestable === true) this.requestable = false;
            const langs = ['tr', 'en'];

            for (const lang of langs) {
                delete require.cache[require.resolve('../languages/' + lang + '.ts')];
                const Locales: typeof Locale = await import('../languages/' + lang + '.ts').catch(() => { });
                if (!Locales) continue;
                this.locales.set(Locales.config.iso, Locales);
            };

            if (typeof this.requestable === 'function') this.requestable(2);
            this.requestable = true;
        } catch {
            if (typeof this.requestable === 'function') this.requestable(0);
            this.requestable = true;
        };
    };
};

declare module 'discord.js' {
    interface Message {
        error: (message: string, opt?: DeclareOptions) => Promise<Message>;
        success: (message: string, opt?: DeclareOptions) => Promise<Message>;
        nmReply: (object: MessageReplyOptions) => Promise<Message>;
        sendTask: (task: string, difficulty: number, prize: number, opt?: DeclareOptions) => Promise<Message>;
    }
    interface ModalSubmitInteraction {
        error: (message: string, opt?: DeclareOptions) => Promise<any>;
        success: (message: string, opt?: DeclareOptions) => Promise<any>;
    }
    interface ButtonInteraction {
        error: (message: string, opt?: DeclareOptions) => Promise<any>;
        success: (message: string, opt?: DeclareOptions) => Promise<any>;
        sendError: (message: string, opt?: DeclareOptions) => Promise<any>;
    }
    interface StringSelectMenuInteraction {
        error: (message: string, opt?: DeclareOptions) => Promise<any>;
        success: (message: string, opt?: DeclareOptions) => Promise<any>;
        sendError: (message: string, opt?: DeclareOptions) => Promise<any>;
    }
    interface CommandInteraction {
        error: (message: string, opt?: DeclareOptions) => Promise<any>;
        success: (message: string, opt?: DeclareOptions) => Promise<any>;
        sendError: (message: string, opt?: DeclareOptions) => Promise<any>;
    }
};