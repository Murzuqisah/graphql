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
            this.renderCurrentPage();
        });
    }

    renderCurrentPage() {
        if (this.currentPage === 'login') {
            this.LoginPage.render(this.appContainer);
        }
    }
}

new App();