import { ChatInputCommandInteraction, GuildMember, TextChannel } from 'discord.js';
import { BotCommand } from './type';
import { log, LogLevel } from '../utils/logger';
import config from '../config/config.json';

export const Command: BotCommand = {
  data: new (require('discord.js').SlashCommandBuilder)()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption((option: any) =>
      option
        .setName('member')
        .setDescription('The member to warn')
        .setRequired(true)
    )
    .addStringOption((option: any) =>
      option
        .setName('reason')
        .setDescription('The reason for the warning')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    const member = interaction.options.getUser('member');
    const reason = interaction.options.getString('reason');
    const auditChannelId = (config as any).moderation?.logChannel || (config as any).channels?.auditLog;

    if (!auditChannelId || auditChannelId === 'AUDIT_LOG_CHANNEL_ID') {
      await interaction.reply({ content: 'Audit log channel not configured.', ephemeral: true });
      return;
    }

    try {
      const targetMember = await interaction.guild.members.fetch(member!.id);
      const auditChannel = await interaction.guild.channels.fetch(auditChannelId);

      if (!targetMember || !auditChannel || !auditChannel.isTextBased()) {
        await interaction.reply({ content: 'Target member or audit channel not found.', ephemeral: true });
        return;
      }

      await member!.send(`You have been warned in ${interaction.guild.name} for: ${reason}`);

      const embed = {
        title: '⚠️ Warning Issued',
        description: `**Member:** ${targetMember.user.tag}\n**Reason:** ${reason}`,
        color: 0xffaa00,
        timestamp: new Date().toISOString(),
      };

      await (auditChannel as TextChannel).send({ embeds: [embed as any] });
      log(`Warn issued: ${targetMember.user.tag} for ${reason}`, LogLevel.INFO);

      await interaction.reply({ content: `Warned ${targetMember.user.tag}`, ephemeral: true });
    } catch (error) {
      log(`Error issuing warning: ${error}`, LogLevel.ERROR);
      await interaction.reply({ content: 'Failed to issue warning.', ephemeral: true });
    }
  },
};
