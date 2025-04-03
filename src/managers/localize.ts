import Dark from "../client";

const Localizer = (client: Dark, db: any) => {
    const localize = (key: string, replacements?: Record<string, string>): string => {
        const locale = client.locales.get(db?.locale ?? client.config.main.default_locale);
        let localized = key.split('.').reduce((val, key) => val?.[key], locale.__ as any) ?? key;

        if (replacements) {
            for (const placeholder in replacements) {
                const replacement = replacements[placeholder];
                localized = localized.replaceAll(`{${placeholder}}`, replacement);
            };
        };


        return localized;
    };

    localize.getSchema = () => {
        const locale = client.locales.get(db?.locale ?? client.config.main.default_locale);
        return locale.config;
    };

    return localize;
};

export default Localizer;