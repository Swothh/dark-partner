export function duplicates(array: string[]): string[] {
    const counts: { [key: string]: number } = {};
    const duplicates: string[] = [];

    for (let i = 0; i < array.length; i++) {
        const value: string = array[i];
        counts[value] = counts[value] ? counts[value] + 1 : 1;

        if (counts[value] !== 1) {
            duplicates.push(value);
        };
    };

    return duplicates;
};