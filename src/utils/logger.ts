import chalk from 'chalk';
import * as Sentry from '@sentry/node';
import config from '../configs';

declare global {
    interface Console {
        success(message: string, ...data: any[]): void;
        error(message: string, ...data: any[]): void;
        info(message: string, ...data: any[]): void;
        warn(message: string, ...data: any[]): void;
    }
};

const prefix = (type: any) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getSeconds()).slice(-2);

    return `${chalk.gray(`${year}-${month}-${day} ${hour}:${minute}:${second}`)} │ ${type}`;
};

const log = (type: string, message: string, ...data: any[]) => {
    const maxLength = Math.max(chalk.bold.green('SUCCESS').length, chalk.bold.red('ERROR').length, chalk.bold.yellow('WARN').length, chalk.bold.cyan('INFO').length);
    const paddedType = type.padStart(maxLength, ' ');

    console.log(
        `${prefix(paddedType)} ${chalk.bold.gray('・')} ${message}`,
        ...data
    );
};

const success = (message: string, ...data: any[]) => {
    log(chalk.bold.green('SUCCESS'), message, ...data);
};

/*const error = (message: string, title?: string, ...data: any[]) => {
    log(chalk.bold.red('ERROR'), message, title, ...data);
};*/

const warn = (message: string, ...data: any[]) => {
    log(chalk.bold.yellow('WARN'), message, ...data);
};

const info = (message: string, ...data: any[]) => {
    log(chalk.bold.cyan('INFO'), message, ...data);
};

console.success = success;
console.warn = warn;
console.info = info;
//console.error = error;