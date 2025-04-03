import { Interaction } from 'discord.js';
import { InferSchemaType } from 'mongoose';
import { Events } from '../../structures';
import { Tasks } from '../../managers';
import { Guild } from '../../models';

export const Event: Events = {
    name: 'interactionCreate',
    on: 'on',
    run: async (client, interaction: Interaction) => {
        try {
            if (!interaction.isButton() || !interaction.customId.match(/dev\.(set_task|trigger_log|clean_partner)/)) return;
            if (!client.config.main.owners.includes(interaction.user.id)) return;
            const type = interaction.customId.split('.')[1];

            if (type === 'set_task') {
                const task = new Tasks();
                await task.set(interaction.user.id).then(r => {
                    if (r !== false) interaction.reply({ content: `Task ${r?.type} has been set!`, ephemeral: true });
                });
            };

            if (type === 'trigger_log') {
                const locales = client.locales.get('tr');
                const db = await Guild.findOne({ guildId: interaction.guild.id });

                await client.utils.Partner.SEND_LOG(client, locales.__, interaction, {
                    this: {
                        guild: interaction.guild,
                        guild_db: db
                    },
                    target: {
                        guild: interaction.guild,
                        guild_db: db
                    },
                    request: {
                        guild: interaction.guild.id,
                        target: interaction.guild.id,
                        author: interaction.user.id,
                        date: Date.now(),
                        message: interaction.message.id
                    }
                }, true);

                await interaction.reply({ content: 'TRIGGER SUCCESS <#' + db.partner.log + '>' });
            };

            if (type === 'clean_partner') {
                console.log('selam')

                const db = await Guild.find({ 'partner.status': 1 }).lean();
                db.forEach(async (guild) => {
                    const filtered = [];
                    const g = await client.shardManager.getGuild(guild.guildId);
                    if (!g) {
                        console.log('Guild not found: ' + guild.guildId);
                        filtered.push(guild.guildId);
                    };

                    const channel = await client.shardManager.shardEval(g?.shardId, 'GET_CHANNEL', {
                        guild: guild.guildId,
                        channel: guild.partner.channel
                    });

                    if (!channel) {
                        console.log('Channel not found: ' + guild.partner.channel + ' in ' + guild.guildId);
                    };
                });
            };
        } catch (err) {
            console.error(err);
        };
    }
};