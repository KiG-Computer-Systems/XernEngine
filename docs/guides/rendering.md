# Rendering

XernEngine uses WebGL for hardware-accelerated rendering, but also supports Canvas 2D API for simpler games. This guide covers manual rendering techniques.

## Canvas 2D Basics

### Getting the Context

```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
```

### Clearing the Screen

```javascript
// Clear entire canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Or fill with a color
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

## Drawing Shapes

### Rectangles

```javascript
// Filled rectangle
ctx.fillStyle = '#3498db';
ctx.fillRect(x, y, width, height);

// Stroked rectangle
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 2;
ctx.strokeRect(x, y, width, height);
```

### Circles

```javascript
ctx.fillStyle = '#e74c3c';
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
ctx.fill();

// Stroked circle
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
ctx.stroke();
```

### Lines

```javascript
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.stroke();

// Multiple connected lines
ctx.beginPath();
ctx.moveTo(points[0].x, points[0].y);
for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
}
ctx.stroke();
```

### Polygons

```javascript
function drawPolygon(ctx, points, fillColor, strokeColor) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    
    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }
}

// Triangle
drawPolygon(ctx, [
    { x: 100, y: 50 },
    { x: 50, y: 150 },
    { x: 150, y: 150 }
], '#3498db', '#ffffff');
```

## Drawing Images (Sprites)

### Loading Images

```javascript
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Usage
const playerSprite = await loadImage('assets/player.png');
```

### Drawing Images

```javascript
// Basic draw
ctx.drawImage(image, x, y);

// Scaled draw
ctx.drawImage(image, x, y, width, height);

// Sprite sheet (draw portion of image)
ctx.drawImage(
    image,
    sourceX, sourceY, sourceWidth, sourceHeight,  // Source rectangle
    destX, destY, destWidth, destHeight           // Destination rectangle
);
```

### Sprite Class

```javascript
class Sprite {
    constructor(image, x = 0, y = 0) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = image.width;
        this.height = image.height;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.visible = true;
        
        // Anchor point (0-1)
        this.anchorX = 0;
        this.anchorY = 0;
    }
    
    draw(ctx) {
        if (!this.visible || this.alpha <= 0) return;
        
        ctx.save();
        
        // Apply alpha
        ctx.globalAlpha = this.alpha;
        
        // Transform
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        
        // Calculate offset based on anchor
        const offsetX = -this.width * this.anchorX;
        const offsetY = -this.height * this.anchorY;
        
        // Draw
        ctx.drawImage(this.image, offsetX, offsetY, this.width, this.height);
        
        ctx.restore();
    }
    
    // Center the anchor point
    centerAnchor() {
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }
}
```

## Sprite Sheets

### Drawing from a Sprite Sheet

```javascript
class SpriteSheet {
    constructor(image, frameWidth, frameHeight) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.columns = Math.floor(image.width / frameWidth);
        this.rows = Math.floor(image.height / frameHeight);
    }
    
    drawFrame(ctx, frameIndex, x, y, width = null, height = null) {
        const col = frameIndex % this.columns;
        const row = Math.floor(frameIndex / this.columns);
        
        const sx = col * this.frameWidth;
        const sy = row * this.frameHeight;
        
        ctx.drawImage(
            this.image,
            sx, sy, this.frameWidth, this.frameHeight,
            x, y, 
            width || this.frameWidth, 
            height || this.frameHeight
        );
    }
    
    drawFrameByCoord(ctx, col, row, x, y) {
        const sx = col * this.frameWidth;
        const sy = row * this.frameHeight;
        
        ctx.drawImage(
            this.image,
            sx, sy, this.frameWidth, this.frameHeight,
            x, y, this.frameWidth, this.frameHeight
        );
    }
}

// Usage
const spriteSheet = new SpriteSheet(playerImage, 32, 32);

// Draw frame 0 (top-left)
spriteSheet.drawFrame(ctx, 0, player.x, player.y);

// Draw frame at column 2, row 1
spriteSheet.drawFrameByCoord(ctx, 2, 1, player.x, player.y);
```

## Text Rendering

### Basic Text

```javascript
ctx.font = '24px Arial';
ctx.fillStyle = '#ffffff';
ctx.fillText('Hello World', x, y);

// Stroked text
ctx.strokeStyle = '#000000';
ctx.lineWidth = 2;
ctx.strokeText('Hello World', x, y);
```

### Centered Text

```javascript
function drawCenteredText(ctx, text, x, y, font = '24px Arial', color = '#ffffff') {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
}

// Center on screen
drawCenteredText(ctx, 'GAME OVER', canvas.width / 2, canvas.height / 2);
```

### Text with Shadow

```javascript
function drawTextWithShadow(ctx, text, x, y, font, color, shadowColor = '#000') {
    ctx.font = font;
    
    // Shadow
    ctx.fillStyle = shadowColor;
    ctx.fillText(text, x + 2, y + 2);
    
    // Main text
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}
```

## Transformations

### Save and Restore

Always use `save()` and `restore()` when applying transformations:

```javascript
ctx.save();

// Apply transformations
ctx.translate(x, y);
ctx.rotate(angle);
ctx.scale(scaleX, scaleY);

// Draw
ctx.fillRect(-width/2, -height/2, width, height);

ctx.restore(); // Restore previous state
```

### Rotation Around Center

```javascript
function drawRotated(ctx, image, x, y, angle) {
    ctx.save();
    
    // Move to center of where we want to draw
    ctx.translate(x + image.width / 2, y + image.height / 2);
    
    // Rotate
    ctx.rotate(angle);
    
    // Draw centered
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    
    ctx.restore();
}
```

### Flipping Sprites

```javascript
function drawFlippedHorizontally(ctx, image, x, y) {
    ctx.save();
    ctx.translate(x + image.width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
}

function drawFlippedVertically(ctx, image, x, y) {
    ctx.save();
    ctx.translate(x, y + image.height);
    ctx.scale(1, -1);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
}
```

## Layers and Z-Order

### Manual Layer System

```javascript
class RenderLayer {
    constructor(zIndex = 0) {
        this.zIndex = zIndex;
        this.items = [];
    }
    
    add(item) {
        this.items.push(item);
    }
    
    remove(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }
    
    draw(ctx) {
        this.items.forEach(item => item.draw(ctx));
    }
    
    clear() {
        this.items = [];
    }
}

class LayerManager {
    constructor() {
        this.layers = new Map();
    }
    
    createLayer(name, zIndex) {
        const layer = new RenderLayer(zIndex);
        this.layers.set(name, layer);
        return layer;
    }
    
    getLayer(name) {
        return this.layers.get(name);
    }
    
    draw(ctx) {
        // Sort layers by z-index
        const sorted = [...this.layers.values()]
            .sort((a, b) => a.zIndex - b.zIndex);
        
        sorted.forEach(layer => layer.draw(ctx));
    }
}

// Usage
const layers = new LayerManager();
layers.createLayer('background', 0);
layers.createLayer('entities', 10);
layers.createLayer('effects', 20);
layers.createLayer('ui', 100);

layers.getLayer('background').add(background);
layers.getLayer('entities').add(player);
layers.getLayer('effects').add(particles);
layers.getLayer('ui').add(healthBar);

// In render loop
layers.draw(ctx);
```

## Effects

### Alpha/Transparency

```javascript
ctx.globalAlpha = 0.5; // 50% transparent
ctx.drawImage(image, x, y);
ctx.globalAlpha = 1.0; // Reset
```

### Blend Modes

```javascript
// Additive blending (good for lights, particles)
ctx.globalCompositeOperation = 'lighter';
ctx.drawImage(lightImage, x, y);
ctx.globalCompositeOperation = 'source-over'; // Reset

// Available blend modes:
// 'source-over' (default), 'lighter', 'multiply', 'screen',
// 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn'
```

### Simple Gradient

```javascript
// Linear gradient
const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
gradient.addColorStop(0, '#ff0000');
gradient.addColorStop(0.5, '#00ff00');
gradient.addColorStop(1, '#0000ff');

ctx.fillStyle = gradient;
ctx.fillRect(x, y, width, height);

// Radial gradient
const radial = ctx.createRadialGradient(cx, cy, innerRadius, cx, cy, outerRadius);
radial.addColorStop(0, '#ffffff');
radial.addColorStop(1, 'transparent');

ctx.fillStyle = radial;
ctx.beginPath();
ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
ctx.fill();
```

## Performance Tips

1. **Batch similar operations** - Draw all sprites of the same type together
2. **Use off-screen canvas** - Pre-render complex graphics
3. **Minimize state changes** - Group by fill color, font, etc.
4. **Cull invisible objects** - Don't draw what's off-screen
5. **Use integer coordinates** - Avoid sub-pixel rendering when possible

```javascript
// Off-screen canvas for pre-rendering
const offscreen = document.createElement('canvas');
offscreen.width = 100;
offscreen.height = 100;
const offCtx = offscreen.getContext('2d');

// Pre-render complex graphic
offCtx.fillStyle = '#ff0000';
offCtx.beginPath();
// ... complex drawing ...
offCtx.fill();

// Use pre-rendered canvas as image
ctx.drawImage(offscreen, x, y);
```

## Next Steps

- [Animation System](../api/animation.md)
- [Camera](../api/camera.md)
- [Particle Systems](particles.md)
