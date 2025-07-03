import { AuthManager } from '../utils/auth.js';
import { UserInfo } from './UserInfo.js';
import { Statistics } from './Statistics.js';
import { LoadingSpinner } from './LoadingSpinner.js';
import { ProfileTemplate } from './templates/ProfileTemplate.js';
import { Navigation } from './Navigation.js';

export class Profile {
    constructor(onLogout, userData = null) {
        this.onLogout = onLogout;
        this.userData = userData;
        this.element = null;
        this.isLoading = !userData;
        this.error = '';
    }

    async initialize() {
        if (this.userData) return;
        
        try {
            const { GraphQLClient } = await import('../utils/graphql.js');
            const userId = AuthManager.getUserIdFromToken();
            if (!userId) {
                throw new Error('Unable to get user ID from token');
            }

            this.userData = await GraphQLClient.getUserData(userId);
            this.isLoading = false;
        } catch (err) {
            this.error = err instanceof Error ? err.message : 'Failed to fetch user data';
            this.isLoading = false;
            console.error('Error fetching user data:', err);
        }
    }

    render() {
        if (this.isLoading) {
            const loadingSpinner = new LoadingSpinner();
            return loadingSpinner.render();
        }

        if (this.error) {
            return this.renderError();
        }

        if (!this.userData || !this.userData.user.length) {
            return this.renderNoData();
        }

        this.element = ProfileTemplate.create();
        this.setupEventListeners();
        this.renderNavigation();
        this.renderUserInfo();
        this.renderStatistics();
        
        return this.element;
    }

    renderError() {
        const div = document.createElement('div');
        div.className = 'min-h-screen flex items-center justify-center bg-secondary-50 px-4';
        div.innerHTML = `
            <div class="card max-w-md w-full text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h2 class="text-xl font-semibold text-secondary-900 mb-2">Error Loading Profile</h2>
                <p class="text-secondary-600 mb-6">${this.error}</p>
                <button id="error-logout-btn" class="btn-primary">
                    Back to Login
                </button>
            </div>
        `;
        
        div.querySelector('#error-logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });
        
        return div;
    }

    renderNoData() {
        const div = document.createElement('div');
        div.className = 'min-h-screen flex items-center justify-center bg-secondary-50 px-4';
        div.innerHTML = `
            <div class="card max-w-md w-full text-center">
                <h2 class="text-xl font-semibold text-secondary-900 mb-2">No User Data Found</h2>
                <p class="text-secondary-600 mb-6">Unable to load your profile information.</p>
                <button id="nodata-logout-btn" class="btn-primary">
                    Back to Login
                </button>
            </div>
        `;
        
        div.querySelector('#nodata-logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });
        
        return div;
    }

    setupEventListeners() {
        const logoutButton = this.element.querySelector('#logout-button');
        logoutButton.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    renderNavigation() {
        const navContainer = this.element.querySelector('#navigation');
        if (navContainer) {
            const navigation = new Navigation('dashboard');
            navigation.show(navContainer);
        }
    }

    renderUserInfo() {
        const userInfoContainer = this.element.querySelector('#user-info');
        const userInfo = new UserInfo(this.userData.user[0], this.userData);
        userInfo.show(userInfoContainer);
    }

    renderStatistics() {
        const statisticsContainer = this.element.querySelector('#statistics');
        const statistics = new Statistics(this.userData);
        statistics.show(statisticsContainer);
    }

    handleLogout() {
        AuthManager.removeAuthToken();
        this.onLogout();
    }

    async show(container) {
        if (!this.userData) {
            // Show loading first
            const loadingSpinner = new LoadingSpinner();
            loadingSpinner.show(container);
            
            // Initialize data
            await this.initialize();
        }
        
        // Render the actual profile
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}