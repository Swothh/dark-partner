export default [
    ///////////////////////
    // TODO: Add more tasks
    ///////////////////////

    {
        type: 'partner',
        id: 'partner_up',
        count: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        amount: [1, 3, 6, 8, 10, 14, 17, 20, 25, 28],
        difficulty: [1, 1, 1, 1, 2, 2, 2, 3, 3, 3],
        disabled: false
    },
    {
        type: 'vote',
        id: 'vote_bot',
        count: [1],
        amount: [5],
        difficulty: [1],
        disabled: false
    },
    {
        type: 'case',
        id: 'open_case',
        count: [1, 2, 3, 4],
        amount: [12, 24, 48, 96],
        difficulty: [1, 2, 3, 3],
        disabled: false
    },
    {
        type: 'daily',
        id: 'get_daily',
        count: [1],
        amount: [4],
        difficulty: [1],
        disabled: false
    },
    {
        type: 'generosity',
        id: 'generosity_transfer_money',
        count: [1, 2, 3, 4],
        amount: [5, 10, 15, 20],
        difficulty: [3, 3, 3, 3],
        disabled: false
    },
    {
        type: 'buy_item',
        id: 'open_market',
        count: [1, 2, 3],
        amount: [10, 20, 30],
        difficulty: [1, 2, 3],
    },
    {
        type: 'play_puzzle',
        id: 'play_puzzle',
        count: [1, 2, 3],
        amount: [5, 7, 9],
        difficulty: [1, 2, 2],
    },
    {
        type: 'be_the_bad_guy',
        id: 'gamble',
        count: [1, 2, 3],
        amount: [5, 7, 9],
        difficulty: [1, 2, 2],
    }
];