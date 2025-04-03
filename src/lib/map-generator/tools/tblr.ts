export const tblr = (arr: string[][], i: number, k: number, corners?: boolean) => [
    arr[i - 1]?.[k],
    arr[i + 1]?.[k],
    arr[i]?.[k - 1],
    arr[i]?.[k + 1],
    ...(!corners ? [] : [
        arr[i - 1]?.[k - 1],
        arr[i - 1]?.[k + 1],
        arr[i + 1]?.[k - 1],
        arr[i + 1]?.[k + 1],
    ])
];