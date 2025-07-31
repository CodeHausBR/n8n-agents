//BIBLIOTECAS
import * as z4 from "zod";
//
import t from "../../../types";

import model_recebedor from "../../models/recebedor/model_recebedor";
import model_conta_receber from "../../models/conta_receber/model_conta_receber";
import model_log from "../../models/log/model_log";
import services_webhook from "../../services/webhook/services_webhook";

//HELPERS
import helpers from "../../helpers/helpers";

//BANCO DE DADOS

//SERVICES

const controller_webhook = class controller_webhook {
    // static recebedor = class recebedor {
    //     static async receber_evento_webhook_recebedor_pagarme(c: t.Context) {
    //         try {
    //             const dados_body: t.Services.ServicePagarme.Recebedor.ReceberEventoWebhook.Output = await c.req.json();
    //             console.log(dados_body, "dados_body");

    //             const update_recebedor_status = await model_recebedor.atualizar_pelo_id(
    //                 {
    //                     data: {
    //                         recebedor: {
    //                             _id: dados_body.data.recebedor.code,
    //                             status: dados_body.data.recebedor.status,
    //                         },
    //                     },
    //                 },
    //                 c
    //             );
    //             console.log(update_recebedor_status, "update_recebedor_status");

    //             helpers.set_response.c.SUCCESS({message: "Sucesso ao atualizar o status do recebedor.", results: update_recebedor_status.data.recebedor, c: c});
    //         } catch (error) {
    //             helpers.set_response.c.SERVER_ERROR({error, c});
    //         }
    //     }
    // };

    static conta_receber = class conta_receber {
        static async rebecer_evento_webhook_conta_receber_cobranca(c: t.Context) {
            try {
                const dados_webhook: t.Services.ServicePagarme.Pedido.WebhookCobranca.Input = await c.req.json();

                const dados_validados = t.Services.ServicePagarme.Pedido.WebhookCobranca.InputSchema.parse(dados_webhook);
                if (dados_validados?.data?.order?.metadata?.v && dados_validados?.data?.order?.metadata?.v !== "2.0") {
                    const conta_receber = await model_conta_receber.buscar_pelo_filtro(
                        {
                            filtros: {
                                conta_receber: {
                                    pagamento_id: dados_validados?.data?.order?.id,
                                    excluido: false,
                                    pagina: 1,
                                },
                            },
                        },
                        c
                    );

                    if (!conta_receber) {
                        await model_log.criar(
                            {
                                data: {
                                    log: {
                                        class_name: "controller_webhook",
                                        static_function: "rebecer_evento_webhook_conta_receber_cobranca",
                                        error_message: "erro ao buscar conta a receber",
                                        error_returned_by_system: "",
                                        matrix: dados_webhook?.data?.code,
                                        organization: "pagarme",
                                        type: "error",
                                        type_user: "",
                                        user: "pagarme",
                                    },
                                },
                            },
                            c
                        );
                    } else {
                        const dados_atualizar = services_webhook.services_webhook_conta_receber.verificar_tipo_de_atualizacao_pelo_webhook(dados_webhook, conta_receber);
                        dados_atualizar && (await model_conta_receber.atualizar_pelo_id({data: {conta_receber: dados_atualizar}}, c));
                    }
                }

                return helpers.set_response.c.SUCCESS({message: "Sucesso ao receber webhook", results: [], c: c});
            } catch (error) {
                return helpers.set_response.c.WARNING({message: "Erro ao receber webhook", c: c, results: []});
            }
        }
    };
};

export default controller_webhook;
