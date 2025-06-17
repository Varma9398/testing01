# Smart Palette Pro

A professional color palette generator web application that extracts beautiful color palettes from uploaded images.

## Features

- **Image Upload**: Upload images to extract color palettes
- **Color Extraction**: Automatically extract dominant colors and create palettes
- **Color Harmony Generator**: Generate harmonious color combinations
- **Image History**: Track and manage uploaded images with their extracted palettes
- **Saved Palettes**: Save and manage your favorite color palettes
- **Export Options**: Export palettes in various formats
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui Components
- React Router DOM

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

### Build

To build for production:
```bash
npm run build
```

## Deployment

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment (Recommended)

The project uses GitHub Actions for automatic deployment. Every push to the `main` branch will trigger a build and deployment to GitHub Pages.

### Manual Deployment

If you prefer manual deployment:

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

### GitHub Pages Setup

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the sidebar
3. Set the source to "GitHub Actions"
4. The site will be available at: `https://varma9398.github.io/SMART/`

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── utils/              # Utility functions
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push to your branch
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
