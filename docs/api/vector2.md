# Vector2 API

The `Vector2` class provides 2D vector mathematics for positions, velocities, and directions.

## Import

```javascript
import { Vector2 } from './xernengine.js';
```

## Constructor

```javascript
const vec = new Vector2(x, y);
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `x` | `number` | 0 | X component |
| `y` | `number` | 0 | Y component |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | X component |
| `y` | `number` | Y component |

## Instance Methods

### Basic Operations

#### clone()

Creates a copy of the vector.

```javascript
const copy = vec.clone();
```

#### copy(v)

Copies values from another vector.

```javascript
vec.copy(otherVec);
```

#### set(x, y)

Sets both components.

```javascript
vec.set(100, 200);
```

### Arithmetic

#### add(v)

Adds another vector.

```javascript
const velocity = new Vector2(5, 0);
position.add(velocity);
```

#### sub(v)

Subtracts another vector.

```javascript
const direction = target.clone().sub(source);
```

#### mul(scalar)

Multiplies by a scalar.

```javascript
velocity.mul(2); // Double speed
```

#### div(scalar)

Divides by a scalar.

```javascript
velocity.div(2); // Half speed
```

### Length & Distance

#### length()

Gets the magnitude/length.

```javascript
const speed = velocity.length();
```

#### lengthSq()

Gets the squared length (faster, no sqrt).

```javascript
// Good for comparisons
if (vec.lengthSq() < 100 * 100) {
    // Within 100 units
}
```

#### distanceTo(v)

Distance to another vector.

```javascript
const dist = player.position.distanceTo(enemy.position);
```

#### distanceToSq(v)

Squared distance (faster).

```javascript
// Check if within range
if (player.distanceToSq(enemy) < 200 * 200) {
    // Within 200 units
}
```

### Normalization

#### normalize()

Normalizes to unit length (length = 1).

```javascript
direction.normalize();
// Now direction.length() === 1
```

#### normalized()

Returns a normalized copy.

```javascript
const unitDir = velocity.normalized();
```

### Products

#### dot(v)

Dot product.

```javascript
const dot = a.dot(b);
// dot > 0: same direction
// dot < 0: opposite direction
// dot = 0: perpendicular
```

#### cross(v)

2D cross product (returns scalar).

```javascript
const cross = a.cross(b);
// cross > 0: b is counter-clockwise from a
// cross < 0: b is clockwise from a
```

### Angles

#### angle()

Angle in radians.

```javascript
const angle = velocity.angle();
// Returns angle from positive X axis
```

#### angleTo(v)

Angle to another vector.

```javascript
const angleToTarget = position.angleTo(target);
```

### Transformations

#### rotate(angle)

Rotates the vector.

```javascript
velocity.rotate(Math.PI / 4); // Rotate 45 degrees
```

#### lerp(v, t)

Linear interpolation.

```javascript
// Move 10% towards target
position.lerp(target, 0.1);
```

#### reflect(normal)

Reflects off a surface.

```javascript
// Bounce off wall
const wallNormal = new Vector2(1, 0);
velocity.reflect(wallNormal);
```

#### clampLength(max)

Limits the maximum length.

```javascript
velocity.clampLength(maxSpeed);
```

#### negate()

Reverses direction.

```javascript
velocity.negate(); // Now pointing opposite
```

#### perpendicular()

Gets perpendicular vector.

```javascript
const perp = velocity.perpendicular();
```

### Comparison

#### equals(v)

Checks equality.

```javascript
if (pos1.equals(pos2)) {
    // Same position
}
```

### Conversion

#### toArray()

Converts to array.

```javascript
const [x, y] = vec.toArray();
```

#### toString()

String representation.

```javascript
console.log(vec.toString()); // "Vector2(10, 20)"
```

## Static Methods

### Vector2.fromAngle(angle, length)

Creates vector from angle.

```javascript
// Unit vector pointing up
const up = Vector2.fromAngle(-Math.PI / 2);

// Velocity at 45 degrees with speed 100
const vel = Vector2.fromAngle(Math.PI / 4, 100);
```

### Vector2.random(length)

Creates random direction vector.

```javascript
// Random unit vector
const randomDir = Vector2.random();

// Random velocity with speed 50
const randomVel = Vector2.random(50);
```

### Vector2.lerp(a, b, t)

Interpolates between two vectors.

```javascript
const midpoint = Vector2.lerp(start, end, 0.5);
```

### Vector2.add(a, b)

Adds two vectors (non-mutating).

```javascript
const sum = Vector2.add(v1, v2);
```

### Vector2.sub(a, b)

Subtracts two vectors (non-mutating).

```javascript
const diff = Vector2.sub(v1, v2);
```

## Static Constants

```javascript
Vector2.ZERO   // (0, 0)
Vector2.ONE    // (1, 1)
Vector2.UP     // (0, -1)
Vector2.DOWN   // (0, 1)
Vector2.LEFT   // (-1, 0)
Vector2.RIGHT  // (1, 0)
```

## Examples

### Movement

```javascript
class Entity {
    constructor() {
        this.position = new Vector2(100, 100);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.maxSpeed = 300;
    }
    
    update(dt) {
        // Apply acceleration
        this.velocity.add(this.acceleration.clone().mul(dt));
        
        // Limit speed
        this.velocity.clampLength(this.maxSpeed);
        
        // Apply velocity
        this.position.add(this.velocity.clone().mul(dt));
        
        // Reset acceleration
        this.acceleration.set(0, 0);
    }
    
    applyForce(force) {
        this.acceleration.add(force);
    }
}
```

### Seeking Behavior

```javascript
function seek(entity, target, maxSpeed, maxForce) {
    // Desired velocity
    const desired = Vector2.sub(target, entity.position);
    desired.normalize().mul(maxSpeed);
    
    // Steering = desired - current
    const steering = Vector2.sub(desired, entity.velocity);
    steering.clampLength(maxForce);
    
    entity.applyForce(steering);
}
```

### Shooting Towards Mouse

```javascript
function shootAt(shooter, targetX, targetY) {
    const target = new Vector2(targetX, targetY);
    const direction = Vector2.sub(target, shooter.position).normalize();
    
    const bullet = new Bullet();
    bullet.position = shooter.position.clone();
    bullet.velocity = direction.mul(bulletSpeed);
    
    return bullet;
}
```

### Orbiting

```javascript
class Orbiter {
    constructor(center, radius, speed) {
        this.center = center;
        this.radius = radius;
        this.angle = 0;
        this.speed = speed;
        this.position = new Vector2();
    }
    
    update(dt) {
        this.angle += this.speed * dt;
        
        this.position.x = this.center.x + Math.cos(this.angle) * this.radius;
        this.position.y = this.center.y + Math.sin(this.angle) * this.radius;
    }
}
```

### Collision Response

```javascript
function bounceOffWall(entity, wallNormal) {
    // Reflect velocity
    entity.velocity.reflect(wallNormal);
    
    // Optional: dampen bounce
    entity.velocity.mul(0.8);
}

// Usage
if (hitLeftWall) bounceOffWall(ball, Vector2.RIGHT);
if (hitRightWall) bounceOffWall(ball, Vector2.LEFT);
if (hitTopWall) bounceOffWall(ball, Vector2.DOWN);
if (hitBottomWall) bounceOffWall(ball, Vector2.UP);
```

### Smooth Following

```javascript
function smoothFollow(follower, target, smoothing, dt) {
    // Interpolate position towards target
    follower.position.lerp(target.position, smoothing * dt);
}

// Usage (call every frame)
smoothFollow(camera, player, 5, deltaTime);
```

## Related

- [Physics API](physics.md)
- [Camera API](camera.md)
- [Rendering Guide](../guides/rendering.md)
