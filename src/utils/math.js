// Математические функции
export function clamp(value, min, max) {
    if (value === null || min === null || max === null) {
        throw new ReferenceError('Cannot pass null to clamp function');
    }
    if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
        throw new TypeError('clamp function expects three numbers as arguments');
    }
    if (Number.isNaN(value) || Number.isNaN(min) || Number.isNaN(max)) {
        throw new RangeError('clamp function expects three valid numbers as arguments');
    }
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}

export function lerp(start, end, t) {
    if (start === null || end === null || t === null) {
        throw new ReferenceError('Cannot pass null to lerp function');
    }
    if (typeof start !== 'number' || typeof end !== 'number' || typeof t !== 'number') {
        throw new TypeError('lerp function expects three numbers as arguments');
    }
    if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(t)) {
        throw new RangeError('lerp function expects three valid numbers as arguments');
    }
    return start + t * (end - start);
}
