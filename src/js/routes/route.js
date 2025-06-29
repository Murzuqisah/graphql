export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.container = null;
    }

    addRoute(path, handler) {
        this.routes.set(path, handler);

    }

    setContainer(container) {
        this.container = container;
    }

    navigate(path, ...args) {
        if (!this.routes.has(path)) {
            return;
        }

        const Component = this.routes.get(path);
        this.currentRoute = path;

        if (this.container) {
            const componentInstance = new handler(...args);
            componentInstance.show(this.container);
        }
    }
}