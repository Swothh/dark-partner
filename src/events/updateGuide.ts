import { Message } from 'discord.js';
import { Events } from '../structures';

export const Event: Events = {
    name: 'messageCreate',
    on: 'on',
    run: async (client, message: Message) => {
        try {
            if (!message.author.bot || message.guild?.id !== client.config.main.guide_update_webhook.guild || message.channel?.id !== client.config.main.guide_update_webhook.channel || message.author?.username !== 'GitHub') return;
            message.react('🔧').catch(() => {});
            client.fetchGuide();
        } catch (err) {
            console.error(err);
        };
    }
};