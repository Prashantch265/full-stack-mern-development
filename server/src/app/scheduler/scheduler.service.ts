import cron from 'node-cron';
import config from '../../configs/config';
import { logger } from '../../utils';
import { syncWooCommerceData, cleanupOldData } from '../sync/sync.service';

/**
 * Starts the scheduler for the WooCommerce data synchronization job.
 * The schedule is dynamically loaded from the configuration.
 */
export const startSyncScheduler = (): void => {
  // Validate the cron expression
  if (!cron.validate(config.syncupCronSchedule)) {
    logger.error(
      `Invalid cron expression: "${config.syncupCronSchedule}". Scheduler will not start.`
    );
    return;
  }

  logger.info(
    `Scheduler initialized. Sync job will run on schedule: "${config.syncupCronSchedule}"`
  );

  // Schedule the syncWooCommerceData function to run based on the cron expression
  cron.schedule(config.syncupCronSchedule, async () => {
    try {
      logger.info("Cron job triggered: Starting scheduled WooCommerce sync.");
      await syncWooCommerceData();
      logger.info("Scheduled WooCommerce sync finished.");
    } catch (error) {
      logger.error("An error occurred during the scheduled sync job:", error);
    }
  });
};


/**
 * Starts the scheduler for the old data cleanup job.
 */
export const startCleanupScheduler = (): void => {
  if (!cron.validate(config.cleanupCronSchedule)) {
    logger.error(
      `Invalid cron expression for cleanup: "${config.cleanupCronSchedule}". Scheduler will not start.`
    );
    return;
  }

  logger.info(
    `Scheduler initialized. Cleanup job will run on schedule: "${config.cleanupCronSchedule}"`
  );

  cron.schedule(config.cleanupCronSchedule, async () => {
    try {
      logger.info("Cron job triggered: Starting scheduled data cleanup.");
      await cleanupOldData();
      logger.info("Scheduled data cleanup finished.");
    } catch (error) {
      logger.error("An error occurred during the scheduled cleanup job:", error);
    }
  });
};
