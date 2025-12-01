import controller from "infra/controller";
import { createRouter } from "next-connect";
import user from "models/user";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const result = await user.findByUsername(username);
  return response.status(200).json(result);
}
