import { DOMUtils } from '../controller.js';
import { renderRankSection } from './rank.js';

const GRAPHQL_API = "https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql";

class ProfilePage {
    constructor(appController) {
        this.appController = appController;
    }

    async render(container, userData) {
        console.log('Rendering ProfilePage with userData:', userData);
        container.innerHTML = '';
        const token = userData.token;

        // Fetch user school info and stats
        let profileData = {};
        try {
            profileData = await this.fetchProfileData(token, userData.username);
            if (!profileData || !profileData.login) {
                throw new Error("No profile data found.");
            }
        } catch (e) {
            if (e.message && e.message.toLowerCase().includes("jwt")) {
                this.appController.handleLogout();
                return;
            }
            container.innerHTML = `<div class="error-message show">Failed to load profile data.<br>${e.message || ''}</div>`;
            return;
        }

        // Store for chart updates
        window.userData = {
            ...profileData,
            xpProgression: Array.isArray(profileData.transactions) ? profileData.transactions : [],
        };

        const pageContainer = DOMUtils.createElement('div', 'container fade-in');
        const title = DOMUtils.createElement('h1', '', 'My Profile');
        const welcomeMsg = this.createWelcomeMessage(userData, profileData);
        const profileInfo = this.createProfileInfo(userData, profileData);

        // --- Add rank section here ---
        const rankSection = document.createElement('div');
        const level = typeof profileData.level === 'number' ? profileData.level : 1;
        const transactions = Array.isArray(profileData.transactions) ? profileData.transactions : [];
        renderRankSection(rankSection, level, transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0));
        // ---

        const logoutButton = this.createLogoutButton();

        pageContainer.appendChild(title);
        pageContainer.appendChild(welcomeMsg);
        pageContainer.appendChild(profileInfo);
        pageContainer.appendChild(rankSection);
        pageContainer.appendChild(logoutButton);
        container.appendChild(pageContainer);

        this.attachEventListeners();
    }

    async fetchProfileData(token, username) {
        const query = `
        query {
          user(where: {login: {_eq: "${username}"}}) {
            id
            login
            email
            totalUp
            totalDown
            auditsReceived
            auditsDone
            transactions(where: {type: {_eq: "xp"}}) {
              amount
              createdAt
              path
            }
            progresses {
              path
              grade
              updatedAt
            }
            skills: progresses(where: {grade: {_eq: 1}}) {
              path
              grade
            }
          }
        }
        `;
        const res = await fetch(GRAPHQL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        if (!res.ok) {
            if (res.status === 401) throw new Error("JWT expired or unauthorized.");
            throw new Error("Network error.");
        }

        const result = await res.json();
        if (result.errors && result.errors.length > 0) {
            throw new Error(result.errors[0].message || "GraphQL error.");
        }
        const data = result.data;
        return data.user && data.user[0] ? data.user[0] : {};
    }

    createWelcomeMessage(userData, profileData) {
        const welcomeMsg = DOMUtils.createElement('div', 'welcome-message');
        welcomeMsg.innerHTML = `
            Welcome back, <strong>${userData.username}</strong>!<br>
            You are successfully logged in.
        `;
        return welcomeMsg;
    }

    createProfileInfo(userData, profileData) {
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
            <p><strong>Audits Done:</strong> ${profileData.auditsDone || 0}</p>
            <p><strong>Audits Received:</strong> ${profileData.auditsReceived || 0}</p>
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
        const logoutButton = document.getElementById('logoutButton');
        logoutButton.disabled = true;
        logoutButton.textContent = 'Signing Out...';

        setTimeout(() => {
            this.appController.handleLogout();
        }, 500);
    }
}

export { ProfilePage };