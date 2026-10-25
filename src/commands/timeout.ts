import { ChatInputCommandInteraction, GuildMember, TextChannel, PermissionFlagsBits } from 'discord.js';
import { BotCommand } from './type';
import { log, LogLevel } from '../utils/logger';
import config from '../config/config.json';

export const Command: BotCommand = {
  data: new (require('discord.js').SlashCommandBuilder)()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption((option: any) =>
      option
        .setName('member')
        .setDescription('The member to timeout')
        .setRequired(true)
    )
    .addIntegerOption((option: any) =>
      option
        .setName('duration')
        .setDescription('Duration in minutes (max 40320 = 28 days)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320)
    )
    .addStringOption((option: any) =>
      option
        .setName('reason')
        .setDescription('The reason for the timeout')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      return;
    }

    const member = interaction.options.getUser('member');
    const duration = interaction.options.getInteger('duration');
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

      await targetMember.timeout(duration! * 60 * 1000, reason || 'No reason provided');

      const embed = {
        title: '🔇 Timeout Applied',
        description: `**Member:** ${targetMember.user.tag}\n**Duration:** ${duration} minutes\n**Reason:** ${reason}`,
        color: 0xff0000,
        timestamp: new Date().toISOString(),
      };

      await (auditChannel as TextChannel).send({ embeds: [embed as any] });
      log(`Timeout applied: ${targetMember.user.tag} for ${duration} minutes - ${reason}`, LogLevel.INFO);

      await interaction.reply({ content: `Timed out ${targetMember.user.tag} for ${duration} minutes`, ephemeral: true });
    } catch (error) {
      log(`Error applying timeout: ${error}`, LogLevel.ERROR);
      await interaction.reply({ content: 'Failed to apply timeout.', ephemeral: true });
    }
  },
};
