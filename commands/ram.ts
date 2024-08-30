import { CacheType, EmbedBuilder, Interaction, SlashCommandBuilder } from 'discord.js';

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

        const loadingEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("Container resource usage.")
                .setDescription("<a:wait_cursor:1142730437286952980> Pulling from API...");
            
        await interaction.reply({ embeds: [ loadingEmbed ]});

        try {
            const serverId = 23;
            const resources = await client.getServerDetails("23"); //client.getServerResources(serverId);
            //console.log(`Server ${serverId} RAM Usage: ${resources.memory_bytes / 1024 / 1024} MB`);
            await loadingEmbed.setDescription(`✅ Pulled from API\n\n` +
                `CPU: **${resources.cpu_absolute}** / ${resources.limits.cpu}\n` +
                `RAM: **${resources.memory_bytes / 1024 / 1024} MB** / ${resources.limits.memory} MB\n` +
                `Disk: **${resources.disk_bytes / 1024 / 1024} MB** / ${resources.limits.disk} MB\n` +
                `Network receive: **${resources.network_rx_bytes / 1024 / 1024} MB**\n` +
                `Network send: **${resources.network_tx_bytes / 1024 / 1024} MB**\n\n` +
                `Name: ${resources.name}\n` +
                `ID: ${resources.id}\n` +
                `State: ${resources.state}`);
            await loadingEmbed.setColor(0x00FF00);
            
            await interaction.editReply({ embeds: [ loadingEmbed ]});
        } catch (error) {
            console.error('Failed to fetch server resources:', error);
            await loadingEmbed.setDescription(`❌ Failed to get resource information usage.\n\nDebug information:\n${error}`);
            await loadingEmbed.setColor(0xFF0000);
            
            await interaction.editReply({ embeds: [ loadingEmbed ]});
        }

        loadingEmbed.setFooter({ text: `Finished at ${new Date()}` });

        await interaction.editReply({ embeds: [ loadingEmbed ]});
    },
};