# Installation Guide

## System Requirements

- **Node.js**: Version 16.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **WebGL**: Version 1.0 or 2.0 support

## Installation Methods

### Method 1: npm (Recommended)

```bash
# Create a new project directory
mkdir my-game
cd my-game

# Initialize npm project
npm init -y

# Install XernEngine
npm install xernengine
```

### Method 2: Clone from Repository

```bash
# Clone the repository
git clone https://github.com/your-repo/xernengine.git

# Navigate to directory
cd xernengine

# Install dependencies
npm install
```

### Method 3: Direct Download

Download the latest release from the releases page and extract to your project folder.

## Project Setup

### Basic Setup

1. Create your project structure:

```
my-game/
├── index.html
├── game.js
├── assets/
│   ├── images/
│   ├── audio/
│   └── data/
└── node_modules/
    └── xernengine/
```

2. Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My XernEngine Game</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        #gameCanvas {
            background: #1a1a2e;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <script type="module" src="game.js"></script>
</body>
</html>
```

3. Create `game.js`:

```javascript
import { 
    Engine, 
    Scene, 
    Renderer,
    Camera,
    logger 
} from './node_modules/xernengine/src/xernengine.js';

// Your game code here
logger.info('XernEngine initialized');
```

### Using Webpack

If you're using the built-in webpack configuration:

```bash
# Development mode with hot reload
npm start

# Production build
npm run build
```

## Verifying Installation

Create a simple test to verify everything works:

```javascript
import { VERSION, logger, LogLevel } from 'xernengine';

// Set log level
logger.setLevel(LogLevel.DEBUG);

// Log engine version
logger.info(`XernEngine v${VERSION} loaded successfully`);

// Test basic functionality
const canvas = document.getElementById('gameCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(10, 10, 100, 100);
    logger.info('Rendering test passed');
} else {
    logger.error('Canvas element not found');
}
```

If you see a green square and the console messages, XernEngine is working correctly!

## Development Tools

### Recommended IDE Setup

**VS Code / Cursor Extensions:**
- ESLint
- Prettier
- JavaScript (ES6) code snippets
- Live Server

### Browser DevTools

Enable these for debugging:
- Console (for logs)
- Performance (for profiling)
- Network (for asset loading)

## Troubleshooting

### "Module not found" Error

Ensure you're using ES6 modules:
```html
<script type="module" src="game.js"></script>
```

### CORS Errors

When loading assets locally, use a development server:
```bash
# Using npm
npm start

# Or using Python
python -m http.server 8080

# Or using Node
npx serve
```

### WebGL Context Lost

Handle context loss gracefully:
```javascript
canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    logger.warn('WebGL context lost');
});

canvas.addEventListener('webglcontextrestored', () => {
    logger.info('WebGL context restored');
    // Reinitialize resources
});
```

## Next Steps

- [Quick Start Guide](quickstart.md)
- [Project Structure](project-structure.md)
- [Your First Game](first-game.md)
