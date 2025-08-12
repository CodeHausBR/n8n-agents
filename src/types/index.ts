import {Context as HonoContext} from "hono";

// CONTROLLERS:
import ControllerToken from "./controllers/token";
import ControllerResponse from "./controllers/response";
import UserPayload from "./controllers/token";
import {Controller as ControllerCartaFianca} from "./controllers/order";
import ControllerLog from "./controllers/log";
import ControllerRecebedor from "./controllers/recebedor";
import ControllerContasPagar from "./controllers/conta_pagar";
import ControllerProfessor from './controllers/professor'

// USAR ESSE PADRÃO DE IMPORTAÇÃO COM O NOME ESPLICITO:
import ControllerHelpers from "./controllers/helpers";
import ControllerContasReceber from "./controllers/conta_receber";
import ControllerCliente from "./controllers/cliente";
import ControllerAluno from './controllers/aluno'
import ControllerSalaDeAula from './controllers/sala_de_aula'
import ControllerEvento from './controllers/evento'
//SERVICES
import ServicesPagarme from "./services/pagarme";
import ServiceAsaas from "./services/asaas";
namespace t {
    export interface Context extends HonoContext {
        env: Env;
        set(key: "usuario_auth", params: UserPayload.UserToken): UserPayload.UserToken;
        get(key: "usuario_auth"): UserPayload.UserToken;
    }
    export import Token = UserPayload;
    export type User = UserPayload.PatternUserPayload;
    export interface Env {
        JSON_WEB_TOKEN_AUTH_USER: string;
        POSTGRESQL_DATABASE_URL: string;
        SK_PAGARME: string;
        URL_API_PAGARME: string;
        BASE_URL_ASAAS: string;
        SK_TOKEN_ASAAS: string;
    }
    export namespace Controllers {
        export import Response = ControllerResponse;
        export import UserPayload = ControllerToken;
        export import Helpers = ControllerHelpers;
        export import Controller = ControllerCartaFianca; //remover apos o teste
        export import Log = ControllerLog;
        export import Recebedor = ControllerRecebedor;

        export import ContaReceber = ControllerContasReceber;
        export import ContaPagar = ControllerContasPagar;
        //Cliente correto novo cadastro
        export import Cliente = ControllerCliente;
        export import Aluno = ControllerAluno;
        export import Professor = ControllerProfessor;
        export import SalaDeAula = ControllerSalaDeAula;
        export import Evento = ControllerEvento
    }

    export namespace Services {
        export import ServicePagarme = ServicesPagarme;
        export import Asaas = ServiceAsaas;
    }
}
export default t;
