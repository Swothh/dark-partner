import { ModalBuilder as CreateModal, Collection, Interaction, ButtonInteraction, ContextMenuCommandInteraction, StringSelectMenuInteraction, CommandInteraction, ModalSubmitInteraction } from 'discord.js';
import Dark from '../client';
import { ModalUtils } from '../utils';

const builder: Collection<string, (interaction: Interaction) => void> = new Collection();
const modal_ids: Set<string> = new Set();

export class ModalManager {
    constructor(private client: Dark, private interaction: ButtonInteraction | ContextMenuCommandInteraction | StringSelectMenuInteraction | CommandInteraction) {
        this.client = client;
        this.interaction = interaction;

        this.client.on('interactionCreate', this.handleInteraction);
    };

    private handleInteraction = async (interaction: Interaction) => {
        if (!interaction.isModalSubmit()) return;

        const modal_id = interaction.customId;
        if (modal_ids.has(modal_id) && !interaction.deferred) {
            modal_ids.delete(modal_id);
            const callback = builder.get(modal_id);
            builder.delete(modal_id);

            try {
                if (callback) {
                    await callback(interaction);
                }
            } catch (error) {
                console.error(error);
                await this.handleModalError(modal_id);
            };
        };
    };

    private async handleModalError(modal_id: string) {
        if (!this.interaction.deferred && !this.interaction.replied) {
            await this.interaction.reply({
                content: 'An error occurred while creating the modal.',
                ephemeral: true,
            });
        };

        builder.delete(modal_id);
        modal_ids.delete(modal_id);
    };

    public async build(modal_id: string, { modal }: { modal: CreateModal }): Promise<ModalSubmitInteraction> {
        return new Promise(async (resolve) => {
            builder.set(modal_id, async (interaction: Interaction) => {
                const modal = await ModalUtils(this.client, interaction as ModalSubmitInteraction);
                resolve(modal);
            });
            modal_ids.add(modal_id);
            modal.setCustomId(modal_id);

            try {
                await this.interaction.showModal(modal);
            } catch (error) {
                console.error(error);
                await this.handleModalError(modal_id);
            }
        });
    };
};