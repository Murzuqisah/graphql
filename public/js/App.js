import { AuthManager } from './utils/auth.js';
import { LoginComponent } from './components/LoginComponent.js';
import { Profile } from './components/Profile.js';
import { LoadingSpinner } from './components/LoadingSpinner.js';
import { XPProgressPage } from './pages/XPProgressPage.js';
import { ProjectsPage } from './pages/ProjectsPage.js';
import { AuditsPage } from './pages/AuditsPage.js';
import { SkillsPage } from './pages/SkillsPage.js';
import { StatsPage } from './pages/StatsPage.js';

export class App {
    constructor() {
        this.isLoggedIn = false;
        this.isLoading = true;
        this.currentPage = 'dashboard';
        this.userData = null;
        this.container = document.getElementById('app');
        
        this.init();
    }

    async init() {
        // Check if user is already authenticated
        this.isLoggedIn = AuthManager.isAuthenticated();
        this.isLoading = false;
        
        // Set up hash change listener for navigation
        window.addEventListener('hashchange', () => this.handleNavigation());
        
        this.render();
    }

    handleNavigation() {
        if (!this.isLoggedIn) return;
        
        const hash = window.location.hash.slice(1) || 'dashboard';
        this.currentPage = hash;
        this.renderPage();
    }

    handleLogin() {
        this.isLoggedIn = true;
        window.location.hash = 'dashboard';
        this.render();
    }

    handleLogout() {
        this.isLoggedIn = false;
        this.userData = null;
        window.location.hash = '';
        this.render();
    }

    async render() {
        if (this.isLoading) {
            const loadingSpinner = new LoadingSpinner();
            loadingSpinner.show(this.container);
            return;
        }

        if (this.isLoggedIn) {
            await this.renderPage();
        } else {
            const loginComponent = new LoginComponent(() => this.handleLogin());
            loginComponent.show(this.container);
        }
    }

    async renderPage() {
        const hash = window.location.hash.slice(1) || 'dashboard';
        this.currentPage = hash;

        // Load user data if not already loaded
        if (!this.userData) {
            await this.loadUserData();
        }

        switch (this.currentPage) {
            case 'dashboard':
                const profile = new Profile(() => this.handleLogout(), this.userData);
                profile.show(this.container);
                break;
            case 'stats':
                const statsPage = new StatsPage(() => this.handleLogout(), this.userData);
                statsPage.show(this.container);
                break;
            case 'xp-progress':
                const xpPage = new XPProgressPage(() => this.handleLogout(), this.userData);
                xpPage.show(this.container);
                break;
            case 'projects':
                const projectsPage = new ProjectsPage(() => this.handleLogout(), this.userData);
                projectsPage.show(this.container);
                break;
            case 'audits':
                const auditsPage = new AuditsPage(() => this.handleLogout(), this.userData);
                auditsPage.show(this.container);
                break;
            case 'skills':
                const skillsPage = new SkillsPage(() => this.handleLogout(), this.userData);
                skillsPage.show(this.container);
                break;
            default:
                window.location.hash = 'dashboard';
        }
    }

    async loadUserData() {
        try {
            const { GraphQLClient } = await import('./utils/graphql.js');
            const userId = AuthManager.getUserIdFromToken();
            if (!userId) {
                throw new Error('Unable to get user ID from token');
            }
            this.userData = await GraphQLClient.getUserData(userId);
        } catch (err) {
            console.error('Error loading user data:', err);
            this.handleLogout();
        }
    }
}