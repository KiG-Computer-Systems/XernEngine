// Система частиц для визуальных эффектов
import { ObjectPool } from '../utils/objectPool.js';

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;  // ускорение
        this.ay = 0;
        this.life = 0;
        this.maxLife = 1000;
        this.size = 5;
        this.sizeEnd = 0;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.color = '#ffffff';
        this.colorEnd = null;
        this.alpha = 1;
        this.alphaEnd = 0;
        this.active = false;
    }

    update(deltaTime) {
        if (!this.active) return;

        this.life += deltaTime;
        if (this.life >= this.maxLife) {
            this.active = false;
            return;
        }

        // Физика
        this.vx += this.ax * (deltaTime / 1000);
        this.vy += this.ay * (deltaTime / 1000);
        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);
        this.rotation += this.rotationSpeed * (deltaTime / 1000);
    }

    getProgress() {
        return this.life / this.maxLife;
    }
}

export class ParticleEmitter {
    constructor(config = {}) {
        // Позиция эмиттера
        this.x = config.x || 0;
        this.y = config.y || 0;

        // Пул частиц
        this.maxParticles = config.maxParticles || 100;
        this.pool = new ObjectPool(
            () => new Particle(),
            (p) => { p.reset(); return p; },
            this.maxParticles
        );
        this.particles = [];

        // Настройки эмиссии
        this.emissionRate = config.emissionRate || 10; // частиц в секунду
        this.emissionAccumulator = 0;
        this.burst = config.burst || 0; // одноразовый выброс
        this.duration = config.duration || -1; // -1 = бесконечно
        this.elapsed = 0;
        this.active = false;

        // Настройки частиц
        this.particleConfig = {
            life: config.life || { min: 500, max: 1000 },
            speed: config.speed || { min: 50, max: 100 },
            angle: config.angle || { min: 0, max: 360 },
            size: config.size || { start: 10, end: 0 },
            color: config.color || { start: '#ffffff', end: '#ffffff' },
            alpha: config.alpha || { start: 1, end: 0 },
            gravity: config.gravity || 0,
            rotation: config.rotation || { min: 0, max: 0 },
            spread: config.spread || { x: 0, y: 0 } // разброс от центра
        };

        // Рендеринг
        this.blendMode = config.blendMode || 'source-over'; // 'lighter' для свечения
        this.shape = config.shape || 'circle'; // 'circle', 'square', 'image'
        this.image = config.image || null;
    }

    /**
     * Запустить эмиттер
     */
    start() {
        this.active = true;
        this.elapsed = 0;
        this.emissionAccumulator = 0;

        // Burst - мгновенный выброс
        if (this.burst > 0) {
            for (let i = 0; i < this.burst; i++) {
                this.emit();
            }
        }
    }

    /**
     * Остановить эмиттер
     */
    stop() {
        this.active = false;
    }

    /**
     * Выпустить одну частицу
     */
    emit() {
        if (this.particles.length >= this.maxParticles) return;

        const particle = this.pool.acquire();
        const cfg = this.particleConfig;

        // Позиция с разбросом
        particle.x = this.x + (Math.random() - 0.5) * cfg.spread.x;
        particle.y = this.y + (Math.random() - 0.5) * cfg.spread.y;

        // Скорость и направление
        const angle = this._random(cfg.angle.min, cfg.angle.max) * Math.PI / 180;
        const speed = this._random(cfg.speed.min, cfg.speed.max);
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;

        // Гравитация
        particle.ay = cfg.gravity;

        // Время жизни
        particle.maxLife = this._random(cfg.life.min, cfg.life.max);
        particle.life = 0;

        // Размер
        particle.size = cfg.size.start;
        particle.sizeEnd = cfg.size.end;

        // Цвет
        particle.color = cfg.color.start;
        particle.colorEnd = cfg.color.end;

        // Прозрачность
        particle.alpha = cfg.alpha.start;
        particle.alphaEnd = cfg.alpha.end;

        // Вращение
        particle.rotationSpeed = this._random(cfg.rotation.min, cfg.rotation.max);

        particle.active = true;
        this.particles.push(particle);
    }

    /**
     * Обновить эмиттер
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        // Обновить время жизни эмиттера
        if (this.duration > 0) {
            this.elapsed += deltaTime;
            if (this.elapsed >= this.duration) {
                this.active = false;
            }
        }

        // Эмиссия новых частиц
        if (this.active && this.emissionRate > 0) {
            this.emissionAccumulator += deltaTime;
            const emitInterval = 1000 / this.emissionRate;
            
            while (this.emissionAccumulator >= emitInterval) {
                this.emit();
                this.emissionAccumulator -= emitInterval;
            }
        }

        // Обновить частицы
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);

            if (!particle.active) {
                this.pool.release(particle);
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Отрисовать частицы
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = this.blendMode;

        for (const particle of this.particles) {
            const progress = particle.getProgress();

            // Интерполяция размера
            const size = this._lerp(particle.size, particle.sizeEnd, progress);
            
            // Интерполяция прозрачности
            const alpha = this._lerp(particle.alpha, particle.alphaEnd, progress);
            
            // Интерполяция цвета
            const color = particle.colorEnd 
                ? this._lerpColor(particle.color, particle.colorEnd, progress)
                : particle.color;

            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;

            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.shape === 'square') {
                ctx.fillRect(-size / 2, -size / 2, size, size);
            } else if (this.shape === 'image' && this.image) {
                ctx.drawImage(this.image, -size / 2, -size / 2, size, size);
            }

            ctx.restore();
        }

        ctx.restore();
    }

    /**
     * Получить количество активных частиц
     * @returns {number}
     */
    getParticleCount() {
        return this.particles.length;
    }

    /**
     * Проверить, завершён ли эффект
     * @returns {boolean}
     */
    isComplete() {
        return !this.active && this.particles.length === 0;
    }

    // Утилиты
    _random(min, max) {
        return min + Math.random() * (max - min);
    }

    _lerp(a, b, t) {
        return a + (b - a) * t;
    }

    _lerpColor(colorA, colorB, t) {
        // Простая интерполяция hex цветов
        const a = this._hexToRgb(colorA);
        const b = this._hexToRgb(colorB);
        const r = Math.round(this._lerp(a.r, b.r, t));
        const g = Math.round(this._lerp(a.g, b.g, t));
        const bl = Math.round(this._lerp(a.b, b.b, t));
        return `rgb(${r},${g},${bl})`;
    }

    _hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }
}

// Готовые эффекты
export const ParticleEffects = {
    /**
     * Эффект взрыва
     */
    explosion(x, y, color = '#ff6600') {
        return new ParticleEmitter({
            x, y,
            maxParticles: 50,
            burst: 30,
            emissionRate: 0,
            duration: 100,
            life: { min: 300, max: 600 },
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            size: { start: 15, end: 0 },
            color: { start: color, end: '#ffff00' },
            alpha: { start: 1, end: 0 },
            gravity: 200,
            blendMode: 'lighter'
        });
    },

    /**
     * Эффект дыма
     */
    smoke(x, y) {
        return new ParticleEmitter({
            x, y,
            maxParticles: 100,
            emissionRate: 20,
            life: { min: 1000, max: 2000 },
            speed: { min: 20, max: 50 },
            angle: { min: 250, max: 290 },
            size: { start: 10, end: 30 },
            color: { start: '#888888', end: '#444444' },
            alpha: { start: 0.8, end: 0 },
            spread: { x: 20, y: 0 }
        });
    },

    /**
     * Эффект огня
     */
    fire(x, y) {
        return new ParticleEmitter({
            x, y,
            maxParticles: 100,
            emissionRate: 40,
            life: { min: 300, max: 800 },
            speed: { min: 50, max: 150 },
            angle: { min: 250, max: 290 },
            size: { start: 20, end: 5 },
            color: { start: '#ff3300', end: '#ffff00' },
            alpha: { start: 1, end: 0 },
            spread: { x: 15, y: 0 },
            blendMode: 'lighter'
        });
    },

    /**
     * Эффект искр
     */
    sparks(x, y) {
        return new ParticleEmitter({
            x, y,
            maxParticles: 30,
            burst: 20,
            emissionRate: 0,
            duration: 50,
            life: { min: 200, max: 500 },
            speed: { min: 200, max: 400 },
            angle: { min: 0, max: 360 },
            size: { start: 3, end: 1 },
            color: { start: '#ffff00', end: '#ff6600' },
            alpha: { start: 1, end: 0 },
            gravity: 300,
            blendMode: 'lighter'
        });
    }
};
