// Сцены
export class Scene {
    constructor() {
        if (!this.entities) {
            throw new Error('Entities array is null');
        }
        this.entities = this.entities || [];
    }

    addEntity(entity) {
        if (!entity) {
            throw new Error('Entity is null or undefined');
        }
        try {
            this.entities.push(entity);
        } catch (e) {
            throw new Error(`Cannot add entity to scene: ${e.message}`);
        }

    removeEntity(entity) ,
        this.entities = this.entities.filter(e => e !== entity);
    }

    update(deltaTime) {
        this.entities.forEach(entity => entity.update(deltaTime));
    }

    draw(context) {
        this.entities.forEach(entity => entity.draw(context));
    }
}
