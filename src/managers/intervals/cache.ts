import { Guild, Timeouts, Requests, User } from '../../models';
import botEvents from '../../botEvents';
import Dark from '../../client';

export const Interval = (client: Dark) => {
    let loaded = 0;

    const handleLoad = () => {
        loaded++;
        if (loaded === 4) botEvents.triggerCacheLoad();
    };

    const guilds = async () => {
        const guilds = await Guild.find().lean();
        client.collectionGuilds.set('database_guild', guilds);
        if (loaded < 4) handleLoad();
    };

    const requests = async () => {
        const requests = await Requests.find().lean();
        client.collectionGuilds.set('database_requests', requests);
        if (loaded < 4) handleLoad();
    };

    const timeouts = async () => {
        const timeouts = await Timeouts.find().lean();
        client.collectionGuilds.set('database_timeouts', timeouts);
        if (loaded < 4) handleLoad();
    };

    const users = async () => {
        const users = await User.find().lean();
        client.collectionGuilds.set('database_users', users);
        if (loaded < 4) handleLoad();
    };

    guilds();
    requests();
    timeouts();
    users();

    botEvents.on('interval_refetch:Guild', guilds);
    botEvents.on('interval_refetch:Requests', requests);
    botEvents.on('interval_refetch:Timeouts', timeouts);
    botEvents.on('interval_refetch:User', users);
};