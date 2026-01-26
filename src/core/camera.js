// Система камеры для управления viewport
export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.zoom = 1;
        this.rotation = 0;
        
        // Границы мира
        this.bounds = null;
        
        // Цель для следования
        this.target = null;
        this.followSpeed = 0.1; // Плавность следования (0-1)
        this.deadzone = { x: 50, y: 50 }; // Мёртвая зона
        
        // Эффект тряски
        this.shake = { intensity: 0, duration: 0, elapsed: 0 };
    }

    /**
     * Установить границы мира
     * @param {number} minX 
     * @param {number} minY 
     * @param {number} maxX 
     * @param {number} maxY 
     */
    setBounds(minX, minY, maxX, maxY) {
        this.bounds = { minX, minY, maxX, maxY };
    }

    /**
     * Следовать за объектом
     * @param {Object} target - объект с x, y
     * @param {number} speed - скорость следования (0-1)
     */
    follow(target, speed = 0.1) {
        this.target = target;
        this.followSpeed = speed;
    }

    /**
     * Прекратить следование
     */
    stopFollow() {
        this.target = null;
    }

    /**
     * Эффект тряски камеры
     * @param {number} intensity - интенсивность
     * @param {number} duration - длительность в мс
     */
    startShake(intensity = 10, duration = 500) {
        this.shake.intensity = intensity;
        this.shake.duration = duration;
        this.shake.elapsed = 0;
    }

    /**
     * Обновление камеры
     * @param {number} deltaTime - время с прошлого кадра
     */
    update(deltaTime) {
        // Следование за целью
        if (this.target) {
            const targetX = this.target.x - this.width / 2;
            const targetY = this.target.y - this.height / 2;

            // Проверка мёртвой зоны
            const dx = targetX - this.x;
            const dy = targetY - this.y;

            if (Math.abs(dx) > this.deadzone.x) {
                this.x += dx * this.followSpeed;
            }
            if (Math.abs(dy) > this.deadzone.y) {
                this.y += dy * this.followSpeed;
            }
        }

        // Применение границ
        if (this.bounds) {
            this.x = Math.max(this.bounds.minX, Math.min(this.x, this.bounds.maxX - this.width));
            this.y = Math.max(this.bounds.minY, Math.min(this.y, this.bounds.maxY - this.height));
        }

        // Обновление тряски
        if (this.shake.duration > 0) {
            this.shake.elapsed += deltaTime;
            if (this.shake.elapsed >= this.shake.duration) {
                this.shake.duration = 0;
                this.shake.intensity = 0;
            }
        }
    }

    /**
     * Получить смещение для рендеринга (с учётом тряски)
     * @returns {{x: number, y: number}}
     */
    getOffset() {
        let offsetX = -this.x;
        let offsetY = -this.y;

        // Добавить тряску
        if (this.shake.duration > 0) {
            const progress = 1 - (this.shake.elapsed / this.shake.duration);
            const currentIntensity = this.shake.intensity * progress;
            offsetX += (Math.random() - 0.5) * 2 * currentIntensity;
            offsetY += (Math.random() - 0.5) * 2 * currentIntensity;
        }

        return { x: offsetX, y: offsetY };
    }

    /**
     * Преобразовать мировые координаты в экранные
     * @param {number} worldX 
     * @param {number} worldY 
     * @returns {{x: number, y: number}}
     */
    worldToScreen(worldX, worldY) {
        const offset = this.getOffset();
        return {
            x: (worldX + offset.x) * this.zoom,
            y: (worldY + offset.y) * this.zoom
        };
    }

    /**
     * Преобразовать экранные координаты в мировые
     * @param {number} screenX 
     * @param {number} screenY 
     * @returns {{x: number, y: number}}
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX / this.zoom + this.x,
            y: screenY / this.zoom + this.y
        };
    }

    /**
     * Проверить, виден ли объект на экране
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @returns {boolean}
     */
    isVisible(x, y, width = 0, height = 0) {
        return x + width > this.x &&
               x < this.x + this.width &&
               y + height > this.y &&
               y < this.y + this.height;
    }

    /**
     * Центрировать камеру на точке
     * @param {number} x 
     * @param {number} y 
     */
    centerOn(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }
}
