# Contributing to UN Equal Earth Map

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful, inclusive, and constructive in all interactions. We're committed to providing a welcoming environment for all contributors.

## How to Contribute

### Reporting Issues

1. **Check existing issues** to avoid duplicates
2. **Provide details**:
   - Description of the bug or feature request
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Browser/OS/device information
   - Screenshots if applicable

### Submitting Changes

1. **Fork the repository** on GitHub
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**:
   - Keep commits atomic and well-documented
   - Follow the code style (TypeScript, React conventions)
   - Add comments for complex logic
   - Update types and interfaces

4. **Test locally**:
   ```bash
   npm install  # if dependencies changed
   npm run dev  # test in development
   npm run build # verify production build
   ```

5. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new layer type"
   # Use conventional commits: feat:, fix:, docs:, style:, refactor:, test:, chore:
   ```

6. **Push to your fork and create a Pull Request**:
   - Provide a clear title and description
   - Link any related issues
   - Describe what changed and why

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Initial Setup

```bash
git clone https://github.com/yourusername/africa-map.git
cd africa-map
npm install
```

### Running the Development Server

```bash
npm run dev
# Navigate to http://localhost:5173
```

### Building for Production

```bash
npm run build  # Creates optimized dist/ directory
npm run preview # Preview the production build
```

## Code Style Guidelines

### TypeScript

- Use strict mode (enabled in tsconfig.json)
- Define interfaces for all data structures
- Avoid `any` type—use proper typing
- Export types from type definition files

Example:
```typescript
interface DataLayer {
  id: string;
  name: string;
  type: 'fill' | 'line' | 'circle';
  sourceUrl: string;
  color: string;
  opacity: number;
}
```

### React Components

- Use functional components with hooks
- Extract custom hooks for reusable logic
- Keep components focused on single responsibility
- Use memoization for performance-critical components
- Name components with PascalCase

Example:
```typescript
export function TimeSeriesSlider({ year, onYearChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  // ...
}
```

### CSS/Tailwind

- Prefer Tailwind utility classes
- Use mobile-first responsive design
- Define custom colors in tailwind.config.js if needed
- Maintain consistent spacing (4px baseline)

Example:
```typescript
<div className="w-full px-4 py-3 sm:px-6 hover:bg-gray-50 transition-colors">
```

### Component Organization

```
src/components/
├── MapContainer.tsx          # Main container (50+ lines)
├── TimeSeriesSlider.tsx      # Specific feature (50+ lines)
├── Legend.tsx                # Specific feature (50+ lines)
└── README.md                 # Component documentation
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `MapContainer.tsx`)
- **Hooks**: camelCase, prefix with `use` (e.g., `useProjection.ts`)
- **Utilities**: camelCase (e.g., `dataLoader.ts`)
- **Types**: File in types/ directory (e.g., `types/data.ts`)

## Commit Message Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style (formatting, semicolons, etc.)
- `refactor:` Code refactoring without changing behavior
- `test:` Adding or updating tests
- `chore:` Build, dependencies, tooling

Example:
```bash
git commit -m "feat: add time-series slider component

- Add TimeSeriesSlider component supporting 1950-2026 range
- Implement 5-year interval selection
- Add responsive button grid for desktop view"
```

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] **Development build runs** (`npm run dev`)
- [ ] **Production build succeeds** (`npm run build`)
- [ ] **Desktop view** (1024px+)
- [ ] **Tablet view** (768px-1024px)
- [ ] **Mobile view** (375px)
- [ ] **Map interactions** (pan, zoom, projection toggle)
- [ ] **Data layer toggles** (show/hide layers)
- [ ] **Accessibility** (keyboard navigation, screen reader)

### Browser Compatibility

Test on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Chrome (Android)
- Mobile Safari (iOS)

### Performance Testing

- Check bundle size: `npm run build` output
- Monitor network requests (DevTools Network tab)
- Test on slower networks (DevTools Throttling)

## Pull Request Process

1. **Title**: Clear, descriptive (under 70 characters)
2. **Description**: Explain what and why
3. **Checklist**:
   - [ ] Code follows style guidelines
   - [ ] Changes are tested (locally or with screenshots)
   - [ ] Documentation updated (README, comments)
   - [ ] No console errors or warnings
   - [ ] Mobile responsive design verified

4. **Example PR Template**:
   ```markdown
   ## Description
   Add TimeSeriesSlider component to allow users to explore data across decades.

   ## Changes
   - New TimeSeriesSlider component
   - Support for 1950-2026 range (5-year intervals)
   - Mobile and desktop UI variants

   ## Testing
   - [x] Development: `npm run dev` works
   - [x] Production: `npm run build` succeeds
   - [x] Mobile (375px): all controls visible
   - [x] Desktop (1024px+): all controls visible

   ## Screenshots
   [Mobile view screenshot]
   [Desktop view screenshot]
   ```

## Documentation

### Component Documentation

Add JSDoc comments to components and hooks:

```typescript
/**
 * Time-series slider for year selection
 * 
 * @component
 * @example
 * const [year, setYear] = useState(2020);
 * return <TimeSeriesSlider year={year} onYearChange={setYear} />
 * 
 * @param {TimeSeriesSliderProps} props - Component props
 * @returns {JSX.Element} Slider component
 */
export function TimeSeriesSlider({ year, onYearChange }: TimeSeriesSliderProps) {
```

### README Updates

- Document new features in README.md
- Update project structure section if files are added
- Add troubleshooting entries if new issues may arise

## Release Process

Releases are cut periodically by maintainers. Contributors don't need to worry about this—just focus on quality PRs.

## Getting Help

- **Questions**: GitHub Discussions
- **Issues**: Check GitHub Issues first
- **Documentation**: Read README.md and code comments

## Thank You!

Contributing takes time and effort. We appreciate every contribution, no matter how small. Thank you for helping make this project better!
