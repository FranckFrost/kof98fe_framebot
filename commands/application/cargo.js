const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { MessageEmbedVideo } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cargo')
    .setDescription('Pick character name and move, to get a response with all available cargo data.')
    .addStringOption(character =>
  		character.setName('character')
        .setAutocomplete(true)
  			.setDescription('The character name (e.g. Kyo, Iori).')
  			.setRequired(true))
    .addStringOption(move =>
  		move.setName('move')
        .setAutocomplete(true)
  			.setDescription('The move name or input.')
  			.setRequired(true)),
  async execute(interaction) {
    const character = this.getCharacter(interaction.options.getString('character'));
    const mov = interaction.options.getString('move');
    if (mov.split("??")[1] === undefined) {
      return interaction.editReply('You are free to manually enter the **character** but you have to select the **move** from the scroll list. You can type to refine the search.')
    }
    const [id, move] = mov.split("??");
    console.log("cargo", character, move)

    try {
      // Fetch the cargo data with the appropriate moveId
      const url_cargo = "https://dreamcancel.com/w/index.php?title=Special:CargoExport&tables=MoveData_KOF98FE%2C&&fields=MoveData_KOF98FE.rank%2C+MoveData_KOF98FE.idle%2C+MoveData_KOF98FE.images%2C+MoveData_KOF98FE.hitboxes%2C+MoveData_KOF98FE.damage%2C+MoveData_KOF98FE.counter%2C+MoveData_KOF98FE.stun%2C+MoveData_KOF98FE.guard%2C+MoveData_KOF98FE.cancel%2C+MoveData_KOF98FE.startup%2C+MoveData_KOF98FE.active%2C+MoveData_KOF98FE.recovery%2C+MoveData_KOF98FE.hitadv%2C+MoveData_KOF98FE.blockadv%2C+MoveData_KOF98FE.invul%2C&where=moveId%3D%22"+encodeURIComponent(id)+"%22&order+by=&limit=100&format=json";
      const response_cargo = await fetch(url_cargo);
      const cargo = await response_cargo.json();
  
      // Preparing the embed data from cargo
      let moveData = cargo[0];
      const startup = this.getHyperLink(moveData['startup']);
      const active = this.getHyperLink(moveData['active']);
      const recovery = this.getHyperLink(moveData['recovery']);
      const rank = this.getHyperLink(moveData['rank']);
      const idle = this.getHyperLink(moveData['idle']);
      const stun = this.getHyperLink(moveData['stun']);
      const counter = this.getHyperLink(moveData['counter']);
      const oh = this.getHyperLink(moveData['hitadv']);
      const ob = this.getHyperLink(moveData['blockadv']);
      const inv = this.getHyperLink(moveData['invul'],1);
      const dmg = this.getHyperLink(moveData['damage']);
      const guard = this.getHyperLink(moveData['guard']);
      const cancel = this.getHyperLink(moveData['cancel']);

      // Fetch hitboxes or images if lack of the former
      let images = (moveData['images'] !== null) ? moveData['images'].toString().trim().split(',') : [];
      let hitboxes = (moveData['hitboxes'] !== null) ? moveData['hitboxes'].toString().trim().split(',') : images;
    
      // Get character link and img for header and thumbnail.
      const link = 'https://dreamcancel.com/wiki/The_King_of_Fighters_%2798_UMFE/' + encodeURIComponent(character);
      const img = this.getCharacterImg(character);
      
      const embeds = [];
      const embed = new MessageEmbed()
        .setColor('#0x1a2c78')
        .setTitle(character)
        .setURL(link)
        .setAuthor({ name: move, iconURL: 'https://pbs.twimg.com/profile_images/1150082025673625600/m1VyNZtc_400x400.png', url: link + '/Data' })
        // .setDescription('Move input')
        .setThumbnail('https://tiermaker.com/images/chart/chart/king-of-fighters-98-ultimate-match-tier-list-maker-1280912/' + img + 'selectpng.png')
        .addFields(
          { name: 'Startup', value: startup, inline: true },
          { name: 'Active', value: active, inline: true },
          { name: 'Recovery', value: recovery, inline: true },
          { name: '\u200B', value: '\u200B' },
          )
      if (idle === "yes") {
        embed.addFields({ name: 'Rank', value: rank})
      }else{
        embed.addFields(
          { name: 'Damage', value: dmg, inline: true },
          { name: 'Cancel', value: cancel, inline: true },
          { name: '\u200B', value: '\u200B' },
          )
        if (counter !== '-') {
          embed.addFields(
            { name: 'Counter', value: counter, inline: true },
            { name: 'Stun', value: stun, inline: true },
            { name: '\u200B', value: '\u200B' },
            )
        }
        embed.addFields(
          { name: 'Guard', value: guard, inline: true },
          { name: 'On hit', value: oh, inline: true },
          { name: 'On block', value: ob, inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: 'Invincibility', value: inv },
          // { name: 'Inline field title', value: 'Some value here', inline: true },
          )
      }
        embed.setFooter({ text: 'Got feedback? Join the 98FE server: discord.gg/rbRX3Dv5TG', iconURL: 'https://cdn.iconscout.com/icon/free/png-128/discord-3-569463.png' });
        if (hitboxes.length === 0) {
          embed.addField('No image was found for this move', 'Feel free to share with Franck Frost if you have one.', true);
          embeds.push(embed)
        } else {
          let ind = "url\":\""
          
          let url = "https://dreamcancel.com/w/api.php?action=query&format=json&prop=imageinfo&titles=File:" + encodeURIComponent(hitboxes.shift()) + "&iiprop=url"
          let response = await fetch(url)
          let car = await response.text()
          let s = car.indexOf(ind) + ind.length
          let image = car.slice(s,car.indexOf("\"",s))
          embed.setImage(image)
          embeds.push(embed)

          if (hitboxes.length > 0) {
            url = "https://dreamcancel.com/w/api.php?action=query&format=json&prop=imageinfo&titles=File:" + encodeURIComponent(hitboxes.shift()) + "&iiprop=url"
            response = await fetch(url)
            car = await response.text()
            s = car.indexOf(ind) + ind.length
            let image1 = car.slice(s,car.indexOf("\"",s))
            const embed1 = new MessageEmbed().setImage(image1)
            embeds.push(embed1)
          }
  
          if (hitboxes.length > 0) {
            url = "https://dreamcancel.com/w/api.php?action=query&format=json&prop=imageinfo&titles=File:" + encodeURIComponent(hitboxes.shift()) + "&iiprop=url"
            response = await fetch(url)
            car = await response.text()
            s = car.indexOf(ind) + ind.length
            let image2 = car.slice(s,car.indexOf("\"",s))
            const embed2 = new MessageEmbed().setImage(image2)
            embeds.push(embed2)
          }
  
          if (hitboxes.length > 0) {
            url = "https://dreamcancel.com/w/api.php?action=query&format=json&prop=imageinfo&titles=File:" + encodeURIComponent(hitboxes.shift()) + "&iiprop=url"
            response = await fetch(url)
            car = await response.text()
            s = car.indexOf(ind) + ind.length
            let image3 = car.slice(s,car.indexOf("\"",s))
            const embed3 = new MessageEmbed().setImage(image3)
            embeds.push(embed3)
          }
        }
      await interaction.editReply({embeds: embeds});
      return;
      } catch (error) {
        console.log("Error finishing cargo request", error);
        return interaction.editReply('There was an error while processing your **cargo** request, reach out to <@259615904772521984>. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/100XfeqQCZB7uaeg9DJ3yWIIu6lHLbhdhs7B8b8eWRpY) to look for the data.');
      }
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
  getHyperLink: function(str,inv) {
    if (inv && str === null) return 'No recorded invincibility.'; // no invuln found
    if (str === null) return '-'; // no property found
    let s = str.toString().replaceAll('&#039;','');
    if (s.match(/.*?\[\[.*?\]\].*/) === null) return s.replaceAll('_',' '); // no hyperlink found
    
    let t="", u="", v=[], w=[], x=[], y=[], z=(s.split(',')[1]!==undefined) ? s.split(',') : s.split(';')
    for (let i in z) {
        y[i] = z[i].match(/.*?\[\[.*?\]\].*/g)
    }
    for (let i in y) {
      if (y[i] === null) {
          x.push(z[i])
      }else{
          let wiki = "https://dreamcancel.com/wiki/"
          for (let j in y[i]) {
              w = y[i][j].replace(']]','').split('[[')
              v = w[1].split('|')
              if (v[1].includes("HKD")) u = " \'Hard Knockdown\'"
              if (v[1].includes("SKD")) u = " \'Soft Knockdown\'"
              x.push(w[0] + '[' + v[1] + '](' + wiki + v[0] + u + ')')
          }
      }
    }
    for (let i in x) {
        t = t + x[i] + ','
    }
    return t.slice(0, -1);
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
