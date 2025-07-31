//BIBLIOTECAS
import helpers from "../../../helpers/helpers";
import t from "../../../../types";

//HELPERS

//BANCO DE DADOS

//SERVICES
//MODEL
import model_conta_receber from "../../../models/conta_receber/model_conta_receber";
import model_log from "../../../models/log/model_log";
const config_notificao_mok = [
    {
        enabled: true,
        emailEnabledForProvider: false,
        smsEnabledForProvider: false,
        emailEnabledForCustomer: true,
        smsEnabledForCustomer: true,
        phoneCallEnabledForCustomer: false,
        whatsappEnabledForCustomer: true,
        event: "PAYMENT_CREATED",
        scheduleOffset: 0,
        deleted: false,
    },
    {
        enabled: false,
        emailEnabledForProvider: false,
        smsEnabledForProvider: false,
        emailEnabledForCustomer: true,
        smsEnabledForCustomer: false,
        phoneCallEnabledForCustomer: false,
        whatsappEnabledForCustomer: true,
        event: "PAYMENT_RECEIVED",
        scheduleOffset: 0,
        deleted: false,
    },
    {
        enabled: true,
        emailEnabledForProvider: false,
        smsEnabledForProvider: false,
        emailEnabledForCustomer: true,
        smsEnabledForCustomer: true,
        phoneCallEnabledForCustomer: false,
        whatsappEnabledForCustomer: true,
        event: "PAYMENT_UPDATED",
        scheduleOffset: 0,
        deleted: false,
    },
    {
        enabled: true,
        emailEnabledForProvider: false,
        smsEnabledForProvider: false,
        emailEnabledForCustomer: true,
        smsEnabledForCustomer: true,
        phoneCallEnabledForCustomer: false,
        whatsappEnabledForCustomer: true,
        event: "PAYMENT_DUEDATE_WARNING",
        scheduleOffset: 10,
        deleted: false,
    },
    {
        enabled: true,
        emailEnabledForProvider: false,
        smsEnabledForProvider: false,
        emailEnabledForCustomer: true,
        smsEnabledForCustomer: true,
        phoneCallEnabledForCustomer: false,
        whatsappEnabledForCustomer: true,
        event: "PAYMENT_DUEDATE_WARNING",
        scheduleOffset: 0,
        deleted: false,
    },
    {
        enabled: true,
        emailEnabledForProvider: false,
        smsEnabledForProvider: false,
        emailEnabledForCustomer: true,
        smsEnabledForCustomer: true,
        phoneCallEnabledForCustomer: false,
        whatsappEnabledForCustomer: false,
        event: "SEND_LINHA_DIGITAVEL",
        scheduleOffset: 0,
        deleted: false,
    },
    {
        enabled: true,
        emailEnabledForProvider: true,
        smsEnabledForProvider: false,
        emailEnabledForCustomer: true,
        smsEnabledForCustomer: true,
        phoneCallEnabledForCustomer: false,
        whatsappEnabledForCustomer: true,
        event: "PAYMENT_OVERDUE",
        scheduleOffset: 0,
        deleted: false,
    },
    {
        enabled: true,
        emailEnabledForProvider: false,
        smsEnabledForProvider: false,
        emailEnabledForCustomer: true,
        smsEnabledForCustomer: true,
        phoneCallEnabledForCustomer: false,
        whatsappEnabledForCustomer: true,
        event: "PAYMENT_OVERDUE",
        scheduleOffset: 1,
        deleted: false,
    },
];

const config_cobranca_mok = {
    interest: {
        value: 3,
    },
    fine: {
        value: 0.03,
        type: "PERCENTAGE",
    },
} as const;

const services_asaas_api = class services_asaas_api {
    static utils = class utils {
        static headers(c: t.Context) {
            return {
                "User-Agent": "NodeJS/22.0 (Serverless)",
                accept: "application/json",
                "content-type": "application/json",
                access_token: c.env.SK_TOKEN_ASAAS,
            };
        }
    };

    static cliente = class cliente {
        static async criar(cliente: t.Controllers.Cliente.Criar.Output, c: t.Context): Promise<t.Services.Asaas.Cliente.Criar.Output> {
            const verificar_se_cliente_ja_existe = await this.buscar_pelo_filtro(
                {
                    filtros: {
                        cliente: {
                            cpfCnpj: cliente.data.cliente.cpf_cnpj,
                        },
                    },
                },
                c
            );

            if (verificar_se_cliente_ja_existe?.data?.clientes?.data?.length > 0) {
                return {
                    data: {
                        cliente: verificar_se_cliente_ja_existe.data.clientes.data[0],
                    },
                };
            }

            try {
                const requestData = {
                    externalReference: cliente?.data?.cliente?._id,
                    name: cliente?.data?.cliente?.nome || null,
                    cpfCnpj: cliente?.data?.cliente?.cpf_cnpj || null,
                    email: cliente?.data?.cliente?.email || null,
                    mobilePhone: cliente?.data?.cliente?.celular || null,
                    address: null,
                    addressNumber: null,
                    complement: null,
                    province: null,
                    postalCode: null,
                    notificationDisabled: false,
                    phone: cliente?.data?.cliente?.celular || null,
                };

                const response = await fetch(`${c.env.BASE_URL_ASAAS}/v3/customers`, {
                    method: "POST",
                    headers: services_asaas_api.utils.headers(c),
                    body: JSON.stringify(requestData),
                });

                if (response.ok === false) {
                    helpers.set_response.error.WARNING({message: "Erro ao criar cliente dentro do asaas", results: []});
                }
                const responseData: t.Services.Asaas.Cliente.Criar.Output["data"]["cliente"] = await response.json();

                await services_asaas_api.notificacao_config.atualizar_config_notificacoes_padrao(responseData.id, c);

                return {
                    data: {
                        cliente: responseData,
                    },
                };
            } catch (error) {
                return helpers.set_response.error.WARNING({message: error.message || "Erro ao salvar cliente no asaas", results: error}) as any;
            }
        }

        static async buscar_pelo_filtro(filtro: t.Services.Asaas.Cliente.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Services.Asaas.Cliente.BuscarPeloFiltro.Output> {
            try {
                const trasnformar_keys_em_string = JSON.stringify(filtro.filtros.cliente);

                const set_filtros = new URLSearchParams(JSON.parse(trasnformar_keys_em_string)).toString();

                const response = await fetch(`${c.env.BASE_URL_ASAAS}/v3/customers?${set_filtros}`, {
                    method: "GET",
                    headers: services_asaas_api.utils.headers(c),
                });

                if (response.ok === false) {
                    helpers.set_response.error.WARNING({message: "Erro ao buscar cliente no asaas", results: []});
                }

                const responseData: t.Services.Asaas.Cliente.BuscarPeloFiltro.Output["data"]["clientes"] = await response.json();

                return {
                    data: {
                        clientes: responseData,
                    },
                };
            } catch (error) {
                return helpers.set_response.error.WARNING({message: error.message || "Erro ao buscar config notificação cliente no asaas", results: error}) as any;
            }
        }
    };

    static notificacao_config = class notificacao_config {
        static async buscar_config_de_notificacao(c: t.Context, costumer_asaas_id: string) {
            try {
                const response = await fetch(`${c.env.BASE_URL_ASAAS}/v3/customers/${costumer_asaas_id}/notifications`, {
                    method: "GET",
                    headers: services_asaas_api.utils.headers(c),
                });

                const responseData: any = await response.json();

                if (response.ok === false) {
                    return helpers.set_response.error.WARNING({message: "Erro ao criar notificações para o cliente no asaas", results: responseData});
                }

                return responseData.data;
            } catch (error) {
                return helpers.set_response.error.WARNING({message: error.message || "Erro ao buscar config notificação cliente no asaas", results: error});
            }
        }

        static async atualizar_config_notificacoes_padrao(costumer_asaas_id: string, c: t.Context) {
            const listConfig: t.Services.Asaas.Notification.NotificationConfig[] = await this.buscar_config_de_notificacao(c, costumer_asaas_id);

            try {
                const set_new_config = listConfig?.map((config) => {
                    const configsPadrao = config_notificao_mok.filter((item) => item?.event == config?.event);
                    for (const configs of configsPadrao) {
                        if (configs?.scheduleOffset > 0 && config?.scheduleOffset > 0) {
                            const [cfg] = configsPadrao?.filter((item) => item?.scheduleOffset > 0);
                            Object.keys(cfg).forEach((key) => {
                                config[key] = cfg?.[key];
                            });
                        } else if (configs?.scheduleOffset == 0 && config?.scheduleOffset == 0) {
                            const [cfg] = configsPadrao?.filter((item) => item?.scheduleOffset == 0);
                            Object.keys(cfg).forEach((key) => {
                                config[key] = cfg?.[key];
                            });
                        }
                    }
                    return config;
                });

                const response = await fetch(`${c.env.BASE_URL_ASAAS}/v3/notifications/batch`, {
                    method: "PUT",
                    headers: services_asaas_api.utils.headers(c),
                    body: JSON.stringify({
                        customer: costumer_asaas_id,
                        notifications: set_new_config,
                    }),
                });

                const responseData: any[] = await response.json();

                if (response.ok === false) {
                    return helpers.set_response.error.WARNING({message: "Erro ao atualizar configurações de notificação", results: responseData});
                }

                return responseData;
            } catch (error) {
                return helpers.set_response.error.WARNING({message: error.message || "Erro ao atualizar config notificação cliente no asaas", results: error}) as any;
            }
        }
    };

    static cobranca = class cobranca {
        static async criar(data: t.Controllers.ContaReceber.Criar.Input, c: t.Context): Promise<t.Services.Asaas.Cobranca.CriarCobrancaBoleto.Output> {
            const myHeaders = services_asaas_api.utils.headers(c);
            const conta: any = data.data.conta_receber;

            // Validar os dados de entrada usando o schema Zod
            const dados_validados = t.Services.Asaas.Cobranca.CriarCobrancaBoleto.InputSchema.parse({
                data: {
                    cobranca: {
                        customer: conta.cliente_id,
                        description: conta.descricao,
                        installmentCount: conta.parcelas,
                        totalValue: conta.valor,
                        externalReference: conta.codigo,
                        dueDate: new Date(conta.vencimento),
                        postalService: false,
                        billingType: conta.metodo_pagamento[0],
                        fine: {
                            type: config_cobranca_mok.fine.type,
                            value: config_cobranca_mok.fine.value,
                        },
                        interest: {
                            value: config_cobranca_mok.interest.value,
                        },
                    },
                },
            }) as t.Services.Asaas.Cobranca.CriarCobrancaBoleto.Input;

            const raw: string = JSON.stringify(dados_validados.data.cobranca);

            type RequestRedirect = "follow";

            const url: string = `${c.env.BASE_URL_ASAAS}/v3/payments`;
            const options = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow" as RequestRedirect,
            };

            const response = await fetch(url, options);
            const result: any = await response.json();

            if (response.ok === false) {
                await model_log.criar(
                    {
                        data: {
                            log: {
                                class_name: "servicesCobrancaApi",
                                matrix: dados_validados.data.cobranca.externalReference,
                                static_function: "criar_cobranca",
                                organization: "onda_segura",
                                type: "error",
                                error_message: "Erro ao criar cobrança na API externa",
                                error_returned_by_system: result,
                                user: "",
                                type_user: "",
                            },
                        },
                    },
                    c
                );
                return helpers.set_response.error.DATABASE_ERROR({
                    message: "Erro ao criar cobrança na API externa",
                    results: result || [],
                }) as any;
            } else {
                // Log de sucesso
                await model_log.criar(
                    {
                        data: {
                            log: {
                                class_name: "servicesCobrancaApi",
                                matrix: dados_validados.data.cobranca.externalReference,
                                static_function: "criar_cobranca",
                                organization: "onda_segura",
                                type: "log",
                                error_message: "Sucesso ao criar cobrança na API externa",
                                error_returned_by_system: "",
                                user: "",
                                type_user: "",
                            },
                        },
                    },
                    c
                );

                return {
                    data: {
                        cobranca: result,
                    },
                };
            }
        }

        static async buscar_cobrancas(filtro: t.Services.Asaas.Cobranca.BuscarCobranca.Input, c: t.Context): Promise<t.Services.Asaas.Cobranca.BuscarCobranca.Output> {
            const dados_validade = t.Services.Asaas.Cobranca.BuscarCobranca.InputSchema.parse(filtro);

            const transforma_array_em_string = JSON.stringify(dados_validade.data.cobranca);

            const set_filtros = new URLSearchParams(JSON.parse(transforma_array_em_string)).toString();

            const response = await fetch(`${c.env.BASE_URL_ASAAS}/v3/payments/?${set_filtros}`, {
                method: "GET",
                headers: services_asaas_api.utils.headers(c),
            });

            if (response.ok === false) {
                helpers.set_response.error.WARNING({message: "Erro ao buscar cobrança no Asaas", results: []});
            }

            const responseData: t.Services.Asaas.Cobranca.BuscarCobranca.Output["data"]["cobrancas"] = await response.json();

            return {
                data: {
                    cobrancas: responseData,
                },
            };
        }

        static async deletar_cobranca(data: t.Services.Asaas.Cobranca.DeletarCobranca.Input, c: t.Context): Promise<t.Services.Asaas.Cobranca.DeletarCobranca.Output> {
            const dados_validados = t.Services.Asaas.Cobranca.DeletarCobranca.InputSchema.parse(data);

            const response = await fetch(`${c.env.BASE_URL_ASAAS}/v3/payments/${dados_validados.data.id}`, {
                method: "DELETE",
                headers: services_asaas_api.utils.headers(c),
            });

            if (response.ok === false) {
                helpers.set_response.error.WARNING({message: "Erro ao cancelar cobrança na plataforma Asaas", results: []});
            }

            const result: any = await response.json();

            return {
                data: {
                    cobranca: result,
                },
            };
        }
    };

    //não mexer nesse trem
    static transferencia = class transferencia {
        static async pagar_pix(recebedor: t.Controllers.Recebedor.Criar.Input, c: t.Context): Promise<t.Services.Asaas.Transferencia.PagarPix.Output> {
            const myHeaders = services_asaas_api.utils.headers(c);

            const url = `${c.env.BASE_URL_ASAAS}/v3/transfers`;
            const options = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({
                    value: 1000,
                    operationType: "PIX",
                    pixAddressKey: "41aed6c8-b68c-4d5a-a906-3ac56da9521e",
                    pixAddressKeyType: "EVP",
                    description: "Churrasco pago via Pix agendado",
                    externalReference: "15615664156",
                }),
            };

            const response: t.Services.Asaas.Transferencia.PagarPix.Output | any = await fetch(url, options)
                .then((res) => res.json())
                .then((json) => console.log(json))
                .catch((err) => console.error(err));

            return response;
        }
    };
};

export default services_asaas_api;
