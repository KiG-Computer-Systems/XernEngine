// Конечный автомат для управления состояниями
export class State {
    constructor(name) {
        this.name = name;
        this.machine = null;
    }

    /**
     * Вызывается при входе в состояние
     * @param {*} prevState - предыдущее состояние
     * @param {*} params - параметры перехода
     */
    enter(prevState, params) {}

    /**
     * Вызывается при выходе из состояния
     * @param {*} nextState - следующее состояние
     */
    exit(nextState) {}

    /**
     * Обновление состояния
     * @param {number} deltaTime 
     */
    update(deltaTime) {}

    /**
     * Отрисовка состояния (если нужно)
     * @param {*} context 
     */
    draw(context) {}
}

export class StateMachine {
    constructor(owner = null) {
        this.owner = owner;
        this.states = new Map();
        this.currentState = null;
        this.previousState = null;
        this.history = [];
        this.maxHistory = 10;
        
        // Callbacks
        this.onStateChange = null;
    }

    /**
     * Добавить состояние
     * @param {State} state 
     * @returns {StateMachine} - для цепочки вызовов
     */
    addState(state) {
        state.machine = this;
        this.states.set(state.name, state);
        return this;
    }

    /**
     * Создать и добавить простое состояние
     * @param {string} name 
     * @param {Object} handlers - {enter, exit, update, draw}
     * @returns {StateMachine}
     */
    createState(name, handlers = {}) {
        const state = new State(name);
        if (handlers.enter) state.enter = handlers.enter;
        if (handlers.exit) state.exit = handlers.exit;
        if (handlers.update) state.update = handlers.update;
        if (handlers.draw) state.draw = handlers.draw;
        return this.addState(state);
    }

    /**
     * Установить начальное состояние
     * @param {string} name 
     * @param {*} params 
     */
    start(name, params = null) {
        const state = this.states.get(name);
        if (!state) {
            throw new Error(`State "${name}" not found`);
        }

        this.currentState = state;
        state.enter(null, params);
        this._addToHistory(name);

        if (this.onStateChange) {
            this.onStateChange(null, state);
        }
    }

    /**
     * Перейти в новое состояние
     * @param {string} name - имя состояния
     * @param {*} params - параметры для enter()
     */
    setState(name, params = null) {
        const nextState = this.states.get(name);
        if (!nextState) {
            throw new Error(`State "${name}" not found`);
        }

        if (this.currentState === nextState) return;

        const prevState = this.currentState;
        
        if (prevState) {
            prevState.exit(nextState);
        }

        this.previousState = prevState;
        this.currentState = nextState;
        nextState.enter(prevState, params);
        this._addToHistory(name);

        if (this.onStateChange) {
            this.onStateChange(prevState, nextState);
        }
    }

    /**
     * Вернуться к предыдущему состоянию
     * @param {*} params 
     */
    goBack(params = null) {
        if (this.previousState) {
            this.setState(this.previousState.name, params);
        }
    }

    /**
     * Обновить текущее состояние
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        if (this.currentState) {
            this.currentState.update(deltaTime);
        }
    }

    /**
     * Отрисовать текущее состояние
     * @param {*} context 
     */
    draw(context) {
        if (this.currentState) {
            this.currentState.draw(context);
        }
    }

    /**
     * Получить текущее состояние
     * @returns {State|null}
     */
    getCurrentState() {
        return this.currentState;
    }

    /**
     * Получить имя текущего состояния
     * @returns {string|null}
     */
    getCurrentStateName() {
        return this.currentState ? this.currentState.name : null;
    }

    /**
     * Проверить, является ли текущим состояние
     * @param {string} name 
     * @returns {boolean}
     */
    is(name) {
        return this.currentState && this.currentState.name === name;
    }

    /**
     * Добавить в историю
     * @private
     */
    _addToHistory(name) {
        this.history.push({
            state: name,
            timestamp: Date.now()
        });
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    /**
     * Получить историю переходов
     * @returns {Array}
     */
    getHistory() {
        return [...this.history];
    }
}

// Пример использования для игровых состояний
export class GameStateMachine extends StateMachine {
    constructor() {
        super();
        
        // Предустановленные игровые состояния
        this.createState('loading', {
            enter: () => console.log('Loading...'),
            update: (dt) => {}
        });

        this.createState('menu', {
            enter: () => console.log('Main Menu'),
            update: (dt) => {}
        });

        this.createState('playing', {
            enter: () => console.log('Game Started'),
            update: (dt) => {}
        });

        this.createState('paused', {
            enter: () => console.log('Game Paused'),
            update: (dt) => {}
        });

        this.createState('gameOver', {
            enter: () => console.log('Game Over'),
            update: (dt) => {}
        });
    }
}
