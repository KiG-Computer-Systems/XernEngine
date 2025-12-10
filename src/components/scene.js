// Сцены
export class Scene {
    constructor() {
        this.entities = [];
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    removeEntity(entity) {
        this.entities = this.entities.filter(e => e !== entity);
    }

    update(deltaTime) {
        this.entities.forEach(entity => entity.update(deltaTime));
    }

    draw(context) {
        this.entities.forEach(entity => entity.draw(context));
    }
}