import t from "../../../types";
const services_webhook = class services_webhook {
    static services_webhook_conta_receber = class services_webhook_conta_receber {
        static utils = class utils {};

        static verificar_tipo_de_atualizacao_pelo_webhook(
            dados_webhook: t.Services.ServicePagarme.Pedido.WebhookCobranca.Input,
            conta_receber: t.Controllers.ContaReceber.BuscarPeloFiltro.Output
        ): t.Controllers.ContaReceber.AtualizarPeloId.Input["data"]["conta_receber"] | void {
            type TiposWebhookPagarme = "charge.paid" | "charge.refunded" | "charge.pending" | "charge.deleted";

            enum ListaEnumPagarmeStatus {
                "charge.paid" = 503,
                "charge.refunded" = 504,
                "charge.pending" = 501,
                "charge.deleted" = 502,
            }

            const tipo = dados_webhook.type as TiposWebhookPagarme;
            const metodo_pagamento = dados_webhook.data.payment_method;

            if (tipo === "charge.paid") {
                const atualizacao: t.Controllers.ContaReceber.AtualizarPeloId.Input["data"]["conta_receber"] = {
                    _id: conta_receber?.data?.conta_receber?.[0]?._id,
                    status: ListaEnumPagarmeStatus[tipo],
                    metodo_pagamento: metodo_pagamento,
                    titular: dados_webhook.data.customer?.name,
                    documento_titular: dados_webhook.data.customer?.document,
                    data_pagamento: new Date(dados_webhook.data.paid_at).toISOString(),
                };

                return atualizacao;
            }

            if (tipo === "charge.deleted") {
                const atualizacao: t.Controllers.ContaReceber.AtualizarPeloId.Input["data"]["conta_receber"] = {
                    _id: conta_receber?.data?.conta_receber?.[0]?._id,
                    status: ListaEnumPagarmeStatus[tipo],
                };

                return atualizacao;
            }

            if (tipo === "charge.refunded") {
                const atualizacao: t.Controllers.ContaReceber.AtualizarPeloId.Input["data"]["conta_receber"] = {
                    _id: conta_receber?.data?.conta_receber?.[0]?._id,
                    status: ListaEnumPagarmeStatus[tipo],
                };

                return atualizacao;
            }
        }
    };
};
export default services_webhook;
