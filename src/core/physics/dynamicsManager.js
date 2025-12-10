// Менеджер динамики
export class DynamicsManager {
    constructor() {
        this.objects = [];
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    applyAllForces() {
        this.objects.forEach(obj => {
            // ...логика применения сил...
        });
    }
}
