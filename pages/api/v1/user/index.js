import controller from "infra/controller";
import { createRouter } from "next-connect";
import user from "models/user";
import session from "models/session";
import authorization from "models/authorization";
import { ForbiddenError } from "infra/errors";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.get(controller.canRequest("read:session"), getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  controller.setSessionCookie(response, sessionObject);
  await session.renew(sessionObject.id);

  const userFound = await user.findOneById(sessionObject.user_id);

  if (!authorization.can(userFound, "read:session")) {
    throw new ForbiddenError({
      message: "Você não possui permissão para realizar esta ação.",
      action: "Contate o suporte caso você acredite que isto seja um erro.",
    });
  }

  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  return response.status(200).json(userFound);
}
