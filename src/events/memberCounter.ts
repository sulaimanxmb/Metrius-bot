import { Client, Guild, TextChannel } from 'discord.js';
import { log, LogLevel } from '../utils/logger';
import config from '../config/config.json';

export function setupMemberCounter(client: Client): void {
  const counterConfig = (config as any).memberCount;
  
  if (!counterConfig || !counterConfig.enabled || counterConfig.channelId === 'MEMBER_COUNT_CHANNEL_ID') {
    log('Member Counter: Not enabled or not configured. Skipping.', LogLevel.WARN);
    return;
  }

  const updateCounter = async (guild: Guild): Promise<void> => {
    try {
      const channel = await client.channels.fetch(counterConfig.channelId) as TextChannel;
      if (!channel || !channel.isTextBased() || !channel.name) {
        log(`Member Counter: Channel ${counterConfig.channelId} is invalid.`, LogLevel.ERROR);
        return;
      }

      const memberCount = guild.memberCount;
      const newName = `👥 Members: ${memberCount}`;

      if (channel.name !== newName) {
        await channel.setName(newName);
        log(`Member Counter: Updated channel name to ${newName}`, LogLevel.INFO);
      }
    } catch (error) {
      log(`Member Counter: Error updating counter: ${error}`, LogLevel.ERROR);
    }
  };

  // Update counter on guild member add/remove
  client.on('guildMemberAdd', async (member) => {
    await updateCounter(member.guild);
  });

  client.on('guildMemberRemove', async (member) => {
    await updateCounter(member.guild);
  });

  // Update counter on ready
  client.once('ready', async () => {
    const guildId = (config as any).bot?.guildId || process.env.GUILD_ID;
    if (!guildId) {
      log(`Member Counter: Guild ID not set.`, LogLevel.ERROR);
      return;
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      log(`Member Counter: Guild ${guildId} not found.`, LogLevel.ERROR);
      return;
    }

    await updateCounter(guild);
    log(`Member Counter: Initialized for guild ${guild.name}`, LogLevel.INFO);
  });
}
