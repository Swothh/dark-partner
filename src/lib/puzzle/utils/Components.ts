import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

export const Components = ([playerId, gameId]: string[], disabled?: boolean, disabledDirections?: string[]): ActionRowBuilder<ButtonBuilder>[] => ([
    new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✖️')
                .setCustomId(`DISCORD-MINIGAME-EXIT-${playerId}-${gameId}`)
                .setDisabled(disabled || false),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji('1135596352252948541')
                .setCustomId(`DISCORD-MINIGAME-UP-${playerId}-${gameId}`)
                .setDisabled(disabled || (disabledDirections?.includes?.('UP') || false)),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji('978039529208418374')
                .setCustomId(`DISCORD-MINIGAME-BLANK-${playerId}-${gameId}`)
                .setDisabled(true)
        ),
    new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji('1135596359253242090')
                .setCustomId(`DISCORD-MINIGAME-LEFT-${playerId}-${gameId}`)
                .setDisabled(disabled || (disabledDirections?.includes?.('LEFT') || false)),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji('1135596347492409344')
                .setCustomId(`DISCORD-MINIGAME-DOWN-${playerId}-${gameId}`)
                .setDisabled(disabled || (disabledDirections?.includes?.('DOWN') || false)),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji('1135596366802985011')
                .setCustomId(`DISCORD-MINIGAME-RIGHT-${playerId}-${gameId}`)
                .setDisabled(disabled || (disabledDirections?.includes?.('RIGHT') || false))
        )
]);