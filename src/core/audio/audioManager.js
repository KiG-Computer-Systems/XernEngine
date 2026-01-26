// Менеджер аудио для звуков и музыки
export class AudioManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.sounds = new Map();
        this.music = new Map();
        this.currentMusic = null;
        
        this.volumes = {
            master: 1,
            sfx: 1,
            music: 0.5
        };

        this.initialized = false;
    }

    /**
     * Инициализация аудио контекста (вызывать по клику пользователя)
     */
    init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = this.volumes.master;
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
        }
    }

    /**
     * Загрузить звук
     * @param {string} name - имя звука
     * @param {string} url - URL файла
     * @returns {Promise}
     */
    async loadSound(name, url) {
        if (!this.initialized) this.init();

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.sounds.set(name, audioBuffer);
            return audioBuffer;
        } catch (error) {
            console.error(`Failed to load sound "${name}":`, error);
            throw error;
        }
    }

    /**
     * Загрузить музыку
     * @param {string} name - имя трека
     * @param {string} url - URL файла
     * @returns {Promise}
     */
    async loadMusic(name, url) {
        if (!this.initialized) this.init();

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.music.set(name, audioBuffer);
            return audioBuffer;
        } catch (error) {
            console.error(`Failed to load music "${name}":`, error);
            throw error;
        }
    }

    /**
     * Воспроизвести звук
     * @param {string} name - имя звука
     * @param {Object} options - опции
     * @returns {AudioBufferSourceNode}
     */
    playSound(name, options = {}) {
        if (!this.initialized || !this.sounds.has(name)) return null;

        const { volume = 1, loop = false, playbackRate = 1 } = options;

        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();

        source.buffer = this.sounds.get(name);
        source.loop = loop;
        source.playbackRate.value = playbackRate;

        gainNode.gain.value = volume * this.volumes.sfx;

        source.connect(gainNode);
        gainNode.connect(this.masterGain);

        source.start(0);
        return source;
    }

    /**
     * Воспроизвести музыку
     * @param {string} name - имя трека
     * @param {boolean} loop - зацикливание
     * @param {number} fadeIn - время плавного появления (мс)
     */
    playMusic(name, loop = true, fadeIn = 1000) {
        if (!this.initialized || !this.music.has(name)) return;

        // Остановить текущую музыку
        if (this.currentMusic) {
            this.stopMusic(500);
        }

        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();

        source.buffer = this.music.get(name);
        source.loop = loop;

        // Плавное появление
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(
            this.volumes.music,
            this.context.currentTime + fadeIn / 1000
        );

        source.connect(gainNode);
        gainNode.connect(this.masterGain);

        source.start(0);

        this.currentMusic = { source, gainNode, name };
    }

    /**
     * Остановить музыку
     * @param {number} fadeOut - время плавного затухания (мс)
     */
    stopMusic(fadeOut = 500) {
        if (!this.currentMusic) return;

        const { source, gainNode } = this.currentMusic;

        gainNode.gain.linearRampToValueAtTime(
            0,
            this.context.currentTime + fadeOut / 1000
        );

        setTimeout(() => {
            try {
                source.stop();
            } catch (e) {
                // Уже остановлен
            }
        }, fadeOut);

        this.currentMusic = null;
    }

    /**
     * Пауза музыки
     */
    pauseMusic() {
        if (this.context && this.context.state === 'running') {
            this.context.suspend();
        }
    }

    /**
     * Возобновить музыку
     */
    resumeMusic() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    /**
     * Установить громкость
     * @param {string} type - 'master', 'sfx', или 'music'
     * @param {number} value - громкость (0-1)
     */
    setVolume(type, value) {
        this.volumes[type] = Math.max(0, Math.min(1, value));

        if (type === 'master' && this.masterGain) {
            this.masterGain.gain.value = this.volumes.master;
        }

        if (type === 'music' && this.currentMusic) {
            this.currentMusic.gainNode.gain.value = this.volumes.music;
        }
    }

    /**
     * Получить громкость
     * @param {string} type 
     * @returns {number}
     */
    getVolume(type) {
        return this.volumes[type];
    }

    /**
     * Отключить звук
     */
    mute() {
        if (this.masterGain) {
            this.masterGain.gain.value = 0;
        }
    }

    /**
     * Включить звук
     */
    unmute() {
        if (this.masterGain) {
            this.masterGain.gain.value = this.volumes.master;
        }
    }
}

// Синглтон для глобального использования
export const audio = new AudioManager();
