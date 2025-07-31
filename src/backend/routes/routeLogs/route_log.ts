import {Hono} from "hono";
import controller_log from "../../controllers/log/controller_log";
import helpers from "../../helpers/helpers";

const routeLogs = new Hono();

routeLogs.post("/log", helpers.token.verifyToken, controller_log.criar as any);
routeLogs.get("/log", helpers.token.verifyToken, controller_log.buscar_pelo_filtro as any);

export default routeLogs;
