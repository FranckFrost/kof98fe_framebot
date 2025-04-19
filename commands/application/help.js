const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Describes how to use the commands to retrieve frame data'),
  async execute(interaction) {
    const embed = new MessageEmbed()
          .setColor('#0x1a2c78')
          .setTitle('Need Help?')
          .setAuthor({ name: 'KOF98FE FrameBot', iconURL: 'https://cdn.discordapp.com/icons/718675944944173203/17628a2f54e7b4bfe76834cfb8633369.webp?size=240', url: 'https://discord.gg/rbRX3Dv5TG' })
          .addFields(
            { name: 'Getting started', value: 'The bot displays available data of a certain move of a certain character individually per request. It uses autocomplete, so please keep typing to filter the results to your needs.\n Source of the data is the latest [framedata sheet](https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY) for the **/frames** slash command and the [Dream Cancel wiki](https://dreamcancel.com/wiki/The_King_of_Fighters_%2798_UMFE) for **/cargo**.\n Their common arguments are as follows:', inline: false },
            { name: '\u200B', value: '\u200B' },
            { name: 'Character', value: 'The **character** which is a case insensitive string (e.g. athena, Chris, iori)', inline: false },
            { name: 'Move', value: 'The **move** input which is a case insensitive string (e.g. crouch A, dp+A, 236C)', inline: false },
            { name: '\u200B', value: '\u200B' },
            { name: 'Demo', value: 'The following is a visual representation of how the bot works:', inline: false },
          )
          .setImage('https://media.giphy.com/media/9jkdG3K7RAV0Ri9npP/giphy.gif')
          .setFooter({ text: 'Got feedback? Join the 98FE server: discord.gg/rbRX3Dv5TG', iconURL: 'https://cdn.iconscout.com/icon/free/png-128/discord-3-569463.png' });
        return interaction.reply({embeds: [embed]});
  },
};
