# Particle Systems Guide

Particle systems create visual effects like explosions, fire, smoke, and magic spells. XernEngine provides a flexible particle system.

## Import

```javascript
import { ParticleEmitter, ParticleEffects } from './xernengine.js';
```

## Quick Start

Use pre-built effects:

```javascript
// Create explosion at position
const explosion = ParticleEffects.explosion(100, 200);
explosion.start();

// Create fire effect
const fire = ParticleEffects.fire(400, 500);
fire.start();

// Create smoke
const smoke = ParticleEffects.smoke(300, 400);
smoke.start();

// Sparks
const sparks = ParticleEffects.sparks(200, 300);
sparks.start();
```

## Custom Emitter

Create a custom particle emitter:

```javascript
const emitter = new ParticleEmitter({
    x: 400,
    y: 300,
    
    // Pool settings
    maxParticles: 100,
    
    // Emission settings
    emissionRate: 20,        // Particles per second
    burst: 0,                // One-time burst count
    duration: -1,            // -1 = infinite
    
    // Particle settings
    life: { min: 500, max: 1000 },
    speed: { min: 50, max: 150 },
    angle: { min: 0, max: 360 },
    size: { start: 10, end: 0 },
    color: { start: '#ff6600', end: '#ffff00' },
    alpha: { start: 1, end: 0 },
    gravity: 200,
    rotation: { min: -180, max: 180 },
    spread: { x: 10, y: 10 },
    
    // Render settings
    blendMode: 'lighter',    // 'source-over' or 'lighter'
    shape: 'circle'          // 'circle', 'square', or 'image'
});

emitter.start();
```

## Configuration Options

### Emission

| Option | Type | Description |
|--------|------|-------------|
| `emissionRate` | `number` | Particles spawned per second |
| `burst` | `number` | Particles spawned immediately on start |
| `duration` | `number` | Emitter lifetime (-1 = infinite) |

### Particle Properties

| Option | Type | Description |
|--------|------|-------------|
| `life` | `{min, max}` | Particle lifetime in ms |
| `speed` | `{min, max}` | Initial speed |
| `angle` | `{min, max}` | Emission angle in degrees |
| `size` | `{start, end}` | Size interpolation |
| `color` | `{start, end}` | Color interpolation |
| `alpha` | `{start, end}` | Opacity interpolation |
| `gravity` | `number` | Vertical acceleration |
| `rotation` | `{min, max}` | Rotation speed |
| `spread` | `{x, y}` | Position randomization |

### Rendering

| Option | Type | Description |
|--------|------|-------------|
| `blendMode` | `string` | Canvas blend mode |
| `shape` | `string` | Particle shape |
| `image` | `Image` | Custom particle image |

## Examples

### Explosion Effect

```javascript
function createExplosion(x, y) {
    const explosion = new ParticleEmitter({
        x, y,
        maxParticles: 50,
        burst: 30,
        emissionRate: 0,
        duration: 100,
        
        life: { min: 200, max: 500 },
        speed: { min: 100, max: 300 },
        angle: { min: 0, max: 360 },
        size: { start: 15, end: 0 },
        color: { start: '#ff6600', end: '#ffff00' },
        alpha: { start: 1, end: 0 },
        gravity: 200,
        blendMode: 'lighter'
    });
    
    explosion.start();
    particleSystems.push(explosion);
    
    // Camera shake
    camera.startShake(15, 300);
}
```

### Blood/Hit Effect

```javascript
function createBloodEffect(x, y, direction) {
    const blood = new ParticleEmitter({
        x, y,
        maxParticles: 20,
        burst: 15,
        emissionRate: 0,
        duration: 50,
        
        life: { min: 300, max: 600 },
        speed: { min: 50, max: 150 },
        angle: { min: direction - 45, max: direction + 45 },
        size: { start: 6, end: 2 },
        color: { start: '#cc0000', end: '#880000' },
        alpha: { start: 1, end: 0 },
        gravity: 400
    });
    
    blood.start();
    particleSystems.push(blood);
}
```

### Magic Trail

```javascript
function createMagicTrail(entity) {
    const trail = new ParticleEmitter({
        x: entity.x,
        y: entity.y,
        maxParticles: 50,
        emissionRate: 30,
        duration: -1,
        
        life: { min: 200, max: 400 },
        speed: { min: 10, max: 30 },
        angle: { min: 0, max: 360 },
        size: { start: 8, end: 0 },
        color: { start: '#00ffff', end: '#0066ff' },
        alpha: { start: 0.8, end: 0 },
        gravity: -50,
        blendMode: 'lighter'
    });
    
    trail.start();
    
    // Update position each frame
    entity.trailEmitter = trail;
}

// In update
entity.trailEmitter.x = entity.x;
entity.trailEmitter.y = entity.y;
```

### Rain Effect

```javascript
function createRain() {
    const rain = new ParticleEmitter({
        x: canvas.width / 2,
        y: -10,
        maxParticles: 500,
        emissionRate: 200,
        duration: -1,
        
        life: { min: 800, max: 1200 },
        speed: { min: 400, max: 600 },
        angle: { min: 85, max: 95 },
        size: { start: 2, end: 2 },
        color: { start: '#aaddff', end: '#aaddff' },
        alpha: { start: 0.6, end: 0.3 },
        gravity: 200,
        spread: { x: canvas.width, y: 0 },
        shape: 'square'
    });
    
    rain.start();
    return rain;
}
```

### Snow Effect

```javascript
function createSnow() {
    const snow = new ParticleEmitter({
        x: canvas.width / 2,
        y: -10,
        maxParticles: 200,
        emissionRate: 30,
        duration: -1,
        
        life: { min: 5000, max: 8000 },
        speed: { min: 20, max: 50 },
        angle: { min: 80, max: 100 },
        size: { start: 4, end: 4 },
        color: { start: '#ffffff', end: '#ffffff' },
        alpha: { start: 0.9, end: 0.5 },
        gravity: 10,
        rotation: { min: -90, max: 90 },
        spread: { x: canvas.width, y: 0 }
    });
    
    snow.start();
    return snow;
}
```

### Dust/Footstep Effect

```javascript
function createDustPuff(x, y) {
    const dust = new ParticleEmitter({
        x, y,
        maxParticles: 10,
        burst: 8,
        emissionRate: 0,
        duration: 50,
        
        life: { min: 300, max: 500 },
        speed: { min: 20, max: 50 },
        angle: { min: 200, max: 340 },
        size: { start: 5, end: 15 },
        color: { start: '#aa9977', end: '#887755' },
        alpha: { start: 0.6, end: 0 },
        gravity: -20
    });
    
    dust.start();
    particleSystems.push(dust);
}

// Call when player lands or runs
player.onLand = () => createDustPuff(player.x, player.y + player.height);
```

## Managing Particle Systems

```javascript
class ParticleManager {
    constructor() {
        this.systems = [];
    }
    
    add(emitter) {
        this.systems.push(emitter);
        return emitter;
    }
    
    update(deltaTime) {
        for (let i = this.systems.length - 1; i >= 0; i--) {
            const system = this.systems[i];
            system.update(deltaTime);
            
            // Remove completed systems
            if (system.isComplete()) {
                this.systems.splice(i, 1);
            }
        }
    }
    
    draw(ctx) {
        for (const system of this.systems) {
            system.draw(ctx);
        }
    }
    
    clear() {
        this.systems = [];
    }
    
    // Helper methods for common effects
    explosion(x, y, color = '#ff6600') {
        const emitter = ParticleEffects.explosion(x, y, color);
        emitter.start();
        return this.add(emitter);
    }
    
    fire(x, y) {
        const emitter = ParticleEffects.fire(x, y);
        emitter.start();
        return this.add(emitter);
    }
    
    smoke(x, y) {
        const emitter = ParticleEffects.smoke(x, y);
        emitter.start();
        return this.add(emitter);
    }
}

// Usage
const particles = new ParticleManager();

// Create effects
particles.explosion(enemy.x, enemy.y);
particles.fire(torch.x, torch.y);

// In game loop
particles.update(deltaTime);
particles.draw(ctx);
```

## Custom Particle Image

```javascript
const starImage = await loadImage('assets/star.png');

const starEmitter = new ParticleEmitter({
    x: 400,
    y: 300,
    maxParticles: 50,
    emissionRate: 10,
    
    life: { min: 1000, max: 2000 },
    speed: { min: 30, max: 80 },
    angle: { min: 0, max: 360 },
    size: { start: 20, end: 5 },
    alpha: { start: 1, end: 0 },
    rotation: { min: -180, max: 180 },
    
    shape: 'image',
    image: starImage,
    blendMode: 'lighter'
});
```

## Performance Tips

1. **Limit particle count**: Use appropriate `maxParticles`
2. **Use object pooling**: Built into `ParticleEmitter`
3. **Cull off-screen**: Particles outside view are still updated
4. **Reduce emission rate**: Lower rates still look good
5. **Use `lighter` blend sparingly**: More expensive than `source-over`

```javascript
// Debug: show particle count
ctx.fillText(`Particles: ${emitter.getParticleCount()}`, 10, 20);
```

## Related

- [ObjectPool API](../api/object-pool.md)
- [Rendering Guide](rendering.md)
- [Animation API](../api/animation.md)
