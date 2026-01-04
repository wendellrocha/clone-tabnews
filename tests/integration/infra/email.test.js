import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();
    expect(email.send).toBeInstanceOf(Function);

    await email.send({
      from: "TabNews <contato@tabnews.com.br>",
      to: "wendellrochaa@gmail.com",
      subject: "Teste de assunto",
      text: "Teste de texto",
      html: "<p>Teste de HTML</p>",
    });

    await email.send({
      from: "TabNews <contato@tabnews.com.br>",
      to: "wendellrochaa@gmail.com",
      subject: "Último email enviado",
      text: "Teste de texto",
      html: "<p>Teste de HTML</p>",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<contato@tabnews.com.br>");
    expect(lastEmail.recipients[0]).toBe("<wendellrochaa@gmail.com>");
    expect(lastEmail.subject).toBe("Último email enviado");
    expect(lastEmail.text).toBe("Teste de texto");
  });
});
