import { LoadingTemplate } from './templates/LoadingTemplate.js';

export class LoadingSpinner {
    constructor() {
        this.element = null;
    }

    render() {
        this.element = LoadingTemplate.create();
        return this.element;
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}