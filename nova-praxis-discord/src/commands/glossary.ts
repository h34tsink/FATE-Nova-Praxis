import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { lookupGlossary, searchGlossary } from '../db/queries.js';

export const data = new SlashCommandBuilder()
  .setName('glossary')
  .setDescription('Look up a Nova Praxis term')
  .addStringOption((opt) =>
    opt.setName('term').setDescription('Term to look up').setRequired(true).setAutocomplete(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const term = interaction.options.getString('term', true);

  const entry = await lookupGlossary(term);

  if (!entry) {
    // Try fuzzy search and show suggestions
    const results = await searchGlossary(term);
    if (results.length > 0) {
      const suggestions = results.map((r) => r.term).join(', ');
      await interaction.reply({
        content: `No exact match for "${term}". Did you mean: ${suggestions}?`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({ content: `No glossary entry for "${term}".`, ephemeral: true });
    }
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(entry.term)
    .setColor(0x5865f2)
    .setFooter({ text: 'Nova Praxis Glossary' });

  if (entry.short_def) {
    embed.setDescription(entry.short_def.slice(0, 4096));
  }

  if (entry.aliases.length > 0) {
    embed.addFields({ name: 'Aliases', value: entry.aliases.join(', '), inline: true });
  }

  if (entry.tags.length > 0) {
    embed.addFields({ name: 'Tags', value: entry.tags.join(', '), inline: true });
  }

  await interaction.reply({ embeds: [embed] });
}
