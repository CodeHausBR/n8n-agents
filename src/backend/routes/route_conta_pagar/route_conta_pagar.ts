import {Hono} from "hono";
import controller_conta_pagar from "../../controllers/conta_pagar/controller_conta_pagar";
import helpers from "../../helpers/helpers";

const route_conta_pagar = new Hono();

// contas a receber
route_conta_pagar.post("/conta_pagar", helpers.token.verifyToken, controller_conta_pagar.criar as any);
route_conta_pagar.get("/conta_pagar", helpers.token.verifyToken, controller_conta_pagar.buscar_pelo_filtro as any);
route_conta_pagar.get("/conta_pagar/:id", helpers.token.verifyToken, controller_conta_pagar.buscar_pelo_id as any);
route_conta_pagar.patch("/conta_pagar/:id", helpers.token.verifyToken, controller_conta_pagar.atualizar_pelo_id as any);
route_conta_pagar.delete("/conta_pagar/:id", helpers.token.verifyToken, controller_conta_pagar.deletar_pelo_id as any);

export default route_conta_pagar;
