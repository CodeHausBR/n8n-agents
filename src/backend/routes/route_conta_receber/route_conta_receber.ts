import {Hono} from "hono";
import controller_conta_receber from "../../controllers/contas_receber/controller_conta_receber";
import helpers from "../../helpers/helpers";

const route_conta_receber = new Hono();

// contas a receber
route_conta_receber.post("/conta_receber", helpers.token.verifyToken, controller_conta_receber.criar as any);
route_conta_receber.get("/conta_receber", helpers.token.verifyToken, controller_conta_receber.buscar_pelo_filtro as any);
route_conta_receber.get("/conta_receber/:id", helpers.token.verifyToken, controller_conta_receber.buscar_pelo_id as any);
route_conta_receber.patch("/conta_receber/:id", helpers.token.verifyToken, controller_conta_receber.atualizar_pelo_id as any);
route_conta_receber.delete("/conta_receber/:id", helpers.token.verifyToken, controller_conta_receber.deletar_pelo_id as any);

export default route_conta_receber;
