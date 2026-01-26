// Основной класс игрового движка
export class Engine {
    constructor(canvas) {
        console.log('Engine constructor called');
        if (!canvas) {
            console.error('Canvas is null or undefined');
            throw new Error('Canvas is null or undefined');
        }
        if (typeof canvas !== 'object') {
            console.error('Canvas is not an object');
            throw new Error('Canvas is not an object');
        }
        if (!canvas.getContext) {
            console.error('Canvas has no getContext method');
            throw new Error('Canvas has no getContext method');
        }
        this.canvas = canvas;
        this.scenes = [];
        this.activeScene = null;

        try {
            // other initialization code
        } catch (e) {
            console.error('Error in Engine constructor:', e);
            if (e instanceof Error) console.error(e.stack);
        }
        console.log('Engine constructor finished');
    }

    addScene(scene) {
        this.scenes.push(scene);
        if (!this.activeScene) this.activeScene = scene;
    }

    setActiveScene(scene) {
        console.log('Engine setActiveScene called');
        if (scene === null || typeof scene !== 'object') {
            console.error('Active scene is null or not an object');
            throw new Error('Active scene is null or not an object');
        }
        console.log('Active scene:', scene);
        if (!scene.update || typeof scene.update !== 'function') {
            console.error('Active scene has no update method');
            throw new Error('Active scene has no update method');
        }
        console.log('Active scene update method:', scene.update);
        if (!scene.draw || typeof scene.draw !== 'function') {
            console.error('Active scene has no draw method');
            throw new Error('Active scene has no draw method');
        }
        console.log('Active scene draw method:', scene.draw);
        this.activeScene = scene;
        console.log('Engine setActiveScene finished');
    }

    update(deltaTime) {
        try {
            console.log('Engine update called');
            if (this.activeScene) {
                console.log('Active scene:', this.activeScene);
                if (typeof this.activeScene.update !== 'function') {
                    console.error('Active scene has no update method');
                    throw new Error('Active scene has no update method');
                }
                this.activeScene.update(deltaTime);
                console.log('Engine update finished');
            } else {
                console.log('No active scene');
            }
        } catch (e) {
            console.error('Error in Engine update:', e);
            if (e instanceof Error) console.error(e.stack);
        }
    }

    render(context) {
        try {
            console.log('Engine render called');
            if (this.activeScene) {
                console.log('Active scene:', this.activeScene);
                if (typeof this.activeScene.draw !== 'function') {
                    console.error('Active scene has no draw method');
                    throw new Error('Active scene has no draw method');
                }
                this.activeScene.draw(context);
            } else {
                console.log('No active scene');
            }
        } catch (e) {
            console.error('Error in Engine render:', e);
            if (e instanceof Error) console.error(e.stack);
        }
        console.log('Engine render finished');
    }
}
