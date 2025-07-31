import {Hono} from "hono";
import controller_webhook from "../../controllers/webhook/controller_webhook";

const route_webhook = new Hono();

// route_webhook.post("/webhook/pagarme/recebedor", controller_webhook.recebedor.receber_evento_webhook_recebedor_pagarme());
// route_webhook.post("/webhook/asaas/recebedor", services_pagarme_api.recebedor.receber_evento_webhook_recebedor_pagarme());
route_webhook.post("/webhook/pagarme/conta_receber", controller_webhook.conta_receber.rebecer_evento_webhook_conta_receber_cobranca as any);
export default route_webhook;
