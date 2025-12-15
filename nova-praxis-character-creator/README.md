# Nova Praxis Character Creator

An interactive web application for creating characters in Nova Praxis FATE.

## Features

- Step-by-step character creation wizard
- Automatic calculation of Rep, Stress, and other derived stats
- Skill allocation with validation
- Sleeve builder with augmentation budget tracking
- Export to Obsidian-formatted markdown
- Printable character sheets
- Save/load characters from browser storage

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── lib/
│   ├── data/           # Game data (skills, houses, sleeves, etc.)
│   ├── stores/         # Svelte stores for character state
│   ├── components/     # Reusable UI components
│   └── utils/          # Helper functions
├── routes/
│   ├── +layout.svelte  # Main layout
│   └── +page.svelte    # Character creator page
└── app.html            # HTML template
```

## License

For personal use with Nova Praxis campaign.
