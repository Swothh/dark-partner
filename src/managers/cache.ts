import Dark from '../client';

type Model = | 'guilds'
             | 'requests'
             | 'timeouts'
             | 'users';

const modelKeys = {
    guilds: 'database_guild',
    requests: 'database_requests',
    timeouts: 'database_timeouts',
    users: 'database_users'
};

const queryFilter = (data: any, query: Record<string, any> = {}) => Object.keys(query).every(key => {
    if (key.includes('.')) {
        let val = data;
        key.split('.').forEach(el => val = val?.[el]);
        return val === query[key];
    } else {
        return data[key] === query[key];
    };
});

export class CacheManager {
    public constructor(private client: Dark) {};
    private getAllData = (model: Model) => this.client.collectionGuilds.get(modelKeys[model]);

    public findOne(model: Model, query?: Record<string, any>) {
        const doc = this.getAllData(model).find(doc => queryFilter(doc, query));
        return doc ?? null;
    };

    public find(model: Model, query?: Record<string, any>) {
        const doc = this.getAllData(model).filter(doc => queryFilter(doc, query));
        return doc ?? [];
    };
};