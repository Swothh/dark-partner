import { generateMap, detectLocations, config, getMaterials, tblr } from './tools';
import axios from 'axios';

const isValid = (m: string[][]) => {
    const l = detectLocations(m);
    return l.boxes.length >= config.settings.box_area && l.others.length >= (config.settings.box_area + l.boxes.length);
};

export const generate = () => {
    let map = generateMap();
    while (map.flat().filter(t => t === config.areas.void).length > config.settings.max_void_count || !isValid(map)) map = generateMap();

    const locs = detectLocations(map);
    const materials = getMaterials();

    locs.others.forEach(el => map[el[0]][el[1]] = config.areas.enemy_spawn);
    locs.boxes.forEach(el => map[el[0]][el[1]] = config.areas.box_spawn);

    const coordinates: [string, [number, number]][] = [];
    const entities: [string, [number, number]][] = [];

    map.flat().forEach((tile, i) => {
        const current = <const>[Math.floor(i / config.size.x), i % config.size.x];
        if (tile === config.areas.box_spawn) coordinates.push(['box', [...current]]);
        if (tile === config.areas.enemy_spawn) coordinates.push(['enemy', [...current]]);
        if (tile === config.areas.other_spawn) coordinates.push(['other', [...current]]);
    });

    for (let i = 0; i < Math.max(config.settings.box_count, config.settings.enemy_count, config.settings.inset_walls); i++) {
        if (i === 0) {
            const posible = coordinates.filter(c => c[0] === 'other' && !entities.find(e => e[1][0] === c[1][0] && e[1][1] === c[1][1]));
            const selected = posible[Math.floor(Math.random() * posible.length)];
            if (selected) entities.push(['character', selected[1]]);
        };

        if (i < config.settings.inset_walls) {
            const posible = coordinates.filter(c => c[0] === 'box' && !entities.find(e => e[1][0] === c[1][0] && e[1][1] === c[1][1]) && !entities.filter(e => e[0] === 'wall').find(e => Math.sqrt((c[1][0] - e[1][0]) ** 2 + (c[1][1] - e[1][1]) ** 2) < config.settings.wall_distance));
            const selected = posible[Math.floor(Math.random() * posible.length)];
            if (selected) entities.push(['wall', selected[1]]);
        };

        if (i < config.settings.box_count) {
            const posible = coordinates.filter(c => c[0] === 'box' && !entities.find(e => e[1][0] === c[1][0] && e[1][1] === c[1][1]));
            const selected = posible[Math.floor(Math.random() * posible.length)];
            if (selected) entities.push(['box', selected[1]]);
        };

        if (i < config.settings.box_count) {
            const posible = coordinates.filter(c => c[0] !== 'box' && tblr(map, c[1][0], c[1][1], true).filter(t => t === config.areas.wall).length < 3 && !entities.find(e => e[1][0] === c[1][0] && e[1][1] === c[1][1]) && !entities.filter(e => e[0] === 'target').find(e => Math.sqrt((c[1][0] - e[1][0]) ** 2 + (c[1][1] - e[1][1]) ** 2) < config.settings.targets_min_distance));
            const selected = posible[Math.floor(Math.random() * posible.length)];
            if (selected) entities.push(['target', selected[1]]);
        };

        if (i < config.settings.enemy_count) {
            const player = entities.find(e => e[0] === 'character');
            const posible = coordinates.filter(c => !entities.find(e => e[1][0] === c[1][0] && e[1][1] === c[1][1]) && Math.sqrt((c[1][0] - player[1][0]) ** 2 + (c[1][1] - player[1][1]) ** 2) > config.settings.player_distance && !entities.filter(e => e[0] === 'enemy').find(e => Math.sqrt((c[1][0] - e[1][0]) ** 2 + (c[1][1] - e[1][1]) ** 2) < config.settings.player_distance));
            const selected = posible[Math.floor(Math.random() * posible.length)];
            if (selected) entities.push(['enemy', selected[1]]);
        };
    };

    map.forEach((row, i) => {
        row.forEach((tile, k) => {
            if (tile === config.areas.void) map[i][k] = materials.blank.tile;
            else if (tile === config.areas.wall) map[i][k] = materials.wall.tile;
            else map[i][k] = materials.blank.tile;

            const ent = entities.find(e => e[1][0] === i && e[1][1] === k);
            if (ent && map[i][k]) map[i][k] = materials[ent[0] as keyof typeof materials].tile || materials.blank.tile;
        });
    });

    return {
        map: {
            width: config.size.x,
            blocks: Object.keys(materials).reduce((obj, key: keyof typeof materials) => {
                obj[key] = materials[key].tile;
                return obj;
            }, {} as Record<keyof typeof materials, string>),
            tiles: map.flat()
        }
    };
};