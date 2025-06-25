import { LoginPage } from './ui/login.js';
import { ProfilePage } from './ui/profile.js';

class App {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'login';
        this.appContainer = null;

        this.loginPage = new LoginPage(this);
        this.profilePage = new ProfilePage(this);

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
        // Simulate JWT token for demo
        user.token = user.token || 'mock-jwt-token';
        this.currentUser = user;
        localStorage.setItem('authToken', user.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentPage = 'profile';
        this.renderCurrentPage();
    }

    handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.currentPage = 'login';
        this.renderCurrentPage();
    }

    renderCurrentPage() {
        if (this.currentPage === 'login') {
            this.loginPage.render(this.appContainer);
        } else if (this.currentPage === 'profile') {
            this.profilePage.render(this.appContainer, this.currentUser);
        }
    }
}

new App();

// No changes needed; logic is correct for JWT-based login/profile flow.