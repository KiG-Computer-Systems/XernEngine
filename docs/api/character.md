# Character API

The `Character` class represents a game character with position, sprite, health, and scripting capabilities.

## Import

```javascript
import { Character } from './xernengine.js';
```

## Constructor

```javascript
const character = new Character(name, sprite);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Character name |
| `sprite` | `Object` | Sprite object with x, y, draw() |

**Throws:**
- `TypeError` if name is not a valid string
- `TypeError` if sprite is not a valid object

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | - | Character name |
| `sprite` | `Object` | - | Associated sprite |
| `x` | `number` | 0 | X position |
| `y` | `number` | 0 | Y position |
| `health` | `number` | 100 | Current health |
| `scripts` | `Array` | [] | Attached behavior scripts |

## Methods

### update(deltaTime)

Updates the character and runs all scripts.

```javascript
character.update(deltaTime);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `deltaTime` | `number` | Time since last frame (ms) |

---

### draw(context)

Renders the character's sprite.

```javascript
character.draw(ctx);
```

---

### addScript(script)

Adds a behavior script.

```javascript
character.addScript((char, dt) => {
    // Move right
    char.x += 100 * (dt / 1000);
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `script` | `Function` | Script function(character, deltaTime) |

---

### setPosition(x, y)

Sets character position.

```javascript
character.setPosition(100, 200);
```

## Examples

### Basic Character

```javascript
import { Character } from './xernengine.js';

// Create sprite object
const sprite = {
    x: 0,
    y: 0,
    width: 32,
    height: 48,
    image: playerImage,
    
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
};

// Create character
const player = new Character('Hero', sprite);
player.setPosition(100, 100);

// Add to scene
scene.addEntity(player);
```

### Custom Character Class

```javascript
class Player extends Character {
    constructor(sprite) {
        super('Player', sprite);
        
        this.speed = 200;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.inventory = [];
        this.isInvulnerable = false;
        
        // Velocity
        this.vx = 0;
        this.vy = 0;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        const dt = deltaTime / 1000;
        
        // Apply velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Update sprite position
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        
        // Reset velocity
        this.vx = 0;
        this.vy = 0;
    }
    
    moveUp() { this.vy = -this.speed; }
    moveDown() { this.vy = this.speed; }
    moveLeft() { this.vx = -this.speed; }
    moveRight() { this.vx = this.speed; }
    
    takeDamage(amount) {
        if (this.isInvulnerable) return;
        
        this.health -= amount;
        this.flashRed();
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }
    
    die() {
        globalEvents.emit('player-death', this);
    }
    
    flashRed() {
        this.isInvulnerable = true;
        setTimeout(() => {
            this.isInvulnerable = false;
        }, 1000);
    }
}
```

### Enemy Character

```javascript
class Enemy extends Character {
    constructor(type, sprite, target) {
        super(type, sprite);
        
        this.target = target;
        this.speed = 80;
        this.health = 30;
        this.damage = 10;
        this.attackRange = 40;
        this.attackCooldown = 0;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        const dt = deltaTime / 1000;
        this.attackCooldown -= deltaTime;
        
        if (this.target) {
            this.moveTowardsTarget(dt);
            this.checkAttack();
        }
        
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }
    
    moveTowardsTarget(dt) {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.attackRange) {
            this.x += (dx / distance) * this.speed * dt;
            this.y += (dy / distance) * this.speed * dt;
        }
    }
    
    checkAttack() {
        if (this.attackCooldown > 0) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.attackRange) {
            this.attack();
            this.attackCooldown = 1000;
        }
    }
    
    attack() {
        if (this.target.takeDamage) {
            this.target.takeDamage(this.damage);
        }
    }
    
    die() {
        this.active = false;
        globalEvents.emit('enemy-death', this);
    }
}
```

### Character with Scripts

```javascript
// Create character
const npc = new Character('Guard', npcSprite);
npc.setPosition(200, 150);

// Add patrol behavior
let patrolDirection = 1;
npc.addScript((char, dt) => {
    char.x += 50 * patrolDirection * (dt / 1000);
    
    if (char.x > 400) patrolDirection = -1;
    if (char.x < 100) patrolDirection = 1;
});

// Add player detection
npc.addScript((char, dt) => {
    const dx = player.x - char.x;
    const dy = player.y - char.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
        // Player detected!
        char.alert = true;
    }
});

// Add sprite update
npc.addScript((char, dt) => {
    char.sprite.x = char.x;
    char.sprite.y = char.y;
});
```

### Animated Character

```javascript
class AnimatedCharacter extends Character {
    constructor(name, spriteSheet, frameWidth, frameHeight) {
        const sprite = {
            x: 0,
            y: 0,
            image: spriteSheet,
            frameWidth,
            frameHeight,
            currentFrame: 0,
            
            draw(ctx) {
                const sx = this.currentFrame * this.frameWidth;
                ctx.drawImage(
                    this.image,
                    sx, 0, this.frameWidth, this.frameHeight,
                    this.x, this.y, this.frameWidth, this.frameHeight
                );
            }
        };
        
        super(name, sprite);
        
        this.animator = new AnimationController();
        this.facing = 1;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        this.animator.update(deltaTime);
        
        const frame = this.animator.getCurrentFrame();
        if (frame) {
            this.sprite.currentFrame = frame.x / this.sprite.frameWidth;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.facing, 1);
        
        const frame = this.animator.getCurrentFrame();
        if (frame) {
            ctx.drawImage(
                this.sprite.image,
                frame.x, frame.y, frame.width, frame.height,
                -frame.width / 2, -frame.height / 2, frame.width, frame.height
            );
        }
        
        ctx.restore();
    }
}
```

## Related

- [Scene API](scene.md)
- [Animation API](animation.md)
- [Physics API](physics.md)
