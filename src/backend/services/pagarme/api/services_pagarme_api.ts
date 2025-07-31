import t from "../../../../types";

import helpers from "../../../helpers/helpers";
import model_log from "../../../models/log/model_log";

const services_pagarme_api = class services_pagarme_api {
    static utils = class utils {
        static header(env: t.Env) {
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("content-type", "application/json");
            myHeaders.append("authorization", `${env.SK_PAGARME}`);
            return myHeaders;
        }

        static adicionar_metodos_pagamento_pedido({
            conta,
            pedido,
        }: {
            conta: t.Controllers.ContaReceber.Criar.Input["data"]["conta_receber"];
            pedido: t.Services.ServicePagarme.Pedido.Criar.Input;
        }): t.Services.ServicePagarme.Pedido.Criar.Input {
            const checkout = pedido.data.pedido.payments[0].checkout;
            if (!checkout) return pedido;

            switch (conta.metodo_pagamento) {
                case "pix":
                    checkout.pix = {
                        expires_in: "86400000",
                        additional_information: [
                            {
                                name: "Onda Segura",
                                value: "pix",
                            },
                        ],
                    };
                    break;
                case "boleto":
                    checkout.boleto = {
                        bank: "033",
                        due_at: conta.vencimento ?? new Date().toISOString(),
                        instructions: "Pagamento Carta fiança - Onda Segura",
                    };
                    break;
                case "credit_card":
                    checkout.credit_card = {
                        capture: true,
                        statement_descriptor: "Onda Segura",
                        free_installment: 1,
                        max_installments: 12,
                        // interest_rate: conta.juros.valor,
                        installments: Array.from({length: conta.parcelas}, (_, i) => {
                            const numero_parcela = i + 1;
                            const valor_base = conta.valor;

                            const total = numero_parcela <= 1 ? valor_base : Math.round(valor_base * Math.pow(1 + conta.juros.valor / 100, numero_parcela - 1));

                            return {
                                number: numero_parcela,
                                total,
                            };
                        }),
                    };
                    break;
            }

            return pedido;
        }
    };

    static cliente = class cliente {
        static async criar(customer: t.Controllers.Cliente.Criar.Output, c: t.Context): Promise<any> {
            const myHeaders = services_pagarme_api.utils.header(c.env);

            function validateAndRemoveSpecialCharactersAndSpaces(value: string): {value: string; documentType: string; customerType: string} {
                const regex = /[^a-zA-Z0-9\s]/g;
                const newValue = value?.replace(regex, "");
                const documentType: string = newValue?.length > 11 ? "CNPJ" : "CPF";
                const customerType: string = newValue?.length > 11 ? "company" : "individual";

                return {
                    value: newValue,
                    documentType: documentType,
                    customerType: customerType,
                };
            }

            const validationsByDocument = validateAndRemoveSpecialCharactersAndSpaces(customer.data.cliente.cpf_cnpj);

            const dados_validados = t.Services.ServicePagarme.Cliente.Criar.InputSchema.parse({
                name: customer.data.cliente.nome,
                email: customer.data.cliente.email,
                code: customer.data.cliente._id,
                document: validationsByDocument.value,
                document_type: validationsByDocument.documentType,
                type: validationsByDocument.customerType,
                gender: customer.data.cliente?.genero || "masculino",
                phones: {
                    mobile_phone: {
                        country_code: "55",
                        area_code: customer.data.cliente.celular.slice(0, 2),
                        number: customer?.data?.cliente?.celular.slice(2),
                    },
                },
            }) as t.Services.ServicePagarme.Cliente.Criar.Input;

            // const dados_validados = t.Services.ServicePagarme.Cliente.Criar.InputSchema.parse(novo_cliente);

            const response = await fetch(`${c.env.URL_API_PAGARME}/customers`, {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(dados_validados),
            });

            const responseData: t.Services.ServicePagarme.Cliente.Criar.Output = await response.json();

            if (response.ok === false) {
                helpers.set_response.error.WARNING({message: "Erro ao criar cliente dentro do pagarme", results: []});
            }

            return {
                data: {
                    cliente: responseData,
                },
            };
        }
    };

    static pedido = class pedido {
        static async criar(data: t.Controllers.ContaReceber.Criar.Input, c: t.Context): Promise<t.Services.ServicePagarme.Pedido.Criar.Output> {
            const conta = data.data.conta_receber;

            const pedido: t.Services.ServicePagarme.Pedido.Criar.Input = {
                data: {
                    pedido: {
                        code: conta?.codigo,
                        customer_id: conta?.cliente_id,
                        metadata: conta?.metadata,
                        items: [
                            {
                                amount: conta?.valor,
                                code: conta?.codigo,
                                description: conta?.descricao == undefined || conta?.descricao?.length == 0 ? "Recebimento" : conta?.descricao,
                                quantity: 1,
                            },
                        ],
                        payments: [
                            {
                                payment_method: "checkout",
                                checkout: {
                                    accepted_payment_methods: [conta?.metodo_pagamento],
                                    customer_editable: false,
                                    default_payment_method: conta?.metodo_pagamento ?? "pix",
                                    expires_in: 1440000,
                                    skip_checkout_success_page: false,
                                    success_url: "https://ondasegura.com.br/",
                                },
                            },
                        ],
                    },
                },
            };

            const novo_pedido = services_pagarme_api.utils.adicionar_metodos_pagamento_pedido({conta, pedido});

            const dados_validados = t.Services.ServicePagarme.Pedido.Criar.InputSchema.parse(novo_pedido);

            const url = `${c.env.URL_API_PAGARME}/orders`;
            const options = {
                method: "POST",
                headers: services_pagarme_api.utils.header(c.env),
                body: JSON.stringify(dados_validados.data.pedido),
            };

            const response = await fetch(url, options);
            const result: any = await response.json();

            const logBase = {
                class_name: "services_pagarme_api",
                matrix: conta.codigo,
                static_function: "createOrder",
                organization: "onda_segura",
                user: "",
                type_user: "",
            };

            if (!response.ok) {
                await model_log.criar(
                    {
                        data: {
                            log: {
                                ...logBase,
                                type: "error",
                                error_message: "Erro ao cadastrar ordem no pagarme",
                                error_returned_by_system: result,
                            },
                        },
                    },
                    c
                );
            } else {
                await model_log.criar(
                    {
                        data: {
                            log: {
                                ...logBase,
                                type: "log",
                                error_message: "Sucesso ao cadastrar ordem no pagarme",
                                error_returned_by_system: "",
                            },
                        },
                    },
                    c
                );
            }

            return {
                data: {
                    pedido: result as t.Services.ServicePagarme.Pedido.Criar.Output["data"]["pedido"],
                },
            };
        }

        static async deletar(data: t.Services.ServicePagarme.Pedido.Deletar.Input, c: t.Context): Promise<t.Services.ServicePagarme.Pedido.Deletar.Output> {
            const dados_validados = t.Services.ServicePagarme.Pedido.Deletar.InputSchema.parse(data);

            const response = await fetch(`${c.env.URL_API_PAGARME}/orders/${dados_validados?.data?.id}/closed`, {
                method: "PATCH",
                headers: services_pagarme_api.utils.header(c.env),
                body: JSON.stringify({status: dados_validados?.data?.status}),
            });

            if (response.ok === false) {
                helpers.set_response.error.WARNING({message: "Erro ao cancelar pedido no Pagar.me.", results: []});
            }

            const result = await response.json();

            return {
                data: {
                    cobranca: result as t.Services.ServicePagarme.Pedido.Deletar.Output["data"]["cobranca"],
                },
            };
        }
    };
};

export default services_pagarme_api;
