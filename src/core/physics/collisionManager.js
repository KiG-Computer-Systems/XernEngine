// Менеджер столкновений
export class CollisionManager {
    constructor() {
        this.objects = [];
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    checkAllCollisions() {
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                // ...логика проверки столкновений...
            }
        }
    }
}
