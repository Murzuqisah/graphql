import { LoginPage } from './ui/login.js';
// import { ProfilePage } from './ui/profile.js'; // Uncomment and implement as needed

class App {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'login';
        this.appContainer = null;

        this.loginPage = new LoginPage(this);
        // this.profilePage = new ProfilePage(this); // Uncomment and implement as needed

        document.addEventListener('DOMContentLoaded', () => {
            this.appContainer = document.getElementById('app');
            this.checkExistingSession();
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

    handleLoginSuccess(user) {
        this.currentUser = user;
        localStorage.setItem('authToken', user.token || 'mock-token');
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentPage = 'profile';
        this.renderCurrentPage();
    }

    renderCurrentPage() {
        if (this.currentPage === 'login') {
            this.loginPage.render(this.appContainer);
        } else if (this.currentPage === 'profile') {
            // this.profilePage.render(this.appContainer, this.currentUser); // Uncomment and implement as needed
            this.appContainer.innerHTML = '<div>Profile page placeholder</div>'; // Temporary placeholder
        }
    }
}

new App();