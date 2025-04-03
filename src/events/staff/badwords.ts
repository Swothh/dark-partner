import { Interaction } from 'discord.js';
import { Events } from '../../structures';
import { Guild, User } from '../../models';

export const Event: Events = {
    name: 'interactionCreate',
    on: 'on',
    run: async (client, interaction: Interaction) => {
        try {
            if (!interaction.isButton() || !interaction.customId.match(/badwords\.(warn|ban)/)) return;
            const guildId = interaction.customId.split('.')[1].split('-')[2];
            const userId = interaction.customId.split('.')[1].split('-')[3];

            await User.updateOne({ user: userId }, {
                $inc: {
                    'total_badwords': 1
                }
            }, { upsert: true });

            await Guild.updateOne({ guildId: guildId }, {
                $inc: {
                    'total_badwords': 1
                }
            }, { upsert: true });

            await interaction.message.edit({
                content: interaction.message.content + '\n\n' + interaction.user.toString() + ' tarafından uyarıldı.',
                components: []
            });
        } catch (err) {
            console.error(err);
        };
    }
};