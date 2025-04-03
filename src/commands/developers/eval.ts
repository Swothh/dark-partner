import { Commands } from '../../structures';
import { EmbedBuilder } from 'discord.js';
import util from 'util';

export const Command: Commands = {
    name: 'eval',
    description: 'evalke',
    aliases: [],
    category: 'developers',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        const code = args.join(' ');
        if (!code) return message.error('error.code');

        try {
            let start = Date.now();
            let evaled = await eval(code);
            if (typeof evaled !== 'string') evaled = util.inspect(evaled);

            let end = Date.now() - start;
            if (evaled.includes(client.token)) evaled = evaled.replaceAll(client.token, '🗿 burda token yok sadece bir konyalı var 🗿');

            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.main)
                        .addFields({
                            name: '‧ Giriş',
                            value: `\`\`\`js\n${code}\`\`\``,
                        }, {
                            name: '‧ Çıkış',
                            value: `\`\`\`js\n${evaled}\`\`\``,
                        }, {
                            name: '‧ Çıktı süresi',
                            value: `\`\`\`js\n${end}ms\`\`\``,
                        })
                ]
            });
        } catch (err) {
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.error)
                        .addFields({
                            name: '‧ Giriş',
                            value: `\`\`\`js\n${code}\`\`\``,
                        }, {
                            name: '‧ Çıkış',
                            value: `\`\`\`js\n${err}\`\`\``,
                        }, {
                            name: '‧ Çıktı süresi',
                            value: `\`\`\`js\n${0}ms\`\`\``,
                        })
                ]
            });
        };
    }
};