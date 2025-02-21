// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const keepAlive = require('./server');
const path = require('path')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const appCommandFiles = fs.readdirSync('./commands/application').filter(file => file.endsWith('.js'));
const guildCommandFiles = fs.readdirSync('./commands/guild').filter(file => file.endsWith('.js'));

for (const file of appCommandFiles) {
  const command = require(`./commands/application/${file}`);
  client.commands.set(command.data.name, command);
}
for (const file of guildCommandFiles) {
  const command = require(`./commands/guild/${file}`);
  client.commands.set(command.data.name, command);
}

let json = null
let characters = []
client.once('ready', () => {
  json = fs.readFileSync("./assets/framedata98.json", 'utf8');
  json = JSON.parse(json);
  Object.keys(json).forEach(function (key) {
    characters.push(key);
  })
  console.log('Ready!');
});
client.on('interactionCreate', async autocomplete => {
	if (!autocomplete.isAutocomplete()) return;
  // console.log(autocomplete.commandName)
	if (autocomplete.commandName === 'embed' || autocomplete.commandName === 'frames') {
    let currentOption = autocomplete.options.getFocused(true);
    let currentName = currentOption.name;
    let currentValue = currentOption.value;

    const options = [];
    if (currentName === "character") {
      characters.forEach((character) => {
        if (character.toLowerCase().includes(currentValue.toLowerCase())) {
          let charObj = {}
          charObj["name"] = character;
          charObj["value"] = character;
          if (options.length < 25) {
            options.push(charObj);
          }
        }
      })
    }
    // 
    let character = autocomplete.options.getString('character')
    // console.log(character)
    // If move is focused 
    if (currentName === "move" && character !== "") {
      // currentValue = autocomplete.options.getFocused()
      let moveObj = {}
      if (json[character] === undefined) {
        // Capitilize first letter of character name.
        let char = character.charAt(0).toUpperCase() + character.slice(1);
        // Temp: validate extra names.
        if (char === 'Mary') {
          char = 'Blue Mary'
            }
        if (char === 'O.Chris') {
          char = 'Orochi Chris'
            }
        if (char === 'O.Shermie') {
          char = 'Orochi Shermie'
            }
        if (char === 'O.Yashiro') {
          char = 'Orochi Yashiro'
            }
        if (char === 'Ex kyo' ||
            char === 'Ex Kyo') {
          char = 'EX Kyo'
            }
        if (char === 'Ex geese' ||
            char === 'Ex Geese') {
          char = 'EX Geese'
            }
        if (char === 'Ex terry' ||
            char === 'Ex Terry') {
          char = 'EX Terry'
            }
        if (char === 'Ex andy' ||
            char === 'Ex Andy') {
          char = 'EX Andy'
            }
        if (char === 'Ex joe' ||
            char === 'Ex Joe') {
          char = 'EX Joe'
            }
        if (char === 'Ex ryo' ||
            char === 'Ex Ryo') {
          char = 'EX Ryo'
            }
        if (char === 'Ex robert' ||
            char === 'Ex Robert') {
          char = 'EX Robert'
            }
        if (char === 'Ex yuri' ||
            char === 'Ex Yuri') {
          char = 'EX Yuri'
            }
        if (char === 'Ex king' ||
            char === 'Ex King') {
          char = 'EX King'
            }
        if (char === 'Ex mai' ||
            char === 'Ex Mai') {
          char = 'EX Mai'
            }
        if (char === 'Ex yamazaki' ||
            char === 'Ex Yamazaki') {
          char = 'EX Yamazaki'
            }
        if (char === 'Ex blue mary' ||
            char === 'Ex Blue mary' ||
            char === 'Ex mary') {
          char = 'EX Blue Mary'
            }
        if (char === 'Ex billy' ||
            char === 'Ex Billy') {
          char = 'EX Billy'
            }
        character = char
      }
      if (json[character] === undefined) {
        moveObj["name"] = 'Moves not found for specified character, try another character';
        moveObj["value"] = 'Moves not found for specified character, try another character';
        options.push(moveObj);
      } else {
        let moves = [] 
        Object.keys(json[character]).forEach(function (key) {
          moves.push(key);
        })
        // console.log(moves)
        // console.log('currval ' + currentValue)
        moves.forEach((move) => {
          if (move.toLowerCase().includes(currentValue.toLowerCase())) {
            moveObj = {}
            moveObj["name"] = move;
            moveObj["value"] = move;
            // console.log(move)
            if (options.length < 25) {
              options.push(moveObj);
            }
          }
        }) 
      }
    }
		await autocomplete.respond(options);
	}
});
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});
client.on("ready", () => {
  console.log(`Hi, ${client.user.username} is now online and used in ${client.guilds.cache.size} servers.`);
  client.guilds.cache.forEach((guild) => {
    console.log(`${guild.name} with ${guild.memberCount} members.`)
  });

  client.user.setPresence({
    status: "online",
    activities: [{
      name: 'Kyo. Use /frames or /help to get started.'
    }],
  }); 
});
// Keep bot alive. (doesn't seem to work on raspberry, port issue to look into later)
// keepAlive();
// Login to Discord with your client's token
const token = process.env['DISCORD_TOKEN']
client.login(token);
