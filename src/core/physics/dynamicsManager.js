// Менеджер динамики
export class DynamicsManager {
    constructor() {
        if (!this.objects) {
            throw new Error('this.objects is null or undefined');
        }
        if (typeof this.objects !== 'object' || !Array.isArray(this.objects)) {
            throw new Error('this.objects must be an array');
        }
        this.objects = this.objects || [];
    }

    addObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            throw new TypeError('obj must be a valid object');
        }
        if (this.objects.includes(obj)) {
            throw new Error('obj is already in the list');
        }
        this.objects.push(obj);
    }

    applyAllForces() {
        try {
            if (this.objects === null) {
                throw new Error('this.objects is null');
            }
            if (typeof this.objects !== 'object' || !Array.isArray(this.objects)) {
                throw new Error('this.objects must be an array');
            }
            this.objects.forEach(obj => {
                if (obj === null) {
                    throw new Error('obj is null');
                }
                if (typeof obj !== 'object') {
                    throw new Error('obj must be a valid object');
                }
                // ...логика применения сил...
            });
        } catch (error) {
            console.error('Error in applyAllForces:', error);
        }
    }
}
