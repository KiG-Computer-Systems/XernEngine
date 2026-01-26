// Улучшенная система логирования
export const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
};

export class Logger {
    constructor(name = 'XernEngine') {
        this.name = name;
        this.level = LogLevel.DEBUG;
        this.history = [];
        this.maxHistory = 1000;
        this.enableColors = true;
        this.enableTimestamp = true;
        
        // Цвета для консоли
        this.colors = {
            debug: '#7f8c8d',
            info: '#3498db',
            warn: '#f39c12',
            error: '#e74c3c'
        };
    }

    /**
     * Установить уровень логирования
     * @param {number} level - LogLevel значение
     */
    setLevel(level) {
        this.level = level;
    }

    /**
     * Форматировать сообщение
     * @private
     */
    _format(level, message, data) {
        const timestamp = this.enableTimestamp 
            ? new Date().toISOString().substr(11, 12)
            : '';
        
        return {
            timestamp,
            level,
            name: this.name,
            message,
            data
        };
    }

    /**
     * Добавить в историю
     * @private
     */
    _addToHistory(entry) {
        this.history.push(entry);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    /**
     * Вывести в консоль
     * @private
     */
    _output(level, levelName, message, data) {
        if (this.level > level) return;

        const entry = this._format(levelName, message, data);
        this._addToHistory(entry);

        const prefix = this.enableTimestamp 
            ? `[${entry.timestamp}] [${this.name}] [${levelName.toUpperCase()}]`
            : `[${this.name}] [${levelName.toUpperCase()}]`;

        if (this.enableColors && typeof window !== 'undefined') {
            const color = this.colors[levelName];
            const style = `color: ${color}; font-weight: bold;`;
            
            if (data !== undefined) {
                console.log(`%c${prefix}`, style, message, data);
            } else {
                console.log(`%c${prefix}`, style, message);
            }
        } else {
            if (data !== undefined) {
                console.log(prefix, message, data);
            } else {
                console.log(prefix, message);
            }
        }
    }

    /**
     * Debug сообщение
     * @param {string} message 
     * @param {*} data 
     */
    debug(message, data) {
        this._output(LogLevel.DEBUG, 'debug', message, data);
    }

    /**
     * Info сообщение
     * @param {string} message 
     * @param {*} data 
     */
    info(message, data) {
        this._output(LogLevel.INFO, 'info', message, data);
    }

    /**
     * Warning сообщение
     * @param {string} message 
     * @param {*} data 
     */
    warn(message, data) {
        this._output(LogLevel.WARN, 'warn', message, data);
        if (data !== undefined) {
            console.warn(message, data);
        } else {
            console.warn(message);
        }
    }

    /**
     * Error сообщение
     * @param {string} message 
     * @param {*} data 
     */
    error(message, data) {
        this._output(LogLevel.ERROR, 'error', message, data);
        if (data !== undefined) {
            console.error(message, data);
        } else {
            console.error(message);
        }
    }

    /**
     * Группировка логов
     * @param {string} label 
     */
    group(label) {
        console.group(`[${this.name}] ${label}`);
    }

    /**
     * Закрыть группу
     */
    groupEnd() {
        console.groupEnd();
    }

    /**
     * Замер времени
     * @param {string} label 
     */
    time(label) {
        console.time(`[${this.name}] ${label}`);
    }

    /**
     * Завершить замер времени
     * @param {string} label 
     */
    timeEnd(label) {
        console.timeEnd(`[${this.name}] ${label}`);
    }

    /**
     * Получить историю логов
     * @param {number} level - минимальный уровень
     * @returns {Array}
     */
    getHistory(level = LogLevel.DEBUG) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return this.history.filter(entry => {
            const entryLevel = levels.indexOf(entry.level);
            return entryLevel >= level;
        });
    }

    /**
     * Очистить историю
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Экспортировать логи в JSON
     * @returns {string}
     */
    exportLogs() {
        return JSON.stringify(this.history, null, 2);
    }

    /**
     * Создать дочерний логгер
     * @param {string} name 
     * @returns {Logger}
     */
    child(name) {
        const child = new Logger(`${this.name}:${name}`);
        child.level = this.level;
        child.enableColors = this.enableColors;
        child.enableTimestamp = this.enableTimestamp;
        return child;
    }
}

// Глобальный логгер
export const logger = new Logger('XernEngine');

// Установить уровень для production
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
    logger.setLevel(LogLevel.WARN);
}
