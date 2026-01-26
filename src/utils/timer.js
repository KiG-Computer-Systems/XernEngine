// Система таймеров и задержек
export class Timer {
    constructor() {
        this.elapsed = 0;
        this.duration = 0;
        this.running = false;
        this.paused = false;
        this.loop = false;
        this.onComplete = null;
        this.onUpdate = null;
    }

    /**
     * Запустить таймер
     * @param {number} duration - длительность в мс
     * @param {Function} onComplete - callback по завершению
     * @param {boolean} loop - повторять
     * @returns {Timer}
     */
    start(duration, onComplete = null, loop = false) {
        this.duration = duration;
        this.onComplete = onComplete;
        this.loop = loop;
        this.elapsed = 0;
        this.running = true;
        this.paused = false;
        return this;
    }

    /**
     * Остановить таймер
     */
    stop() {
        this.running = false;
        this.paused = false;
        this.elapsed = 0;
    }

    /**
     * Пауза таймера
     */
    pause() {
        this.paused = true;
    }

    /**
     * Возобновить таймер
     */
    resume() {
        this.paused = false;
    }

    /**
     * Обновить таймер
     * @param {number} deltaTime - время с прошлого кадра (мс)
     */
    update(deltaTime) {
        if (!this.running || this.paused) return;

        this.elapsed += deltaTime;

        if (this.onUpdate) {
            this.onUpdate(this.getProgress());
        }

        if (this.elapsed >= this.duration) {
            if (this.onComplete) {
                this.onComplete();
            }

            if (this.loop) {
                this.elapsed = 0;
            } else {
                this.running = false;
            }
        }
    }

    /**
     * Получить прогресс (0-1)
     * @returns {number}
     */
    getProgress() {
        return Math.min(this.elapsed / this.duration, 1);
    }

    /**
     * Получить оставшееся время
     * @returns {number}
     */
    getRemaining() {
        return Math.max(this.duration - this.elapsed, 0);
    }

    /**
     * Проверить, завершён ли таймер
     * @returns {boolean}
     */
    isComplete() {
        return !this.running && this.elapsed >= this.duration;
    }
}

// Менеджер таймеров
export class TimerManager {
    constructor() {
        this.timers = new Map();
        this.nextId = 0;
    }

    /**
     * Создать таймер
     * @param {number} duration - длительность в мс
     * @param {Function} callback - callback по завершению
     * @param {boolean} loop - повторять
     * @returns {number} - ID таймера
     */
    setTimeout(duration, callback, loop = false) {
        const id = this.nextId++;
        const timer = new Timer();
        timer.start(duration, () => {
            callback();
            if (!loop) {
                this.timers.delete(id);
            }
        }, loop);
        this.timers.set(id, timer);
        return id;
    }

    /**
     * Создать интервал
     * @param {number} duration - интервал в мс
     * @param {Function} callback - callback
     * @returns {number} - ID таймера
     */
    setInterval(duration, callback) {
        return this.setTimeout(duration, callback, true);
    }

    /**
     * Отменить таймер
     * @param {number} id - ID таймера
     */
    clearTimeout(id) {
        this.timers.delete(id);
    }

    /**
     * Отменить интервал
     * @param {number} id - ID таймера
     */
    clearInterval(id) {
        this.clearTimeout(id);
    }

    /**
     * Обновить все таймеры
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        this.timers.forEach(timer => timer.update(deltaTime));
    }

    /**
     * Приостановить все таймеры
     */
    pauseAll() {
        this.timers.forEach(timer => timer.pause());
    }

    /**
     * Возобновить все таймеры
     */
    resumeAll() {
        this.timers.forEach(timer => timer.resume());
    }

    /**
     * Очистить все таймеры
     */
    clear() {
        this.timers.clear();
    }
}

// Утилиты для работы со временем
export const TimeUtils = {
    /**
     * Задержка на основе Promise
     * @param {number} ms - миллисекунды
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Простой debounce
     * @param {Function} func 
     * @param {number} wait 
     * @returns {Function}
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Простой throttle
     * @param {Function} func 
     * @param {number} limit 
     * @returns {Function}
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Форматировать время в MM:SS
     * @param {number} ms - миллисекунды
     * @returns {string}
     */
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
};

// Глобальный менеджер таймеров
export const timers = new TimerManager();
