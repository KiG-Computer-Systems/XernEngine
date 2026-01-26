// Пул объектов для оптимизации памяти и производительности
export class ObjectPool {
    /**
     * @param {Function} factory - функция создания объекта
     * @param {Function} reset - функция сброса объекта
     * @param {number} initialSize - начальный размер пула
     */
    constructor(factory, reset = null, initialSize = 10) {
        this.factory = factory;
        this.reset = reset || ((obj) => obj);
        this.pool = [];
        this.active = new Set();

        // Предварительно создаём объекты
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.factory());
        }
    }

    /**
     * Получить объект из пула
     * @returns {*} - объект из пула или новый
     */
    acquire() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.factory();
        }
        this.active.add(obj);
        return obj;
    }

    /**
     * Вернуть объект в пул
     * @param {*} obj - объект для возврата
     */
    release(obj) {
        if (this.active.has(obj)) {
            this.active.delete(obj);
            this.reset(obj);
            this.pool.push(obj);
        }
    }

    /**
     * Вернуть все активные объекты в пул
     */
    releaseAll() {
        this.active.forEach(obj => {
            this.reset(obj);
            this.pool.push(obj);
        });
        this.active.clear();
    }

    /**
     * Получить статистику пула
     * @returns {{available: number, active: number, total: number}}
     */
    getStats() {
        return {
            available: this.pool.length,
            active: this.active.size,
            total: this.pool.length + this.active.size
        };
    }

    /**
     * Очистить пул
     */
    clear() {
        this.pool = [];
        this.active.clear();
    }
}

// Пример использования для пуль/частиц
export class BulletPool extends ObjectPool {
    constructor(initialSize = 50) {
        super(
            // Factory
            () => ({
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                active: false,
                damage: 10
            }),
            // Reset
            (bullet) => {
                bullet.x = 0;
                bullet.y = 0;
                bullet.vx = 0;
                bullet.vy = 0;
                bullet.active = false;
                return bullet;
            },
            initialSize
        );
    }

    spawn(x, y, vx, vy, damage = 10) {
        const bullet = this.acquire();
        bullet.x = x;
        bullet.y = y;
        bullet.vx = vx;
        bullet.vy = vy;
        bullet.damage = damage;
        bullet.active = true;
        return bullet;
    }
}
