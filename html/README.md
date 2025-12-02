# Loopzo Landing Page

Static landing page for Loopzo, an adaptive bicycle manufacturer based in the Netherlands.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build CSS:**
   ```bash
   npm run build:css
   ```

3. **Open the site:**
   ```bash
   open index.html
   ```

## Development

### Build Commands

- `npm run build:css` - Build production CSS (minified)
- `npm run watch:css` - Watch for changes and rebuild automatically

### Project Structure

```
loopzo/
├── index.html          # Main HTML file
├── src/
│   └── input.css      # Tailwind source + custom styles
├── dist/
│   └── output.css     # Compiled CSS (auto-generated)
├── assets/            # Images and logos
└── tailwind.config.js # Tailwind configuration
```

## Customization

### Colors
Edit CSS variables in `src/input.css` under the `:root` selector, then rebuild CSS.

### Styling
The site uses Tailwind CSS utility classes. Modify classes directly in `index.html`.

### Content
All content is in `index.html` - the site is a single-page application.

## Tech Stack

- HTML5
- Tailwind CSS v3
- Vanilla JavaScript (no framework)

## Browser Support

Modern browsers with CSS Grid and Flexbox support.
