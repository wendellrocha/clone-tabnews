import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
import user from "models/user";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "wendellrocha",
          email: "wendellrochaa@gmail.com",
          password: "123",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: responseBody.username,
        email: responseBody.email,
        password: responseBody.password,
        features: ["read:activation_token"],
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("wendellrocha");

      expect(userInDatabase).not.toBeNull();

      const incorrentPasswordMatch = await password.compare(
        "1234",
        userInDatabase.password,
      );

      const correntPasswordMatch = await password.compare(
        "123",
        userInDatabase.password,
      );

      expect(incorrentPasswordMatch).not.toBe(true);
      expect(correntPasswordMatch).toBe(true);
    });

    test("With duplicated 'email'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1",
          email: "wendellrochaa+1@gmail.com",
          password: "123",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "wendellrochaa+1@gmail.com",
          password: "123",
        }),
      });

      const responseBody2 = await response2.json();

      expect(response2.status).toBe(400);

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "wendellrochaa+2@gmail.com",
          password: "123",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "wendellrochaa+3@gmail.com",
          password: "123",
        }),
      });

      const responseBody2 = await response2.json();

      expect(response2.status).toBe(400);

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
        status_code: 400,
      });
    });

    describe("Default user", () => {
      test("With unique and valid data", async () => {
        const user1 = await orchestrator.createUser({});
        await orchestrator.activateUser(user1.id);
        const user1SessionObject = await orchestrator.createSession(user1.id);

        const user2Response = await fetch(
          "http://localhost:3000/api/v1/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: `session_id=${user1SessionObject.token}`,
            },
            body: JSON.stringify({
              username: "wendellrocha2",
              email: "email@example.com",
              password: "123",
            }),
          },
        );

        expect(user2Response.status).toBe(403);

        const responseBody = await user2Response.json();
        expect(responseBody).toEqual({
          name: "ForbiddenError",
          message: "Você não possui permissão para executar esta ação.",
          action: 'Verifique se o usuário tem a feature: "create:user"',
          status_code: 403,
        });
      });
    });
  });
});
