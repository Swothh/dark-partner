export interface Map {
    width: number;
    blocks: {
        wall: string;
        blank: string;
        box: string;
        enemy: string;
        target: string;
        character: string;
        dead: string;
    };
    tiles: string[];
};