import controller from "infra/controller";
import { createRouter } from "next-connect";
import user from "models/user";
import session from "models/session";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  await session.renew(sessionObject.id);
  const userFound = await user.findOneById(sessionObject.user_id);

  controller.setSessionCookie(response, sessionObject);

  return response.status(200).json(userFound);
}
