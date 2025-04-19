const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { MessageEmbedVideo } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Pick character name and move, to get a response with all available move data.')
    .addStringOption(character =>
  		character.setName('character')
        .setAutocomplete(true)
  			.setDescription('The character name (e.g. Kyo, Iori).')
  			.setRequired(true))
    .addStringOption(move =>
  		move.setName('move')
        .setAutocomplete(true)
  			.setDescription('The move input.')
  			.setRequired(true)),
  async execute(interaction) {
    const character = this.getCharacter(interaction.options.getString('character'));
    const move = interaction.options.getString('move');
    // Load frame data json.
    fs.readFile("./assets/framedata98fe.json", "utf8", (err, jsonObject) => {
      if (err) {
        // If unable to read json, exit.
        return interaction.reply('Could not load framedata file. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY) for the data.');
      }
      try {
        console.log(character, move)
        let data = JSON.parse(jsonObject);
        // If character not found, exit.
        if (data.hasOwnProperty(character) === false) {
          return interaction.reply('Could not find character: ' + character + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY) for available characters.');
        }
        // If move not found, exit.
        if (data[character].hasOwnProperty(move) === false) {
          return interaction.reply('Could not find specified move: ' + move + ' for ' + character + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY) for available data.');
        }
        
        let moveData = data[character][move];
        const startup = (moveData['Startup'] !== null) ? moveData['Startup'].toString() : '-';
        const active = (moveData['Active'] !== null) ? moveData['Active'].toString() : '-';
        const recovery = (moveData['Recovery'] !== null) ? moveData['Recovery'].toString() : '-';
        //const oh = (moveData['On Hit (F)'] !== null) ? moveData['On Hit (F)'].toString() : '-';
        const ob = (moveData['Frame Advantage on Block'] !== null) ? moveData['Frame Advantage on Block'].toString() : '-';
        const notes = (moveData['Properties'] !== null) ? moveData['Properties'].toString() : 'No notes found.';
        //const dmg = (moveData['Damage'] !== null) ? moveData['Damage'].toString() : '-';
        // Get character link and img for header and thumbnail.
        const link = 'https://dreamcancel.com/wiki/The_King_of_Fighters_%2798_UMFE/' + encodeURIComponent(character);
        const img = this.getCharacterImg(character);
        
        const embeds = [];
        const embed = new MessageEmbed()
          .setColor('#0x1a2c78')
          .setTitle(character)
          .setURL(link)
          .setAuthor({ name: move, iconURL: 'https://pbs.twimg.com/profile_images/1150082025673625600/m1VyNZtc_400x400.png', url: 'https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY' })
          // .setDescription('Move input')
          .setThumbnail('https://tiermaker.com/images/chart/chart/king-of-fighters-98-ultimate-match-tier-list-maker-1280912/' + img + 'selectpng.png')
          .addFields(
            { name: 'Startup', value: startup, inline: true },
            { name: 'Active', value: active, inline: true },
            { name: 'Recovery', value: recovery, inline: true },
            { name: '\u200B', value: '\u200B' },
            // { name: 'Damage', value: dmg, inline: true },
            // { name: 'On hit', value: oh, inline: true },
            { name: 'On block', value: ob, inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Notes', value: notes },
            // { name: 'Inline field title', value: 'Some value here', inline: true },
          )
          .setFooter({ text: 'Got feedback? Join the 98FE server: discord.gg/rbRX3Dv5TG', iconURL: 'https://cdn.iconscout.com/icon/free/png-128/discord-3-569463.png' });
          (moveData['Image'] != null && moveData['Image'].toString() != {'valueType': 'IMAGE'}) ? embed.setImage(moveData['Image']) : embed.addField('No image was found for this move', 'Feel free to share with Franck Frost if you have one.', true);
        embeds.push(embed);
        if (moveData['Image1'] != null && moveData['Image1'].toString() != {'valueType': 'IMAGE'}) {
          const embed1 = new MessageEmbed().setImage(moveData['Image1']);
          embeds.push(embed1);
        }
        if (moveData['Image2'] != null && moveData['Image2'].toString() != {'valueType': 'IMAGE'}) {
          const embed2 = new MessageEmbed().setImage(moveData['Image2']);
          embeds.push(embed2);
        }
        if (moveData['Image3'] != null && moveData['Image3'].toString() != {'valueType': 'IMAGE'}) {
          const embed3 = new MessageEmbed().setImage(moveData['Image3']);
          embeds.push(embed3);
        }
        if (moveData['Image4'] != null && moveData['Image4'].toString() != {'valueType': 'IMAGE'}) {
          const embed4 = new MessageEmbed().setImage(moveData['Image4']);
          embeds.push(embed4);
        }
        if (moveData['Image5'] != null && moveData['Image5'].toString() != {'valueType': 'IMAGE'}) {
          const embed5 = new MessageEmbed().setImage(moveData['Image5']);
          embeds.push(embed5);
        }
        if (moveData['Image6'] != null && moveData['Image6'].toString() != {'valueType': 'IMAGE'}) {
          const embed6 = new MessageEmbed().setImage(moveData['Image6']);
          embeds.push(embed6);
        }
        if (moveData['Image7'] != null && moveData['Image7'].toString() != {'valueType': 'IMAGE'}) {
          const embed7 = new MessageEmbed().setImage(moveData['Image7']);
          embeds.push(embed7);
        }
        if (moveData['Image8'] != null && moveData['Image8'].toString() != {'valueType': 'IMAGE'}) {
          const embed8 = new MessageEmbed().setImage(moveData['Image8']);
          embeds.push(embed8);
        }
        if (moveData['Image9'] != null && moveData['Image9'].toString() != {'valueType': 'IMAGE'}) {
          const embed9 = new MessageEmbed().setImage(moveData['Image9']);
          embeds.push(embed9);
        } //10 embeds max per message
        return interaction.reply({embeds: embeds});
      } catch (error) {
        console.log("Error parsing JSON string:", error);
        return interaction.reply('There was an error while processing your request, reach out to <@259615904772521984>. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY) to look for the data.');
      }
    });
  },
  getCharacter: function(character) {
    const chart = {
      'Andy': 'Andy Bogard',
      'Athena': 'Athena Asamiya',
      'Benimaru': 'Benimaru Nikaido',
      'Billy': 'Billy Kane',
      'Mary': 'Blue Mary',
      'Ex Ryo': 'EX Ryo',
      'Ex Robert': 'EX Robert',
      'Ex Yuri': 'EX Yuri',
      'Ex Terry': 'EX Terry',
      'Ex Andy': 'EX Andy',
      'Ex Joe': 'EX Joe',
      'Ex Kyo': 'EX Kyo',
      'Ex Geese': 'EX Geese',
      'Ex King': 'EX King',
      'Ex Mai': 'EX Mai',
      'Ex Yamazaki': 'EX Yamazaki',
      'Ex Billy': 'EX Billy',
      'Ex Blue Mary': 'EX Blue Mary',
      'O.Chris': 'Orochi Chris',
      'O.Shermie': 'Orochi Shermie',
      'O.Yashiro': 'Orochi Yashiro',
      'Chang': 'Chang Koehan',
      'Chin': 'Chin Gentsai',
      'Choi': 'Choi Bounge',
      'Clark': 'Clark Still',
      'Eiji': 'Eiji Kisaragi',
      'Daimon': 'Goro Daimon',
      'Krauser': 'Wolfgang Krauser',
      'Iori': 'Iori Yagami',
      'Brian': 'Brian Battler',
      'Joe': 'Joe Higashi',
      'HeavyD': 'Heavy D!',
      'Heavy D': 'Heavy D!',
      'Mr.Big': 'Mr. Big',
      'Mr Big': 'Mr. Big',
      'MrBig': 'Mr. Big',
      'Rugal': 'Rugal Bernstein',
      'Kasumi': 'Kasumi Todoh',
      'Kim': 'Kim Kaphwan',
      'Saisyu': 'Saisyu Kusanagi',
      'Kyo': 'Kyo Kusanagi',
      'Leona': 'Leona Heidern',
      'Chizuru': 'Chizuru Kagura',
      'Mai': 'Mai Shiranui',
      'Geese': 'Geese Howard',
      'Lucky': 'Lucky Glauber',
      'Ralf': 'Ralf Jones',
      'Robert': 'Robert Garcia',
      'Ryo': 'Ryo Sakazaki',
      'Yamazaki': 'Ryuji Yamazaki',
      'Shingo': 'Shingo Yabuki',
      'Kensou': 'Sie Kensou',
      'Takuma': 'Takuma Sakazaki',
      'Terry': 'Terry Bogard',
      'Yashiro': 'Yashiro Nanakase',
      'Yuri': 'Yuri Sakazaki'
    };
    if (chart[character] === undefined) {
      return character;
    }
    return chart[character];
  },
  getCharacterImg: function(character) {
    const chartImg = {
      'Ryuji Yamazaki': 'yamazaki',
      'Goro Daimon': 'daimon',
      'Wolfgang Krauser': 'krauser',
      'Sie Kensou': 'kensou',
      'Orochi Chris': 'orochichris',
      'Orochi Shermie': 'orochishermie',
      'Orochi Yashiro': 'orochiyashiro',
    };
    if (chartImg[character] === undefined) {
      return character.replace(/Blue\s*/,'').replace(/EX\s*/,'ex').replace(' D!','D').toLowerCase().split(' ')[0];
    }
    return chartImg[character];
  }
};
