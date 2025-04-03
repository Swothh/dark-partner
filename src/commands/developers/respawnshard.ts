import { Commands } from '../../structures';

export const Command: Commands = {
    name: 'respawn',
    description: 'res',
    aliases: ['reshard', 're-shard', 'rs'],
    category: 'developers',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        const [id] = args;
        if (!id || (id.toLowerCase() !== 'all' && isNaN(Number(id)))) return await message.error('Please provide a shard id or all shards.');
        if (!client.shard.ids.includes(Number(id)) && id.toLowerCase() !== 'all') return await message.error('Please provide a valid shard id.');

        await message.success(id === 'all' ? 'All shards are being respawned.' : `Shard **#${id}** is being respawned.`);
        client.shard.send(`respawn:${id}`);
    }
};