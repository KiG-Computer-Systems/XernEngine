// 2D вектор для математических операций
export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Клонировать вектор
     * @returns {Vector2}
     */
    clone() {
        return new Vector2(this.x, this.y);
    }

    /**
     * Копировать значения из другого вектора
     * @param {Vector2} v 
     * @returns {Vector2}
     */
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    /**
     * Установить значения
     * @param {number} x 
     * @param {number} y 
     * @returns {Vector2}
     */
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Сложение векторов
     * @param {Vector2} v 
     * @returns {Vector2}
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * Вычитание векторов
     * @param {Vector2} v 
     * @returns {Vector2}
     */
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /**
     * Умножение на скаляр
     * @param {number} scalar 
     * @returns {Vector2}
     */
    mul(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Деление на скаляр
     * @param {number} scalar 
     * @returns {Vector2}
     */
    div(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
        }
        return this;
    }

    /**
     * Длина вектора
     * @returns {number}
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Квадрат длины (быстрее чем length)
     * @returns {number}
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Нормализовать вектор
     * @returns {Vector2}
     */
    normalize() {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }

    /**
     * Получить нормализованную копию
     * @returns {Vector2}
     */
    normalized() {
        return this.clone().normalize();
    }

    /**
     * Скалярное произведение
     * @param {Vector2} v 
     * @returns {number}
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Векторное произведение (2D возвращает скаляр)
     * @param {Vector2} v 
     * @returns {number}
     */
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    /**
     * Расстояние до другого вектора
     * @param {Vector2} v 
     * @returns {number}
     */
    distanceTo(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Квадрат расстояния (быстрее)
     * @param {Vector2} v 
     * @returns {number}
     */
    distanceToSq(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    /**
     * Угол вектора в радианах
     * @returns {number}
     */
    angle() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Угол до другого вектора
     * @param {Vector2} v 
     * @returns {number}
     */
    angleTo(v) {
        return Math.atan2(v.y - this.y, v.x - this.x);
    }

    /**
     * Повернуть вектор
     * @param {number} angle - угол в радианах
     * @returns {Vector2}
     */
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Линейная интерполяция
     * @param {Vector2} v - целевой вектор
     * @param {number} t - коэффициент (0-1)
     * @returns {Vector2}
     */
    lerp(v, t) {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        return this;
    }

    /**
     * Отразить вектор относительно нормали
     * @param {Vector2} normal - нормаль поверхности
     * @returns {Vector2}
     */
    reflect(normal) {
        const dot = this.dot(normal);
        this.x -= 2 * dot * normal.x;
        this.y -= 2 * dot * normal.y;
        return this;
    }

    /**
     * Ограничить длину вектора
     * @param {number} max 
     * @returns {Vector2}
     */
    clampLength(max) {
        const len = this.length();
        if (len > max) {
            this.mul(max / len);
        }
        return this;
    }

    /**
     * Инвертировать вектор
     * @returns {Vector2}
     */
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * Получить перпендикулярный вектор
     * @returns {Vector2}
     */
    perpendicular() {
        return new Vector2(-this.y, this.x);
    }

    /**
     * Проверить равенство
     * @param {Vector2} v 
     * @returns {boolean}
     */
    equals(v) {
        return this.x === v.x && this.y === v.y;
    }

    /**
     * Преобразовать в массив
     * @returns {Array}
     */
    toArray() {
        return [this.x, this.y];
    }

    /**
     * Преобразовать в строку
     * @returns {string}
     */
    toString() {
        return `Vector2(${this.x}, ${this.y})`;
    }

    // Статические методы

    /**
     * Создать из угла
     * @param {number} angle - угол в радианах
     * @param {number} length - длина
     * @returns {Vector2}
     */
    static fromAngle(angle, length = 1) {
        return new Vector2(
            Math.cos(angle) * length,
            Math.sin(angle) * length
        );
    }

    /**
     * Создать случайный вектор
     * @param {number} length - длина
     * @returns {Vector2}
     */
    static random(length = 1) {
        const angle = Math.random() * Math.PI * 2;
        return Vector2.fromAngle(angle, length);
    }

    /**
     * Линейная интерполяция между двумя векторами
     * @param {Vector2} a 
     * @param {Vector2} b 
     * @param {number} t 
     * @returns {Vector2}
     */
    static lerp(a, b, t) {
        return new Vector2(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t
        );
    }

    /**
     * Сумма двух векторов
     * @param {Vector2} a 
     * @param {Vector2} b 
     * @returns {Vector2}
     */
    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    /**
     * Разность двух векторов
     * @param {Vector2} a 
     * @param {Vector2} b 
     * @returns {Vector2}
     */
    static sub(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    // Константы
    static get ZERO() { return new Vector2(0, 0); }
    static get ONE() { return new Vector2(1, 1); }
    static get UP() { return new Vector2(0, -1); }
    static get DOWN() { return new Vector2(0, 1); }
    static get LEFT() { return new Vector2(-1, 0); }
    static get RIGHT() { return new Vector2(1, 0); }
}
