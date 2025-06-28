import { LoginPage } from "../ui/login.js";
import { ProfilePage } from "../ui/profile.js";

// Create a simple appController for routing context
const appController = {
    handleLoginSuccess(user) {
        localStorage.setItem('authToken', user.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        location.hash = '#/profile';
    },
    handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        location.hash = '#/login';
    }
};

const loginPage = new LoginPage(appController);
const profilePage = new ProfilePage(appController);

const routes = {
    login: (container) => loginPage.render(container),
    profile: (container) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        profilePage.render(container, user);
    }
};

function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            return false;
        }
        return true;
    } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        return false;
    }
}

const parseRoute = () => {
    const hash = location.hash;

    if (!hash || hash === '#') {
        location.hash = isAuthenticated() ? '#/profile' : '#/login';
        return;
    }

    const route = hash.replace('#/', '');
    const view = routes[route];
    const app = document.getElementById('app');

    const protectedRoutes = ['profile'];
    if (protectedRoutes.includes(route) && !isAuthenticated()) {
        location.hash = '#/login';
        return;
    }

    if (view) {
        app.innerHTML = '';
        view(app);
    } else {
        app.innerHTML = '<h2>404 - Page Not Found</h2>';
    }
};

window.addEventListener('hashchange', parseRoute);
window.addEventListener('load', parseRoute);