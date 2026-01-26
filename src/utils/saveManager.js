// Система сохранения игрового прогресса
export class SaveManager {
    constructor(gameId = 'xernengine-game') {
        this.gameId = gameId;
        this.autoSaveInterval = null;
        this.onSave = null;
        this.onLoad = null;
    }

    /**
     * Сохранить данные
     * @param {string} slot - слот сохранения
     * @param {Object} data - данные для сохранения
     * @returns {boolean}
     */
    save(slot, data) {
        try {
            const saveData = {
                slot,
                timestamp: Date.now(),
                version: 1,
                data
            };

            const key = `${this.gameId}_${slot}`;
            localStorage.setItem(key, JSON.stringify(saveData));

            if (this.onSave) {
                this.onSave(slot, saveData);
            }

            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    /**
     * Загрузить данные
     * @param {string} slot - слот сохранения
     * @returns {Object|null}
     */
    load(slot) {
        try {
            const key = `${this.gameId}_${slot}`;
            const json = localStorage.getItem(key);

            if (!json) return null;

            const saveData = JSON.parse(json);

            if (this.onLoad) {
                this.onLoad(slot, saveData);
            }

            return saveData.data;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    /**
     * Удалить сохранение
     * @param {string} slot - слот сохранения
     */
    delete(slot) {
        const key = `${this.gameId}_${slot}`;
        localStorage.removeItem(key);
    }

    /**
     * Проверить существование сохранения
     * @param {string} slot - слот сохранения
     * @returns {boolean}
     */
    exists(slot) {
        const key = `${this.gameId}_${slot}`;
        return localStorage.getItem(key) !== null;
    }

    /**
     * Получить информацию о сохранении
     * @param {string} slot - слот сохранения
     * @returns {Object|null}
     */
    getInfo(slot) {
        try {
            const key = `${this.gameId}_${slot}`;
            const json = localStorage.getItem(key);

            if (!json) return null;

            const saveData = JSON.parse(json);
            return {
                slot: saveData.slot,
                timestamp: saveData.timestamp,
                date: new Date(saveData.timestamp).toLocaleString(),
                version: saveData.version
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Получить все сохранения
     * @returns {Array}
     */
    getAllSaves() {
        const saves = [];
        const prefix = `${this.gameId}_`;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                const slot = key.substring(prefix.length);
                const info = this.getInfo(slot);
                if (info) {
                    saves.push(info);
                }
            }
        }

        // Сортировка по времени (новые сначала)
        return saves.sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * Включить автосохранение
     * @param {number} interval - интервал в мс
     * @param {Function} getData - функция получения данных для сохранения
     */
    enableAutoSave(interval, getData) {
        this.disableAutoSave();

        this.autoSaveInterval = setInterval(() => {
            const data = getData();
            if (data) {
                this.save('autosave', data);
            }
        }, interval);
    }

    /**
     * Отключить автосохранение
     */
    disableAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    /**
     * Быстрое сохранение (F5)
     * @param {Object} data 
     */
    quickSave(data) {
        return this.save('quicksave', data);
    }

    /**
     * Быстрая загрузка (F9)
     * @returns {Object|null}
     */
    quickLoad() {
        return this.load('quicksave');
    }

    /**
     * Экспортировать сохранение в файл
     * @param {string} slot - слот сохранения
     */
    exportToFile(slot) {
        const key = `${this.gameId}_${slot}`;
        const json = localStorage.getItem(key);

        if (!json) {
            console.error('Save not found');
            return;
        }

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.gameId}_${slot}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Импортировать сохранение из файла
     * @param {File} file - файл сохранения
     * @returns {Promise<boolean>}
     */
    async importFromFile(file) {
        try {
            const text = await file.text();
            const saveData = JSON.parse(text);

            if (!saveData.slot || !saveData.data) {
                throw new Error('Invalid save file');
            }

            const key = `${this.gameId}_${saveData.slot}`;
            localStorage.setItem(key, text);

            return true;
        } catch (error) {
            console.error('Failed to import save:', error);
            return false;
        }
    }

    /**
     * Очистить все сохранения
     */
    clearAll() {
        const prefix = `${this.gameId}_`;
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    /**
     * Получить размер используемого хранилища
     * @returns {number} - размер в байтах
     */
    getStorageSize() {
        const prefix = `${this.gameId}_`;
        let size = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                size += localStorage.getItem(key).length * 2; // UTF-16
            }
        }

        return size;
    }
}

// Глобальный менеджер сохранений
export const saves = new SaveManager();
