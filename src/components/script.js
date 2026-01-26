// Скрипт для объектов
export class Script {
    constructor(action) {
        if (typeof action !== 'function') {
            throw new TypeError(`Script action must be a function, received ${typeof action}`);
        }

        this.action = action;
    }

    execute(entity, deltaTime) {
        if (!entity || !this.action) {
            console.warn(`Attempting to execute script on null or undefined entity or action`);
            return;
        }

        try {
            this.action(entity, deltaTime);
        } catch (e) {
            if (e instanceof TypeError) {
                console.error(`Error executing script on entity ${entity.constructor.name}: ${e.message}`);
            } else {
                console.error(`Error executing script on entity ${entity.constructor.name}: ${e}`);
            }
        }
    }
}
