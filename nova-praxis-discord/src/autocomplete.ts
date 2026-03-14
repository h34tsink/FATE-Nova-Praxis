import { AutocompleteInteraction } from 'discord.js';
import { query } from './db/client.js';

export async function handleAutocomplete(interaction: AutocompleteInteraction) {
  const focused = interaction.options.getFocused(true);
  const value = focused.value.toLowerCase();

  if (!value || value.length < 1) {
    await interaction.respond([]);
    return;
  }

  try {
    let choices: { name: string; value: string }[] = [];

    switch (interaction.commandName) {
      case 'glossary': {
        const result = await query<{ term: string }>(
          `SELECT term FROM glossary WHERE lower(term) LIKE $1 ORDER BY term LIMIT 10`,
          [`%${value}%`]
        );
        choices = result.rows.map((r) => ({ name: r.term, value: r.term }));
        break;
      }

      case 'character': {
        const result = await query<{ name: string }>(
          `SELECT name FROM characters WHERE lower(name) LIKE $1 ORDER BY name LIMIT 10`,
          [`%${value}%`]
        );
        choices = result.rows.map((r) => ({ name: r.name, value: r.name }));
        break;
      }

      case 'npc': {
        if (focused.name === 'token') {
          const result = await query<{ token: string; name: string; rank: number }>(
            `SELECT token, name, rank FROM entity_cards
             WHERE lower(token) LIKE $1 OR lower(name) LIKE $1
             ORDER BY rank DESC, name LIMIT 10`,
            [`%${value}%`]
          );
          choices = result.rows.map((r) => ({
            name: `${r.name} (R${r.rank}) — ${r.token}`,
            value: r.token,
          }));
        }
        break;
      }

      case 'lookup': {
        if (focused.name === 'query') {
          const result = await query<{ name: string; category: string }>(
            `SELECT DISTINCT name, category FROM game_data
             WHERE lower(name) LIKE $1
             ORDER BY name LIMIT 10`,
            [`%${value}%`]
          );
          choices = result.rows.map((r) => ({
            name: `${r.name} [${r.category}]`,
            value: r.name,
          }));
        }
        break;
      }
    }

    await interaction.respond(choices.slice(0, 25)); // Discord max 25
  } catch {
    await interaction.respond([]);
  }
}
