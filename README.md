# Smart Palette Pro FX

A professional color palette generator web application that extracts colors from uploaded images and generates harmonious color palettes.

## Features

- **Image Upload**: Upload images to extract color palettes
- **Color Extraction**: Automatically extract dominant colors from images
- **Harmony Generator**: Generate harmonious color combinations
- **Palette Management**: Save and manage your favorite palettes
- **Image History**: Track uploaded images with thumbnails and details
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui components
- React Router for navigation
- Local storage for data persistence

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/varma9398/SMART.git
cd SMART
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages (manual)

## Deployment

### GitHub Pages (Automatic)

This project is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

1. Push your changes to the main branch
2. GitHub Actions will automatically build and deploy to `https://varma9398.github.io/SMART/`

### Manual Deployment

If you prefer to deploy manually:

```bash
npm run build
npm run deploy
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── ImageUpload.tsx # Image upload functionality
│   ├── PaletteDisplay.tsx # Color palette display
│   ├── HarmonyGenerator.tsx # Color harmony generation
│   ├── SavedPalettes.tsx # Saved palettes management
│   └── ImageHistory.tsx # Image upload history
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── lib/                # Library configurations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
