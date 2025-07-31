//BIBLIOTECAS
//HELPERS
//TYPES

//BANCO DE DADOS

//SERVICES
import helpers from "../../helpers/helpers";

import services_asaas_api from "../asaas/api/services_asaas_api";
import services_pagarme_api from "../pagarme/api/services_pagarme_api";
//TYPES
import t from "../../../types";

const services_conta_receber = class services_conta_receber {
    static regras = class regras {
        static async verificar_status_da_conta_receber_antes_de_cancelar(data: t.Controllers.ContaReceber.BuscarPeloId.Output): Promise<void> {
            if (data.data.conta_receber.status === 503) {
                helpers.set_response.error.WARNING({message: "Não é possível cancelar a conta a receber pois a mesma já esta paga", results: []});
            }
        }

        static verifica_se_id_da_plataforma_existe(chave: string): void {
            const existe = (chave && chave?.length > 0) || false;

            !existe && helpers.set_response.error.WARNING({message: "Chave do cliente na plataforma não cadastrada", results: []});
        }
    };

    static async selecionar_checkout_criar(
        body: t.Controllers.ContaReceber.Criar.Input,
        cliente: t.Controllers.Cliente.BuscarPeloId.Output,
        c: t.Context
    ): Promise<t.Controllers.ContaReceber.Criar.Input[]> {
        switch (body.data.conta_receber.checkout) {
            case "pagarme":
                services_conta_receber.regras.verifica_se_id_da_plataforma_existe(cliente?.data?.cliente?.pagarme_external_id);

                body.data.conta_receber.cliente_id = cliente?.data?.cliente?.pagarme_external_id;

                const cobranca_pagarme = await services_pagarme_api.pedido.criar(body, c);

                if (!cobranca_pagarme?.data?.pedido?.id) {
                    helpers.set_response.error.WARNING({message: "Erro ao criar pedido no Pagar.me", results: []});
                }

                const dados_cobranca_pagarme: t.Controllers.ContaReceber.Criar.Input[] = Array.from({length: 1}, () => ({
                    data: {
                        conta_receber: {
                            ...body?.data?.conta_receber,
                            status: 501,
                            codigo: cobranca_pagarme?.data?.pedido?.code,
                            pagamento_id: cobranca_pagarme?.data?.pedido?.id,
                            url_cobranca: cobranca_pagarme?.data?.pedido?.checkouts?.[0]?.payment_url,
                            url_pedido: "",
                            parcelas: 1,
                            parcela: 1,
                            valor_pacela: body?.data?.conta_receber?.valor,
                        },
                    },
                }));

                return dados_cobranca_pagarme;

            case "asaas":
                services_conta_receber.regras.verifica_se_id_da_plataforma_existe(cliente?.data?.cliente?.asaas_external_id);

                body.data.conta_receber.cliente_id = cliente.data.cliente.asaas_external_id;

                const cobranca_asaas = await services_asaas_api.cobranca.criar(body, c);

                const filtros: t.Services.Asaas.Cobranca.BuscarCobranca.Input = {
                    data: {
                        cobranca: {installment: cobranca_asaas.data.cobranca.installment},
                    },
                };

                const lista_de_cobrancas_asaas = await services_asaas_api.cobranca.buscar_cobrancas(filtros, c);

                const dados_cobranca_asaas: t.Controllers.ContaReceber.Criar.Input[] = lista_de_cobrancas_asaas.data.cobrancas.data.map((item) => ({
                    data: {
                        conta_receber: {
                            ...body.data.conta_receber,
                            status: 501,
                            codigo: item?.externalReference,
                            pagamento_id: item?.id,
                            url_cobranca: item?.bankSlipUrl,
                            url_pedido: item?.invoiceUrl,
                            parcela: item?.installmentNumber,
                            valor_pacela: item?.value * 100,
                            vencimento: item?.dueDate,
                        },
                    },
                }));

                return dados_cobranca_asaas;
                break;
            default:
                return helpers.set_response.error.WARNING({message: "Checkout não enviado ou não listado", results: []}) as any;
        }
    }

    static async selecionar_checkout_deletar(conta_receber: t.Controllers.ContaReceber.BuscarPeloId.Output, c: t.Context): Promise<void> {
        switch (conta_receber.data.conta_receber.checkout) {
            case "pagarme":
                const data_pagarme: t.Services.ServicePagarme.Pedido.Deletar.Input = {
                    data: {id: conta_receber.data.conta_receber.pagamento_id, status: "canceled"},
                };
                const resultado = await services_pagarme_api.pedido.deletar(data_pagarme, c);

                if (!resultado?.data?.cobranca?.closed) {
                    helpers.set_response.error.WARNING({message: "Erro ao cancelar cobrança no Pagar.me.", results: []});
                }

                break;
            case "asaas":
                const data_asaas: t.Services.Asaas.Cobranca.DeletarCobranca.Input = {
                    data: {id: conta_receber?.data?.conta_receber?.pagamento_id},
                };
                const result = await services_asaas_api.cobranca.deletar_cobranca(data_asaas, c);

                if (!result.data.cobranca.deleted) {
                    helpers.set_response.WARNING({message: "Erro ao cancelar cobrança no Asaas.", results: []});
                }
                break;
            default:
                break;
        }
    }
};

export default services_conta_receber;
