import { Localizer } from '../../../managers';

export const pageLetters = (l?: number | string, locale?: ReturnType<typeof Localizer>) => {
    const en_letters = {
        A: '🇦',
        B: '🇧',
        C: '🇨',
        D: '🇩',
        E: '🇪',
        F: '🇫',
        G: '🇬',
        H: '🇭',
        I: '🇮',
        J: '🇯',
        K: '🇰',
        L: '🇱',
        M: '🇲',
        N: '🇳',
        O: '🇴',
        P: '🇵',
        Q: '🇶',
        R: '🇷',
        S: '🇸',
        T: '🇹',
        U: '🇺',
        V: '🇻',
        W: '🇼',
        X: '🇽',
        Y: '🇾',
    };

    const tr_letters = {
        A: '🇦',
        B: '🇧',
        C: '🇨',
        Ç: '🇨',
        D: '🇩',
        E: '🇪',
        F: '🇫',
        G: '🇬',
        Ğ: '🇬',
        H: '🇭',
        I: '🇮',
        İ: 'ℹ️',
        J: '🇯',
        K: '🇰',
        L: '🇱',
        M: '🇲',
        N: '🇳',
        O: '🇴',
        Ö: '🇴',
        P: '🇵',
        R: '🇷',
        S: '🇸',
        Ş: '🇸',
        T: '🇹',
        U: '🇺',
        Ü: '🇺',
        V: '🇻',
        Y: '🇾',
        Z: '🇿',
    };

    const letters = locale.getSchema().iso === 'tr' ? tr_letters : en_letters;
    if (l === 0) return Object.keys(letters).slice(0, 16);
    if (l === 1) return Object.keys(letters).slice(16, 32);

    return letters[l as keyof typeof letters];
};