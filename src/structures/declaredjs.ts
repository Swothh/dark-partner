import { MessageReplyOptions, EmbedField, Message } from "discord.js";

export interface DeclareOptions {
    fields?: EmbedField[] | EmbedField[][];
    components?: MessageReplyOptions['components'];
    noPrefix?: boolean;
    image?: string;
    edit?: Message;
};