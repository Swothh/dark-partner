import { areas, size } from './config';
import { clear } from './clear';

export const generateMap = () => {
    const map: string[][][] = [
        [], []
    ];

    for (let k = 0; k < 2; k++) {
        while (map[k].length < (size.y / 2)) {
            const rowIndex = map[k].length;
            map[k].push([]);
            for (let i = 0; i < size.x; i++) {
                if (rowIndex === 0) {
                    map[k][0][i] = [0, size.x - 1].includes(i) ? areas.void : [areas.other_spawn, areas.void][Math.floor(Math.random() * 2)];
                } else {
                    const top = map[k][rowIndex - 1];
                    const percent = top?.[i] === areas.other_spawn ? 1 : (top?.[i - 1] === areas.other_spawn || top?.[i + 1] === areas.other_spawn) ? 0.75 : 0;
                    map[k][rowIndex][i] = Math.random() < percent ? ([0, size.x - 1].includes(i) ? (Math.random() < 0.25 ? areas.void : areas.other_spawn) : areas.other_spawn) : areas.void;
                };
            };
        };
    };

    map[1].reverse().forEach(el => map[0].push(el));
    delete map[1];
    let clearmap: typeof map = null;

    for (let i = 0; i < 5; i++) {
        clearmap = clear(clearmap || map);
    };

    return clearmap[0];
};