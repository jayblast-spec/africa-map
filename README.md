# UN Equal Earth Map of Africa

An interactive web map showcasing Africa's true geographical size and proportions using the UN Equal Earth projection. Built with Vite, React, TypeScript, and MapLibre GL.

**Live Demo:** [Visit the Map](https://africa-map-sepia.vercel.app) 🌍 (Live on Vercel)

## About

This is a **production-grade, open-source interactive map** of Africa built on the UN's Equal Earth projection. It demonstrates Africa's true geographical size and land area, correcting centuries of cartographic distortion caused by the Mercator projection.

**Why this matters:** Traditional maps (Mercator projection) shrink Africa from 30.4 million km² to visual sizes comparable to Greenland or Russia. The Equal Earth projection restores accurate area representation, enabling fact-based geography for education, policy, and real-world applications.

**Mission:** This map serves as foundational infrastructure for GPS, navigation, educational platforms, and organizations working with geographic data. All code is open-source and free to use.

### Key Features

- **Equal Earth Projection**: Accurate area representation for all countries
- **Projection Toggle**: Switch between Equal Earth and Mercator projections
- **Time-Series Slider**: Explore data across decades (1950-2026, 5-year intervals)
- **Layer Controls**: Toggle visibility of population density, GDP, and infrastructure data
- **Interactive Legend**: Understand data scales and country measurements
- **3D Terrain**: Visualize elevation data for better geographical context
- **Mobile-Responsive**: Fully responsive design optimized for 375px to 1440px+ screens
- **Accessibility**: WCAG AA compliant with semantic HTML and keyboard navigation

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Map Engine**: MapLibre GL JS v6.11 with Equal Earth plugin
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/jayblast-spec/africa-map.git
cd africa-map

# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:5173
```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
africa-map/
├── src/
│   ├── components/           # React components
│   │   ├── MapContainer.tsx   # Main map container
│   │   ├── TimeSeriesSlider.tsx # Year selector (1950-2026)
│   │   ├── LayerControls.tsx  # Population, GDP, Infrastructure toggles
│   │   ├── Legend.tsx         # Data scales and country areas
│   │   └── ProjectionToggle.tsx # Projection switcher
│   ├── hooks/                # Custom React hooks
│   │   ├── useMapInstance.ts  # MapLibre GL initialization
│   │   ├── useProjection.ts   # Projection state management
│   │   ├── useTerrainLayer.ts # 3D terrain layer management
│   │   └── useDataLayers.ts   # Data layer lifecycle management
│   ├── lib/                  # Utility libraries
│   │   ├── dataLoader.ts      # GeoJSON loading and layer management
│   │   ├── projections.ts     # Projection switching logic
│   │   └── terrainLoader.ts   # Terrain data fetching
│   ├── types/                # TypeScript type definitions
│   │   └── data.ts           # Data layer interfaces
│   ├── App.tsx               # Main app component
│   └── index.tsx             # React entry point
├── public/                   # Static assets (data, tiles, etc.)
├── dist/                     # Production build output
├── vercel.json              # Vercel deployment configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## Usage

### Basic Map Interaction

1. **Explore**: Drag to pan, scroll to zoom
2. **Switch Projections**: Click the projection toggle button (top-right)
3. **View Time Series**: Use the year slider at the bottom to explore historical data
4. **Toggle Layers**: Click the "Layers" panel to show/hide data overlays
5. **Understand Data**: Click the legend to expand and read about each data layer

### Keyboard Navigation

- **Tab**: Navigate between controls
- **Enter/Space**: Activate buttons and toggle controls
- **Arrow Keys**: Adjust slider values (when focused)

## Data Sources

- **Boundaries**: Natural Earth (countries, admin borders)
- **Terrain**: AWS Elevation Data (NOAA ETOPO1 Digital Elevation Model)
- **Population**: UN World Population Prospects (1950-2026 estimates)
- **GDP**: World Bank Open Data
- **Infrastructure**: OpenStreetMap (ports, airports, roads)

## Responsive Design

The application is fully responsive and tested at:

- **Mobile** (375px): Optimized touch interface with collapsible panels
- **Tablet** (768px-1024px): Balanced layout with side panels
- **Desktop** (1440px+): Full feature UI with expanded controls

All components adapt dynamically to viewport changes.

## Accessibility

- **WCAG AA Compliant**: Tested with accessibility validators
- **Color Contrast**: All text meets WCAG AA standards (4.5:1 minimum)
- **Semantic HTML**: Proper heading hierarchy and landmark roles
- **ARIA Labels**: Interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard accessibility
- **Reduced Motion**: Respects prefers-reduced-motion preference

## Performance

- **Bundle Size**: ~324 kB gzipped (well under 2MB)
- **Build Time**: ~32 seconds (Vite optimized)
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Tile Caching**: 1-year cache for map tile assets

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally: `npm run dev`
3. Build to verify: `npm run build`
4. Commit with descriptive message
5. Push and open a pull request

### Code Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint configuration (with recommended React rules)
- **Formatting**: Prettier integration
- **Testing**: Unit and integration test coverage for utilities

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Configure build:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy (automatic on push to main)

```bash
# Manual deployment (requires Vercel CLI)
npm install -g vercel
vercel --prod
```

### Environment Variables

No environment variables are required for deployment. All map data is bundled with the application.

## Troubleshooting

### Map not loading?
- Check browser console for errors
- Verify internet connection (for tile server)
- Clear browser cache and reload

### Terrain layer missing?
- AWS elevation tiles may be loading slowly
- Try zooming in/out to refresh tile requests
- Check network tab in browser DevTools

### Performance issues?
- Reduce visible layers
- Close browser tabs consuming memory
- Update graphics drivers

## License

This project is open source and available under the MIT License.

## Attribution

- **Map Data**: OpenStreetMap contributors, Natural Earth Data
- **Terrain**: NOAA ETOPO1
- **Projection**: UN Equal Earth Plugin
- **Icons & Assets**: System icons, Tailwind CSS defaults

## Contact & Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: Support via repository contact
