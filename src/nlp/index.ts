import * as data from './datasets';
const { NlpManager } = require('node-nlp');

export default class NLP {
    public manager: any;
    public trained: boolean = false;

    public constructor() {
        this.manager = new NlpManager({
            languages: ['tr'],
            nlu: { log: false }
        });

        Object.entries(data).forEach(([k, v]) => {
            v.forEach(word => {
                this.manager.addDocument('tr', word, k.split('_')[0]);
            });
        });

        this.manager.train().then(() => {
            this.manager.save();
            console.success(`${Object.values(data).reduce((t, a) => t + a.length, 0)} words registered to NLP.`);
            this.trained = true;
        });
    };

    public async detect(input: string) {
        const res = (type: string = null) => ({ detected: !!type, type: type || null });
        if (!this.trained) return res('other');
        const response = await this.manager.process('tr', input).catch(() => { });

        if (!response) return res('other');
        return res(response?.intent?.replace('None', ''));
    };
};

/*let a = new NLP();

setTimeout(() => {
    [ 'dasg', 'merhaba aga naber', 'ananı sigm loren' ].forEach(el => {
        a.detect(el).then(console.log);
    });
}, 3000);*/