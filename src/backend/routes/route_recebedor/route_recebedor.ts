import {Hono} from "hono";
import controller_recebedor from "../../controllers/recebedor/controller_recebedor";
import helpers from "../../helpers/helpers";

const route_recebedor = new Hono();

route_recebedor.post("/recebedor", helpers.token.verifyToken, controller_recebedor.criar as any);
route_recebedor.get("/recebedor/:id", helpers.token.verifyToken, controller_recebedor.buscar_pelo_id as any);
route_recebedor.get("/recebedor", helpers.token.verifyToken, controller_recebedor.buscar_pelo_filtro as any);
route_recebedor.patch("/recebedor/:id", helpers.token.verifyToken, controller_recebedor.atualizar_pelo_id as any);
route_recebedor.delete("/recebedor/:id", helpers.token.verifyToken, controller_recebedor.deletar_pelo_id as any);

export default route_recebedor;
