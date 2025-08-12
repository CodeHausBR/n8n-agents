import {Hono} from "hono";
import controller_professor from "../../controllers/professor/controller_professor";
import helpers from "../../helpers/helpers";

const route_professor = new Hono();

// contas a receber
route_professor.post("/professor", helpers.token.verifyToken, controller_professor.criar as any);
route_professor.get("/professor", helpers.token.verifyToken, controller_professor.buscar_pelo_filtro as any);
route_professor.get("/professor/:id", helpers.token.verifyToken, controller_professor.buscar_pelo_id as any);
route_professor.patch("/professor/:id", helpers.token.verifyToken, controller_professor.atualizar_pelo_id as any);
route_professor.delete("/professor/:id", helpers.token.verifyToken, controller_professor.deletar_pelo_id as any);

export default route_professor;
