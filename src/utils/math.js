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

export function normalize(value, min, max) {
    if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
        throw new TypeError('normalize expects numbers');
    }
    if (min === max) {
        throw new RangeError('normalize range cannot be zero');
    }
    return (value - min) / (max - min);
}

export function randomRange(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
        throw new TypeError('randomRange expects numbers');
    }
    if (min > max) {
        throw new RangeError('min cannot be greater than max');
    }
    return Math.random() * (max - min) + min;
}

export function approximately(a, b, epsilon = 1e-6) {
    if (typeof a !== 'number' || typeof b !== 'number' || typeof epsilon !== 'number') {
        throw new TypeError('approximately expects numbers');
    }
    return Math.abs(a - b) < epsilon;
}
