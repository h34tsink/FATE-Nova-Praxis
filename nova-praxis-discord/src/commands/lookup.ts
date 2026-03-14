import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { searchGameData, getGameDataByName } from '../db/queries.js';
import { gameDataEmbed, gameDataListEmbed } from '../embeds/game-data.js';

export const data = new SlashCommandBuilder()
  .setName('lookup')
  .setDescription('Search game data: gear, augmentations, sleeves, skills, states, houses')
  .addStringOption((opt) =>
    opt.setName('query').setDescription('What to search for').setRequired(true).setAutocomplete(true)
  )
  .addStringOption((opt) =>
    opt
      .setName('category')
      .setDescription('Filter by category')
      .setRequired(false)
      .addChoices(
        { name: 'Gear', value: 'gear' },
        { name: 'Armor Feature', value: 'armor_feature' },
        { name: 'Augmentation', value: 'augmentation' },
        { name: 'Sleeve', value: 'sleeve' },
        { name: 'Skill', value: 'skill' },
        { name: 'State', value: 'state' },
        { name: 'House', value: 'house' }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const searchQuery = interaction.options.getString('query', true);
  const category = interaction.options.getString('category') ?? undefined;

  // Try exact match first
  const exact = await getGameDataByName(searchQuery, category);
  if (exact) {
    await interaction.reply({ embeds: [gameDataEmbed(exact)] });
    return;
  }

  // Full-text search
  const results = await searchGameData(searchQuery, category);

  if (results.length === 0) {
    await interaction.reply({ content: `No results for "${searchQuery}".`, ephemeral: true });
    return;
  }

  if (results.length === 1) {
    await interaction.reply({ embeds: [gameDataEmbed(results[0])] });
    return;
  }

  await interaction.reply({ embeds: [gameDataListEmbed(results, searchQuery)] });
}
