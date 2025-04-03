import { Localizer } from '../managers';

export const categories = (locale: ReturnType<typeof Localizer>) => ([
    {
        label: locale('categories.general'),
        description: locale('categories.general_description'),
        value: 'global_server',
        emoji: '🌐'
    },
    {
        label: locale('categories.game'),
        description: locale('categories.game_description'),
        value: 'game_server',
        emoji: '🎮'
    },
    {
        label: locale('categories.public'),
        description: locale('categories.public_description'),
        value: 'public_server',
        emoji: '👥'
    },
    {
        label: locale('categories.nsfw'),
        description: locale('categories.nsfw_description'),
        value: 'nsfw_server',
        emoji: '🔞'
    },
    {
        label: locale('categories.anime'),
        description: locale('categories.anime_description'),
        value: 'anime_server',
        emoji: '🍜'
    },
    {
        label: locale('categories.botlist_code'),
        description: locale('categories.botlist_code_description'),
        value: 'botlist_server',
        emoji: '🤖'
    },
    {
        label: locale('categories.roleplay'),
        description: locale('categories.roleplay_description'),
        value: 'roleplay_server',
        emoji: '🎭'
    },
    {
        label: locale('categories.software'),
        description: locale('categories.software_description'),
        value: 'software_server',
        emoji: '👨‍💻'
    },
    {
        label: locale('categories.community'),
        description: locale('categories.community_description'),
        value: 'community_server',
        emoji: '👪'
    },
    {
        label: locale('categories.reward'),
        description: locale('categories.reward_description'),
        value: 'reward_server',
        emoji: '🎁'
    }
]);