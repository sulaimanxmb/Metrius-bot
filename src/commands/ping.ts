import { ChatInputCommandInteraction } from 'discord.js';
import { BotCommand } from './type';

export const Command: BotCommand = {
  data: new (require('discord.js').SlashCommandBuilder)()
    .setName('ping')
    .setDescription('Ping the bot!'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('Pong!');
  },
};
