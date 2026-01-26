// Система событий для коммуникации между компонентами
export class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    /**
     * Подписаться на событие
     * @param {string} event - название события
     * @param {Function} callback - обработчик
     * @returns {Function} - функция отписки
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);

        // Возвращаем функцию отписки
        return () => this.off(event, callback);
    }

    /**
     * Подписаться на событие один раз
     * @param {string} event - название события
     * @param {Function} callback - обработчик
     */
    once(event, callback) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback(...args);
        };
        this.on(event, wrapper);
    }

    /**
     * Отписаться от события
     * @param {string} event - название события
     * @param {Function} callback - обработчик
     */
    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
        }
    }

    /**
     * Вызвать событие
     * @param {string} event - название события
     * @param {...any} args - аргументы
     */
    emit(event, ...args) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`Error in event handler for "${event}":`, error);
                }
            });
        }
    }

    /**
     * Удалить все обработчики события
     * @param {string} event - название события
     */
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }

    /**
     * Получить количество слушателей события
     * @param {string} event - название события
     * @returns {number}
     */
    listenerCount(event) {
        return this.events.has(event) ? this.events.get(event).size : 0;
    }
}

// Глобальный эмиттер для игровых событий
export const globalEvents = new EventEmitter();
