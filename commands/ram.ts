import { CacheType, EmbedBuilder, Interaction, SlashCommandBuilder } from 'discord.js';
import * as process from "process";

const { exec } = require('child_process');
const config = require("../config.json");
const apiKey = config.panel.API_key;

import PterodactylClient from '../pterodactyl/pterodactyl-client';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkusage')
        .setDescription('Checks the discord bots container usage.'),
    async execute(interaction: any) {
        if(!interaction.member.roles.cache.has("1278385955228876812")){
            const embed = new EmbedBuilder().setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("You lack sufficient permissions to run this command.");
            //await interaction.reply('You dont have the perms for this command!');
            await interaction.reply({ embeds: [ embed ]});
            return;
        }
        
        const apiUrl = 'https://panel.keiran.club/api';
        const client = new PterodactylClient(apiKey, apiUrl);

        let statusInfo = "<a:wait_cursor:1142730437286952980> Pulling from API...\n:black_large_square: Fetch process info";
        let content = "";

        const loadingEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("Container resource usage.")
                .setDescription(statusInfo + "\n\n" + content);
            
        await interaction.reply({ embeds: [ loadingEmbed ]});

        try {
            const serverId = 23;
            const resources = await client.getServerDetails("23"); //client.getServerResources(serverId);
            const resourceUsage = await client.getServerResourceUsage("449dacf2");
            //console.log(`Server ${serverId} RAM Usage: ${resources.memory_bytes / 1024 / 1024} MB`);
            statusInfo = "✅ Pulled from API\n<a:wait_cursor:1142730437286952980> Fetching process info...";
            content = `API fetched resource information:\nCPU: **${resources.cpu_absolute}** / ${resources.limits.cpu}\n` +
                `RAM: **${resourceUsage.memory_bytes / 1024 / 1024} MB** / ${resources.limits.memory} MB\n` +
                `Disk: **${resourceUsage.disk_bytes / 1024 / 1024} MB** / ${resources.limits.disk} MB\n` +
                `Network receive: **${resourceUsage.network_rx_bytes / 1024 / 1024} MB**\n` +
                `Network send: **${resourceUsage.network_tx_bytes / 1024 / 1024} MB**\n\n` +
                `Name: ${resources.name}\n` +
                `ID: ${resources.id}\n` +
                `State: ${resources.state}`;
            await loadingEmbed.setDescription(statusInfo + `\n\n` + content);
            await loadingEmbed.setColor(0x00FF00);
            
            await interaction.editReply({ embeds: [ loadingEmbed ]});
        } catch (error) {
            console.error('Failed to fetch server resources:', error);
            statusInfo = "❌ Failed to get resource information usage.\n:black_large_square: Fetch process info";
            await loadingEmbed.setDescription(statusInfo + `\n\nDebug information:\n${error}`);
            //await loadingEmbed.setColor(0xFF0000);
            
            await interaction.editReply({ embeds: [ loadingEmbed ]});
            return;
        }

        const uptime: string = formatSeconds(process.uptime());
        const memory =  process.memoryUsage();

        statusInfo = "✅ Pulled from API\n✅ Fetched process info";
        content += `\n\nProcess fetch resource information: Uptime: ${uptime}\n` +
            `Memory usage: **${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB** / ${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`;

        loadingEmbed.setFooter({ text: `Finished at ${new Date()}` });

        await loadingEmbed.setDescription(statusInfo + `\n\n` + content);
        await loadingEmbed.setColor(0x00FF00);

        await interaction.editReply({ embeds: [ loadingEmbed ]});
    },
};

function formatSeconds(seconds: number): string {
    const years = Math.floor(seconds / (365 * 24 * 3600));
    seconds %= (365 * 24 * 3600);

    const months = Math.floor(seconds / (30 * 24 * 3600));
    seconds %= (30 * 24 * 3600);

    const days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${(remainingSeconds).toFixed(0)}s`;
}