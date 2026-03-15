import { AutocompleteInteraction } from 'discord.js';
import { query } from './db/client.js';
import { autocompleteAspects } from './db/aspect-queries.js';
import { getLatestSessionNum } from './db/queries.js';
import { GuildMember } from 'discord.js';

export async function handleAutocomplete(interaction: AutocompleteInteraction) {
  const focused = interaction.options.getFocused(true);
  const value = focused.value.toLowerCase();

  try {
    let choices: { name: string; value: string }[] = [];

    switch (interaction.commandName) {
      case 'glossary': {
        if (!value) break;
        const result = await query<{ term: string }>(
          `SELECT term FROM glossary WHERE lower(term) LIKE $1 ORDER BY term LIMIT 10`,
          [`%${value}%`]
        );
        choices = result.rows.map((r) => ({ name: r.term, value: r.term }));
        break;
      }

      case 'character': {
        if (!value) break;
        const result = await query<{ name: string }>(
          `SELECT name FROM characters WHERE lower(name) LIKE $1 ORDER BY name LIMIT 10`,
          [`%${value}%`]
        );
        choices = result.rows.map((r) => ({ name: r.name, value: r.name }));
        break;
      }

      case 'npc': {
        if (!value || focused.name !== 'token') break;
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
        break;
      }

      case 'lookup': {
        if (!value || focused.name !== 'query') break;
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
        break;
      }

      case 'aspects': {
        if (focused.name === 'aspect') {
          const sessionNum = await getLatestSessionNum();
          if (!sessionNum) break;

          const sub = interaction.options.getSubcommand();
          // For invoke: hide hidden aspects from non-GMs
          // For compel/remove: GM-only commands, show all
          const member = interaction.member;
          const gm = member instanceof GuildMember &&
            member.roles.cache.some((r) => r.name.toLowerCase() === 'gm');
          const includeHidden = gm || sub !== 'invoke';

          const rows = await autocompleteAspects(sessionNum, value, includeHidden);
          choices = rows.map((r) => ({
            name: `${r.text} [${r.type}]`.slice(0, 100),
            value: String(r.id),
          }));
        }

        if (focused.name === 'player') {
          const result = await query<{ name: string }>(
            `SELECT name FROM characters WHERE lower(name) LIKE $1 ORDER BY name LIMIT 10`,
            [value ? `%${value}%` : '%']
          );
          choices = result.rows.map((r) => ({ name: r.name, value: r.name }));
        }
        break;
      }
    }

    await interaction.respond(choices.slice(0, 25));
  } catch {
    await interaction.respond([]);
  }
}
