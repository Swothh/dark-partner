import { connect, set } from 'mongoose';
import config from '../configs';

export function dbManager() {
    try {
        console.info('Connecting to database...');

        set('strictQuery', true);
        connect(config.database.uri).then(() => {
            console.success('Successfully connected to database.');
        });
    } catch(err) {
        console.error('Failed to connect database, client will be terminated.');
        process.exit();
    };

    return;
};