export default [
    {
        name: 'GUILD_RATING',
        related: [
            'guild',
            'safety'
        ],
        locked: false,
        public: false
    },
    {
        name: 'COMMUNITY_SHOP',
        related: [
            'user',
            'economy',
            'shop'
        ],
        locked: false,
        public: false
    },
    {
        name: 'USER_TASKS',
        related: [
            'user',
            'economy'
        ],
        locked: false,
        public: false
    }
];