import EventEmitter from 'events';

class BotEvents extends EventEmitter {
    public readonly regexp = /(save|updateOne|updateMany|deleteOne|deleteMany|remove|update)/;
    public readonly triggerRefetch = (model: string) => this.emit(`interval_refetch:${model}`);
    public readonly triggerCacheLoad = () => this.emit('cache_loaded');
};

const botEvents = new BotEvents();
export default botEvents;