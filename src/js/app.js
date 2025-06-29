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
            this.setupRouting();
        });
    }

    setupRouting() {
        window.addEventListener('hashchange', () => this.handleRouteChange());
        this.handleRouteChange();
    }

    handleRouteChange() {
        const hash = location.hash.replace(/^#\/?/, '').split('/')[0];
        if (hash === 'profile') {
            const token = localStorage.getItem('authToken');
            if (!token) {
                this.navigateTo('login');
                return;
            }
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.currentPage = 'profile';
        } else {
            this.currentPage = 'login';
        }
        this.renderCurrentPage();
    }

    navigateTo(page) {
        location.hash = `#/${page}`;
    }

    handleLoginSuccess(user) {
        this.currentUser = user;
        localStorage.setItem('authToken', user.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.navigateTo('profile');
    }

    handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.navigateTo('login');
    }

    renderCurrentPage() {
        if (!this.appContainer) return;
        this.appContainer.innerHTML = '';
        if (this.currentPage === 'login') {
            this.loginPage.render(this.appContainer);
        } else if (this.currentPage === 'profile') {
            this.profilePage.render(this.appContainer, this.currentUser);
        }
    }
}

new App();
// Only app.js should control routing and rendering.