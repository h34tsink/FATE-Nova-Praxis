# Start Nova Praxis Discord Bot
# Run: powershell -File start-bot.ps1

Set-Location $PSScriptRoot

# Ensure PostgreSQL container is running
docker-compose up db -d

# Start the bot
npx tsx src/index.ts
