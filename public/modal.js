// ==================== 弹窗模态框功能 ====================

// 存储详细数据
const anomalyDetailData = {
  liquidation: {
    title: '爆仓监控 - 详细数据',
    data: [
      { coin: 'BTC/USDT', type: 'long', amount: '$2.5M', price: '$97,234.50', time: '2026-01-30 12:05:32' },
      { coin: 'ETH/USDT', type: 'short', amount: '$1.8M', price: '$3,245.80', time: '2026-01-30 12:03:15' },
      { coin: 'SOL/USDT', type: 'long', amount: '$850K', price: '$218.75', time: '2026-01-30 12:01:48' },
      { coin: 'DOGE/USDT', type: 'short', amount: '$420K', price: '$0.0876', time: '2026-01-30 11:58:22' },
      { coin: 'XRP/USDT', type: 'long', amount: '$380K', price: '$2.15', time: '2026-01-30 11:55:07' },
      { coin: 'AVAX/USDT', type: 'short', amount: '$290K', price: '$35.20', time: '2026-01-30 11:52:33' },
      { coin: 'LINK/USDT', type: 'long', amount: '$180K', price: '$14.85', time: '2026-01-30 11:49:15' },
      { coin: 'ADA/USDT', type: 'short', amount: '$150K', price: '$0.52', time: '2026-01-30 11:45:58' },
      { coin: 'DOT/USDT', type: 'long', amount: '$120K', price: '$6.95', time: '2026-01-30 11:42:41' },
      { coin: 'MATIC/USDT', type: 'short', amount: '$95K', price: '$0.78', time: '2026-01-30 11:39:24' },
    ]
  },
  whale: {
    title: '大单异动 - 详细追踪',
    data: [
      { coin: 'BTC', amount: '500 BTC', value: '$48.6M', type: 'inflow', time: '12:05:45', exchange: 'Binance' },
      { coin: 'ETH', amount: '5,000 ETH', value: '$16.2M', type: 'outflow', time: '12:03:28', exchange: 'OKX' },
      { coin: 'USDT', amount: '10M USDT', value: '$10M', type: 'mint', time: '12:01:12', exchange: 'Tether' },
      { coin: 'SOL', amount: '8,500 SOL', value: '$1.86M', type: 'inflow', time: '11:58:55', exchange: 'Bybit' },
      { coin: 'DOGE', amount: '20M DOGE', value: '$1.75M', type: 'inflow', time: '11:56:38', exchange: 'Binance' },
      { coin: 'XRP', amount: '2M XRP', value: '$4.3M', type: 'outflow', time: '11:54:21', exchange: 'Bitget' },
      { coin: 'LINK', amount: '150K LINK', value: '$2.23M', type: 'inflow', time: '11:51:04', exchange: 'OKX' },
      { coin: 'AVAX', amount: '10K AVAX', value: '$352K', type: 'outflow', time: '11:48:47', exchange: 'Binance' },
      { coin: 'MATIC', amount: '3M MATIC', value: '$2.34M', type: 'inflow', time: '11:46:30', exchange: 'KuCoin' },
      { coin: 'ADA', amount: '8M ADA', value: '$4.16M', type: 'outflow', time: '11:44:13', exchange: 'Binance' },
    ]
  },
  funding: {
    title: '资金费率 - 实时监控',
    data: [
      { coin: 'BTC/USDT', rate: '0.0100%', predict: '0.0095%', status: 'positive', next: '08:00:00' },
      { coin: 'ETH/USDT', rate: '0.0120%', predict: '0.0118%', status: 'positive', next: '08:00:00' },
      { coin: 'SOL/USDT', rate: '-0.0050%', predict: '-0.0048%', status: 'negative', next: '08:00:00' },
      { coin: 'DOGE/USDT', rate: '0.0085%', predict: '0.0082%', status: 'positive', next: '08:00:00' },
      { coin: 'XRP/USDT', rate: '-0.0032%', predict: '-0.0030%', status: 'negative', next: '08:00:00' },
      { coin: 'AVAX/USDT', rate: '0.0150%', predict: '0.0145%', status: 'positive', next: '08:00:00' },
      { coin: 'LINK/USDT', rate: '0.0075%', predict: '0.0072%', status: 'positive', next: '08:00:00' },
      { coin: 'ADA/USDT', rate: '-0.0028%', predict: '-0.0025%', status: 'negative', next: '08:00:00' },
      { coin: 'DOT/USDT', rate: '0.0068%', predict: '0.0065%', status: 'positive', next: '08:00:00' },
      { coin: 'MATIC/USDT', rate: '0.0055%', predict: '0.0052%', status: 'positive', next: '08:00:00' },
    ]
  },
  oi: {
    title: '未平仓合约 - 详细分析',
    data: [
      { coin: 'BTC OI', value: '$15.2B', change24h: '+2.3%', change7d: '+5.8%', trend: 'up' },
      { coin: 'ETH OI', value: '$8.5B', change24h: '+1.8%', change7d: '+3.2%', trend: 'up' },
      { coin: 'SOL OI', value: '$2.1B', change24h: '-0.5%', change7d: '+8.5%', trend: 'down' },
      { coin: 'DOGE OI', value: '$650M', change24h: '+3.2%', change7d: '+12.3%', trend: 'up' },
      { coin: 'XRP OI', value: '$890M', change24h: '+1.5%', change7d: '+4.7%', trend: 'up' },
      { coin: 'AVAX OI', value: '$420M', change24h: '-2.1%', change7d: '+6.5%', trend: 'down' },
      { coin: 'LINK OI', value: '$380M', change24h: '+4.8%', change7d: '+9.2%', trend: 'up' },
      { coin: 'ADA OI', value: '$320M', change24h: '+2.7%', change7d: '+7.1%', trend: 'up' },
      { coin: 'DOT OI', value: '$280M', change24h: '-1.3%', change7d: '+3.8%', trend: 'down' },
      { coin: 'MATIC OI', value: '$410M', change24h: '+5.6%', change7d: '+11.5%', trend: 'up' },
    ]
  },
  orderbook: {
    title: '订单簿深度 - 详细数据',
    data: [
      { coin: 'BTC', bid: '$8.5M', ask: '$7.2M', ratio: '1.18', status: 'bullish' },
      { coin: 'ETH', bid: '$3.8M', ask: '$3.5M', ratio: '1.09', status: 'bullish' },
      { coin: 'SOL', bid: '$850K', ask: '$920K', ratio: '0.92', status: 'bearish' },
      { coin: 'DOGE', bid: '$2.3M', ask: '$2.1M', ratio: '1.10', status: 'bullish' },
      { coin: 'XRP', bid: '$1.8M', ask: '$1.7M', ratio: '1.06', status: 'bullish' },
      { coin: 'AVAX', bid: '$320K', ask: '$350K', ratio: '0.91', status: 'bearish' },
      { coin: 'LINK', bid: '$280K', ask: '$260K', ratio: '1.08', status: 'bullish' },
      { coin: 'ADA', bid: '$450K', ask: '$420K', ratio: '1.07', status: 'bullish' },
      { coin: 'DOT', bid: '$180K', ask: '$190K', ratio: '0.95', status: 'bearish' },
      { coin: 'MATIC', bid: '$380K', ask: '$365K', ratio: '1.04', status: 'bullish' },
    ]
  },
  volatility: {
    title: '价格波动率 - 详细分析',
    data: [
      { coin: 'BTC', period: '24h', volatility: '3.2%', high: '$98,500', low: '$95,000', range: '3.7%' },
      { coin: 'ETH', period: '24h', volatility: '4.1%', high: '$3,450', low: '$3,200', range: '7.3%' },
      { coin: 'SOL', period: '24h', volatility: '6.8%', high: '$235', low: '$210', range: '11.4%' },
      { coin: 'DOGE', period: '24h', volatility: '8.5%', high: '$0.092', low: '$0.083', range: '10.6%' },
      { coin: 'XRP', period: '24h', volatility: '5.2%', high: '$2.25', low: '$2.08', range: '7.8%' },
      { coin: 'AVAX', period: '24h', volatility: '7.3%', high: '$36.80', low: '$33.50', range: '9.5%' },
      { coin: 'LINK', period: '24h', volatility: '6.1%', high: '$15.50', low: '$14.20', range: '8.8%' },
      { coin: 'ADA', period: '24h', volatility: '4.8%', high: '$0.55', low: '$0.50', range: '9.6%' },
      { coin: 'DOT', period: '24h', volatility: '5.5%', high: '$7.25', low: '$6.65', range: '8.7%' },
      { coin: 'MATIC', period: '24h', volatility: '7.2%', high: '$0.82', low: '$0.74', range: '10.3%' },
    ]
  },
  highlow: {
    title: '24h高低点 - 详细追踪',
    data: [
      { coin: 'BTC', high: '$98,500', low: '$95,000', current: '$97,234.5', position: '76%' },
      { coin: 'ETH', high: '$3,450', low: '$3,200', current: '$3,245.8', position: '18%' },
      { coin: 'SOL', high: '$235', low: '$210', current: '$218.75', position: '37%' },
      { coin: 'DOGE', high: '$0.092', low: '$0.083', current: '$0.0876', position: '51%' },
      { coin: 'XRP', high: '$2.25', low: '$2.08', current: '$2.15', position: '41%' },
      { coin: 'AVAX', high: '$36.80', low: '$33.50', current: '$35.20', position: '51%' },
      { coin: 'LINK', high: '$15.50', low: '$14.20', current: '$14.85', position: '52%' },
      { coin: 'ADA', high: '$0.55', low: '$0.50', current: '$0.52', position: '40%' },
      { coin: 'DOT', high: '$7.25', low: '$6.65', current: '$6.95', position: '50%' },
      { coin: 'MATIC', high: '$0.82', low: '$0.74', current: '$0.78', position: '50%' },
    ]
  },
  volume: {
    title: '成交量分析 - 详细数据',
    data: [
      { coin: 'BTC', volume24h: '$28.5B', change24h: '+12.3%', avg24h: '$25.2B', ratio: '1.13' },
      { coin: 'ETH', volume24h: '$15.2B', change24h: '+8.5%', avg24h: '$14.0B', ratio: '1.09' },
      { coin: 'SOL', volume24h: '$5.8B', change24h: '+23.6%', avg24h: '$4.7B', ratio: '1.23' },
      { coin: 'DOGE', volume24h: '$4.2B', change24h: '+18.2%', avg24h: '$3.6B', ratio: '1.17' },
      { coin: 'XRP', volume24h: '$3.8B', change24h: '+6.7%', avg24h: '$3.6B', ratio: '1.06' },
      { coin: 'AVAX', volume24h: '$1.5B', change24h: '+15.8%', avg24h: '$1.3B', ratio: '1.15' },
      { coin: 'LINK', volume24h: '$1.8B', change24h: '+19.2%', avg24h: '$1.5B', ratio: '1.20' },
      { coin: 'ADA', volume24h: '$1.2B', change24h: '+9.3%', avg24h: '$1.1B', ratio: '1.09' },
      { coin: 'DOT', volume24h: '$980M', change24h: '+7.8%', avg24h: '$910M', ratio: '1.08' },
      { coin: 'MATIC', volume24h: '$1.4B', change24h: '+16.5%', avg24h: '$1.2B', ratio: '1.17' },
    ]
  }
};

// 打开弹窗
function showModal(cardElement, type) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  
  const data = anomalyDetailData[type];
  if (!data) return;
  
  modalTitle.textContent = data.title;
  modalContent.innerHTML = generateModalContent(type, data.data);
  
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  document.body.style.overflow = 'hidden';
}

// 关闭弹窗
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('active');
  
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 300);
}

// 生成弹窗内容
function generateModalContent(type, data) {
  switch(type) {
    case 'liquidation':
      return generateLiquidationContent(data);
    case 'whale':
      return generateWhaleContent(data);
    case 'funding':
      return generateFundingContent(data);
    case 'oi':
      return generateOIContent(data);
    case 'orderbook':
      return generateOrderbookContent(data);
    case 'volatility':
      return generateVolatilityContent(data);
    case 'highlow':
      return generateHighLowContent(data);
    case 'volume':
      return generateVolumeContent(data);
    default:
      return '<p class="text-slate-400">暂无数据</p>';
  }
}

// 爆仓监控内容
function generateLiquidationContent(data) {
  const totalAmount = data.reduce((sum, item) => {
    const value = parseFloat(item.amount.replace(/[$,MKB]/g, ''));
    if (item.amount.includes('B')) return sum + value * 1000;
    if (item.amount.includes('M')) return sum + value;
    if (item.amount.includes('K')) return sum + value / 1000;
    return sum + value;
  }, 0);

  const longCount = data.filter(item => item.type === 'long').length;
  const shortCount = data.filter(item => item.type === 'short').length;

  return `
    <div class="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-slate-400 mb-1">总爆仓金额</p>
          <p class="text-xl font-bold text-red-400">$${totalAmount.toFixed(2)}M</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">多头爆仓</p>
          <p class="text-xl font-bold text-red-400">${longCount} 笔</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">空头爆仓</p>
          <p class="text-xl font-bold text-green-400">${shortCount} 笔</p>
        </div>
      </div>
    </div>
    <table class="modal-data-table">
      <thead>
        <tr>
          <th>交易对</th>
          <th>方向</th>
          <th>金额</th>
          <th>价格</th>
          <th>时间</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td class="font-medium">${item.coin}</td>
            <td>
              <span class="px-2 py-1 rounded text-xs font-medium ${item.type === 'long' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}">
                ${item.type === 'long' ? '多头爆仓' : '空头爆仓'}
              </span>
            </td>
            <td class="${item.type === 'long' ? 'text-red-400' : 'text-green-400'} font-medium">${item.amount}</td>
            <td class="text-slate-300">${item.price}</td>
            <td class="text-slate-500 text-xs">${item.time}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// 大单异动内容
function generateWhaleContent(data) {
  const totalValue = data.reduce((sum, item) => {
    const value = parseFloat(item.value.replace(/[$,MKB]/g, ''));
    if (item.value.includes('B')) return sum + value * 1000;
    if (item.value.includes('M')) return sum + value;
    if (item.value.includes('K')) return sum + value / 1000;
    return sum + value;
  }, 0);

  const inflowCount = data.filter(item => item.type === 'inflow').length;
  const outflowCount = data.filter(item => item.type === 'outflow').length;

  return `
    <div class="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-slate-400 mb-1">总价值</p>
          <p class="text-xl font-bold text-amber-400">$${totalValue.toFixed(2)}M</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">流入</p>
          <p class="text-xl font-bold text-green-400">${inflowCount} 笔</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">流出</p>
          <p class="text-xl font-bold text-red-400">${outflowCount} 笔</p>
        </div>
      </div>
    </div>
    <table class="modal-data-table">
      <thead>
        <tr>
          <th>币种</th>
          <th>数量</th>
          <th>价值</th>
          <th>类型</th>
          <th>时间</th>
          <th>交易所</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td class="font-medium">${item.coin}</td>
            <td class="text-slate-300">${item.amount}</td>
            <td class="text-amber-400 font-medium">${item.value}</td>
            <td>
              <span class="px-2 py-1 rounded text-xs font-medium ${
                item.type === 'inflow' ? 'bg-green-500/20 text-green-400' :
                item.type === 'outflow' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }">
                ${item.type === 'inflow' ? '流入' : item.type === 'outflow' ? '流出' : '铸造'}
              </span>
            </td>
            <td class="text-slate-500 text-xs">${item.time}</td>
            <td class="text-slate-400">${item.exchange}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// 资金费率内容
function generateFundingContent(data) {
  const positiveCount = data.filter(item => item.status === 'positive').length;
  const negativeCount = data.filter(item => item.status === 'negative').length;

  return `
    <div class="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-slate-400 mb-1">多头支付</p>
          <p class="text-xl font-bold text-green-400">${positiveCount} 个</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">空头支付</p>
          <p class="text-xl font-bold text-red-400">${negativeCount} 个</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">更新周期</p>
          <p class="text-xl font-bold text-slate-300">8 小时</p>
        </div>
      </div>
    </div>
    <table class="modal-data-table">
      <thead>
        <tr>
          <th>交易对</th>
          <th>当前费率</th>
          <th>预测费率</th>
          <th>状态</th>
          <th>下次结算</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td class="font-medium">${item.coin}</td>
            <td class="${item.status === 'positive' ? 'text-green-400' : 'text-red-400'} font-medium">${item.rate}</td>
            <td class="text-slate-400">${item.predict}</td>
            <td>
              <span class="px-2 py-1 rounded text-xs font-medium ${item.status === 'positive' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                ${item.status === 'positive' ? '多头支付' : '空头支付'}
              </span>
            </td>
            <td class="text-slate-500">${item.next}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// 未平仓合约内容
function generateOIContent(data) {
  const totalOI = data.reduce((sum, item) => {
    const value = parseFloat(item.value.replace(/[$,B]/g, ''));
    return sum + value;
  }, 0);

  const upTrendCount = data.filter(item => item.trend === 'up').length;
  const downTrendCount = data.filter(item => item.trend === 'down').length;

  return `
    <div class="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-slate-400 mb-1">总OI</p>
          <p class="text-xl font-bold text-amber-400">$${totalOI.toFixed(1)}B</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">上升趋势</p>
          <p class="text-xl font-bold text-green-400">${upTrendCount} 个</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">下降趋势</p>
          <p class="text-xl font-bold text-red-400">${downTrendCount} 个</p>
        </div>
      </div>
    </div>
    <table class="modal-data-table">
      <thead>
        <tr>
          <th>币种</th>
          <th>OI 价值</th>
          <th>24h 变化</th>
          <th>7d 变化</th>
          <th>趋势</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td class="font-medium">${item.coin}</td>
            <td class="text-amber-400 font-medium">${item.value}</td>
            <td class="${item.change24h.startsWith('+') ? 'text-green-400' : 'text-red-400'}">${item.change24h}</td>
            <td class="${item.change7d.startsWith('+') ? 'text-green-400' : 'text-red-400'}">${item.change7d}</td>
            <td>
              <span class="px-2 py-1 rounded text-xs font-medium ${item.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                ${item.trend === 'up' ? '上升' : '下降'}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// 订单簿深度内容
function generateOrderbookContent(data) {
  const bullishCount = data.filter(item => item.status === 'bullish').length;
  const bearishCount = data.filter(item => item.status === 'bearish').length;

  return `
    <div class="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-slate-400 mb-1">买盘占优</p>
          <p class="text-xl font-bold text-green-400">${bullishCount} 个</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">卖盘占优</p>
          <p class="text-xl font-bold text-red-400">${bearishCount} 个</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">买卖比均值</p>
          <p class="text-xl font-bold text-amber-400">${(data.reduce((sum, item) => sum + parseFloat(item.ratio), 0) / data.length).toFixed(2)}</p>
        </div>
      </div>
    </div>
    <table class="modal-data-table">
      <thead>
        <tr>
          <th>币种</th>
          <th>买单深度</th>
          <th>卖单深度</th>
          <th>买/卖比</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td class="font-medium">${item.coin}</td>
            <td class="text-green-400">${item.bid}</td>
            <td class="text-red-400">${item.ask}</td>
            <td class="text-amber-400 font-medium">${item.ratio}</td>
            <td>
              <span class="px-2 py-1 rounded text-xs font-medium ${item.status === 'bullish' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                ${item.status === 'bullish' ? '买盘占优' : '卖盘占优'}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// 价格波动率内容
function generateVolatilityContent(data) {
  const avgVolatility = (data.reduce((sum, item) => sum + parseFloat(item.volatility), 0) / data.length).toFixed(2);
  const maxVolatility = Math.max(...data.map(item => parseFloat(item.volatility))).toFixed(2);

  return `
    <div class="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-slate-400 mb-1">平均波动率</p>
          <p class="text-xl font-bold text-orange-400">${avgVolatility}%</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">最高波动率</p>
          <p class="text-xl font-bold text-red-400">${maxVolatility}%</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">统计周期</p>
          <p class="text-xl font-bold text-slate-300">24 小时</p>
        </div>
      </div>
    </div>
    <table class="modal-data-table">
      <thead>
        <tr>
          <th>币种</th>
          <th>周期</th>
          <th>波动率</th>
          <th>24h 最高</th>
          <th>24h 最低</th>
          <th>波动范围</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td class="font-medium">${item.coin}</td>
            <td class="text-slate-400">${item.period}</td>
            <td class="text-orange-400 font-medium">${item.volatility}</td>
            <td class="text-green-400">${item.high}</td>
            <td class="text-red-400">${item.low}</td>
            <td class="text-amber-400">${item.range}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// 24h高低点内容
function generateHighLowContent(data) {
  const avgPosition = (data.reduce((sum, item) => sum + parseFloat(item.position), 0) / data.length).toFixed(1);

  return `
    <div class="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-slate-400 mb-1">平均位置</p>
          <p class="text-xl font-bold text-amber-400">${avgPosition}%</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">高位币种</p>
          <p class="text-xl font-bold text-green-400">${data.filter(item => parseFloat(item.position) > 70).length} 个</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">低位币种</p>
          <p class="text-xl font-bold text-red-400">${data.filter(item => parseFloat(item.position) < 30).length} 个</p>
        </div>
      </div>
    </div>
    <table class="modal-data-table">
      <thead>
        <tr>
          <th>币种</th>
          <th>24h 最高</th>
          <th>24h 最低</th>
          <th>当前价格</th>
          <th>位置</th>
          <th>进度条</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td class="font-medium">${item.coin}</td>
            <td class="text-green-400">${item.high}</td>
            <td class="text-red-400">${item.low}</td>
            <td class="text-amber-400 font-medium">${item.current}</td>
            <td class="text-slate-300">${item.position}</td>
            <td style="width: 150px;">
              <div class="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-red-500 to-green-500" style="width: ${item.position}"></div>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// 成交量分析内容
function generateVolumeContent(data) {
  const totalVolume = data.reduce((sum, item) => {
    const value = parseFloat(item.volume24h.replace(/[$,B]/g, ''));
    return sum + value;
  }, 0);

  const increaseCount = data.filter(item => item.change24h.startsWith('+')).length;
  const decreaseCount = data.filter(item => item.change24h.startsWith('-')).length;

  return `
    <div class="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xs text-slate-400 mb-1">总成交量</p>
          <p class="text-xl font-bold text-pink-400">$${totalVolume.toFixed(2)}B</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">成交量增长</p>
          <p class="text-xl font-bold text-green-400">${increaseCount} 个</p>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">成交量下降</p>
          <p class="text-xl font-bold text-red-400">${decreaseCount} 个</p>
        </div>
      </div>
    </div>
    <table class="modal-data-table">
      <thead>
        <tr>
          <th>币种</th>
          <th>24h 成交量</th>
          <th>24h 变化</th>
          <th>24h 均值</th>
          <th>量比</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            <td class="font-medium">${item.coin}</td>
            <td class="text-pink-400 font-medium">${item.volume24h}</td>
            <td class="${item.change24h.startsWith('+') ? 'text-green-400' : 'text-red-400'}">${item.change24h}</td>
            <td class="text-slate-400">${item.avg24h}</td>
            <td class="text-amber-400 font-medium">${item.ratio}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// 键盘事件监听
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
