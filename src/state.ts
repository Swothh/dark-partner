import { Server } from 'socket.io';
import config from './configs';

export default function startStateServer() {
    const io = new Server(config.main.socket.port, { serveClient: false });
    const state: Record<string, { data: any, exp: number }> = {};

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token || token !== config.main.socket.auth || !socket.handshake.address?.includes('127.0.0.1')) return next(new Error('unauthorized'));
        next();
    });

    const deleteExpired = () => Object.keys(state).forEach(key => {
        const value = state[key] || { data: null, exp: Infinity };
        if (Date.now() < value.exp) return;
        delete state[key];
    });

    io.on('connection', socket => {
        socket.onAny(() => deleteExpired());

        socket.on('GET', (key: string, ack: (value: any) => void) => {
            if (typeof key !== 'string' || typeof ack !== 'function') return;
            const value = state[key] || { data: null, exp: Infinity };
            ack(Date.now() < value.exp ? value.data : null);
        });

        socket.on('SET', (key: string, value: any, exp: number, ack: () => void) => {
            if (exp === -1) exp = Infinity;
            if (typeof key !== 'string' || typeof exp !== 'number' || typeof ack !== 'function') return;
            state[key] = { data: value ?? null, exp };
            ack();
        });

        socket.on('DELETE', (key: string, ack: (deleted: boolean) => void) => {
            if (typeof key !== 'string' || typeof ack !== 'function') return;
            ack(delete state[key]);
        });
    });
};