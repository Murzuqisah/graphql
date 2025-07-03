export class XPProgressChart {
    constructor(transactions) {
        this.transactions = transactions;
        this.element = null;
    }

    processData() {
        const sortedTransactions = [...this.transactions].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        let cumulativeXP = 0;
        return sortedTransactions.map((transaction, index) => {
            cumulativeXP += transaction.amount;
            return {
                date: new Date(transaction.createdAt),
                xp: cumulativeXP,
                project: transaction.object?.name || 'Unknown Project',
                amount: transaction.amount,
                index,
            };
        });
    }

    render() {
        const chartData = this.processData();
        
        if (chartData.length === 0) {
            return this.renderEmptyState();
        }

        const maxXP = Math.max(...chartData.map(d => d.xp));
        const minXP = Math.min(...chartData.map(d => d.xp));
        const xpRange = maxXP - minXP || 1;

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 60, left: 80 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const getX = (index) => (index / (chartData.length - 1)) * chartWidth;
        const getY = (xp) => chartHeight - ((xp - minXP) / xpRange) * chartHeight;

        const pathData = chartData
            .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.xp)}`)
            .join(' ');

        const areaData = `M ${getX(0)} ${chartHeight} L ${pathData.substring(2)} L ${getX(chartData.length - 1)} ${chartHeight} Z`;

        const div = document.createElement('div');
        div.className = 'w-full';
        
        div.innerHTML = `
            <div class="mb-4">
                <h4 class="text-lg font-semibold text-secondary-900 mb-2">XP Progress Over Time</h4>
                <p class="text-sm text-secondary-600">
                    Total XP earned: <span class="font-semibold text-primary-600">${maxXP.toLocaleString()}</span>
                </p>
            </div>

            <div class="overflow-x-auto">
                <svg width="${width}" height="${height}" class="border border-secondary-200 rounded-lg bg-white">
                    <defs>
                        <linearGradient id="xpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.3" />
                            <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.05" />
                        </linearGradient>
                    </defs>

                    <g transform="translate(${margin.left}, ${margin.top})">
                        ${this.renderGridLines(chartWidth, chartHeight, maxXP, minXP)}
                        <path d="${areaData}" fill="url(#xpGradient)" />
                        <path
                            d="${pathData}"
                            fill="none"
                            stroke="#0ea5e9"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        ${this.renderDataPoints(chartData, getX, getY)}
                        ${this.renderXAxisLabels(chartData, getX, chartHeight)}
                    </g>

                    <text
                        x="${margin.left / 2}"
                        y="${height / 2}"
                        text-anchor="middle"
                        transform="rotate(-90, ${margin.left / 2}, ${height / 2})"
                        class="text-sm fill-secondary-700 font-medium"
                    >
                        XP Amount
                    </text>
                    <text
                        x="${width / 2}"
                        y="${height - 10}"
                        text-anchor="middle"
                        class="text-sm fill-secondary-700 font-medium"
                    >
                        Timeline
                    </text>
                </svg>
            </div>
        `;

        this.element = div;
        return this.element;
    }

    renderGridLines(chartWidth, chartHeight, maxXP, minXP) {
        return [0, 0.25, 0.5, 0.75, 1].map((ratio) => `
            <line
                x1="0"
                y1="${chartHeight * ratio}"
                x2="${chartWidth}"
                y2="${chartHeight * ratio}"
                stroke="#e2e8f0"
                stroke-width="1"
            />
            <text
                x="-10"
                y="${chartHeight * ratio + 5}"
                text-anchor="end"
                class="text-xs fill-secondary-500"
            >
                ${Math.round(maxXP - (maxXP - minXP) * ratio).toLocaleString()}
            </text>
        `).join('');
    }

    renderDataPoints(chartData, getX, getY) {
        return chartData.map((d, i) => `
            <circle
                cx="${getX(i)}"
                cy="${getY(d.xp)}"
                r="4"
                fill="#0ea5e9"
                stroke="white"
                stroke-width="2"
                class="hover:r-6 transition-all duration-200 cursor-pointer"
            >
                <title>
                    ${d.project}: +${d.amount} XP
                    Total: ${d.xp.toLocaleString()} XP
                    Date: ${d.date.toLocaleDateString()}
                </title>
            </circle>
        `).join('');
    }

    renderXAxisLabels(chartData, getX, chartHeight) {
        return chartData.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0).map((d) => `
            <text
                x="${getX(chartData.indexOf(d))}"
                y="${chartHeight + 20}"
                text-anchor="middle"
                class="text-xs fill-secondary-500"
            >
                ${d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
        `).join('');
    }

    renderEmptyState() {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-center h-64 text-secondary-500';
        div.innerHTML = `
            <div class="text-center">
                <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                </svg>
                <p>No XP data available</p>
            </div>
        `;
        return div;
    }

    show(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}