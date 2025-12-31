// Динамика объектов
export function applyGravity(obj, gravity) {
    if (obj === null) {
        throw new ReferenceError('applyGravity: obj is null');
    }
    if (gravity === null) {
        throw new ReferenceError('applyGravity: gravity is null');
    }
    if (typeof obj.velocityY !== 'number') {
        throw new TypeError('applyGravity: obj.velocityY is not a number');
    }
    if (typeof gravity !== 'number') {
        throw new TypeError('applyGravity: gravity is not a number');
    }
    obj.velocityY += gravity;
}

export function applyFriction(obj, friction) {
    if (obj === null) {
        throw new ReferenceError('applyFriction: obj is null');
    }
    if (friction === null) {
        throw new ReferenceError('applyFriction: friction is null');
    }
    if (typeof obj.velocityX !== 'number' || typeof obj.velocityY !== 'number' || typeof friction !== 'number') {
        throw new TypeError('applyFriction: obj.velocityX, obj.velocityY, or friction is not a number');
    }
    try {
        obj.velocityX *= friction;
        obj.velocityY *= friction;
    } catch (error) {
        throw new Error(`applyFriction: unable to apply friction to obj: ${error.message}`);
    }
}
