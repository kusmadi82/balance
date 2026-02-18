// Mock wallet data
const walletData = {
  tokens: [
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      chain: 'ethereum',
      balance: 12.5,
      price: 3245.67,
      change24h: 2.34,
      icon: '⟠'
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      chain: 'ethereum',
      balance: 0.85,
      price: 68420.50,
      change24h: -1.23,
      icon: '₿'
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      chain: 'solana',
      balance: 234.6,
      price: 142.89,
      change24h: 5.67,
      icon: '◎'
    },
    {
      id: 'usdc',
      name: 'USD Coin',
      symbol: 'USDC',
      chain: 'ethereum',
      balance: 15420.00,
      price: 1.00,
      change24h: 0.01,
      icon: '$'
    },
    {
      id: 'bnb',
      name: 'BNB',
      symbol: 'BNB',
      chain: 'bsc',
      balance: 45.2,
      price: 612.34,
      change24h: 1.89,
      icon: '◆'
    },
    {
      id: 'matic',
      name: 'Polygon',
      symbol: 'MATIC',
      chain: 'ethereum',
      balance: 8920.5,
      price: 0.87,
      change24h: -2.45,
      icon: '⬣'
    },
    {
      id: 'link',
      name: 'Chainlink',
      symbol: 'LINK',
      chain: 'ethereum',
      balance: 420.8,
      price: 18.56,
      change24h: 3.21,
      icon: '🔗'
    },
    {
      id: 'cake',
      name: 'PancakeSwap',
      symbol: 'CAKE',
      chain: 'bsc',
      balance: 1250.0,
      price: 3.42,
      change24h: -0.89,
      icon: '🥞'
    }
  ],
  transactions: [
    {
      type: 'receive',
      token: 'ETH',
      amount: 2.5,
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      to: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      timestamp: '2 hours ago',
      chain: 'ethereum',
      hash: '0x1a2b3c4d5e6f...'
    },
    {
      type: 'send',
      token: 'USDC',
      amount: 500.00,
      from: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      to: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
      timestamp: '5 hours ago',
      chain: 'ethereum',
      hash: '0x2b3c4d5e6f7a...'
    },
    {
      type: 'receive',
      token: 'SOL',
      amount: 15.8,
      from: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
      to: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      timestamp: '1 day ago',
      chain: 'solana',
      hash: '3c4d5e6f7a8b...'
    },
    {
      type: 'send',
      token: 'BNB',
      amount: 5.2,
      from: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      to: '0xdD870fA1b7C4700F2BD7f44238821C26f7392148',
      timestamp: '2 days ago',
      chain: 'bsc',
      hash: '4d5e6f7a8b9c...'
    },
    {
      type: 'receive',
      token: 'LINK',
      amount: 120.5,
      from: '0x583031D1113aD414F02576BD6afaBfb302140225',
      to: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      timestamp: '3 days ago',
      chain: 'ethereum',
      hash: '5e6f7a8b9c0d...'
    },
    {
      type: 'send',
      token: 'CAKE',
      amount: 250.0,
      from: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      to: '0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C',
      timestamp: '4 days ago',
      chain: 'bsc',
      hash: '6f7a8b9c0d1e...'
    }
  ]
};

let currentFilter = 'all';
let chart = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeChainFilters();
  updatePortfolioSummary();
  renderTokenTable();
  renderAllocationChart();
  renderTransactionHistory();
  animatePortfolioValue();
});

// Chain filter handling
function initializeChainFilters() {
  const pills = document.querySelectorAll('.chain-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.chain;
      renderTokenTable();
      renderAllocationChart();
      renderTransactionHistory();
    });
  });
}

// Calculate portfolio metrics
function getFilteredTokens() {
  if (currentFilter === 'all') return walletData.tokens;
  return walletData.tokens.filter(token => token.chain === currentFilter);
}

function calculatePortfolioValue(tokens) {
  return tokens.reduce((sum, token) => sum + (token.balance * token.price), 0);
}

function calculate24hChange(tokens) {
  const totalValue = calculatePortfolioValue(tokens);
  const yesterdayValue = tokens.reduce((sum, token) => {
    const yesterdayPrice = token.price / (1 + token.change24h / 100);
    return sum + (token.balance * yesterdayPrice);
  }, 0);
  
  const change = totalValue - yesterdayValue;
  const changePercent = (change / yesterdayValue) * 100;
  
  return { change, changePercent };
}

// Update summary cards
function updatePortfolioSummary() {
  const tokens = getFilteredTokens();
  const totalValue = calculatePortfolioValue(tokens);
  const { change, changePercent } = calculate24hChange(tokens);
  
  document.getElementById('portfolioValue').textContent = formatCurrency(totalValue);
  
  const pnlValue = document.getElementById('pnlValue');
  const pnlPercent = document.getElementById('pnlPercent');
  
  pnlValue.textContent = formatCurrency(change, true);
  pnlPercent.textContent = formatPercent(changePercent, true);
  
  if (change >= 0) {
    pnlValue.classList.add('positive');
    pnlValue.classList.remove('negative');
    pnlPercent.classList.add('positive');
    pnlPercent.classList.remove('negative');
  } else {
    pnlValue.classList.add('negative');
    pnlValue.classList.remove('positive');
    pnlPercent.classList.add('negative');
    pnlPercent.classList.remove('positive');
  }
  
  document.getElementById('assetCount').textContent = tokens.length;
  
  const chains = new Set(tokens.map(t => t.chain));
  document.getElementById('chainCount').textContent = chains.size;
}

// Animate portfolio value on load
function animatePortfolioValue() {
  const tokens = getFilteredTokens();
  const targetValue = calculatePortfolioValue(tokens);
  const element = document.getElementById('portfolioValue');
  
  let currentValue = 0;
  const duration = 1500;
  const steps = 60;
  const increment = targetValue / steps;
  const stepDuration = duration / steps;
  
  let step = 0;
  const timer = setInterval(() => {
    currentValue += increment;
    step++;
    
    if (step >= steps) {
      currentValue = targetValue;
      clearInterval(timer);
    }
    
    element.textContent = formatCurrency(currentValue);
  }, stepDuration);
}

// Render token holdings table
function renderTokenTable() {
  const tokens = getFilteredTokens();
  const tbody = document.getElementById('tokenTableBody');
  
  tbody.innerHTML = tokens.map((token, index) => {
    const value = token.balance * token.price;
    const changeClass = token.change24h >= 0 ? 'positive' : 'negative';
    const changeSymbol = token.change24h >= 0 ? '+' : '';
    
    return `
      <tr class="token-row border-t border-white/5">
        <td class="py-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl" 
                 style="background: rgba(212, 175, 55, 0.1);">
              ${token.icon}
            </div>
            <div>
              <div class="font-medium">${token.name}</div>
              <div class="text-xs text-gray-500">${token.symbol}</div>
            </div>
          </div>
        </td>
        <td class="py-4">
          <div class="font-mono">${formatNumber(token.balance)}</div>
          <div class="text-xs text-gray-500">${token.symbol}</div>
        </td>
        <td class="py-4">
          <div class="font-mono">${formatCurrency(token.price)}</div>
        </td>
        <td class="py-4">
          <div class="font-mono ${changeClass}">${changeSymbol}${token.change24h.toFixed(2)}%</div>
        </td>
        <td class="py-4 text-right">
          <div class="font-semibold">${formatCurrency(value)}</div>
        </td>
      </tr>
    `;
  }).join('');
  
  updatePortfolioSummary();
}

// Render allocation donut chart
function renderAllocationChart() {
  const tokens = getFilteredTokens();
  const ctx = document.getElementById('allocationChart').getContext('2d');
  
  const data = tokens.map(token => ({
    label: token.symbol,
    value: token.balance * token.price,
    color: getTokenColor(token.symbol)
  }));
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (chart) {
    chart.destroy();
  }
  
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        borderWidth: 0,
        borderRadius: 4,
        spacing: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: '#d4af37',
          bodyColor: '#e8e8e8',
          borderColor: 'rgba(212, 175, 55, 0.3)',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const value = context.parsed;
              const percent = ((value / total) * 100).toFixed(1);
              return ` ${context.label}: ${formatCurrency(value)} (${percent}%)`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });
  
  renderAllocationLegend(data, total);
}

function renderAllocationLegend(data, total) {
  const legend = document.getElementById('allocationLegend');
  
  legend.innerHTML = data.slice(0, 5).map(item => {
    const percent = ((item.value / total) * 100).toFixed(1);
    return `
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" style="background: ${item.color};"></div>
          <span class="text-gray-400">${item.label}</span>
        </div>
        <span class="font-mono text-gray-300">${percent}%</span>
      </div>
    `;
  }).join('');
}

// Render transaction history
function renderTransactionHistory() {
  const transactions = currentFilter === 'all' 
    ? walletData.transactions 
    : walletData.transactions.filter(tx => tx.chain === currentFilter);
  
  const list = document.getElementById('transactionList');
  
  list.innerHTML = transactions.map(tx => {
    const isReceive = tx.type === 'receive';
    const icon = isReceive ? '↓' : '↑';
    const iconBg = isReceive ? 'bg-green-500/10' : 'bg-red-500/10';
    const iconColor = isReceive ? 'text-green-400' : 'text-red-400';
    const typeText = isReceive ? 'Received' : 'Sent';
    
    return `
      <div class="tx-row glass rounded-xl p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="${iconBg} ${iconColor} w-10 h-10 rounded-full flex items-center justify-center font-bold">
            ${icon}
          </div>
          <div>
            <div class="font-medium">${typeText} ${formatNumber(tx.amount)} ${tx.token}</div>
            <div class="text-xs text-gray-500 mt-1">
              ${isReceive ? 'From' : 'To'}: 
              <span class="font-mono">${truncateAddress(isReceive ? tx.from : tx.to)}</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-400">${tx.timestamp}</div>
          <div class="text-xs text-gray-600 font-mono mt-1">${tx.hash}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Utility functions
function formatCurrency(value, includeSign = false) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(value));
  
  if (includeSign && value !== 0) {
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  }
  
  return formatted;
}

function formatNumber(value) {
  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
  return value.toFixed(4);
}

function formatPercent(value, includeSign = false) {
  const formatted = `${Math.abs(value).toFixed(2)}%`;
  
  if (includeSign && value !== 0) {
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  }
  
  return formatted;
}

function truncateAddress(address) {
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getTokenColor(symbol) {
  const colors = {
    'ETH': 'rgba(98, 126, 234, 0.8)',
    'BTC': 'rgba(247, 147, 26, 0.8)',
    'SOL': 'rgba(156, 39, 176, 0.8)',
    'USDC': 'rgba(33, 150, 243, 0.8)',
    'BNB': 'rgba(243, 186, 47, 0.8)',
    'MATIC': 'rgba(130, 71, 229, 0.8)',
    'LINK': 'rgba(41, 98, 255, 0.8)',
    'CAKE': 'rgba(255, 171, 0, 0.8)'
  };
  
  return colors[symbol] || 'rgba(212, 175, 55, 0.8)';
}