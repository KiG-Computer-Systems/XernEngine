// Обработка столкновений
export function checkCollision(objA, objB) {
    // Простая проверка пересечения прямоугольников
    return objA.x < objB.x + objB.width &&
           objA.x + objA.width > objB.x &&
           objA.y < objB.y + objB.height &&
           objA.y + objA.height > objB.y;
}

export function resolveCollision(objA, objB) {
    // Простая логика разрешения столкновений
    if (checkCollision(objA, objB)) {
        objA.velocity.x = 0;
        objA.velocity.y = 0;
    }
}