import { AuthManager } from '../utils/auth.js';
import { Navigation } from '../components/Navigation.js';
import { Statistics } from '../components/Statistics.js';

export class StatsPage {
    constructor(onLogout, userData) {
        this.onLogout = onLogout;
        this.userData = userData;
        this.element = null;
    }

    render() {
        const div = document.createElement('div');
        div.className = 'min-h-screen bg-secondary-50';
        
        div.innerHTML = `
            <header class="bg-white shadow-sm border-b border-secondary-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h1 class="text-xl font-semibold text-secondary-900">Statistics Overview</h1>
                        </div>
                        <button
                            id="logout-button"
                            class="btn-secondary flex items-center"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="space-y-8">
                    <div id="navigation"></div>
                    <div id="statistics-content"></div>
                </div>
            </main>
        `;

        this.element = div;
        this.setupEventListeners();
        this.renderNavigation();
        this.renderStatistics();
        
        return this.element;
    }

    setupEventListeners() {
        const logoutButton = this.element.querySelector('#logout-button');
        logoutButton.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    renderNavigation() {
        const navContainer = this.element.querySelector('#navigation');
        const navigation = new Navigation('stats');
        navigation.show(navContainer);
    }

    renderStatistics() {
        const statisticsContainer = this.element.querySelector('#statistics-content');
        const statistics = new Statistics(this.userData);
        statistics.show(statisticsContainer);
    }

    handleLogout() {
        AuthManager.removeAuthToken();
        this.onLogout();
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}