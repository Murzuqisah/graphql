class App {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'login';
        this.appContainer = null;

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.appContainer = document.getElementById('app');
            this.renderPage();
        });
    }

    renderPage() {
    }
}