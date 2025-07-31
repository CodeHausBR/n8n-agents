import {Hono} from "hono";
import controller_cliente from "../../controllers/cliente/controller_cliente";
import helpers from "../../helpers/helpers";

const route_cliente = new Hono();

route_cliente.post("/cliente", helpers.token.verifyToken, controller_cliente.criar as any);
route_cliente.get("/cliente/:id", helpers.token.verifyToken, controller_cliente.buscar_pelo_id as any);
route_cliente.get("/cliente", helpers.token.verifyToken, controller_cliente.buscar_pelo_filtro as any);
route_cliente.patch("/cliente/:id", helpers.token.verifyToken, controller_cliente.atualizar_pelo_id as any);
route_cliente.delete("/cliente/:id", helpers.token.verifyToken, controller_cliente.deletar_pelo_id as any);

export default route_cliente;
