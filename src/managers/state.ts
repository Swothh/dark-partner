import { io, Socket } from 'socket.io-client';
import config from '../configs';

export class StateManager {
    private socket: Socket;

    public constructor() {
        this.socket = io(`http://127.0.0.1:${config.main.socket.port}`, {
            auth: {
                token: config.main.socket.auth
            }
        });
    };

    public get = <T = any>(key: string): Promise<T> => new Promise(resolve => {
        if (!this.socket.connected || !key) return resolve(undefined);
        this.socket.emit('GET', key, (val: T) => resolve(val));
    });

    public set = (key: string, value: any, exp: number): Promise<boolean> => new Promise(resolve => {
        if (!this.socket.connected || !key || !value || !exp) return resolve(false);
        this.socket.emit('SET', key, value, exp, () => resolve(true));
    });

    public delete = (key: string): Promise<boolean> => new Promise(resolve => {
        if (!this.socket.connected || !key) return resolve(false);
        this.socket.emit('DELETE', key, () => resolve(true));
    });
};