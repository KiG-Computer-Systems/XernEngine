# Animation API

XernEngine provides a flexible animation system for sprite animations.

## Import

```javascript
import { Animation, AnimationController } from './xernengine.js';
```

## Animation Class

Represents a single animation sequence.

### Constructor

```javascript
const walkAnimation = new Animation(name, frames, frameRate, loop);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | - | Animation identifier |
| `frames` | `Array` | - | Array of frame objects |
| `frameRate` | `number` | 12 | Frames per second |
| `loop` | `boolean` | true | Whether to loop |

### Frame Object

```javascript
{
    x: 0,       // X position in sprite sheet
    y: 0,       // Y position in sprite sheet
    width: 32,  // Frame width
    height: 32  // Frame height
}
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Animation name |
| `frames` | `Array` | Frame data |
| `frameRate` | `number` | Frames per second |
| `loop` | `boolean` | Loop enabled |
| `currentFrame` | `number` | Current frame index |
| `playing` | `boolean` | Is animation playing |
| `onComplete` | `Function` | Callback when animation ends |

### Methods

#### play()

Starts the animation from the beginning.

```javascript
animation.play();
```

#### stop()

Stops the animation.

```javascript
animation.stop();
```

#### pause()

Pauses the animation.

```javascript
animation.pause();
```

#### resume()

Resumes a paused animation.

```javascript
animation.resume();
```

#### update(deltaTime)

Updates the animation.

```javascript
animation.update(deltaTime);
```

#### getCurrentFrame()

Returns the current frame data.

```javascript
const frame = animation.getCurrentFrame();
// { x: 64, y: 0, width: 32, height: 32 }
```

## AnimationController Class

Manages multiple animations for an entity.

### Constructor

```javascript
const animator = new AnimationController();
```

### Methods

#### add(animation)

Adds an animation.

```javascript
animator.add(walkAnimation);
animator.add(runAnimation);
animator.add(attackAnimation);
```

#### create(name, frames, frameRate, loop)

Creates and adds an animation.

```javascript
animator.create('walk', walkFrames, 10, true);
```

#### play(name, force)

Plays an animation by name.

```javascript
animator.play('walk');

// Force restart even if already playing
animator.play('walk', true);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | - | Animation name |
| `force` | `boolean` | false | Force restart |

#### stop()

Stops the current animation.

```javascript
animator.stop();
```

#### update(deltaTime)

Updates the current animation.

```javascript
animator.update(deltaTime);
```

#### getCurrentFrame()

Gets the current frame of the active animation.

```javascript
const frame = animator.getCurrentFrame();
```

#### createFromSpriteSheet(frameWidth, frameHeight, config)

Creates animations from a sprite sheet configuration.

```javascript
animator.createFromSpriteSheet(32, 32, {
    idle: { row: 0, count: 4, frameRate: 8 },
    walk: { row: 1, count: 6, frameRate: 12 },
    run: { row: 2, count: 8, frameRate: 16 },
    attack: { row: 3, count: 6, frameRate: 20, loop: false },
    die: { row: 4, count: 10, frameRate: 15, loop: false }
});
```

**Config Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `row` | `number` | - | Row in sprite sheet |
| `count` | `number` | - | Number of frames |
| `frameRate` | `number` | 12 | Frames per second |
| `loop` | `boolean` | true | Loop animation |
| `startCol` | `number` | 0 | Starting column |

## Examples

### Basic Animated Sprite

```javascript
class AnimatedSprite {
    constructor(image, frameWidth, frameHeight) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        
        this.animator = new AnimationController();
    }
    
    addAnimation(name, row, frameCount, frameRate, loop = true) {
        const frames = [];
        for (let i = 0; i < frameCount; i++) {
            frames.push({
                x: i * this.frameWidth,
                y: row * this.frameHeight,
                width: this.frameWidth,
                height: this.frameHeight
            });
        }
        this.animator.create(name, frames, frameRate, loop);
    }
    
    play(name) {
        this.animator.play(name);
    }
    
    update(deltaTime) {
        this.animator.update(deltaTime);
    }
    
    draw(ctx) {
        const frame = this.animator.getCurrentFrame();
        if (!frame) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scaleX, this.scaleY);
        
        ctx.drawImage(
            this.image,
            frame.x, frame.y, frame.width, frame.height,
            -frame.width / 2, -frame.height / 2, frame.width, frame.height
        );
        
        ctx.restore();
    }
}

// Usage
const playerSprite = new AnimatedSprite(playerImage, 32, 32);
playerSprite.addAnimation('idle', 0, 4, 8);
playerSprite.addAnimation('walk', 1, 6, 12);
playerSprite.addAnimation('attack', 2, 8, 20, false);

playerSprite.play('idle');
```

### Player with Animation States

```javascript
class Player {
    constructor(spriteSheet) {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = 200;
        this.facing = 1; // 1 = right, -1 = left
        
        this.spriteSheet = spriteSheet;
        this.animator = new AnimationController();
        
        // Setup animations
        this.animator.createFromSpriteSheet(32, 48, {
            idle: { row: 0, count: 4, frameRate: 8 },
            walk: { row: 1, count: 6, frameRate: 12 },
            jump: { row: 2, count: 4, frameRate: 10, loop: false },
            fall: { row: 3, count: 2, frameRate: 8 },
            attack: { row: 4, count: 6, frameRate: 20, loop: false }
        });
        
        // Animation complete handlers
        this.animator.animations.get('attack').onComplete = () => {
            this.isAttacking = false;
        };
        
        this.state = 'idle';
        this.isGrounded = true;
        this.isAttacking = false;
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        
        // Apply velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Determine animation state
        this.updateAnimationState();
        
        // Update animation
        this.animator.update(deltaTime);
        
        // Update facing direction
        if (this.vx > 0) this.facing = 1;
        else if (this.vx < 0) this.facing = -1;
    }
    
    updateAnimationState() {
        if (this.isAttacking) {
            this.setState('attack');
        } else if (!this.isGrounded) {
            if (this.vy < 0) {
                this.setState('jump');
            } else {
                this.setState('fall');
            }
        } else if (Math.abs(this.vx) > 10) {
            this.setState('walk');
        } else {
            this.setState('idle');
        }
    }
    
    setState(state) {
        if (this.state !== state) {
            this.state = state;
            this.animator.play(state);
        }
    }
    
    attack() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.animator.play('attack', true);
        }
    }
    
    draw(ctx) {
        const frame = this.animator.getCurrentFrame();
        if (!frame) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.facing, 1); // Flip horizontally based on facing
        
        ctx.drawImage(
            this.spriteSheet,
            frame.x, frame.y, frame.width, frame.height,
            -frame.width / 2, -frame.height / 2, frame.width, frame.height
        );
        
        ctx.restore();
    }
}
```

### Animation Events

```javascript
// Set up animation with completion callback
const attackAnim = animator.animations.get('attack');
attackAnim.onComplete = () => {
    // Called when non-looping animation finishes
    console.log('Attack animation complete');
    player.isAttacking = false;
    player.canMove = true;
};

// Death animation with callback
const deathAnim = animator.animations.get('die');
deathAnim.onComplete = () => {
    // Show game over screen
    gameOver();
};
```

### Sprite Sheet Layout

Typical sprite sheet organization:

```
Row 0: Idle      [frame0][frame1][frame2][frame3]
Row 1: Walk      [frame0][frame1][frame2][frame3][frame4][frame5]
Row 2: Run       [frame0][frame1][frame2][frame3][frame4][frame5][frame6][frame7]
Row 3: Jump      [frame0][frame1][frame2][frame3]
Row 4: Attack    [frame0][frame1][frame2][frame3][frame4][frame5]
Row 5: Die       [frame0][frame1][frame2][frame3][frame4][frame5][frame6][frame7][frame8][frame9]
```

## Related

- [Rendering Guide](../guides/rendering.md)
- [Character API](character.md)
- [Sprite API](sprite.md)
