# ThoughtfulUI

A modern, enterprise-grade workflow editor with NLP capabilities and intuitive drag-and-drop functionality.

## Features

- Interactive workflow canvas with drag-and-drop functionality
- Custom node types with NLP analysis display
- Material-UI based modern interface
- State management with Zustand
- TypeScript support
- Enterprise-grade styling and UX

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # React components
├── features/          # Feature-specific components and logic
├── store/            # Zustand store definitions
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── services/         # API and service integrations
├── assets/           # Static assets
└── styles/           # Global styles and theme
```

## Technologies Used

- React
- TypeScript
- Vite
- ReactFlow
- Material-UI
- Zustand
- DND Kit

## Development

The project uses Vite as the build tool and development server. The main workflow editor is built using ReactFlow, which provides the canvas and node management functionality. The UI components are built using Material-UI for a consistent and modern look.

## License

MIT
