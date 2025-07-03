export class AuditRatioChart {
    constructor(userData) {
        this.userData = userData;
        this.element = null;
    }

    processData() {
        const auditsDone = this.userData.auditsDone || 0;
        const auditsReceived = this.userData.auditsReceived || 0;
        // Correct calculation: audits-received / audits-done
        const ratio = auditsDone > 0 ? auditsReceived / auditsDone : 0;
        
        return {
            done: auditsDone,
            received: auditsReceived,
            ratio: ratio,
            total: auditsDone + auditsReceived,
        };
    }

    render() {
        const auditData = this.processData();
        
        if (auditData.total === 0) {
            return this.renderEmptyState();
        }

        const maxValue = Math.max(auditData.done, auditData.received);
        const barHeight = 40;
        const chartWidth = 400;
        const chartHeight = 200;

        const div = document.createElement('div');
        div.className = 'w-full';
        
        div.innerHTML = `
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-secondary-900 mb-2">Audit Activity (Module #75)</h4>
                <p class="text-sm text-secondary-600">
                    Audit ratio: <span class="font-semibold text-purple-600">${auditData.ratio.toFixed(2)}</span>
                    ${auditData.ratio >= 1 ? ' (Good balance)' : ' (Need more received audits)'}
                </p>
                <p class="text-xs text-secondary-500 mt-1">
                    Formula: Audits Received ÷ Audits Done = ${auditData.received} ÷ ${auditData.done} = ${auditData.ratio.toFixed(2)}
                </p>
            </div>

            <div class="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
                <div class="bg-white p-6 rounded-lg border border-secondary-200">
                    <svg width="${chartWidth}" height="${chartHeight}">
                        <g>
                            <rect
                                x="50"
                                y="40"
                                width="${maxValue > 0 ? (auditData.done / maxValue) * (chartWidth - 100) : 0}"
                                height="${barHeight}"
                                fill="#8b5cf6"
                                rx="4"
                                class="transition-all duration-1000 ease-out"
                            />
                            <text x="40" y="65" text-anchor="end" class="text-sm fill-secondary-700">
                                Done
                            </text>
                            <text
                                x="${55 + (maxValue > 0 ? (auditData.done / maxValue) * (chartWidth - 100) : 0)}"
                                y="65"
                                class="text-sm fill-white font-medium"
                            >
                                ${auditData.done}
                            </text>
                        </g>

                        <g>
                            <rect
                                x="50"
                                y="100"
                                width="${maxValue > 0 ? (auditData.received / maxValue) * (chartWidth - 100) : 0}"
                                height="${barHeight}"
                                fill="#06b6d4"
                                rx="4"
                                class="transition-all duration-1000 ease-out"
                            />
                            <text x="40" y="125" text-anchor="end" class="text-sm fill-secondary-700">
                                Received
                            </text>
                            <text
                                x="${55 + (maxValue > 0 ? (auditData.received / maxValue) * (chartWidth - 100) : 0)}"
                                y="125"
                                class="text-sm fill-white font-medium"
                            >
                                ${auditData.received}
                            </text>
                        </g>

                        ${this.renderGridLines(chartWidth)}
                    </svg>
                </div>

                ${this.renderStatsCards(auditData)}
            </div>
        `;

        this.element = div;
        return this.element;
    }

    renderGridLines(chartWidth) {
        return [0, 0.25, 0.5, 0.75, 1].map((ratio) => `
            <line
                x1="${50 + ratio * (chartWidth - 100)}"
                y1="30"
                x2="${50 + ratio * (chartWidth - 100)}"
                y2="150"
                stroke="#e2e8f0"
                stroke-width="1"
                stroke-dasharray="2,2"
            />
        `).join('');
    }

    renderStatsCards(auditData) {
        return `
            <div class="space-y-4">
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-purple-600 font-medium">Audits Done</p>
                            <p class="text-2xl font-bold text-purple-700">${auditData.done}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-cyan-600 font-medium">Audits Received</p>
                            <p class="text-2xl font-bold text-cyan-700">${auditData.received}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-r p-4 rounded-lg border ${
                    auditData.ratio >= 1 
                        ? 'from-green-50 to-green-100 border-green-200' 
                        : 'from-orange-50 to-orange-100 border-orange-200'
                }">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center ${
                            auditData.ratio >= 1 ? 'bg-green-500' : 'bg-orange-500'
                        }">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium ${
                                auditData.ratio >= 1 ? 'text-green-600' : 'text-orange-600'
                            }">
                                Audit Ratio
                            </p>
                            <p class="text-2xl font-bold ${
                                auditData.ratio >= 1 ? 'text-green-700' : 'text-orange-700'
                            }">
                                ${auditData.ratio.toFixed(2)}
                            </p>
                            <p class="text-xs ${
                                auditData.ratio >= 1 ? 'text-green-600' : 'text-orange-600'
                            }">
                                Received ÷ Done
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-center h-64 text-secondary-500';
        div.innerHTML = `
            <div class="text-center">
                <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No audit data available for Module #75</p>
            </div>
        `;
        return div;
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}