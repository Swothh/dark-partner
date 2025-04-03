import { ActivityType, Interaction } from 'discord.js';
import { Events } from '../structures';

export const Event: Events = {
    name: 'interactionCreate',
    on: 'on',
    run: async (client, i: Interaction) => {
        try {
            if (!i.isButton() || !i.customId.startsWith('DISCORD-MINIGAME')) return;
            const game = client.puzzleGames.get(i.message.id);
            
            [ ...client.puzzleGames.values() ].forEach(g => {
                if (!g.finished) return;
                client.puzzleGames.delete(g.gameMessage.id);
            });

            if (!game) return;
            game.handleButton(i);
        } catch (err) {
            console.error(err);
        };
    }
};