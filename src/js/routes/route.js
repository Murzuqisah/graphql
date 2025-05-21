import { renderLoginPage } from "../ui/login";

const routes = {
    login: renderLoginPage,
};

isAuthenticated();

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
        app.innerHTML = '<h2>404 - Page Not Found</h2>'
    }
}

window.addEventListener('hashchange', parseRoute);
window.addEventListener('load', parseRoute)