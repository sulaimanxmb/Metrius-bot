import { Client, GatewayIntentBits, Collection, Partials, ChatInputCommandInteraction } from 'discord.js';
import * as pingCmd from './commands/ping';
import * as warnCmd from './commands/warn';
import * as timeoutCmd from './commands/timeout';
import { setupReactionRoles } from './events/reactionRoles';
import { setupMemberJoinLeave } from './events/memberJoinLeave';
import { setupMemberCounter } from './events/memberCounter';
import { log, LogLevel } from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

interface BotClient extends Client {
  commands: Collection<string, { data: any; execute: (interaction: ChatInputCommandInteraction) => Promise<void> }>;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Reaction],
}) as BotClient;

client.commands = new Collection();

client.once('ready', async () => {
  log(`Bot is logged in as ${client.user?.tag}`, LogLevel.INFO);
  log(`Guild ID: ${process.env.GUILD_ID || 'Not set'}`, LogLevel.INFO);

  // Register all commands
  const commands = [pingCmd, warnCmd, timeoutCmd];
  const commandData = commands.map(cmd => cmd.Command.data.toJSON());

  try {
    await client.application?.commands.set(commandData);
    log('Commands registered successfully', LogLevel.INFO);
  } catch (error) {
    log(`Error registering commands: ${error}`, LogLevel.ERROR);
  }

  // Setup all event handlers
  setupReactionRoles(client);
  setupMemberJoinLeave(client);
  setupMemberCounter(client);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    log(`Command ${interaction.commandName} not found`, LogLevel.ERROR);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    log(`Error executing ${interaction.commandName}: ${error}`, LogLevel.ERROR);
    await interaction.reply({
      content: 'There was an error executing this command!',
      ephemeral: true,
    });
  }
});

process.on('unhandledRejection', error => {
  log(`Unhandled promise rejection: ${error}`, LogLevel.ERROR);
});

process.on('uncaughtException', error => {
  log(`Uncaught exception: ${error}`, LogLevel.ERROR);
});

client.login(process.env.DISCORD_TOKEN);
