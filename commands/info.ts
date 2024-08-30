import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about the project'),
    async execute(interaction: any) {
        const embed = new EmbedBuilder().setTitle("Project information").addFields([
            { name: "Discord server", value: "You are in the official Choacury Dev Land Discord server.", inline: true },
            { name: "Figma file", value: "**Please request access to the Figma files via the developers.**", inline: true },
            { name: "Website", value: "The official website is located at: https://choacury.keiran.club/", inline: true },
            { name: "Application centre", value: "If you would like to apply to be an official developer on the team, please apply here:" +
                "https://choacury.keiran.club/apply/dev/\n**Anyone is welcome to contribute on the GitHub repositories.**", inline: true },
            { name: "GitHub repositories", value: "ChoacuryOS: https://github.com/Pineconium/ChoacuryOS/\n" +
                "ChoacuryOS Website: https://github.com/TeamChoacury/website", inline: true }
        ]).setFooter({ text: `Finished at ${new Date()}` });

        await interaction.reply({ embeds: [ embed ]});
    },
};
