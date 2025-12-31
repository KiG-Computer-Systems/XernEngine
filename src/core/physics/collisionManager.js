// Менеджер столкновений
export class CollisionManager {
    constructor() {
        if (!this || !(this instanceof CollisionManager)) {
            throw new TypeError('Cannot call CollisionManager constructor as a function');
        }

        if (this.objects === null || typeof this.objects !== 'object') {
            throw new TypeError('CollisionManager objects must be an array');
        }

        this.objects = [];
    }

    addObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            throw new TypeError('CollisionManager objects must be an object');
        }

        if (this.objects.indexOf(obj) !== -1) {
            throw new Error('Object has already been added to CollisionManager');
        }

        try {
            this.objects.push(obj);
        } catch (error) {
            throw new Error(`Error adding object to CollisionManager: ${error.message}`);
        }
    }

    checkAllCollisions() {
        try {
            if (this.objects === null || typeof this.objects !== 'object' || !Array.isArray(this.objects)) {
                throw new TypeError('CollisionManager objects must be an array');
            }

            for (let i = 0; i < this.objects.length; i++) {
                const objA = this.objects[i];
                if (objA === null || typeof objA !== 'object') {
                    throw new TypeError('CollisionManager objects must be an object');
                }

                for (let j = i + 1; j < this.objects.length; j++) {
                    const objB = this.objects[j];
                    if (objB === null || typeof objB !== 'object') {
                        throw new TypeError('CollisionManager objects must be an object');
                    }

                    // ...логика проверки столкновений...
                }
            }
        } catch (error) {
            throw new Error(`Error checking all collisions in CollisionManager: ${error.message}`);
        }
    }
}
