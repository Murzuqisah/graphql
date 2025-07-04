import { AuthManager } from '../utils/auth.js';
import { Navigation } from '../components/Navigation.js';
import { AuditRatioChart } from '../components/charts/AuditRatioChart.js';

export class AuditsPage {
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
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h1 class="text-xl font-semibold text-secondary-900">Audits (Module #75)</h1>
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
                    
                    <!-- Audit Ratio Chart -->
                    <div class="card">
                        <div id="chart-container"></div>
                    </div>

                    <!-- Audit Transaction History -->
                    <div class="card">
                        <h3 class="text-xl font-semibold text-secondary-900 mb-6">Audit Transaction History</h3>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h4 class="text-lg font-medium text-secondary-800 mb-4 flex items-center">
                                    <div class="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                                    Up Transactions (Audits Done)
                                </h4>
                                <div id="up-transactions-list" class="space-y-3 max-h-64 overflow-y-auto">
                                    <!-- Will be populated by JavaScript -->
                                </div>
                            </div>
                            
                            <div>
                                <h4 class="text-lg font-medium text-secondary-800 mb-4 flex items-center">
                                    <div class="w-4 h-4 bg-gray-500 rounded mr-2"></div>
                                    Down Transactions (Audits Received)
                                </h4>
                                <div id="down-transactions-list" class="space-y-3 max-h-64 overflow-y-auto">
                                    <!-- Will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Audit Summary Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="card text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                            <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h4 class="text-lg font-semibold text-orange-900 mb-2">Total Done</h4>
                            <p class="text-3xl font-bold text-orange-700" id="total-done-display">-</p>
                            <p class="text-sm text-orange-600">Up transactions</p>
                        </div>
                        
                        <div class="card text-center bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                            <div class="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-2">Total Received</h4>
                            <p class="text-3xl font-bold text-gray-700" id="total-received-display">-</p>
                            <p class="text-sm text-gray-600">Down transactions</p>
                        </div>
                        
                        <div class="card text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h4 class="text-lg font-semibold text-purple-900 mb-2">Audit Ratio</h4>
                            <p class="text-3xl font-bold text-purple-700" id="ratio-display">-</p>
                            <p class="text-sm text-purple-600">Done ÷ Received</p>
                        </div>
                    </div>

                    <!-- Audit Tips -->
                    <div class="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <h3 class="text-xl font-semibold text-blue-900 mb-4">💡 Understanding Audit Transactions</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white p-4 rounded-lg">
                                <h4 class="font-semibold text-blue-800 mb-2">Up Transactions</h4>
                                <p class="text-sm text-blue-700">Represent audits you have completed for other students. Each transaction shows the points earned for conducting an audit.</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg">
                                <h4 class="font-semibold text-blue-800 mb-2">Down Transactions</h4>
                                <p class="text-sm text-blue-700">Represent audits you have received from other students. These show the evaluation points from peer reviews of your work.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        `;

        this.element = div;
        this.setupEventListeners();
        this.renderNavigation();
        this.renderChart();
        this.renderTransactionHistory();
        this.updateSummaryStats();

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
        const navigation = new Navigation('audits');
        navigation.show(navContainer);
    }

    renderChart() {
        const chartContainer = this.element.querySelector('#chart-container');
        const auditChart = new AuditRatioChart(this.userData);
        auditChart.show(chartContainer);
    }

    renderTransactionHistory() {
        this.renderTransactionList(this.userData.upTransactions, '#up-transactions-list', 'up');
        this.renderTransactionList(this.userData.downTransactions, '#down-transactions-list', 'down');
    }

    renderTransactionList(transactions, containerId, type) {
        const container = this.element.querySelector(containerId);

        if (!transactions || transactions.length === 0) {
            container.innerHTML = `<p class="text-secondary-500 text-sm">No ${type} transactions found for Module #75.</p>`;
            return;
        }

        // Sort transactions by date (newest first)
        const sortedTransactions = [...transactions].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        container.innerHTML = sortedTransactions.map(transaction => `
            <div class="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h5 class="font-medium text-secondary-900">
                            ${transaction.object?.name || 'Audit Transaction'}
                        </h5>
                        <p class="text-sm text-secondary-600">
                            Amount: <span class="font-semibold">${transaction.amount}</span> points
                        </p>
                        <p class="text-xs text-secondary-500">
                            ${new Date(transaction.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}
                        </p>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${type === 'up'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-gray-100 text-gray-800'
            }">
                        ${type === 'up' ? 'Done' : 'Received'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    updateSummaryStats() {
        const totalDone = this.userData.auditsDone || 0;
        const totalReceived = this.userData.auditsReceived || 0;
        const ratio = this.userData.auditRatio || 0;

        this.element.querySelector('#total-done-display').textContent = totalDone;
        this.element.querySelector('#total-received-display').textContent = totalReceived;
        this.element.querySelector('#ratio-display').textContent = ratio.toFixed(2);
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