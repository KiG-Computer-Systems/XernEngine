# ObjectPool API

The `ObjectPool` class provides object pooling for performance optimization, reducing garbage collection by reusing objects.

## Import

```javascript
import { ObjectPool, BulletPool } from './xernengine.js';
```

## Constructor

```javascript
const pool = new ObjectPool(factory, reset, initialSize);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `factory` | `Function` | - | Function that creates new objects |
| `reset` | `Function` | (obj) => obj | Function that resets objects |
| `initialSize` | `number` | 10 | Initial pool size |

## Methods

### acquire()

Gets an object from the pool.

```javascript
const bullet = bulletPool.acquire();
```

**Returns:** Object from pool or newly created

---

### release(obj)

Returns an object to the pool.

```javascript
bulletPool.release(bullet);
```

---

### releaseAll()

Returns all active objects to the pool.

```javascript
pool.releaseAll();
```

---

### getStats()

Gets pool statistics.

```javascript
const stats = pool.getStats();
// { available: 8, active: 2, total: 10 }
```

---

### clear()

Clears the pool.

```javascript
pool.clear();
```

## BulletPool Class

Pre-configured pool for bullet objects.

```javascript
const bullets = new BulletPool(50);

// Spawn a bullet
const bullet = bullets.spawn(x, y, vx, vy, damage);
```

### spawn(x, y, vx, vy, damage)

Creates a bullet from the pool.

```javascript
const bullet = bullets.spawn(
    player.x,
    player.y,
    Math.cos(angle) * speed,
    Math.sin(angle) * speed,
    10
);
```

## Examples

### Basic Object Pool

```javascript
// Pool of particle objects
const particlePool = new ObjectPool(
    // Factory: create new particle
    () => ({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 1000,
        active: false
    }),
    // Reset: reinitialize particle
    (particle) => {
        particle.x = 0;
        particle.y = 0;
        particle.vx = 0;
        particle.vy = 0;
        particle.life = 0;
        particle.active = false;
        return particle;
    },
    // Initial size
    100
);

// Spawn particle
function spawnParticle(x, y, vx, vy) {
    const p = particlePool.acquire();
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.life = 0;
    p.active = true;
    particles.push(p);
    return p;
}

// Return particle to pool
function killParticle(particle) {
    particle.active = false;
    particlePool.release(particle);
}
```

### Enemy Pool

```javascript
class EnemyPool extends ObjectPool {
    constructor(initialSize = 20) {
        super(
            () => new Enemy(),
            (enemy) => {
                enemy.x = 0;
                enemy.y = 0;
                enemy.health = enemy.maxHealth;
                enemy.active = true;
                enemy.target = null;
                return enemy;
            },
            initialSize
        );
    }
    
    spawn(x, y, type, target) {
        const enemy = this.acquire();
        enemy.x = x;
        enemy.y = y;
        enemy.type = type;
        enemy.target = target;
        enemy.health = enemy.maxHealth;
        enemy.active = true;
        return enemy;
    }
}

// Usage
const enemyPool = new EnemyPool(50);

function spawnEnemy(x, y) {
    const enemy = enemyPool.spawn(x, y, 'basic', player);
    enemies.push(enemy);
    return enemy;
}

function onEnemyDeath(enemy) {
    const index = enemies.indexOf(enemy);
    if (index > -1) {
        enemies.splice(index, 1);
        enemyPool.release(enemy);
    }
}
```

### Bullet System

```javascript
class BulletSystem {
    constructor() {
        this.pool = new BulletPool(200);
        this.active = [];
    }
    
    shoot(x, y, angle, speed, damage) {
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        const bullet = this.pool.spawn(x, y, vx, vy, damage);
        this.active.push(bullet);
        
        return bullet;
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        
        for (let i = this.active.length - 1; i >= 0; i--) {
            const bullet = this.active[i];
            
            // Move bullet
            bullet.x += bullet.vx * dt;
            bullet.y += bullet.vy * dt;
            
            // Check bounds
            if (this.isOutOfBounds(bullet)) {
                this.remove(i);
                continue;
            }
            
            // Check collisions
            for (const enemy of enemies) {
                if (this.checkCollision(bullet, enemy)) {
                    enemy.takeDamage(bullet.damage);
                    this.remove(i);
                    break;
                }
            }
        }
    }
    
    remove(index) {
        const bullet = this.active[index];
        this.active.splice(index, 1);
        this.pool.release(bullet);
    }
    
    isOutOfBounds(bullet) {
        return bullet.x < -50 || bullet.x > canvas.width + 50 ||
               bullet.y < -50 || bullet.y > canvas.height + 50;
    }
    
    checkCollision(bullet, enemy) {
        return bullet.x > enemy.x && 
               bullet.x < enemy.x + enemy.width &&
               bullet.y > enemy.y && 
               bullet.y < enemy.y + enemy.height;
    }
    
    draw(ctx) {
        ctx.fillStyle = '#ffff00';
        for (const bullet of this.active) {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    clear() {
        this.active.forEach(b => this.pool.release(b));
        this.active = [];
    }
}

// Usage
const bulletSystem = new BulletSystem();

// Player shooting
if (mouse.isJustPressed(0)) {
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    bulletSystem.shoot(player.x, player.y, angle, 500, 10);
    audio.playSound('shoot');
}

// In game loop
bulletSystem.update(deltaTime);
bulletSystem.draw(ctx);
```

### Explosion Effect Pool

```javascript
class ExplosionPool extends ObjectPool {
    constructor() {
        super(
            () => ({
                x: 0,
                y: 0,
                radius: 0,
                maxRadius: 50,
                life: 0,
                maxLife: 300,
                active: false
            }),
            (exp) => {
                exp.x = 0;
                exp.y = 0;
                exp.radius = 0;
                exp.life = 0;
                exp.active = false;
                return exp;
            },
            30
        );
        
        this.active = [];
    }
    
    spawn(x, y, size = 50) {
        const exp = this.acquire();
        exp.x = x;
        exp.y = y;
        exp.radius = 0;
        exp.maxRadius = size;
        exp.life = 0;
        exp.maxLife = 300;
        exp.active = true;
        this.active.push(exp);
        return exp;
    }
    
    update(dt) {
        for (let i = this.active.length - 1; i >= 0; i--) {
            const exp = this.active[i];
            exp.life += dt;
            
            const progress = exp.life / exp.maxLife;
            exp.radius = exp.maxRadius * Math.sin(progress * Math.PI);
            
            if (exp.life >= exp.maxLife) {
                exp.active = false;
                this.active.splice(i, 1);
                this.release(exp);
            }
        }
    }
    
    draw(ctx) {
        for (const exp of this.active) {
            const progress = exp.life / exp.maxLife;
            const alpha = 1 - progress;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                exp.x, exp.y, 0,
                exp.x, exp.y, exp.radius
            );
            gradient.addColorStop(0, '#ffff00');
            gradient.addColorStop(0.3, '#ff6600');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
}

// Usage
const explosions = new ExplosionPool();

function createExplosion(x, y) {
    explosions.spawn(x, y, 60);
    camera.startShake(10, 200);
    audio.playSound('explosion');
}
```

## When to Use Object Pooling

**Good candidates for pooling:**
- Bullets/projectiles
- Particles
- Enemies that spawn frequently
- Visual effects
- Any object created/destroyed often

**Not needed for:**
- Single instance objects (player, camera)
- Objects created once at startup
- Objects that persist for the entire game

## Performance Tips

1. **Pre-allocate**: Create enough objects upfront
2. **Track stats**: Monitor pool usage to optimize size
3. **Reset properly**: Ensure objects are fully reset
4. **Don't over-pool**: Only pool frequently created objects

```javascript
// Monitor pool performance
setInterval(() => {
    const stats = bulletPool.getStats();
    console.log(`Bullets - Active: ${stats.active}, Available: ${stats.available}`);
}, 5000);
```

## Related

- [Particle Systems Guide](../guides/particles.md)
- [Performance Guide](../guides/optimization.md)
