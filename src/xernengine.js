/**
 * XernEngine - 2D игровой движок для браузерных игр
 * 
 * Главный файл экспорта всех модулей движка
 */

// Core
export { Engine } from './core/engine.js';
export { Renderer } from './core/renderer/renderer.js';
export { Camera } from './core/camera.js';
export { AudioManager, audio } from './core/audio/audioManager.js';

// Components
export { Scene } from './components/scene.js';
export { Character } from './components/character.js';
export { Entity } from './components/entity.js';
export { Sprite } from './components/sprite.js';
export { Animation, AnimationController } from './components/animation.js';
export { Tilemap } from './components/tilemap.js';
export { ParticleEmitter, ParticleEffects } from './components/particleSystem.js';

// Physics
export { checkCollision, resolveCollision } from './core/physics/collision.js';

// Input
export { InputManager } from './core/input/inputManager.js';

// Utils
export { EventEmitter, globalEvents } from './utils/eventEmitter.js';
export { ObjectPool, BulletPool } from './utils/objectPool.js';
export { Logger, LogLevel, logger } from './utils/logger.js';
export { StateMachine, State, GameStateMachine } from './utils/stateMachine.js';
export { Timer, TimerManager, TimeUtils, timers } from './utils/timer.js';
export { Vector2 } from './utils/vector2.js';
export { SaveManager, saves } from './utils/saveManager.js';
export { ResourceManager } from './utils/resourceManager.js';

// Version
export const VERSION = '1.0.0';

/**
 * Быстрое создание игры
 * @param {Object} config - конфигурация
 * @returns {Object} - объект игры
 * 
 * @example
 * const game = XernEngine.createGame({
 *   canvas: document.getElementById('gameCanvas'),
 *   width: 800,
 *   height: 600,
 *   scenes: {
 *     main: new Scene()
 *   }
 * });
 * game.start();
 */
export function createGame(config) {
    const { canvas, width = 800, height = 600, scenes = {} } = config;

    if (!canvas) {
        throw new Error('Canvas element is required');
    }

    canvas.width = width;
    canvas.height = height;

    const engine = new Engine(canvas);
    const renderer = new Renderer(canvas);
    const camera = new Camera(width, height);
    const stateMachine = new GameStateMachine();

    // Добавить сцены
    Object.entries(scenes).forEach(([name, scene]) => {
        engine.addScene(scene);
    });

    let running = false;
    let lastTime = 0;

    function gameLoop(currentTime) {
        if (!running) return;

        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Обновление
        engine.update(deltaTime);
        camera.update(deltaTime);
        timers.update(deltaTime);

        // Рендеринг
        renderer.clear();
        const ctx = canvas.getContext('2d');
        const offset = camera.getOffset();
        ctx.save();
        ctx.translate(offset.x, offset.y);
        engine.render(ctx);
        ctx.restore();

        requestAnimationFrame(gameLoop);
    }

    return {
        engine,
        renderer,
        camera,
        stateMachine,

        start() {
            running = true;
            lastTime = performance.now();
            requestAnimationFrame(gameLoop);
        },

        stop() {
            running = false;
        },

        pause() {
            running = false;
        },

        resume() {
            running = true;
            lastTime = performance.now();
            requestAnimationFrame(gameLoop);
        }
    };
}
