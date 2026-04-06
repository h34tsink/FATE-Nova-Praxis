import 'dotenv/config';

export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN!,
    guildId: process.env.DISCORD_GUILD_ID!,
    gmRoleName: process.env.GM_ROLE_NAME || 'GM',
  },
  db: {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER || 'nova',
    password: process.env.PGPASSWORD || 'changeme',
    database: process.env.PGDATABASE || 'nova_praxis',
  },
  vaultPath: process.env.VAULT_PATH || '/vault',
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  },
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://host.docker.internal:11434',
    model: process.env.OLLAMA_MODEL || 'gemma4:31b',
  },
};
