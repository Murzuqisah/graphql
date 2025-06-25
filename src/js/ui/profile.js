import { DOMUtils } from '../controller.js';

class ProfilePage {
    constructor(appController) {
        this.appController = appController;
    }

    render(container, userData) {
        console.log('Rendering profile page for user:', userData);

        container.innerHTML = '';

        const pageContainer = DOMUtils.createElement('div', 'container fade-in');
        const title = DOMUtils.createElement('h1', '', 'My Profile');
        const welcomeMsg = this.createWelcomeMessage(userData);
        const profileInfo = this.createProfileInfo(userData);
        const logoutButton = this.createLogoutButton();

        pageContainer.appendChild(title);
        pageContainer.appendChild(welcomeMsg);
        pageContainer.appendChild(profileInfo);
        pageContainer.appendChild(logoutButton);
        container.appendChild(pageContainer);

        this.attachEventListeners();
    }

    createWelcomeMessage(userData) {
        const welcomeMsg = DOMUtils.createElement('div', 'welcome-message');
        welcomeMsg.innerHTML = `
            Welcome back, <strong>${userData.username}</strong>!<br>
            You are successfully logged in.
        `;
        return welcomeMsg;
    }

    createProfileInfo(userData) {
        const profileInfo = DOMUtils.createElement('div', 'profile-info');
        const profileTitle = DOMUtils.createElement('h3', '', 'Account Information');
        profileTitle.style.marginBottom = '1rem';
        profileTitle.style.color = '#333';

        const userInfo = DOMUtils.createElement('div');
        const loginTime = new Date(userData.loginTime).toLocaleString();
        userInfo.innerHTML = `
            <p><strong>Username:</strong> ${userData.username}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Last Login:</strong> ${loginTime}</p>
        `;

        profileInfo.appendChild(profileTitle);
        profileInfo.appendChild(userInfo);

        return profileInfo;
    }

    createLogoutButton() {
        const logoutButton = DOMUtils.createElement('button', '', 'Sign Out');
        logoutButton.id = 'logoutButton';
        return logoutButton;
    }

    attachEventListeners() {
        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', () => this.handleLogout());
    }

    handleLogout() {
        console.log('Handling logout');

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.disabled = true;
        logoutButton.textContent = 'Signing Out...';

        setTimeout(() => {
            console.log('Logout successful');
            this.appController.handleLogout();
        }, 500);
    }
}

export { ProfilePage };