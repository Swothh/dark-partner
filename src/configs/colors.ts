import { ColorResolvable } from "discord.js";

export default {
    blank: '#2B2D31' as ColorResolvable,
    main: 'White' as ColorResolvable,
    success: 'White' as ColorResolvable,
    error: 'White' as ColorResolvable,
    types: {
        ordinary: '#CEDCDE',
        rare: '#A868E0',
        epic: '#F5A623',
    } as Record<string, ColorResolvable>
};