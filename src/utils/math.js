// Математические функции
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function lerp(start, end, t) {
    return start + t * (end - start);
}