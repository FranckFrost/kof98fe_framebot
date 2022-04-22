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
    const char = interaction.options.getString('character');
    const move = interaction.options.getString('move');
    // Load frame data json.
    fs.readFile("./assets/framedata98.json", "utf8", (err, jsonObject) => {
      if (err) {
        // console.log("Error reading file from disk:", err);
        return interaction.reply('Could not load frame data file. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY) for the data.');
      }
      try {
        let data = JSON.parse(jsonObject);
        // Capitilize first letter of character name.
        let character = char.charAt(0).toUpperCase() + char.slice(1);
        // Temp: validate extra names.
        if (character === 'Mary') {
          character = 'Blue Mary'
            }
        if (character === 'O.Chris') {
          character = 'Orochi Chris'
            }
        if (character === 'O.Shermie') {
          character = 'Orochi Shermie'
            }
        if (character === 'O.Yashiro') {
          character = 'Orochi Yashiro'
            }
        if (character === 'Ex kyo' ||
            character === 'Ex Kyo') {
          character = 'EX Kyo'
            }
        if (character === 'Ex geese' ||
            character === 'Ex Geese') {
          character = 'EX Geese'
            }
        if (character === 'Ex terry' ||
            character === 'Ex Terry') {
          character = 'EX Terry'
            }
        if (character === 'Ex andy' ||
            character === 'Ex Andy') {
          character = 'EX Andy'
            }
        if (character === 'Ex joe' ||
            character === 'Ex Joe') {
          character = 'EX Joe'
            }
        if (character === 'Ex ryo' ||
            character === 'Ex Ryo') {
          character = 'EX Ryo'
            }
        if (character === 'Ex robert' ||
            character === 'Ex Robert') {
          character = 'EX Robert'
            }
        if (character === 'Ex yuri' ||
            character === 'Ex Yuri') {
          character = 'EX Yuri'
            }
        if (character === 'Ex king' ||
            character === 'Ex King') {
          character = 'EX King'
            }
        if (character === 'Ex mai' ||
            character === 'Ex Mai') {
          character = 'EX Mai'
            }
        if (character === 'Ex yamazaki' ||
            character === 'Ex Yamazaki') {
          character = 'EX Yamazaki'
            }
        if (character === 'Ex blue mary' ||
            character === 'Ex Blue mary' ||
            character === 'Ex mary') {
          character = 'EX Blue Mary'
            }
        if (character === 'Ex billy' ||
            character === 'Ex Billy') {
          character = 'EX Billy'
            }
        // If character not found, exit.
        if (data.hasOwnProperty(character) === false) {
          return interaction.reply('Could not find character: ' + character + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY) for available characters.');
        }
        // Trim extra whitespaces from move.
        /* let parsedMove = move.trim();
        let singleButton = false
        // Check if single button passed.
        if (parsedMove.match(/^[+\-aAbBcCdD() .]+$/g)) {
          singleButton = true
          // console.log(parsedMove)
          // Preppend "far" to return valid value.
          parsedMove = (parsedMove === 'cd' || parsedMove === 'CD') ? parsedMove : 'far ' + parsedMove;
        }
        // console.log(parsedMove)
        // Convert dots into whitespaces.
        parsedMove = parsedMove.replace('.', ' ')
        // Trim whitespaces and add caps, turning "236 a" into "236A".
        if (parsedMove.match(/^[\d+ $+\-aAbBcCdD().]+$/g) ) {
          parsedMove = parsedMove.toUpperCase()
          parsedMove = parsedMove.replace(' ', '')
          console.log("Is this still useful? " + parsedMove)
        } */
        console.log(character)
        let escapedMoves = move
        /* console.log(parsedMove)
        let escapedMoves = ''
        const moveArray = parsedMove.split(" ")
        moveArray.forEach((element) => {
          // Turn ABCD to uppercase if they are not.
          if (element.match(/^[+\-aAbBcCdD() .]+$/g) ) {
            element = element.toUpperCase()
          }
          escapedMoves += element + ' ';
        }) ;
        escapedMoves = escapedMoves.trimEnd();*/
        // If move not found, exit.
        if (data[character].hasOwnProperty(escapedMoves) === false) {
          return interaction.reply('Could not find specified move: ' + move + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY) for available data.');
        }
        let moveData = data[character][escapedMoves];
        const startup = (moveData['Startup'] !== null) ? moveData['Startup'].toString() : '-';
        const active = (moveData['Active'] !== null) ? moveData['Active'].toString() : '-';
        const recovery = (moveData['Recovery'] !== null) ? moveData['Recovery'].toString() : '-';
        //const oh = (moveData['On Hit (F)'] !== null) ? moveData['On Hit (F)'].toString() : '-';
        const ob = (moveData['Frame Advantage on Block'] !== null) ? moveData['Frame Advantage on Block'].toString() : '-';
        const notes = (moveData['Properties'] !== null) ? moveData['Properties'].toString() : 'No notes found.';
        //const dmg = (moveData['Damage'] !== null) ? moveData['Damage'].toString() : '-';
        // Get lowercase trimmed character name for official site url.
        let lowerCaseChar = character.toLowerCase();
        lowerCaseChar = lowerCaseChar.split(/\s+/).join('');
        // Get character link and img for header and thumbnail.
        const link = this.getCharacterLink(character);
        const img = character.toLowerCase().replace(' ', '').replace('.','');
        // console.log(charNo);
        const embed = new MessageEmbed()
          .setColor('#0x1a2c78')
          .setTitle(character)
          .setURL('https://dreamcancel.com/wiki/index.php/The_King_of_Fighters_98_UMFE/' + link)
          .setAuthor({ name: escapedMoves, iconURL: 'https://pbs.twimg.com/profile_images/1150082025673625600/m1VyNZtc_400x400.png', url: 'https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY' })
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
          .setFooter({ text: 'Got feedback? Join the 98FE server: https://discord.gg/rbRX3Dv5TG', iconURL: 'https://cdn.iconscout.com/icon/free/png-128/discord-3-569463.png' });
          (moveData['Image'] !== null) ? embed.setImage(moveData['Image']) : embed.addField('No image was found for this move', 'Feel free to share one with the [developers](https://github.com/FranckFrost/kof98fe_framebot/issues) if you have one.', true);
        return interaction.reply({embeds: [embed]});
      } catch (err) {
        console.log("Error parsing JSON string:", err);
        return interaction.reply('There was an error while processing your request, if the problem persists, contact the bot developers. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY) to look for the data.');
      }
    });
  },
  getCharacterLink: function(character) {
    const charLink = {
      'Andy': 'Andy_Bogard',
      'Athena': 'Athena_Asamiya',
      'Benimaru': 'Benimaru_Nikaido',
      'Billy': 'Billy_Kane',
      'Blue Mary': 'Blue_Mary',
      'EX Ryo': 'EX_Ryo',
      'EX Robert': 'EX_Robert',
      'EX Yuri': 'EX_Yuri',
      'EX Terry': 'EX_Terry',
      'EX Andy': 'EX_Andy',
      'EX Joe': 'EX_Joe',
      'EX Kyo': 'EX_Kyo',
      'EX Geese': 'EX_Geese',
      'EX King': 'EX_King',
      'EX Mai': 'EX_Mai',
      'EX Yamazaki': 'EX_Yamazaki',
      'EX Billy': 'EX_Billy',
      'EX Blue Mary': 'EX_Blue_Mary',
      'Orochi Chris': 'Orochi_Chris',
      'Orochi Shermie': 'Orochi_Shermie',
      'Orochi Yashiro': 'Orochi_Yashiro',
      'Chang': 'Chang_Koehan',
      'Chin': 'Chin_Gentsai',
      'Choi': 'Choi_Bounge',
      'Clark': 'Clark_Still',
      'Eiji': 'Eiji_Kisaragi',
      'Daimon': 'Goro_Daimon',
      'Krauser': 'Wolfgang_Krauser',
      'Iori': 'Iori_Yagami',
      'Brian': 'Brian_Battler',
      'Joe': 'Joe_Higashi',
      'Heavy D': 'Heavy_D!',
      'Mr. Big': 'Mr._Big',
      'Rugal': 'Rugal_Bernstein',
      'Kasumi': 'Kasumi_Todoh',
      'Kim': 'Kim_Kaphwan',
      'Saisyu': 'Saisyu_Kusanagi',
      'Kyo': 'Kyo_Kusanagi',
      'Leona': 'Leona_Heidern',
      'Chizuru': 'Chizuru_Kagura',
      'Mai': 'Mai_Shiranui',
      'Geese': 'Geese_Howard',
      'Lucky': 'Lucky_Glauber',
      'Ralf': 'Ralf_Jones',
      'Robert': 'Robert_Garcia',
      'Ryo': 'Ryo_Sakazaki',
      'Yamazaki': 'Ryuji_Yamazaki',
      'Shingo': 'Shingo_Yabuki',
      'Kensou': 'Sie_Kensou',
      'Takuma': 'Takuma_Sakazaki',
      'Terry': 'Terry_Bogard',
      'Yashiro': 'Yashiro_Nanakase',
      'Yuri': 'Yuri_Sakazaki'
    };
    if (charLink[character] === undefined) {
      return character;
    }
    return charLink[character];
  },
  // img below not used because found better tiermaker
  getCharacterImg: function(character) {
    const charImg = {
      'EX Billy': 'umbillyrbjpg',
      'EX Blue Mary': 'umbluemaryrbjpg',
      'EX Andy': 'umexandypng',
      'EX Geese': 'umgeeserbjpg',
      'EX Joe': 'umjoerbpng',
      'EX King': 'umkingaof2jpg',
      'EX Kyo': 'umkyo95jpg',
      'EX Mai': 'ummairbjpg',
      'EX Terry': 'umterryrb2png',
      'EX Ryo': 'umryo94png',
      'EX Robert': 'umrobert94png',
      'EX Yuri': 'umyuri94png',
      'EX Yamazaki': 'umyamazakirbjpg',
      'Eiji': 'umeijipng',
      'Kasumi': 'umkasumipng',
    };
    if (charImg[character] === undefined) {
      return character.toLowerCase().replace(' ', '')+'png';
    }
    return charImg[character];
  }
};
