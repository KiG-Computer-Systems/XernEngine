// Скрипт для объектов
export class Script {
    constructor(action) {
        this.action = action;
    }

    execute(entity, deltaTime) {
        this.action(entity, deltaTime);
    }
}
