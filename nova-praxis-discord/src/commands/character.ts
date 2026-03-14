import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
} from 'discord.js';
import { getCharacter, listCharacters, upsertCharacter } from '../db/queries.js';
import { characterEmbed, characterSkillsEmbed } from '../embeds/character.js';

export const data = new SlashCommandBuilder()
  .setName('character')
  .setDescription('Character management')
  .addSubcommand((sub) =>
    sub
      .setName('show')
      .setDescription('Show a character sheet')
      .addStringOption((opt) =>
        opt.setName('name').setDescription('Character name').setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName('skills')
      .setDescription('Show a character\'s skills')
      .addStringOption((opt) =>
        opt.setName('name').setDescription('Character name').setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName('import')
      .setDescription('Import a character from JSON file')
      .addAttachmentOption((opt) =>
        opt.setName('file').setDescription('Character JSON file').setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub.setName('list').setDescription('List all characters')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case 'show': {
      const name = interaction.options.getString('name', true);
      const char = await getCharacter(name);
      if (!char) {
        await interaction.reply({ content: `Character "${name}" not found.`, ephemeral: true });
        return;
      }
      await interaction.reply({ embeds: [characterEmbed(char)] });
      break;
    }

    case 'skills': {
      const name = interaction.options.getString('name', true);
      const char = await getCharacter(name);
      if (!char) {
        await interaction.reply({ content: `Character "${name}" not found.`, ephemeral: true });
        return;
      }
      await interaction.reply({ embeds: [characterSkillsEmbed(char)] });
      break;
    }

    case 'import': {
      const attachment = interaction.options.getAttachment('file', true);

      if (!attachment.name?.endsWith('.json')) {
        await interaction.reply({ content: 'Please upload a .json file.', ephemeral: true });
        return;
      }

      try {
        const response = await fetch(attachment.url);
        const raw = await response.text();
        const parsed = JSON.parse(raw);
        const character = parsed.character || parsed;
        const name = character.name;

        if (!name) {
          await interaction.reply({ content: 'Invalid character JSON: no name field.', ephemeral: true });
          return;
        }

        // Strip portrait
        const { portrait, ...data } = character;

        await upsertCharacter(name, data, interaction.user.id);
        await interaction.reply({
          content: `Imported **${name}** (${(data.characterState || 'unknown').toUpperCase()}, House ${(data.houseAffiliation || 'none')})`,
        });
      } catch (err) {
        await interaction.reply({
          content: `Failed to import: ${err instanceof Error ? err.message : 'unknown error'}`,
          ephemeral: true,
        });
      }
      break;
    }

    case 'list': {
      const chars = await listCharacters();
      if (chars.length === 0) {
        await interaction.reply({ content: 'No characters imported yet.', ephemeral: true });
        return;
      }
      const list = chars.map((c) => `- **${c.name}**`).join('\n');
      await interaction.reply({ content: `**Characters:**\n${list}` });
      break;
    }
  }
}
