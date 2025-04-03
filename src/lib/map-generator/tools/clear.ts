import { areas, size } from './config';
import { tblr } from './tblr';

export const clear = (map: string[][][]) => {
    map.flat().forEach((row, i, arr) => {
        row.forEach((tile, k) => {
            if (tile !== areas.other_spawn) return;
            map[0][i][k] = tblr(arr, i, k).filter(t => t === areas.other_spawn).length < 2 ? areas.void : tile;
        });
    });

    map.flat().forEach((row, i, arr) => {
        row.forEach((tile, k) => {
            if (tile !== areas.other_spawn) return;
            map[0][i][k] = (tblr(arr, i, k).find(t => t === areas.void) || [ 0, size.y - 1 ].includes(i) || [ 0, size.x - 1 ].includes(k)) ? areas.wall : tile;
        });
    });

    map.flat().forEach((row, i, arr) => {
        row.forEach((tile, k) => {
            if (tile !== areas.wall) return;
            map[0][i][k] = !tblr(arr, i, k).find(t => t === areas.other_spawn) ? areas.void : tile;
        });
    });

    return map;
};