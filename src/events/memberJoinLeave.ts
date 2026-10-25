import { Client, GuildMember, TextChannel } from 'discord.js';
import { log, LogLevel } from '../utils/logger';
import config from '../config/config.json';

export function setupMemberJoinLeave(client: Client): void {
  const welcomeChannelId = (config as any).channels?.welcomeChannel;
  const goodbyeChannelId = (config as any).channels?.goodbyeChannel;
  const messages = (config as any).messages || {};

  client.on('guildMemberAdd', async (member: GuildMember) => {
    if (!welcomeChannelId || welcomeChannelId === 'WELCOME_CHANNEL_ID') {
      log('Welcome channel not configured. Skipping welcome message.', LogLevel.WARN);
      return;
    }

    try {
      const textChannel = await client.channels.fetch(welcomeChannelId) as TextChannel;
      if (!textChannel || !textChannel.isTextBased()) {
        log(`Welcome: Channel ${welcomeChannelId} is invalid or not a text channel.`, LogLevel.ERROR);
        return;
      }

      const welcomeMessage = (messages.welcome || 'Welcome to the server, {{user}}!')
        .replace('{{user}}', member.user.tag);
      
      await textChannel.send(welcomeMessage);
      log(`Welcome message sent to #${textChannel.name} for ${member.user.tag}`, LogLevel.INFO);
    } catch (error) {
      log(`Error sending welcome message: ${error}`, LogLevel.ERROR);
    }
  });

  (client as any).on('guildMemberRemove', async (member: GuildMember) => {
    if (!goodbyeChannelId || goodbyeChannelId === 'GOODBYE_CHANNEL_ID') {
      log('Goodbye channel not configured. Skipping goodbye message.', LogLevel.WARN);
      return;
    }

    try {
      const textChannel = await client.channels.fetch(goodbyeChannelId) as TextChannel;
      if (!textChannel || !textChannel.isTextBased()) {
        log(`Goodbye: Channel ${goodbyeChannelId} is invalid or not a text channel.`, LogLevel.ERROR);
        return;
      }

      const goodbyeMessage = (messages.goodbye || 'Goodbye, {{user}}!')
        .replace('{{user}}', member.user.tag);
      
      await textChannel.send(goodbyeMessage);
      log(`Goodbye message sent to #${textChannel.name} for ${member.user.tag}`, LogLevel.INFO);
    } catch (error) {
      log(`Error sending goodbye message: ${error}`, LogLevel.ERROR);
    }
  });
}
