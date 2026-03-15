import { ChatInputCommandInteraction, GuildMember, MessageFlags } from 'discord.js';
import { config } from '../config.js';

export function isGM(interaction: ChatInputCommandInteraction): boolean {
  const member = interaction.member;
  if (!member || !(member instanceof GuildMember)) return false;
  return member.roles.cache.some(
    (role) => role.name.toLowerCase() === config.discord.gmRoleName.toLowerCase()
  );
}

export async function requireGM(interaction: ChatInputCommandInteraction): Promise<boolean> {
  if (isGM(interaction)) return true;

  if (interaction.deferred || interaction.replied) {
    await interaction.editReply({ content: 'This command is GM-only.' });
  } else {
    await interaction.reply({
      content: 'This command is GM-only.',
      flags: MessageFlags.Ephemeral,
    });
  }
  return false;
}
