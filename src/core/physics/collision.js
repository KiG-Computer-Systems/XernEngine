// Обработка столкновений
export function checkCollision(objA, objB) {
    if (!objA || !objB) {
        throw new Error('Null pointer reference in checkCollision');
    }

    try {
        // Простая проверка пересечения прямоугольников
        return objA.x < objB.x + objB.width &&
               objA.x + objA.width > objB.x &&
               objA.y < objB.y + objB.height &&
               objA.y + objA.height > objB.y;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export function resolveCollision(objA, objB) {
    if (!objA || !objB) {
        throw new Error('Null pointer reference in resolveCollision');
    }

    try {
        if (checkCollision(objA, objB)) {
            objA.velocity.x = 0;
            objA.velocity.y = 0;
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}
