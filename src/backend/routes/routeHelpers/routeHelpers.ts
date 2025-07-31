import {Hono} from "hono";
import controllerHelpers from "../../controllers/helpers/controllerHelpers";
import helpers from "../../helpers/helpers";

const routeHelpers = new Hono();

routeHelpers.post("/helper", helpers.token.verifyToken, controllerHelpers.criar as any);
routeHelpers.get("/helper/:id", helpers.token.verifyToken, controllerHelpers.buscar_pelo_id as any);
routeHelpers.get("/helpers", helpers.token.verifyToken, controllerHelpers.buscar_pelo_filtro as any);
routeHelpers.patch("/helper/:id", helpers.token.verifyToken, controllerHelpers.atualizar_pelo_id as any);
routeHelpers.delete("/helper/:id", helpers.token.verifyToken, controllerHelpers.deletar_pelo_id as any);

export default routeHelpers;
