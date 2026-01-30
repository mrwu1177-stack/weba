import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import axios from 'axios';

const prisma = new PrismaClient();

export async function fetchAndSaveLiquidations() {
  try {
    // Simulate liquidation data (replace with real API)
    const liquidations = [
      {
        coinId: 'bitcoin',
        coinSymbol: 'btc',
        side: 'long',
        amount: 1.5,
        price: 43500,
        leverage: 25,
        timestamp: new Date(),
      },
      {
        coinId: 'ethereum',
        coinSymbol: 'eth',
        side: 'short',
        amount: 10,
        price: 2280,
        leverage: 10,
        timestamp: new Date(),
      },
    ];

    // Save to database
    for (const liq of liquidations) {
      await prisma.liquidation.create({
        data: {
          coinId: liq.coinId,
          coinSymbol: liq.coinSymbol,
          side: liq.side,
          amount: liq.amount,
          price: liq.price,
          leverage: liq.leverage,
          timestamp: liq.timestamp,
        },
      });
    }

    // Update chart data
    await updateLiquidationCharts(liquidations);

    logger.info(`Saved ${liquidations.length} liquidations`);
  } catch (error: any) {
    logger.error('Error fetching and saving liquidations:', error);
  }
}

async function updateLiquidationCharts(liquidations: any[]) {
  try {
    for (const liq of liquidations) {
      await prisma.liquidationChart.upsert({
        where: {
          coinSymbol_price: {
            coinSymbol: liq.coinSymbol,
            price: liq.price,
          },
        },
        update: {
          longAmount: liq.side === 'long' 
            ? { increment: liq.amount }
            : undefined,
          shortAmount: liq.side === 'short'
            ? { increment: liq.amount }
            : undefined,
          totalAmount: { increment: liq.amount },
          timestamp: new Date(),
        },
        create: {
          coinSymbol: liq.coinSymbol,
          price: liq.price,
          longAmount: liq.side === 'long' ? liq.amount : 0,
          shortAmount: liq.side === 'short' ? liq.amount : 0,
          totalAmount: liq.amount,
          timestamp: new Date(),
        },
      });
    }
  } catch (error: any) {
    logger.error('Error updating liquidation charts:', error);
  }
}
