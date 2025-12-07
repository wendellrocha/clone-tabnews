import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllService();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      await orchestrator.createUser({
        username: "MesmoCase",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      const responseBody2 = await response2.json();

      expect(response2.status).toBe(200);

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: "MesmoCase",
        email: responseBody2.email,
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });

      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      await orchestrator.createUser({
        username: "CaseDiferente",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      const responseBody2 = await response2.json();

      expect(response2.status).toBe(200);

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        username: "CaseDiferente",
        email: responseBody2.email,
        password: responseBody2.password,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });

      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );

      const responseBody = await response.json();

      expect(response.status).toBe(404);

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
