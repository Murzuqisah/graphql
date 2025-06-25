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

    checkExistingSession() {
        const token = localStorage.getItem('authToken');
        if (token) {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.currentPage = 'profile';
        } else {
            this.currentPage = 'login';
        }
        this.renderCurrentPage();
    }

    renderCurrentPage() {
        if (this.currentPage === 'login') {
            this.LoginPage.render(this.appContainer);
        } else if (this.currentPage === 'profile') {
            this.ProfilePage.render(this.appContainer);
        }
    }
}

new App();