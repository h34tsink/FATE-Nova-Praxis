import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
  REST,
  Routes,
  ChatInputCommandInteraction,
} from 'discord.js';
import { config } from './config.js';
import { pool } from './db/client.js';
import { consumeSharedContent } from './share-cache.js';
import { playerResponseEmbed } from './embeds/player-response.js';
import { disabledShareButton } from './embeds/share-button.js';
import { getCachedAspect } from './aspect-cache.js';
import { createAspect } from './db/aspect-queries.js';
import { getLatestSessionNum } from './db/queries.js';

// Import commands
import * as lookup from './commands/lookup.js';
import * as glossary from './commands/glossary.js';
import * as character from './commands/character.js';
import * as npc from './commands/npc.js';
import * as scene from './commands/scene.js';
import * as rules from './commands/rules.js';
import * as recap from './commands/recap.js';
import * as aspects from './commands/aspects.js';
import * as gmStart from './commands/gm-start.js';
import * as sync from './commands/sync.js';
import * as ask from './commands/ask.js';
import * as playerAsk from './commands/player-ask.js';
import { handleAutocomplete } from './autocomplete.js';

interface Command {
  data: { name: string; toJSON(): unknown };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const commands = new Collection<string, Command>();

const commandModules: Command[] = [
  lookup, glossary, character,
  npc, scene, rules, recap, aspects, gmStart, sync, ask, playerAsk,
];

for (const cmd of commandModules) {
  commands.set(cmd.data.name, cmd);
}

// Create Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Register slash commands on ready
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);

  // Register commands with Discord
  const rest = new REST().setToken(config.discord.token);
  const commandData = commandModules.map((cmd) => cmd.data.toJSON());

  try {
    if (config.discord.guildId) {
      // Guild-specific (instant updates during development)
      await rest.put(
        Routes.applicationGuildCommands(readyClient.user.id, config.discord.guildId),
        { body: commandData }
      );
      console.log(`Registered ${commandData.length} guild commands`);
    } else {
      // Global (takes up to 1 hour to propagate)
      await rest.put(Routes.applicationCommands(readyClient.user.id), {
        body: commandData,
      });
      console.log(`Registered ${commandData.length} global commands`);
    }
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
});

// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isAutocomplete()) {
    await handleAutocomplete(interaction);
    return;
  }

  if (interaction.isButton()) {
    await handleButton(interaction);
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Error executing /${interaction.commandName}:`, err);
    try {
      const content = 'Something went wrong executing that command.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content, ephemeral: true });
      } else {
        await interaction.reply({ content, ephemeral: true });
      }
    } catch { /* interaction expired */ }
  }
});

async function handleButton(interaction: import('discord.js').ButtonInteraction) {
  const id = interaction.customId;

  // Share button clicks
  if (id.startsWith('share_')) {
    try {
      const entry = consumeSharedContent(id);
      if (!entry) {
        await interaction.reply({
          content: 'Content expired — run the command again.',
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (interaction.user.id !== entry.userId) {
        await interaction.reply({
          content: 'Only the GM who ran the command can share it.',
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Post public player-safe embed
      const embeds = playerResponseEmbed(entry.title, entry.content, 'Shared by GM');
      if (interaction.channel && 'send' in interaction.channel) {
        await interaction.channel.send({ embeds });
      }

      // Disable the button on the ephemeral message
      await interaction.update({
        components: [disabledShareButton(id)],
      });
    } catch (err) {
      console.error('Error handling share button:', err);
    }
    return;
  }

  // "Add to Scene" buttons from /aspects generate or /aspects suggest
  const addMatch = id.match(/^aspect_add_(\d+)_(\d+)$/);
  if (addMatch) {
    const interactionId = addMatch[1];
    const index = parseInt(addMatch[2]);
    const aspectText = getCachedAspect(interactionId, index);

    if (!aspectText) {
      await interaction.reply({ content: 'Suggestion expired. Run the command again.', ephemeral: true });
      return;
    }

    const sessionNum = await getLatestSessionNum();
    if (!sessionNum) {
      await interaction.reply({ content: 'No active session found.', ephemeral: true });
      return;
    }

    await createAspect(sessionNum, aspectText, 'scene');
    await interaction.reply({ content: `Added to scene: **"${aspectText}"**`, ephemeral: true });
    return;
  }

  // Clear confirmation button
  const clearMatch = id.match(/^aspect_clear_confirm_(\d+)$/);
  if (clearMatch) {
    const sessionNum = parseInt(clearMatch[1]);
    const { clearSessionAspects } = await import('./db/aspect-queries.js');
    const { aspectClearedEmbed } = await import('./embeds/aspect-embeds.js');

    const { removed, remaining } = await clearSessionAspects(sessionNum);
    const embed = aspectClearedEmbed(removed, remaining);

    // Update the ephemeral confirmation message
    await interaction.update({ content: null, embeds: [], components: [] });
    // Post public announcement
    await interaction.followUp({ embeds: [embed] });
    return;
  }

  if (id === 'aspect_clear_cancel') {
    await interaction.update({ content: 'Clear cancelled.', components: [], embeds: [] });
    return;
  }
}

// Graceful shutdown
async function shutdown() {
  console.log('Shutting down...');
  client.destroy();
  await pool.end();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

// Verify database connection, then start bot
async function main() {
  try {
    const res = await pool.query('SELECT 1');
    console.log('Database connected');
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }

  await client.login(config.discord.token);
}

main();
