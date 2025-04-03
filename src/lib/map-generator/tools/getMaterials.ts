import { tiles, chances } from './config';

type Rarities = 'common' | 'rare' | 'epic' | 'legendary';
type Obj = Record<keyof typeof tiles, { rarity: Rarities, tile: string }>;

const rarity = (r: number, e: number, l: number) => {
    const random = Math.random() * 100;
    let rarity = 'common';

    if (random <= r) rarity = 'rare';
    if (random <= e) rarity = 'epic';
    if (random <= l) rarity = 'legendary';
    return rarity as Rarities;
};

export const getMaterials = () => Object.keys(tiles).reduce((obj, key: keyof typeof tiles) => {
    const tier = rarity(chances[key].r, chances[key].e, chances[key].l);
    const arr = (<any>tiles[key])[tier] ?? [];

    obj[key] = {
        rarity: tier,
        tile: arr[Math.floor(Math.random() * arr.length)]
    };

    return obj;
}, {} as Obj);