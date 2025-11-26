import database from "infra/database";
import { ServiceError } from "infra/errors";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  migrationsTable: "pgmigrations",
};

async function migrationsRunner({ dryRun = true } = {}) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun,
    });
    await dbClient.end();

    return pendingMigrations;
  } catch (error) {
    const message = dryRun
      ? "Ocorreu um erro ao listar as migrações pendentes."
      : "Ocorreu um erro ao executar as migrações pendentes.";

    const serviceErrorObject = new ServiceError({ message, cause: error });
    throw serviceErrorObject;
  } finally {
    dbClient?.end();
  }
}

async function listPendingMigrations() {
  return await migrationsRunner();
}

async function runPendingMigrations() {
  return await migrationsRunner({ dryRun: false });
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
