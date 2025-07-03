import { formatXPValue, getRank, getNextRank } from '../utils/utils.js';

export class UserInfo {
    constructor(user, userData) {
        this.user = user;
        this.userData = userData;
        this.element = null;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    getUserAttributes() {
        let attrs = {};
        try {
            if (this.user.attrs) {
                attrs = typeof this.user.attrs === 'string' 
                    ? JSON.parse(this.user.attrs) 
                    : this.user.attrs;
            }
        } catch (e) {
            console.error('Error parsing user attributes:', e);
            attrs = {};
        }
        return attrs;
    }

    calculateUserStats() {
        // Calculate total XP from event 75 transactions only
        const totalXPBytes = this.userData.transaction.reduce((sum, t) => sum + t.amount, 0);
        const totalXP = formatXPValue(totalXPBytes);
        
        // Get level from event 75
        const level = this.user.events && this.user.events.length > 0 ? this.user.events[0].level : 1;
        
        // Calculate rank information
        const currentRank = getRank(level);
        const nextRank = getNextRank(currentRank);
        
        // Calculate progress to next rank
        let progressPercent = 0;
        if (nextRank) {
            const currentLevelInRank = level - currentRank.minLevel;
            const levelsInCurrentRank = currentRank.maxLevel - currentRank.minLevel + 1;
            progressPercent = Math.min(100, (currentLevelInRank / levelsInCurrentRank) * 100);
        } else {
            progressPercent = 100; // Max rank reached
        }

        return {
            totalXP,
            totalXPBytes,
            level,
            currentRank,
            nextRank,
            progressPercent
        };
    }

    render() {
        const attrs = this.getUserAttributes();
        const stats = this.calculateUserStats();
        
        const firstName = attrs.firstName || '';
        const lastName = attrs.lastName || '';
        const email = attrs.email || `${this.user.login}@zone01kisumu.ke`;
        const campus = this.user.campus || 'Zone01 Kisumu';

        const div = document.createElement('div');
        div.className = 'card animate-fade-in';
        
        div.innerHTML = `
            <div class="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div class="flex items-start space-x-6">
                    <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        ${firstName?.[0] || this.user.login?.[0] || 'U'}${lastName?.[0] || ''}
                    </div>
                    
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold text-secondary-900 mb-2">
                            ${firstName && lastName ? `${firstName} ${lastName}` : this.user.login}
                        </h2>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div class="flex items-center text-secondary-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span class="font-medium">Username:</span>
                                <span class="ml-1">${this.user.login}</span>
                            </div>
                            
                            <div class="flex items-center text-secondary-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span class="font-medium">Email:</span>
                                <span class="ml-1">${email}</span>
                            </div>
                            
                            <div class="flex items-center text-secondary-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span class="font-medium">Campus:</span>
                                <span class="ml-1">${campus}</span>
                            </div>
                            
                            <div class="flex items-center text-secondary-600">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0zM12 1v6m0 0V1m0 6l4-4M12 7l-4-4" />
                                </svg>
                                <span class="font-medium">Member since:</span>
                                <span class="ml-1">${this.formatDate(this.user.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200 min-w-80">
                    <h3 class="text-lg font-semibold text-primary-900 mb-4">Module #75 Progress</h3>
                    
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-primary-700">Total XP:</span>
                            <span class="text-lg font-bold text-primary-900">${stats.totalXP}</span>
                        </div>
                        
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-primary-700">Level:</span>
                            <span class="text-lg font-bold text-primary-900">${stats.level}</span>
                        </div>
                        
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-primary-700">Current Rank:</span>
                            <span class="text-sm font-semibold text-primary-800">${stats.currentRank.name}</span>
                        </div>
                        
                        ${stats.nextRank ? `
                            <div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-medium text-primary-700">Progress to ${stats.nextRank.name}:</span>
                                    <span class="text-sm font-semibold text-primary-800">${Math.round(stats.progressPercent)}%</span>
                                </div>
                                <div class="w-full bg-primary-200 rounded-full h-3">
                                    <div 
                                        class="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-1000 ease-out"
                                        style="width: ${stats.progressPercent}%"
                                    ></div>
                                </div>
                            </div>
                        ` : `
                            <div class="text-center py-2">
                                <span class="text-sm font-semibold text-primary-800">🎉 Maximum Rank Achieved!</span>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        this.element = div;
        return this.element;
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}