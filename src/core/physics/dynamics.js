// Динамика объектов
export function applyGravity(obj, gravity) {
    obj.velocityY += gravity;
}

export function applyFriction(obj, friction) {
    obj.velocityX *= friction;
    obj.velocityY *= friction;
}