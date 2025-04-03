export default {
    partnership: {
        guild: 1,
        target: 2,
        user: 0.5
    },
    puzzle: {
        base: 2, // min kazanç
        luck_bonus: 4, // şansına göre 0 ile bu sayı arasında bonus
        kill_bonus: 0.5, // kill aldıgında alacağı bonus
        rarities: {
            common: 0, // sıfır kalacak
            rare: 0,
            epic: 0,
            legendary: 0
        }
    },
    case: { // coin
        angels_screams: 12,
        tears: 50,
        glory: 20,
        badge: 100
    },
    keys: { // coin
        angels_screams: 15,
        tears: 35,
        glory: 55,
    },
    vote: {
        multipler: 0.06,
        reward: 4
    },
    sell_tax: 15,
    partner_random: 5,
    partner_url: 150,
    tasks_refresh: 40,
    guild_prefix: 20
};