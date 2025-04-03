import { Message, MessageChannelComponentCollectorOptions, ComponentType, StringSelectMenuInteraction, ButtonInteraction } from 'discord.js';

interface CollectorOptions extends MessageChannelComponentCollectorOptions<any> {
    channel: Message['channel'] | ButtonInteraction['message']['channel'];
    msg: Message;
};

export const Collector = (options: CollectorOptions) => {
    const { channel, msg } = options;
    const collector = channel.createMessageComponentCollector(options as any);

    collector.on('end', async (c) => {
        await msg?.edit({
            //content: '🕙',
            components: msg.components.map(row => {
                (row as any).components.map((component: any) => {
                    (row as any).components = (row as any).components.map((component: any) => {
                        if (component?.data) component.data.disabled = true;
                        return component;
                    });
                    return component;
                });

                return row;
            }),
            allowedMentions: { repliedUser: false }
        }).catch(() => { });
    });

    return collector;
};