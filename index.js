const Komada = require("komada");
const Discord = require("discord.js");
const config = require("./assets/settings.json");
const speech = require("./assets/speech.json");
const localization = require("./assets/localization.json");
const items = require("./assets/values/items.json");
const recipes = require("./assets/values/recipes.json");

const permStructure = new Komada.PermLevels()
  .addLevel(0, false, () => true)
  .addLevel(2, false, (client, msg) => {
    if (!msg.guild || !msg.guild.settings.modRole) { return false; }
    const modRole = msg.guild.roles.get(msg.guild.settings.modRole);
    return modRole && msg.member.roles.has(modRole.id);
  })
  .addLevel(3, false, (client, msg) => {
    if (!msg.guild || !msg.guild.settings.adminRole) { return false; }
    const adminRole = msg.guild.roles.get(msg.guild.settings.adminRole);
    return adminRole && msg.member.roles.has(adminRole.id);
  })
  .addLevel(4, false, (client, msg) => msg.guild && msg.author.id === msg.guild.owner.id)
  .addLevel(9, false, (client, msg) => msg.author.id === config.secondary)
  .addLevel(10, false, (client, msg) => msg.author === client.owner);

const client = new Komada.Client({
    ownerID: config.ownerID,
    prefix: config.prefix,
    clientOptions: { fetchAllMembers: false },
    cmdLogging: false
});

client.speech = function(keys, msg) {
  if (!keys) { throw new Error("Keys missing in function call!"); }
  var t = speech;
  for (var x = 0; x < keys.length; x++) { t = t[keys[x]]; }
  var text = t[Math.floor(Math.random() * t.length)]; var prefix = msg.guildSettings.prefix || config.prefix;
  return text.replace("-prefix-", prefix);
};

client.ownerSetting = new Discord.Collection();
var keys = Object.keys(config);
for (var x = 0; keys.length > x; x++) { 
  switch (keys[x]) {
    case "owner":
      var key = Object.keys(config.owner);
      for (var y = 0; key.length > y; y++) { client.ownerSetting.set(key[y], config.owner[key[y]]); } break;
    case "database": client.database = config.database; break;
  }
}
client.ownerSetting.set("permLevel", localization.permLevels);
client.database.items = items;
client.database.recipes = recipes;

client.login(config.token);