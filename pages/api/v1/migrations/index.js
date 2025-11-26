import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function migrationsRunner(dryRun) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
      dryRun,
      direction: "up",
      migrationsTable: "pgmigrations",
    };

    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();

    return pendingMigrations;
  } finally {
    dbClient?.end();
  }
}

async function getHandler(request, response) {
  const pendingMigrations = await migrationsRunner(true);
  return response.status(200).json(pendingMigrations);
}
async function postHandler(request, response) {
  const migratedMigrations = await migrationsRunner(false);
  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(200).json(migratedMigrations);
}
