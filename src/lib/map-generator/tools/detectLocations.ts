import { areas } from './config';
import { tblr } from './tblr';

export const detectLocations = (map: string[][]) => {
    const boxes: number[][] = [];
    const others: number[][] = [];

    map.forEach((row, i, arr) => {
        row.forEach((tile, k) => {
            if (tile !== areas.other_spawn) return;
            const t = tblr(arr, i, k);

            if ([ t, t[0] === areas.wall ? [] : tblr(arr, i - 1, k, true), t[1] === areas.wall ? [] : tblr(arr, i + 1, k, true), t[2] === areas.wall ? [] : tblr(arr, i, k - 1, true), t[3] === areas.wall ? [] : tblr(arr, i, k + 1, true) ].flat().filter(t => t === areas.wall).length < 2) boxes.push([ i, k ]);
            if (tblr(arr, i, k, true).filter(t => t === areas.wall).length < 2) others.push([ i, k ]);
        });
    });

    return {
        boxes, 
        others
    };
};