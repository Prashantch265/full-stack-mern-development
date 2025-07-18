import app from './app';
import config from './configs/config';
import { logger } from './utils';
import { startSyncScheduler, startCleanupScheduler } from './app/scheduler/scheduler.service';
/**
 * Start the Express server on the specified port.
 * The port is sourced from environment variables via the config file.
 */
app.listen(config.port, () => {
  const env = config.env || "development";
  logger.info(`=================================`);
  logger.info(`======= ENV: ${env.toUpperCase()} =======`);
  logger.info(`🚀 App listening on the port ${config.port}`);
  logger.info(`=================================`);

  // Start the cron job scheduler
  startSyncScheduler();
  startCleanupScheduler();
});