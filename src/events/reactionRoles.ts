import { Client, User, MessageReaction, GuildMember } from 'discord.js';
import { log, LogLevel } from '../utils/logger';
import config from '../config/config.json';

export function setupReactionRoles(client: Client): void {
  const reactionRoleConfig = (config as any).reactionRoles;
  
  if (!reactionRoleConfig || !reactionRoleConfig.messageId || !reactionRoleConfig.roles || reactionRoleConfig.roles.length === 0) {
    log('Reaction Roles: No configuration found. Skipping.', LogLevel.WARN);
    return;
  }

  client.once('ready', async () => {
    log('Reaction Roles: Loading message and adding reactions...', LogLevel.INFO);
    try {
      const channel = await client.channels.fetch(reactionRoleConfig.messageId);
      if (!channel || !channel.isTextBased()) {
        log(`Reaction Roles: Channel not found or invalid for message ID ${reactionRoleConfig.messageId}`, LogLevel.ERROR);
        return;
      }

      const message = await channel.messages.fetch(reactionRoleConfig.messageId);
      for (const roleConfig of reactionRoleConfig.roles) {
        await message.react(roleConfig.emoji);
        log(`Reaction Roles: Reacted with ${roleConfig.emoji} for role ${roleConfig.roleName}`, LogLevel.INFO);
      }
    } catch (error) {
      log(`Reaction Roles: Error loading message: ${error}`, LogLevel.ERROR);
    }
  });

  (client as any).on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
    if (user.bot) return;
    if (reaction.message.id !== reactionRoleConfig.messageId) return;

    const emoji = reaction.emoji.name;
    const roleConfig = reactionRoleConfig.roles.find((r: any) => r.emoji === emoji);
    if (!roleConfig) return;

    const guild = reaction.message.guild;
    if (!guild) return;

    try {
      const member = await guild.members.fetch(user.id);
      const role = await guild.roles.fetch(roleConfig.roleId);

      if (!member || !role) {
        log(`Reaction Roles: Member or role not found for emoji ${emoji}`, LogLevel.ERROR);
        return;
      }

      await member.roles.add(role);
      log(`Reaction Roles: Added ${role.name} to ${user.tag}`, LogLevel.INFO);
    } catch (error) {
      log(`Reaction Roles: Error adding role to ${user.tag}: ${error}`, LogLevel.ERROR);
    }
  });

  (client as any).on('messageReactionRemove', async (reaction: MessageReaction, user: User) => {
    if (user.bot) return;
    if (reaction.message.id !== reactionRoleConfig.messageId) return;

    const emoji = reaction.emoji.name;
    const roleConfig = reactionRoleConfig.roles.find((r: any) => r.emoji === emoji);
    if (!roleConfig) return;

    const guild = reaction.message.guild;
    if (!guild) return;

    try {
      const member = await guild.members.fetch(user.id);
      const role = await guild.roles.fetch(roleConfig.roleId);

      if (!member || !role) {
        log(`Reaction Roles: Member or role not found for emoji ${emoji}`, LogLevel.ERROR);
        return;
      }

      await member.roles.remove(role);
      log(`Reaction Roles: Removed ${role.name} from ${user.tag}`, LogLevel.INFO);
    } catch (error) {
      log(`Reaction Roles: Error removing role from ${user.tag}: ${error}`, LogLevel.ERROR);
    }
  });
}
