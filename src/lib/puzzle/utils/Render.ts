import { EmbedBuilder } from 'discord.js';
import Minigame from '../index';

const defaultEmbed = (minigame: Minigame, type: 'finish' | 'death' | 'exit'): EmbedBuilder => {
    if (type === 'finish') {
        return new EmbedBuilder()
            .setTitle('You finished the game!')
            .setDescription(
                ':skull: **Kill(s):** ' + minigame.killCount +
                '\n\n' +
                minigame.view
            )
    } else if (type === 'death') {
        return new EmbedBuilder()
            .setTitle('You dead!')
            .setDescription(
                '*You lost because you went against the enemy.*' +
                '\n\n' +
                minigame.view
            )
    } else if (type === 'exit') {
        return new EmbedBuilder()
            .setTitle('You exited the game!')
            .setDescription(
                '*You left the game.*' +
                '\n\n' +
                minigame.view
            )
    };
};

export const Render = (minigame: Minigame, finished?: 'finish' | 'death' | 'exit') => {
    minigame.view = minigame.tiles.map((tile, index) => {
        return tile + ((index + 1) % Number(minigame.map.width) == 0 ? '\n' : '');
    }).join('');

    return !finished ? [
        new EmbedBuilder()
            .setColor('#2B2D31')
            .setDescription(
                minigame.view
            )
            .addFields({
                name: minigame.options.locale('minigame.puzzle.you'),
                value: minigame.blocks.character,
                inline: true
            }, {
                name: minigame.options.locale('minigame.puzzle.box'),
                value: minigame.blocks.box,
                inline: true
            }, {
                name: minigame.options.locale('minigame.puzzle.enemy'),
                value: minigame.blocks.enemy,
                inline: true
            })
    ] : [
        finished === 'finish' ?
            (minigame.options.messages?.finish(minigame) || defaultEmbed(minigame, 'finish')) :
            finished === 'death' ?
                (minigame.options.messages?.death(minigame) || defaultEmbed(minigame, 'death')) :
                (minigame.options.messages?.exit(minigame) || defaultEmbed(minigame, 'exit'))
    ];
};