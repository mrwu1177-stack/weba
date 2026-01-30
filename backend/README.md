# HelloYan Backend Service

BFF (Backend for Frontend) layer for HelloYan cryptocurrency strategy analysis platform.

## Features

- Unified API endpoint for all data needs
- Real-time WebSocket streaming
- Redis caching for performance
- PostgreSQL for data persistence
- Automatic data synchronization
- Multi-source fallback
- API health monitoring

## Tech Stack

- Node.js 18+
- Fastify (High-performance web framework)
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Redis
- Socket.io

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/heloyan"
REDIS_URL="redis://localhost:6379"

# API Keys
COINGECKO_API_KEY=""
BINANCE_API_KEY=""
# ... other API keys
```

## Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/v1/meta` - API metadata
- `GET /api/v1/markets` - Market data
- `GET /api/v1/liquidations` - Liquidation data
- `GET /api/v1/strategies/signals` - Strategy signals
- `GET /api/v1/news` - News feed
- `GET /api/v1/anomalies` - Market anomalies
- `WS /ws` - WebSocket connection

## Architecture

```
Frontend (Next.js)
       ↓
Unified API (/api/v1/*)
       ↓
Service Layer
       ↓
  ┌────┴────┐
  │         │
Database   Redis
(Prisma)  (Cache)
  │         │
  └────┬────┘
       ↓
Third-party APIs
```

## Deployment

Deploy to Railway using the Dockerfile:

```bash
railway up
```

## Monitoring

- Health check: `/health`
- API status: `/api/v1/admin/api-status`
- System logs: `/api/v1/admin/logs`

## License

ISC
