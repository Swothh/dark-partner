import { model, Schema } from 'mongoose';
import { ColorResolvable } from 'discord.js';

export const oldGuilds = model('oldGuilds', new Schema({
    guildID: { type: String, required: true },
    proStatus: { type: Number, default: 0 }, // 0 = not premium, 1 = premium
    proDate: { type: Date, default: null },
    proMs: { type: Number, default: null },
    prefix: { type: String, default: '!' },
    locale: { type: String, required: true, default: 'tr' },
    partnerChannel: { type: String, default: null },
    partnerStaff: { type: String, default: null },
    partnerText: { type: String, default: null },
    partnerInviteURL: { type: String, default: null },
    partnerLog: { type: String, default: null },
    partnerStatus: { type: Number, default: 0 },
    partnerMust: { type: Number, default: null },
    partnerMustCategory: { type: String, default: null },
    partnerCategory: { type: String, default: null },
    totalPartner: { type: Number, default: 0 },
    partnerEmbed: { type: Object, default: {} },
    partnerEmbedStatus: { type: Boolean, default: false },
    maxLink: { type: Number, default: 2 },
    warned: { type: Number, default: 0 },

    /* Hediye alındı mı? */
    giftClaimed: { type: Boolean, default: false },

    /* Özel URL */
    premiumInviteURL: { type: String, default: null },
    premiumStatus: { type: Number, default: 0 },
    premiumDate: { type: Number, default: null },
    premiumMS: { type: Number, default: null },
    expiredUrls: { type: Array, default: [] },

    /* Partner Rastgele Aboneliği */
    planUsage: { type: Number, default: 0 },
    planDate: { type: Number, default: null },

    /* Partner Ara Aboneliği */
    searchPlanUsage: { type: Number, default: 0 },
    searchPlanDate: { type: Number, default: null },

    /* Partner Karaliste */
    blackLists: { type: Array, default: [] },
    blackListCategories: { type: Array, default: [] },

    /* Botlist Ayarları */
    botlistStatus: { type: Number, default: 0 },
    botlistChannel: { type: String, default: null },
    botlistLog: { type: String, default: null },
    botlistStaff: { type: String, default: null },
    botlistAutoRoleBot: { type: String, default: null },
    botlistAutoRoleUser: { type: String, default: null },
    botlistMessageId: { type: String, default: null },
    serverMust: { type: Number, default: 0 },
    totalApproved: { type: Number, default: 0 },
    totalRejected: { type: Number, default: 0 },
    totalWaiting: { type: Number, default: 0 },
    botlistEmbed: { type: Object, default: {} },
    botlistBlacklist: { type: Array, default: [] },

    /* Karşılama Sistemi */
    greetChannels: { type: Array, default: [] },
    greetMessage: { type: String, default: 'Sunucuya hoş geldin, {user}.' },
    greetStatus: { type: Boolean, default: false },
    greetDelete: { type: Number, default: 0 },
    greetDm: { type: Boolean, default: false },

    /* Bilet (ticket) sistemi */
    ticketChannel: { type: String, default: null },
    ticketLog: { type: String, default: null },
    ticketStaff: { type: String, default: null },
    ticketArchived: { type: Boolean, default: true },
    ticketCategories: { type: Array, default: [] },
    ticketCategoriesType: { type: String, default: 'select_menu' },
    ticketCategoriesStatus: { type: Boolean, default: false },
    totalTicket: { type: Number, default: 0 },
    autoTranscript: { type: Boolean, default: false },
    ticketCostumization: { type: Object, default: { message: 'Destek oluşturmak için aşağıdaki butona tıklayın.' } },
    ticketMessageId: { type: String, default: null },
    ticketEmbed: { type: Boolean, default: true },
    ticketBlacklist: { type: Array, default: [] },
    activeTickets: { type: Array, default: [] },

}));

export interface IGuild {
    guildID: string;
    proStatus: 0 | 1;
    proDate: Date;
    proMs: number;
    prefix: string;
    locale: string;
    partnerChannel: string;
    partnerStaff: string;
    partnerText: string;
    partnerInviteURL: string;
    partnerLog: string;
    partnerCategory: string;
    maxLink: number;
    partnerMust: number;
    partnerMustCategory: string;
    partnerStatus: number;
    totalPartner: number;
    partnerEmbed: {
        author: {
            name: string;
            iconURL: string;
        }
        image: string;
        thumbnail: string;
        color: ColorResolvable;
        button: boolean;
    };
    partnerEmbedStatus: boolean;
    warned: number;
    blackLists: string[];
    blackListCategories: string[];

    /* Hediye alındı mı? */
    giftClaimed: boolean;

    /* Özel URL */
    premiumInviteURL: string;
    premiumStatus: number;
    premiumDate: number;
    premiumMS: number;
    expiredUrls: {
        url: string;
        date: number;
    }[];

    /* Partner Rastgele Aboneliği */
    planUsage: number,
    planDate: number,

    /* Partner Ara Aboneliği */
    searchPlanUsage: number,
    searchPlanDate: number,

    /* Botlist Ayarları */
    botlistStatus: number;
    botlistChannel: string;
    botlistLog: string;
    botlistStaff: string;
    botlistAutoRoleBot: string;
    botlistAutoRoleUser: string;
    botlistMessageId: string;
    serverMust: number;
    totalApproved: number;
    totalRejected: number;
    totalWaiting: number;
    botlistEmbed: {
        author: string;
        description: string;
        color: ColorResolvable;
    };
    botlistBlacklist: string[];

    /* Karşılama Sistemi */
    greetChannels: string[];
    greetMessage: string;
    greetStatus: boolean;
    greetDelete: number;
    greetDm: boolean;

    /* Bilet (ticket) sistemi */
    ticketChannel: string;
    ticketLog: string;
    ticketStaff: string;
    ticketArchived: boolean;
    ticketCategories: any[];
    ticketCategoriesStatus: boolean;
    ticketCategoriesType: 'select_menu' | 'button';
    totalTicket: number;
    autoTranscript: boolean;
    ticketBlacklist: string[];
    ticketCostumization: {
        message: string;
        author: string;
        title: string;
        button: string;
        buttonColor: string;
        buttonEmoji: string;
        openedMessage: string;
        openedAuthor: string;
        openedTitle: string;
        openedButtonLabel: string;
        openedButtonEmoji: string;
    };
    ticketMessageId: string;
    ticketEmbed: boolean;
    activeTickets: any[];
};

/* Active Tickets
 [
        {
            channelID: string;
            ownerID: string;
            category: string;
            status: boolean;
            messageID: string;
            createdAt: Date;
        }
    ];
*/