import { ColorResolvable } from "discord.js";
import prices from "./prices";
import badges from "./badges";

export default [
    {
        id: 'angels_screams',
        price: prices.case.angels_screams,
        items: [
            {
                id: 'partner_random',
                name: 'cases.items.partner_random',
                type: 'epic',
                db_type: 'subscribe',
                color: '#A868E0' as ColorResolvable,
                img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
                ratio: 0.01,
                total: 50
            },
            {
                id: 'partner_random',
                name: 'cases.items.partner_random',
                type: 'rare',
                db_type: 'subscribe',
                color: '#A868E0' as ColorResolvable,
                img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
                ratio: 0.1,
                total: 20
            },
            {
                id: 'partner_random',
                name: 'cases.items.partner_random',
                type: 'ordinary',
                db_type: 'subscribe',
                color: '#CEDCDE' as ColorResolvable,
                img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
                ratio: 0.90,
                total: 10
            }
        ],
        img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
        emoji: '👼'
    },
    {
        id: 'tears',
        price: prices.case.tears,
        items: [
            {
                id: 'partner_random',
                name: 'cases.items.partner_random',
                type: 'epic',
                db_type: 'subscribe',
                color: '#A868E0' as ColorResolvable,
                img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
                ratio: 0.01,
                total: 200
            },
            {
                id: 'partner_random',
                name: 'cases.items.partner_random',
                type: 'rare',
                db_type: 'subscribe',
                color: '#CEDCDE' as ColorResolvable,
                img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
                ratio: 0.1,
                total: 100
            },
            {
                id: 'partner_random',
                name: 'cases.items.partner_random',
                type: 'ordinary',
                db_type: 'subscribe',
                color: '#CEDCDE' as ColorResolvable,
                img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
                ratio: 0.9,
                total: 50
            }
        ],
        img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
        emoji: '💧'
    },
    {
        id: 'badge',
        price: prices.case.badge,
        items: badges.filter(b => b.case === 'badge_case' && !b.is_private).map(b => ({
            id: b.id,
            name: b.name,
            type: b.type,
            db_type: b.db_type,
            color: b.color,
            img: b.img,
            ratio: b.ratio,
            total: b.total
        })),
        img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
        emoji: '🌸'
    },
    {
        id: 'glory',
        price: prices.case.glory,
        items: [
            {
                id: 'partner_random',
                name: 'cases.items.partner_random',
                type: 'epic',
                db_type: 'subscribe',
                color: '#A868E0' as ColorResolvable,
                img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
                ratio: 0.01,
                total: 100
            },
            {
                id: 'partner_random',
                name: 'cases.items.partner_random',
                type: 'rare',
                db_type: 'subscribe',
                color: '#A868E0' as ColorResolvable,
                img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
                ratio: 0.1,
                total: 50
            },
            {
                id: 'partner_random',
                name: 'cases.items.partner_random',
                type: 'ordinary',
                db_type: 'subscribe',
                color: '#CEDCDE' as ColorResolvable,
                img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
                ratio: 0.9,
                total: 20
            }
        ],
        img: 'https://cdn-icons-png.flaticon.com/128/4883/4883370.png',
        emoji: '😎'
    },
];