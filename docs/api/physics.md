# Physics API

XernEngine provides basic 2D physics including collision detection and resolution.

## Import

```javascript
import { checkCollision, resolveCollision } from './xernengine.js';
```

## Functions

### checkCollision(objA, objB)

Checks for AABB (Axis-Aligned Bounding Box) collision between two objects.

```javascript
if (checkCollision(player, enemy)) {
    player.takeDamage(10);
}
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `objA` | `Object` | First object with x, y, width, height |
| `objB` | `Object` | Second object with x, y, width, height |

**Returns:** `boolean` - true if objects are colliding

**Throws:**
- `Error` if either object is null

---

### resolveCollision(objA, objB)

Resolves collision by stopping the first object's velocity.

```javascript
if (checkCollision(player, wall)) {
    resolveCollision(player, wall);
}
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `objA` | `Object` | Moving object with velocity |
| `objB` | `Object` | Static object |

## Object Requirements

Objects used with collision functions must have:

```javascript
const object = {
    x: 0,           // X position
    y: 0,           // Y position
    width: 32,      // Width
    height: 32,     // Height
    velocity: {     // For resolveCollision
        x: 0,
        y: 0
    }
};
```

## Custom Collision Detection

### Circle Collision

```javascript
function checkCircleCollision(a, b) {
    const dx = (a.x + a.radius) - (b.x + b.radius);
    const dy = (a.y + a.radius) - (b.y + b.radius);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < a.radius + b.radius;
}

// Usage
const bullet = { x: 100, y: 100, radius: 5 };
const enemy = { x: 120, y: 110, radius: 20 };

if (checkCircleCollision(bullet, enemy)) {
    enemy.takeDamage(bullet.damage);
}
```

### Circle vs Rectangle

```javascript
function circleRectCollision(circle, rect) {
    // Find closest point on rectangle to circle center
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    // Calculate distance
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < circle.radius;
}
```

### Point in Rectangle

```javascript
function pointInRect(px, py, rect) {
    return px >= rect.x && 
           px <= rect.x + rect.width &&
           py >= rect.y && 
           py <= rect.y + rect.height;
}

// Check if mouse is over button
if (pointInRect(mouse.x, mouse.y, button)) {
    button.hovered = true;
}
```

### Point in Circle

```javascript
function pointInCircle(px, py, circle) {
    const dx = px - circle.x;
    const dy = py - circle.y;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
}
```

## Advanced Physics

### Separating Axis Theorem (SAT) for AABB

```javascript
function getOverlap(a, b) {
    const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
    
    if (overlapX <= 0 || overlapY <= 0) {
        return null; // No collision
    }
    
    return { x: overlapX, y: overlapY };
}

function resolveAABB(moving, static) {
    const overlap = getOverlap(moving, static);
    if (!overlap) return;
    
    // Push out along smallest overlap axis
    if (overlap.x < overlap.y) {
        // Horizontal push
        if (moving.x < static.x) {
            moving.x -= overlap.x;
        } else {
            moving.x += overlap.x;
        }
        moving.velocity.x = 0;
    } else {
        // Vertical push
        if (moving.y < static.y) {
            moving.y -= overlap.y;
        } else {
            moving.y += overlap.y;
        }
        moving.velocity.y = 0;
    }
}
```

### Simple Physics Body

```javascript
class PhysicsBody {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        
        this.friction = 0.9;
        this.bounce = 0.5;
        this.mass = 1;
        this.isStatic = false;
    }
    
    applyForce(fx, fy) {
        this.ax += fx / this.mass;
        this.ay += fy / this.mass;
    }
    
    applyGravity(gravity = 980) {
        this.ay += gravity;
    }
    
    update(dt) {
        if (this.isStatic) return;
        
        // Apply acceleration
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        
        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Apply velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Reset acceleration
        this.ax = 0;
        this.ay = 0;
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}
```

### Collision Manager

```javascript
class CollisionManager {
    constructor() {
        this.bodies = [];
        this.staticBodies = [];
    }
    
    add(body) {
        if (body.isStatic) {
            this.staticBodies.push(body);
        } else {
            this.bodies.push(body);
        }
    }
    
    remove(body) {
        const arr = body.isStatic ? this.staticBodies : this.bodies;
        const index = arr.indexOf(body);
        if (index > -1) arr.splice(index, 1);
    }
    
    update(dt) {
        // Update all bodies
        this.bodies.forEach(body => body.update(dt));
        
        // Check collisions
        for (const body of this.bodies) {
            // vs static bodies
            for (const staticBody of this.staticBodies) {
                if (checkCollision(body, staticBody)) {
                    this.resolveCollision(body, staticBody);
                }
            }
            
            // vs other dynamic bodies
            for (const other of this.bodies) {
                if (body !== other && checkCollision(body, other)) {
                    this.resolveDynamicCollision(body, other);
                }
            }
        }
    }
    
    resolveCollision(moving, static) {
        const overlap = getOverlap(moving, static);
        if (!overlap) return;
        
        if (overlap.x < overlap.y) {
            if (moving.x < static.x) {
                moving.x -= overlap.x;
            } else {
                moving.x += overlap.x;
            }
            moving.vx *= -moving.bounce;
        } else {
            if (moving.y < static.y) {
                moving.y -= overlap.y;
            } else {
                moving.y += overlap.y;
            }
            moving.vy *= -moving.bounce;
        }
    }
    
    resolveDynamicCollision(a, b) {
        // Simple elastic collision
        const tempVx = a.vx;
        const tempVy = a.vy;
        
        a.vx = b.vx * a.bounce;
        a.vy = b.vy * a.bounce;
        
        b.vx = tempVx * b.bounce;
        b.vy = tempVy * b.bounce;
    }
}
```

## Platformer Physics

```javascript
class PlatformerBody extends PhysicsBody {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.isGrounded = false;
        this.jumpForce = -500;
        this.gravity = 1500;
        this.maxFallSpeed = 800;
    }
    
    update(dt) {
        // Apply gravity
        if (!this.isGrounded) {
            this.vy = Math.min(this.vy + this.gravity * dt, this.maxFallSpeed);
        }
        
        // Apply velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Reset grounded (will be set by collision)
        this.isGrounded = false;
    }
    
    jump() {
        if (this.isGrounded) {
            this.vy = this.jumpForce;
            this.isGrounded = false;
        }
    }
    
    onCollision(other, side) {
        if (side === 'bottom') {
            this.isGrounded = true;
            this.vy = 0;
        } else if (side === 'top') {
            this.vy = 0;
        } else if (side === 'left' || side === 'right') {
            this.vx = 0;
        }
    }
}

// Collision resolution with side detection
function resolvePlatformerCollision(player, platform) {
    const overlap = getOverlap(player, platform);
    if (!overlap) return;
    
    // Determine collision side
    const fromLeft = player.x + player.width / 2 < platform.x + platform.width / 2;
    const fromTop = player.y + player.height / 2 < platform.y + platform.height / 2;
    
    if (overlap.x < overlap.y) {
        // Horizontal collision
        if (fromLeft) {
            player.x -= overlap.x;
            player.onCollision(platform, 'right');
        } else {
            player.x += overlap.x;
            player.onCollision(platform, 'left');
        }
    } else {
        // Vertical collision
        if (fromTop) {
            player.y -= overlap.y;
            player.onCollision(platform, 'bottom');
        } else {
            player.y += overlap.y;
            player.onCollision(platform, 'top');
        }
    }
}
```

## Raycasting

```javascript
function raycast(origin, direction, maxDistance, obstacles) {
    const ray = {
        x: origin.x,
        y: origin.y,
        dx: direction.x,
        dy: direction.y
    };
    
    let closest = null;
    let closestDist = maxDistance;
    
    for (const obstacle of obstacles) {
        const hit = rayRectIntersection(ray, obstacle);
        if (hit && hit.distance < closestDist) {
            closest = { obstacle, point: hit.point, distance: hit.distance };
            closestDist = hit.distance;
        }
    }
    
    return closest;
}

function rayRectIntersection(ray, rect) {
    const tmin = (rect.x - ray.x) / ray.dx;
    const tmax = (rect.x + rect.width - ray.x) / ray.dx;
    
    const tymin = (rect.y - ray.y) / ray.dy;
    const tymax = (rect.y + rect.height - ray.y) / ray.dy;
    
    const t1 = Math.min(tmin, tmax);
    const t2 = Math.max(tmin, tmax);
    const t3 = Math.min(tymin, tymax);
    const t4 = Math.max(tymin, tymax);
    
    const tNear = Math.max(t1, t3);
    const tFar = Math.min(t2, t4);
    
    if (tNear > tFar || tFar < 0) return null;
    
    const t = tNear > 0 ? tNear : tFar;
    return {
        point: {
            x: ray.x + ray.dx * t,
            y: ray.y + ray.dy * t
        },
        distance: t
    };
}
```

## Related

- [Tilemap API](tilemap.md) - Tile-based collision
- [Vector2 API](vector2.md) - Vector math
- [Input Guide](../guides/input.md) - Player movement
