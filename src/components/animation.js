// Система анимации спрайтов
export class Animation {
    /**
     * @param {string} name - имя анимации
     * @param {Array} frames - массив кадров [{x, y, width, height}]
     * @param {number} frameRate - кадров в секунду
     * @param {boolean} loop - зацикливание
     */
    constructor(name, frames, frameRate = 12, loop = true) {
        this.name = name;
        this.frames = frames;
        this.frameRate = frameRate;
        this.loop = loop;
        this.currentFrame = 0;
        this.elapsed = 0;
        this.playing = false;
        this.onComplete = null;
    }

    /**
     * Запустить анимацию
     */
    play() {
        this.playing = true;
        this.currentFrame = 0;
        this.elapsed = 0;
    }

    /**
     * Остановить анимацию
     */
    stop() {
        this.playing = false;
    }

    /**
     * Пауза анимации
     */
    pause() {
        this.playing = false;
    }

    /**
     * Возобновить анимацию
     */
    resume() {
        this.playing = true;
    }

    /**
     * Обновить анимацию
     * @param {number} deltaTime - время с прошлого кадра (мс)
     */
    update(deltaTime) {
        if (!this.playing) return;

        this.elapsed += deltaTime;
        const frameDuration = 1000 / this.frameRate;

        while (this.elapsed >= frameDuration) {
            this.elapsed -= frameDuration;
            this.currentFrame++;

            if (this.currentFrame >= this.frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.frames.length - 1;
                    this.playing = false;
                    if (this.onComplete) this.onComplete();
                }
            }
        }
    }

    /**
     * Получить текущий кадр
     * @returns {Object} - {x, y, width, height}
     */
    getCurrentFrame() {
        return this.frames[this.currentFrame];
    }
}

// Менеджер анимаций для спрайта
export class AnimationController {
    constructor() {
        this.animations = new Map();
        this.currentAnimation = null;
        this.currentName = null;
    }

    /**
     * Добавить анимацию
     * @param {Animation} animation 
     */
    add(animation) {
        this.animations.set(animation.name, animation);
    }

    /**
     * Создать и добавить анимацию
     * @param {string} name 
     * @param {Array} frames 
     * @param {number} frameRate 
     * @param {boolean} loop 
     * @returns {Animation}
     */
    create(name, frames, frameRate = 12, loop = true) {
        const animation = new Animation(name, frames, frameRate, loop);
        this.add(animation);
        return animation;
    }

    /**
     * Воспроизвести анимацию
     * @param {string} name - имя анимации
     * @param {boolean} force - принудительный перезапуск
     */
    play(name, force = false) {
        if (this.currentName === name && !force) return;

        const animation = this.animations.get(name);
        if (animation) {
            this.currentAnimation = animation;
            this.currentName = name;
            animation.play();
        }
    }

    /**
     * Остановить текущую анимацию
     */
    stop() {
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }
    }

    /**
     * Обновить текущую анимацию
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        if (this.currentAnimation) {
            this.currentAnimation.update(deltaTime);
        }
    }

    /**
     * Получить текущий кадр
     * @returns {Object|null}
     */
    getCurrentFrame() {
        return this.currentAnimation ? this.currentAnimation.getCurrentFrame() : null;
    }

    /**
     * Создать анимации из спрайт-листа
     * @param {number} frameWidth - ширина кадра
     * @param {number} frameHeight - высота кадра
     * @param {Object} config - конфигурация анимаций
     * @example
     * createFromSpriteSheet(32, 32, {
     *   idle: { row: 0, count: 4, frameRate: 8 },
     *   walk: { row: 1, count: 6, frameRate: 12 },
     *   attack: { row: 2, count: 8, frameRate: 16, loop: false }
     * })
     */
    createFromSpriteSheet(frameWidth, frameHeight, config) {
        for (const [name, settings] of Object.entries(config)) {
            const frames = [];
            const { row, count, frameRate = 12, loop = true, startCol = 0 } = settings;

            for (let i = 0; i < count; i++) {
                frames.push({
                    x: (startCol + i) * frameWidth,
                    y: row * frameHeight,
                    width: frameWidth,
                    height: frameHeight
                });
            }

            this.create(name, frames, frameRate, loop);
        }
    }
}
