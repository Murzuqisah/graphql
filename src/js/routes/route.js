export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.container = null;
    }

    addRoute(path, handler) {
        this.routes.set(path, handler);
    
    }
}