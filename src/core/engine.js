// Основной класс игрового движка
export class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.scenes = [];
        this.activeScene = null;
    }

    addScene(scene) {
        this.scenes.push(scene);
        if (!this.activeScene) this.activeScene = scene;
    }

    setActiveScene(scene) {
        this.activeScene = scene;
    }

    update(deltaTime) {
        if (this.activeScene) this.activeScene.update(deltaTime);
    }

    render(context) {
        if (this.activeScene) this.activeScene.draw(context);
    }
}
