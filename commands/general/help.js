const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  let prefix = client.config.prefix;

  if (!args[0]) {
    // This will turn the folder (category) into array.
    let module = client.helps.array();

    // This will hide a folder from display that includes "hide: true" in their module.json
    if (!client.config.owners.includes(message.author.id))
      module = client.helps.array().filter((x) => !x.hide);
    const embed = new Discord.MessageEmbed()
      .setColor("#ff0000 ")
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setDescription(
        `Type \`${prefix}help [command]\` to get more specific information about a command.`
      )
      .setTitle("Chilli")
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      );

    for (const mod of module) {
      // You can change the .join(" | ") to commas, dots or every symbol.
      embed.addField(
        `${mod.name}`,
        mod.cmds.map((x) => `\`${x}\``).join(" | ")
      );
    }

    return message.channel.send(embed);
  } else {
    let cmd = args.join(" ");

    // If the user type the [command], also with the aliases.
    if (
      client.commands.has(cmd) ||
      client.commands.get(client.aliases.get(cmd))
    ) {
      let command =
        client.commands.get(cmd) ||
        client.commands.get(client.aliases.get(cmd));
      let name = command.help.name; // The command name.
      let desc = command.help.description; // The command description.
      let cooldown = command.conf.cooldown + " second(s)"; // The command cooldown.
      let aliases = command.conf.aliases.join(", ")
        ? command.conf.aliases.join(", ")
        : "No aliases provided.";
      let usage = command.help.usage
        ? command.help.usage
        : "No usage provided.";
      let example = command.help.example
        ? command.help.example
        : "No example provided.";

      let embed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle(name)
        .setDescription(desc)
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        .addField("Cooldown", cooldown)
        .addField("Aliases", aliases, true)
        .addField("Usage", usage, true)
        .addField("Example", example, true)
        .setFooter(
          message.member.displayName,
          message.author.displayAvatarURL({ dynamic: true })
        );

      return message.channel.send(embed);
    } else {
      // If the user type the wrong command.
      return message.channel.send({
        embed: { color: "#ff0000", description: "Unknown command." },
      });
    }
  }
};

exports.help = {
  name: "help",
  description: "Show a command list.",
  usage: "help [command]",
  example: "help avatar",
};

exports.conf = {
  aliases: ["h"],
  cooldown: 5,
};
