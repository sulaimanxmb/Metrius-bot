export interface ReactionRoleConfig {
  emoji: string;
  roleId: string;
  roleName: string;
}

export interface ReactionRolesConfig {
  messageId: string;
  roles: ReactionRoleConfig[];
}

export interface ChannelsConfig {
  auditLog: string;
  welcomeChannel: string;
  goodbyeChannel: string;
  memberCount: string;
}

export interface MessagesConfig {
  welcome: string;
  goodbye: string;
}

export interface MemberCountConfig {
  channelId: string;
  enabled: boolean;
}

export interface ModerationConfig {
  enabled: boolean;
  logChannel: string;
}

export interface BotConfig {
  token: string;
  guildId: string;
}

export interface Config {
  bot: BotConfig;
  channels: ChannelsConfig;
  reactionRoles: ReactionRolesConfig;
  messages: MessagesConfig;
  memberCount: MemberCountConfig;
  moderation: ModerationConfig;
}
