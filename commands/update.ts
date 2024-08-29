import { CacheType, EmbedBuilder, Interaction, SlashCommandBuilder } from 'discord.js';

const { exec } = require('child_process');

const isTesting = false;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update the website files (Authorised developers only)'),
    async execute(interaction: any) {
        if(!interaction.member.roles.cache.has("1278385955228876812")){
            const embed = new EmbedBuilder().setColor(0xFF0000)
                .setTitle("Error")
                .setDescription("You lack sufficient permissions to run this command.");
            //await interaction.reply('You dont have the perms for this command!');
            await interaction.reply({ embeds: [ embed ]});
            return;
        }

        if(isTesting) {
            const loadingEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("Updating the website (TEST)")
                .setDescription("<a:wait_cursor:1142730437286952980> Updating website files");
            
            await interaction.reply({ embeds: [ loadingEmbed ]});

            setTimeout(async () => {
                loadingEmbed.setDescription("✅ Successfully updated website files");
                loadingEmbed.setColor(0x00FF00);
            
                await interaction.editReply({ embeds: [ loadingEmbed ]});
            }, 5000);

            setTimeout(async () => {
                loadingEmbed.setDescription("<a:wait_cursor:1142730437286952980> Updating website files");
                loadingEmbed.setColor(0x0099FF);
            
                await interaction.editReply({ embeds: [ loadingEmbed ]});
            }, 10000);

            setTimeout(async () => {
                loadingEmbed.setDescription("❌ Failed to update website files\n\nDebug information: Lol");
                loadingEmbed.setColor(0xFF0000);
            
                await interaction.editReply({ embeds: [ loadingEmbed ]});
            }, 15000);
            return;
        }

        const loadingEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("Updating the website")
                .setDescription("<a:wait_cursor:1142730437286952980> Updating website files");
            
        await interaction.reply(loadingEmbed);
        
        await exec("git -C /website/website pull", (error: Error | null, stdout: string, stderr: string) => {
            if (error) {
                //interaction.editReply(`${error.message}`);

                loadingEmbed.setDescription(`❌ Failed to update website files\n\nDebug information:\n${error.message}`);
                loadingEmbed.setColor(0xFF0000);
            
                interaction.editReply({ embeds: [ loadingEmbed ]});
                return;
            }

            if (stderr) {
                //interaction.editReply(`${stderr}`);

                loadingEmbed.setDescription(`❌ Failed to update website files\n\nDebug information:\n${stderr}`);
                loadingEmbed.setColor(0xFF0000);
            
                interaction.editReply({ embeds: [ loadingEmbed ]});
                return;
            }
        
            //interaction.editReply(`${stdout}`);

            loadingEmbed.setDescription(`✅ Successfully updated website files\n\nDebug information:\n${stdout}`);
            loadingEmbed.setColor(0x00FF00);
            
            interaction.editReply({ embeds: [ loadingEmbed ]});
        });

        /*await exec("git -C /website/ clone https://github.com/TeamChoacury/website.git", (error: Error | null, stdout: string, stderr: string) => {
            if (error) {
                interaction.editReply(`${error.message}`);
                return;
            }

            if (stderr) {
                interaction.editReply(`${stderr}`);
                return;
            }
        
            interaction.editReply(`${stdout}`);
        });*/

        //await interaction.editReply(`Done`);

        loadingEmbed.setFooter({ text: `Finished at ${new Date()}` });

        await interaction.editReply({ embeds: [ loadingEmbed ]});
    },
};