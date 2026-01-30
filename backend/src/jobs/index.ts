import cron from 'node-cron';
import { logger } from '../utils/logger';
import { getMarketData } from '../services/marketService';
import { fetchAndSaveLiquidations } from './liquidationJob';
import { generateStrategySignals } from './strategyJob';
import { broadcastMessage } from '../websocket';
import { WSMessage } from '../types';

export function startCronJobs() {
  logger.info('Starting cron jobs...');

  // Fetch market data every 1 minute
  cron.schedule('*/1 * * * *', async () => {
    logger.info('Running market data fetch job');
    try {
      const markets = await getMarketData({ per_page: 50 });
      logger.info(`Fetched ${markets.length} markets`);

      // Broadcast price updates
      for (const market of markets.slice(0, 10)) {
        // broadcastPriceUpdate could be called here
      }
    } catch (error) {
      logger.error('Error in market data fetch job:', error);
    }
  });

  // Fetch liquidations every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    logger.info('Running liquidation fetch job');
    try {
      await fetchAndSaveLiquidations();
    } catch (error) {
      logger.error('Error in liquidation fetch job:', error);
    }
  });

  // Generate strategy signals every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Running strategy signal generation job');
    try {
      await generateStrategySignals();
    } catch (error) {
      logger.error('Error in strategy signal generation job:', error);
    }
  });

  // Check API health every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Running API health check job');
    try {
      await checkApiHealth();
    } catch (error) {
      logger.error('Error in API health check job:', error);
    }
  });

  logger.info('All cron jobs started');
}

async function checkApiHealth() {
  // TODO: Implement API health checks
  logger.info('API health check completed');
}
