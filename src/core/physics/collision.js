// Collision detection between two axis-aligned rectangles
export function checkCollision(objA, objB) {
    if (!objA || !objB) {
        throw new Error("Null reference in checkCollision");
    }

    // Validate required properties
    const requiredProps = ["x", "y", "width", "height"];
    for (const prop of requiredProps) {
        if (typeof objA[prop] !== "number" || typeof objB[prop] !== "number") {
            throw new Error(`Missing or invalid property '${prop}' in objects`);
        }
    }

    return (
        objA.x < objB.x + objB.width &&
        objA.x + objA.width > objB.x &&
        objA.y < objB.y + objB.height &&
        objA.y + objA.height > objB.y
    );
}

// Collision resolution: stop or bounce
export function resolveCollision(objA, objB, options = { bounce: false }) {
    if (!objA || !objB) {
        throw new Error("Null reference in resolveCollision");
    }

    if (!objA.velocity || typeof objA.velocity.x !== "number" || typeof objA.velocity.y !== "number") {
        throw new Error("Object A missing velocity vector");
    }

    if (checkCollision(objA, objB)) {
        if (options.bounce) {
            // Simple bounce: invert velocity
            objA.velocity.x = -objA.velocity.x;
            objA.velocity.y = -objA.velocity.y;
        } else {
            // Stop movement
            objA.velocity.x = 0;
            objA.velocity.y = 0;
        }
    }
}
