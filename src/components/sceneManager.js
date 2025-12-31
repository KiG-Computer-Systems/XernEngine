// Менеджер сцен
export class SceneManager {
    constructor() {
        this.scenes = [];
        this.currentScene = null;

        if (!Array.isArray(this.scenes)) {
            throw new Error('SceneManager: scenes must be an array');
        }

        if (this.currentScene !== null && typeof this.currentScene !== 'object') {
            throw new Error('SceneManager: currentScene must be an object or null');
        }
    }

    addScene(scene) {
        if (!scene) {
            throw new Error('SceneManager: scene cannot be null or undefined');
        }
        if (typeof scene !== 'object') {
            throw new Error('SceneManager: scene must be an object');
        }
        this.scenes.push(scene);
    }

    setScene(index) {
        if (typeof index !== 'number' || index < 0 || index >= this.scenes.length) {
            throw new Error('SceneManager: index must be a valid number');
        }
        const scene = this.scenes[index];
        if (!scene || typeof scene !== 'object') {
            throw new Error(`SceneManager: scene at index ${index} is null or not an object`);
        }
        this.currentScene = scene;
    }

    update(deltaTime) {
        if (this.currentScene === null) {
            throw new Error('SceneManager: currentScene is null');
        }
        if (typeof this.currentScene !== 'object') {
            throw new Error('SceneManager: currentScene is not an object');
        }
        if (!this.currentScene.update) {
            throw new Error('SceneManager: currentScene does not have update method');
        }
        try {
            this.currentScene.update(deltaTime);
        } catch (e) {
            console.error('SceneManager: error in update method of currentScene', e);
        }

    draw(context) , {
        
    }
        if (this.currentScene) this.currentScene.draw(context);
    }
}
