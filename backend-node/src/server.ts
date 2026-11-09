import app, { prisma } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const server = app.listen(env.PORT, () => {
  logger.info(`Node API listening on port ${env.PORT}`);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});