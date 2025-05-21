import { renderLoginPage } from "../ui/login";

const routes = {
    login: renderLoginPage,
};

const parseRoute = () => {
    const hash = location.hash || '#/login';
    const route = hash.replace('#/', '');

    const view = routes[route];
    const app = document.getElementById('app');

    if (view) {
        app.innerHTML = '';
        view(app);
    } else {
        app.innerHTML = '<h2>404 - Page Not Found</h2>'
    }
}

window.addEventListener('hashchange', parseRoute);
window.addEventListener('load', parseRoute)