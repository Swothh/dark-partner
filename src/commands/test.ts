import { Commands } from '../structures';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, Channel, ChannelType, Message } from 'discord.js';
import axios from 'axios';
import canvas from 'canvas';
import { User, Global, oldGuilds, Guild } from '../models';
import { Manager } from '../managers/serverSharding';
import ChartJSImage from 'chart.js-image';

export const Command: Commands = {
    name: 'test',
    description: 'test',
    aliases: ['tst'],
    category: 'test',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        await message.nmReply({
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder().setCustomId('dev.set_task').setLabel('Set task').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('dev.trigger_log').setLabel('Trigger log').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('dev.clean_partner').setLabel('Clean Partner').setStyle(ButtonStyle.Secondary),
                )
            ]
        })

        /*const guild = await client.shardManager.eval('GET_GUILD', {
            guild: '1144557139512266772'
        });

        console.log(guild);
        console.log('  ')
        console.log('  ')
        console.log('  ')
        console.log('  ')


        const channel = await client.shardManager.eval('GET_CHANNEL', {
            guild: '1144557139512266772',
            channel: '1144586231976579072'
        });

        console.log(channel);*/

        /*// @ts-ignore
        const send = async (shard: number) => await client.shard.broadcastEval(async (c, { id, data, no }) => {
            const $c: Channel = await c.channels.fetch('1144586231976579072').catch(() => null);
            if ($c.type !== ChannelType.GuildText) return;
            const sended: void | Message = await $c.send(data).catch(err => console.error(err));
            return sended;
        }, {
            context: {
                id: channel,
                data: {
                    content: 'sa'
                },
                no: shard
            }
        });

        let sended = await send(0);
        await send(1);
        await send(2);
        await send(3);
        console.log(sended);*/

        // this code send 2 messages to the channel
        /*(await client.shard.broadcastEval(async (c, { channel }: any) => {
            const $c = await c.channels.fetch(channel);
            console.log($c, $c.isTextBased());
            if ($c.isTextBased()) $c.send('sa');
            return $c;
        }, {
            context: {
                channel: '1144586231976579072',
            }
        })).map((el, i) => [i, ()]);*/

        /*const guildsArrays = await client.shard.broadcastEval(async (c, { guild }) => {
            const $c = await c.guilds.fetch(guild);
            return $c;
        }, {
            context: {
                guild: '1144557139512266772',
            }
        });

        let shardId;
        guildsArrays.map((el, i) => {
            if ((el as any).shardId) shardId = (el as any).shardId;
        });

        await client.shardManager.shardEval(shardId, 'SEND_MESSAGE', {
            guild: '1144557139512266772',
            channel: '1144586231976579072',
            payload: {
                content: 'sa'
            }
        });*/

        /*const db = await Guild.findOne({ guildId: message.guild.id });
        const target = await Guild.findOne({ guildId: '1157781285989785790' });

        const guild = await client.shardManager.getGuild('1157781285989785790');
        const channel = await client.shardManager.shardEval(message.guild.shardId, 'GET_CHANNEL', {
            guild: message.guild.id,
            channel: db.partner.channel
        });
        const target_channel = await client.shardManager.shardEval(guild.shardId, 'GET_CHANNEL', {
            guild: '1157781285989785790',
            channel: target.partner.channel
        });

        const send = await client.shardManager.shardEval(message.guild.shardId, 'SEND_MESSAGE', {
            guild: message.guild.id,
            channel: db.partner.channel,
            payload: {
                content: 'sa'
            }
        });

        await client.shardManager.deleteMessage(message.guild.id, db.partner.channel, send.id, message.guild.shardId);

        const send_target = await client.shardManager.shardEval(guild.shardId, 'SEND_MESSAGE', {
            guild: '1157781285989785790',
            channel: target.partner.channel,
            payload: {
                content: 'sa target'
            }
        });

        await client.shardManager.deleteMessage('1157781285989785790', target.partner.channel, send_target.id, guild.shardId);

        await client.shardManager.sendMessage(message.guild.id, db.partner.channel, {
            content: 'sa'
        });

        await client.shardManager.sendMessage('1157781285989785790', target.partner.channel, {
            content: 'sa target'
        });*/

        /*await message.success('⭐ (VERY_BAD)')
        await message.success('⭐⭐ (BAD)')
        await message.success('⭐⭐⭐ (OK)')
        await message.success('⭐⭐⭐⭐ (GOOD)')
        await message.success('⭐⭐⭐⭐⭐ (EXCELLENT)')*/
    }
};