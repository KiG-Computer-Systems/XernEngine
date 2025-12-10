// Менеджер сцен
export class SceneManager {
    constructor() {
        this.scenes = [];
        this.currentScene = null;
    }

    addScene(scene) {
        this.scenes.push(scene);
    }

    setScene(index) {
        if (this.scenes[index]) {
            this.currentScene = this.scenes[index];
        }
    }

    update(deltaTime) {
        if (this.currentScene) this.currentScene.update(deltaTime);
    }

    draw(context) {
        if (this.currentScene) this.currentScene.draw(context);
    }
}
