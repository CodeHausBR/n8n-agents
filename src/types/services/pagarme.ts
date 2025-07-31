import z4 from "zod/v4";
import ControllerRecebedor from "../controllers/recebedor";

// COMO USAR ESTE NAMESPACE NA HORA DE IMPORTAR:
// import t from "onda-types"
// t.Services.CriarCliente.Input
namespace ServicePagarme {
    export namespace Cliente {
        export namespace Criar {
            const generos = {
                feminino: "female",
                masculino: "male",
            } as const;

            export const InputSchema = z4.object({
                name: z4.string(),
                email: z4.email(),
                code: z4.string(),
                document: z4.string(),
                type: z4.string(),
                document_type: z4.string(),
                gender: z4.enum(["feminino", "masculino"]).transform((valor) => generos[valor]),
                address: z4
                    .object({
                        line_1: z4.string(),
                        line_2: z4.string(),
                        zip_code: z4.string(),
                        city: z4.string(),
                        state: z4.string(),
                        country: z4.string(),
                    })
                    .optional(),
                birthdate: z4.string().optional(),
                phones: z4.object({
                    home_phone: z4
                        .object({
                            country_code: z4.string(),
                            area_code: z4.string(),
                            number: z4.string(),
                        })
                        .optional(),
                    mobile_phone: z4.object({
                        country_code: z4.string(),
                        area_code: z4.string(),
                        number: z4.string(),
                    }),
                }),
                metadata: z4.record(z4.string(), z4.any()).optional(),
            });
            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = z4.object({
                id: z4.string(),
                name: z4.string(),
                email: z4.email(),
                code: z4.string(),
                document: z4.string(),
                document_type: z4.string(),
                type: z4.string(),
                gender: z4.string(),
                delinquent: z4.boolean(),
                address: z4.object({
                    id: z4.string(),
                    line_1: z4.string(),
                    line_2: z4.string(),
                    zip_code: z4.string(),
                    city: z4.string(),
                    state: z4.string(),
                    country: z4.string(),
                    status: z4.string(),
                    created_at: z4.string(),
                    updated_at: z4.string(),
                }),
                created_at: z4.string(),
                updated_at: z4.string(),
                birthdate: z4.string().optional(),
                phones: z4.object({
                    home_phone: z4
                        .object({
                            country_code: z4.string(),
                            number: z4.string(),
                            area_code: z4.string(),
                        })
                        .optional(),
                    mobile_phone: z4
                        .object({
                            country_code: z4.string(),
                            number: z4.string(),
                            area_code: z4.string(),
                        })
                        .optional(),
                }),
                metadata: z4.record(z4.string(), z4.any()),
            });
            export type Output = z4.infer<typeof OutputSchema>;
        }
    }

    export namespace Recebedor {
        const remover_simbolos = z4.string().transform((valor) => {
            return valor.replace(/\D/g, "");
        });

        export namespace Criar {
            const TelefoneComTipoSchema = z4.object({
                ddd: z4.string().length(2),
                number: z4.string().min(8),
                type: z4
                    .union([z4.literal("mobile"), z4.literal("landline")])
                    .optional()
                    .nullable(),
            });

            const EnderecoCompletoSchema = z4.object({
                street: z4.string(),
                complementary: z4.string(),
                street_number: z4.string(),
                neighborhood: z4.string(),
                city: z4.string(),
                state: z4.string(),
                zip_code: z4.preprocess((valor) => String(valor ?? ""), remover_simbolos.pipe(z4.string().length(8))),
                reference_point: z4.string(),
            });

            const ContaBancariaSchema = z4.object({
                holder_name: z4.string().transform((value) => (value.length > 30 ? value.slice(0, 27) + "..." : value)),
                holder_type: z4.union([z4.literal("individual"), z4.literal("company")]),
                holder_document: z4.string(),
                bank: z4.string(),
                branch_number: z4.string().length(4),
                branch_check_digit: z4
                    .string()
                    .transform((value) => (value === "" ? null : value))
                    .nullable()
                    .optional(),
                account_number: z4.string().max(13),
                account_check_digit: z4.string().max(1),
                type: z4.union([z4.literal("checking"), z4.literal("savings"), z4.string()]),
            });

            const ConfiguracoesTransferenciaSchema = z4.object({
                transfer_enabled: z4.boolean(),
                transfer_interval: z4.union([z4.literal("Daily"), z4.literal("Weekly"), z4.literal("Monthly")]),
                transfer_day: z4.number().int(),
            });

            const ConfiguracoesAntecipacaoSchema = z4.object({
                enabled: z4.boolean(),
                type: z4.union([z4.literal("full"), z4.literal("1025")]),
                volume_percentage: z4.string(),
                delay: z4.number().nullable(),
            });

            const DefaultBankAccountOutputSchema = z4.object({
                id: z4.string(),
                holder_name: z4.string(),
                holder_type: z4.literal("individual"),
                holder_document: z4.string(),
                bank: z4.string(),
                branch_number: z4.string(),
                account_number: z4.string(),
                account_check_digit: z4.string(),
                type: z4.literal("checking"),
                status: z4.literal("active"),
                created_at: z4.string(),
                updated_at: z4.string(),
            });

            const GatewayRecipientSchema = z4.object({
                gateway: z4.literal("pagarme"),
                status: z4.literal("active"),
                pgid: z4.string(),
                createdAt: z4.string(),
                updatedAt: z4.string(),
            });

            const AutomaticAnticipationSettingsOutputSchema = z4.object({
                enabled: z4.boolean(),
                type: z4.literal("full"),
                // No JSON, 'volume_percentage' é um número
                volume_percentage: z4.number(),
                delay: z4.number(),
            });

            const RegisterInformationOutputSchema = z4.object({
                email: z4.string(),
                document: z4.string(),
                type: z4.string(),
                phone_numbers: z4.array(TelefoneComTipoSchema),
                name: z4.string(),
                mother_name: z4.string(),
                birthdate: z4.string(),
                monthly_income: z4.string(),
                professional_occupation: z4.string(),
                address: EnderecoCompletoSchema,
            });

            export const RecebedorCompletoOutputSchema = z4.object({
                id: z4.string(),
                name: z4.string(),
                email: z4.string(),
                code: z4.string(),
                document: z4.string(),
                type: z4.string(),
                payment_mode: z4.literal("bank_transfer"),
                status: z4.string(),
                created_at: z4.string(),
                updated_at: z4.string(),
                transfer_settings: ConfiguracoesTransferenciaSchema,
                default_bank_account: DefaultBankAccountOutputSchema,
                gateway_recipients: z4.array(GatewayRecipientSchema),
                automatic_anticipation_settings: AutomaticAnticipationSettingsOutputSchema,
                register_information: RegisterInformationOutputSchema,
            });

            const SocioAdministradorSchema = z4.object({
                name: z4.string(),
                email: z4.email(),
                document: z4.string().max(11),
                type: z4.literal("individual"),
                mother_name: z4.string(),
                birthdate: z4.string(),
                monthly_income: z4.transform((val) => Number(val)),
                professional_occupation: z4.string(),
                self_declared_legal_representative: z4.boolean(),
                address: EnderecoCompletoSchema,
                phone_numbers: z4.array(TelefoneComTipoSchema),
            });

            const RegisterInformationIndividualSchema = z4.object({
                type: z4.literal("individual"),
                email: z4.email(),
                document: z4.string().max(11),
                name: z4.string(),
                mother_name: z4.string().optional(),
                birthdate: z4.string(),
                monthly_income: z4.transform((val) => Number(val)),
                professional_occupation: z4.string(),
                address: EnderecoCompletoSchema,
                phone_numbers: z4.array(TelefoneComTipoSchema),
                site_url: z4.string().optional(),
            });

            const RegisterInformationCorporationSchema = z4.object({
                type: z4.literal("corporation"),
                email: z4.email(),
                document: z4.string(),
                company_name: z4.string(),
                trading_name: z4.string(),
                corporation_type: z4.string(),
                founding_date: z4.string(),
                annual_revenue: z4.transform((val) => Number(val)),
                main_address: EnderecoCompletoSchema,
                phone_numbers: z4.array(TelefoneComTipoSchema),
                managing_partners: z4.array(SocioAdministradorSchema),
                site_url: z4.string().optional(),
            });

            const RegisterInformationDiscriminadoSchema = z4.discriminatedUnion("type", [RegisterInformationCorporationSchema, RegisterInformationIndividualSchema]);

            export const InputSchema = z4.object({
                register_information: RegisterInformationDiscriminadoSchema,
                default_bank_account: ContaBancariaSchema,
                transfer_settings: ConfiguracoesTransferenciaSchema,
                automatic_anticipation_settings: ConfiguracoesAntecipacaoSchema,
                code: z4.string(),
            });

            export const OutputSchema = RecebedorCompletoOutputSchema;

            export type Input = z4.infer<typeof InputSchema>;
            export type Output = {
                data: {
                    recebedor: z4.infer<typeof OutputSchema>;
                };
            };
        }
        export namespace ReceberEventoWebhook {
            export const InputSchema = z4.object({
                id: z4.string(),
            });

            export const OutputSchema = Recebedor.Criar.RecebedorCompletoOutputSchema;
            export type Input = z4.infer<typeof InputSchema>;
            export type Output = {
                data: {
                    recebedor: z4.infer<typeof OutputSchema>;
                };
            };
        }
    }

    export namespace Pedido {
        export namespace Criar {
            export const PixSchema = z4
                .object({
                    expires_in: z4.string(),
                    additional_information: z4.array(
                        z4.object({
                            name: z4.string(),
                            value: z4.string(),
                        })
                    ),
                })
                .optional();
            export type Pix = z4.infer<typeof PixSchema>;

            export const BoletoSchema = z4
                .object({
                    bank: z4.string(),
                    due_at: z4.iso.datetime().optional(),
                    instructions: z4.string(),
                })
                .optional();
            export type Boleto = z4.infer<typeof BoletoSchema>;

            export const CartaoDeCreditoSchema = z4
                .object({
                    capture: z4.boolean(),
                    statement_descriptor: z4.string(),
                    installments: z4
                        .array(
                            z4.object({
                                number: z4.number(),
                                total: z4.number().transform((val) => val * 100),
                            })
                        )
                        .optional(),
                    free_installment: z4.number().optional().default(1),
                    interest_rate: z4.number().min(0.01).max(100).optional(),
                    max_installments: z4.number().optional().default(2),
                })
                .optional();

            export type CartaoDeCredito = z4.infer<typeof CartaoDeCreditoSchema>;

            const MetodoPagamentoSchema = z4.union([z4.literal("pix"), z4.literal("boleto"), z4.literal("credit_card"), z4.literal("debit_card")]);

            export const InputSchema = z4.object({
                data: z4.object({
                    pedido: z4.object({
                        code: z4.string(),
                        customer_id: z4.string(),
                        metadata: z4.record(z4.string(), z4.any()).optional(),
                        items: z4.array(
                            z4.object({
                                amount: z4.number().transform((val) => val * 100),
                                code: z4.string(),
                                description: z4.string(),
                                quantity: z4.number(),
                            })
                        ),
                        payments: z4.array(
                            z4.object({
                                payment_method: z4.literal("checkout"),
                                checkout: z4.object({
                                    accepted_payment_methods: z4.array(MetodoPagamentoSchema),
                                    customer_editable: z4.boolean(),
                                    default_payment_method: MetodoPagamentoSchema,
                                    expires_in: z4.number(),
                                    skip_checkout_success_page: z4.boolean(),
                                    success_url: z4.string(),
                                    boleto: BoletoSchema,
                                    pix: PixSchema,
                                    credit_card: CartaoDeCreditoSchema,
                                }),
                            })
                        ),
                    }),
                }),
            });
            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = z4.object({
                id: z4.string(),
                code: z4.string(),
                amount: z4.number(),
                currency: z4.string(),
                closed: z4.boolean(),
                items: z4.array(
                    z4.object({
                        id: z4.string(),
                        type: z4.string(),
                        description: z4.string(),
                        amount: z4.number(),
                        quantity: z4.number(),
                        status: z4.string(),
                        created_at: z4.string(),
                        updated_at: z4.string(),
                        code: z4.string(),
                    })
                ),
                customer: z4.object({
                    id: z4.string(),
                    name: z4.string(),
                    email: z4.string(),
                    code: z4.string(),
                    document: z4.string(),
                    document_type: z4.string(),
                    type: z4.string(),
                    gender: z4.string(),
                    delinquent: z4.boolean(),
                    created_at: z4.string(),
                    updated_at: z4.string(),
                    phones: z4.record(z4.string(), z4.any()),
                }),
                status: z4.string(),
                created_at: z4.string(),
                updated_at: z4.string(),
                checkouts: z4.array(
                    z4.object({
                        id: z4.string(),
                        currency: z4.string(),
                        amount: z4.number(),
                        status: z4.string(),
                        default_payment_method: z4.string(),
                        success_url: z4.string(),
                        payment_url: z4.string(),
                        customer_editable: z4.boolean(),
                        required_fields: z4.array(z4.string()),
                        billing_address_editable: z4.boolean(),
                        skip_checkout_success_page: z4.boolean(),
                        shippable: z4.boolean(),
                        created_at: z4.string(),
                        updated_at: z4.string(),
                        expires_at: z4.string(),
                        accepted_payment_methods: z4.array(z4.string()),
                        accepted_brands: z4.array(z4.string()),
                        accepted_multi_payment_methods: z4.array(z4.any()),
                        customer: z4.object({
                            id: z4.string(),
                            name: z4.string(),
                            email: z4.string(),
                            code: z4.string(),
                            document: z4.string(),
                            document_type: z4.string(),
                            type: z4.string(),
                            gender: z4.string(),
                            delinquent: z4.boolean(),
                            created_at: z4.string(),
                            updated_at: z4.string(),
                            phones: z4.record(z4.string(), z4.any()),
                        }),
                        credit_card: z4
                            .object({
                                capture: z4.boolean(),
                                statementDescriptor: z4.string(),
                                statement_descriptor: z4.string(),
                                authentication: z4.object({
                                    type: z4.string(),
                                    threed_secure: z4.record(z4.string(), z4.any()),
                                }),
                                installments: z4.array(
                                    z4.object({
                                        number: z4.number(),
                                        total: z4.number(),
                                    })
                                ),
                            })
                            .optional(),
                        boleto: z4
                            .object({
                                due_at: z4.string(),
                                instructions: z4.string(),
                            })
                            .optional(),
                        pix: z4
                            .object({
                                expires_at: z4.string(),
                                additional_information: z4.array(
                                    z4.object({
                                        name: z4.string(),
                                        value: z4.string(),
                                    })
                                ),
                            })
                            .optional(),
                        billing_address: z4.record(z4.string(), z4.any()),
                        metadata: z4.record(z4.string(), z4.any()),
                    })
                ),
                metadata: z4.record(z4.string(), z4.any()),
            });
            export type Output = {
                data: {
                    pedido: z4.infer<typeof OutputSchema>;
                };
            };
        }

        export namespace Deletar {
            export const InputSchema = z4.object({
                data: z4.object({
                    id: z4.string(),
                    status: z4.literal("canceled"),
                }),
            });
            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = z4.object({
                id: z4.string(),
                code: z4.string(),
                amount: z4.number(),
                currency: z4.string(),
                closed: z4.boolean(),
                items: z4.array(
                    z4.object({
                        id: z4.string(),
                        description: z4.string(),
                        amount: z4.number(),
                        quantity: z4.number(),
                        status: z4.string(),
                        created_at: z4.string(),
                        updated_at: z4.string(),
                    })
                ),
                customer: z4.object({
                    id: z4.string(),
                    name: z4.string(),
                    email: z4.string(),
                    delinquent: z4.boolean(),
                    created_at: z4.string(),
                    updated_at: z4.string(),
                    phones: z4.record(z4.string(), z4.any()),
                    metadata: z4.record(z4.string(), z4.any()),
                }),
                status: z4.string(),
                created_at: z4.string(),
                updated_at: z4.string(),
                closed_at: z4.string(),
            });
            export type Output = {
                data: {
                    cobranca: z4.infer<typeof OutputSchema>;
                };
            };
        }

        export namespace WebhookCobranca {
            export const PixSchema = z4.object({
                id: z4.string(),
                code: z4.string(),
                gateway_id: z4.string(),
                amount: z4.number(),
                paid_amount: z4.number(),
                status: z4.string(),
                currency: z4.string(),
                payment_method: z4.literal("pix"),
                paid_at: z4.string(),
                created_at: z4.string(),
                updated_at: z4.string(),
                pending_cancellation: z4.boolean(),
                customer: z4.object({
                    id: z4.string(),
                    name: z4.string(),
                    email: z4.string(),
                    code: z4.string(),
                    document: z4.string(),
                    document_type: z4.string(),
                    type: z4.string(),
                    delinquent: z4.boolean(),
                    address: z4.object({
                        id: z4.string(),
                        street: z4.string(),
                        number: z4.string(),
                        complement: z4.string(),
                        zip_code: z4.string(),
                        neighborhood: z4.string(),
                        city: z4.string(),
                        state: z4.string(),
                        country: z4.string(),
                        status: z4.string(),
                        created_at: z4.string(),
                        updated_at: z4.string(),
                        metadata: z4.record(z4.string(), z4.any()),
                    }),
                    created_at: z4.string(),
                    updated_at: z4.string(),
                    phones: z4.object({
                        home_phone: z4.object({
                            country_code: z4.string(),
                            number: z4.string(),
                            area_code: z4.string(),
                        }),
                    }),
                    metadata: z4.record(z4.string(), z4.any()),
                }),
                order: z4.object({
                    id: z4.string(),
                    code: z4.string(),
                    amount: z4.number(),
                    closed: z4.boolean(),
                    created_at: z4.string(),
                    updated_at: z4.string(),
                    closed_at: z4.string(),
                    currency: z4.string(),
                    status: z4.string(),
                    customer_id: z4.string(),
                    metadata: z4.record(z4.string(), z4.any()),
                }),
                checkout_payment: z4.object({
                    id: z4.string(),
                    amount: z4.number(),
                    status: z4.string(),
                    payment_url: z4.string(),
                    billing_address_editable: z4.boolean(),
                    created_at: z4.string(),
                    updated_at: z4.string(),
                }),
                last_transaction: z4.object({
                    transaction_type: z4.string(),
                    pix_provider_tid: z4.string(),
                    qr_code: z4.string(),
                    qr_code_url: z4.string(),
                    end_to_end_id: z4.string(),
                    payer: z4.object({
                        name: z4.string(),
                        document: z4.string(),
                        document_type: z4.string(),
                        bank_account: z4.object({
                            bank_name: z4.string(),
                            ispb: z4.string(),
                        }),
                    }),
                    expires_at: z4.string(),
                    id: z4.string(),
                    gateway_id: z4.string(),
                    amount: z4.number(),
                    status: z4.string(),
                    success: z4.boolean(),
                    created_at: z4.string(),
                    updated_at: z4.string(),
                    gateway_response: z4.record(z4.string(), z4.any()),
                    antifraud_response: z4.record(z4.string(), z4.any()),
                    metadata: z4.record(z4.string(), z4.any()),
                }),
                metadata: z4.record(z4.string(), z4.any()),
            });

            export const CartaoDeCreditoSchema = z4.object({
                amount: z4.number(),
                checkout_payment: z4.object({
                    amount: z4.number(),
                    billing_address_editable: z4.boolean(),
                    created_at: z4.string(),
                    customer_editable: z4.boolean(),
                    id: z4.string(),
                    payment_url: z4.string().url(),
                    shippable: z4.boolean(),
                    skip_checkout_success_page: z4.boolean(),
                    status: z4.string(),
                    updated_at: z4.string(),
                }),
                code: z4.string(),
                created_at: z4.string(),
                currency: z4.string(),
                customer: z4.object({
                    address: z4.object({
                        city: z4.string(),
                        complement: z4.string(),
                        country: z4.string(),
                        created_at: z4.string(),
                        id: z4.string(),
                        neighborhood: z4.string(),
                        number: z4.string(),
                        state: z4.string(),
                        status: z4.string(),
                        street: z4.string(),
                        updated_at: z4.string(),
                        zip_code: z4.string(),
                    }),
                    code: z4.string(),
                    created_at: z4.string(),
                    delinquent: z4.boolean(),
                    document: z4.string(),
                    document_type: z4.string(),
                    email: z4.string().email(),
                    id: z4.string(),
                    name: z4.string(),
                    phones: z4.object({
                        home_phone: z4.object({
                            area_code: z4.string(),
                            country_code: z4.string(),
                            number: z4.string(),
                        }),
                    }),
                    type: z4.string(),
                    updated_at: z4.string(),
                }),
                gateway_id: z4.string(),
                id: z4.string(),
                last_transaction: z4.object({
                    acquirer_auth_code: z4.string(),
                    acquirer_message: z4.string(),
                    acquirer_name: z4.string(),
                    acquirer_nsu: z4.string(),
                    acquirer_return_code: z4.string(),
                    acquirer_tid: z4.string(),
                    amount: z4.number(),
                    antifraud_response: z4.object({
                        provider_name: z4.string(),
                        score: z4.string(),
                        status: z4.string(),
                    }),
                    brand_id: z4.string(),
                    card: z4.object({
                        billing_address: z4.object({
                            city: z4.string(),
                            complement: z4.string(),
                            country: z4.string(),
                            neighborhood: z4.string(),
                            number: z4.string(),
                            state: z4.string(),
                            street: z4.string(),
                            zip_code: z4.string(),
                        }),
                        brand: z4.string(),
                        created_at: z4.string(),
                        exp_month: z4.number(),
                        exp_year: z4.number(),
                        first_six_digits: z4.string(),
                        holder_document: z4.string(),
                        holder_name: z4.string(),
                        id: z4.string(),
                        last_four_digits: z4.string(),
                        network_token: z4.object({
                            status: z4.string(),
                            token_unique_reference: z4.string(),
                        }),
                        status: z4.string(),
                        type: z4.string(),
                        updated_at: z4.string(),
                    }),
                    created_at: z4.string(),
                    funding_source: z4.string(),
                    gateway_id: z4.string(),
                    gateway_response: z4.object({
                        code: z4.string(),
                        errors: z4.array(z4.any()),
                    }),
                    id: z4.string(),
                    installments: z4.number(),
                    metadata: z4.record(z4.string(), z4.any()),
                    operation_type: z4.string(),
                    statement_descriptor: z4.string(),
                    status: z4.string(),
                    success: z4.boolean(),
                    transaction_type: z4.string(),
                    updated_at: z4.string(),
                }),
                order: z4.object({
                    amount: z4.number(),
                    closed: z4.boolean(),
                    closed_at: z4.string(),
                    code: z4.string(),
                    created_at: z4.string(),
                    currency: z4.string(),
                    customer_id: z4.string(),
                    id: z4.string(),
                    metadata: z4.record(z4.string(), z4.any()),
                    status: z4.string(),
                    updated_at: z4.string(),
                }),
                paid_amount: z4.number(),
                paid_at: z4.string(),
                payment_method: z4.literal("credit_card"),
                status: z4.string(),
                updated_at: z4.string(),
            });

            export const BoletoSchema = z4.object({
                amount: z4.number(),
                code: z4.string(),
                created_at: z4.string(),
                currency: z4.string(),
                customer: z4.object({
                    address: z4.object({
                        city: z4.string(),
                        complement: z4.string(),
                        country: z4.string(),
                        created_at: z4.string(),
                        id: z4.string(),
                        line_1: z4.string(),
                        line_2: z4.string(),
                        neighborhood: z4.string(),
                        number: z4.string(),
                        state: z4.string(),
                        status: z4.string(),
                        street: z4.string(),
                        updated_at: z4.string(),
                        zip_code: z4.string(),
                    }),
                    created_at: z4.string(),
                    delinquent: z4.boolean(),
                    document: z4.string(),
                    document_type: z4.string(),
                    email: z4.string().email(),
                    id: z4.string(),
                    name: z4.string(),
                    phones: z4.object({
                        mobile_phone: z4.object({
                            area_code: z4.string(),
                            country_code: z4.string(),
                            number: z4.string(),
                        }),
                    }),
                    type: z4.string(),
                    updated_at: z4.string(),
                }),
                gateway_id: z4.string(),
                id: z4.string(),
                last_transaction: z4.object({
                    amount: z4.number(),
                    antifraud_response: z4.record(z4.string(), z4.any()),
                    bank: z4.string(),
                    barcode: z4.string(),
                    billing_address: z4.object({
                        city: z4.string(),
                        country: z4.string(),
                        line_1: z4.string(),
                        line_2: z4.string(),
                        state: z4.string(),
                        zip_code: z4.string(),
                    }),
                    created_at: z4.string(),
                    document_number: z4.string(),
                    due_at: z4.string(),
                    gateway_id: z4.string(),
                    gateway_response: z4.record(z4.string(), z4.any()),
                    id: z4.string(),
                    instructions: z4.string(),
                    line: z4.string(),
                    metadata: z4.record(z4.string(), z4.any()),
                    nosso_numero: z4.string(),
                    paid_amount: z4.number(),
                    paid_at: z4.string(),
                    pdf: z4.string(),
                    qr_code: z4.string(),
                    status: z4.string(),
                    success: z4.boolean(),
                    transaction_type: z4.string(),
                    updated_at: z4.string(),
                    url: z4.string(),
                }),
                order: z4.object({
                    amount: z4.number(),
                    closed: z4.boolean(),
                    closed_at: z4.string(),
                    code: z4.string(),
                    created_at: z4.string(),
                    currency: z4.string(),
                    customer_id: z4.string(),
                    id: z4.string(),
                    status: z4.string(),
                    updated_at: z4.string(),
                    metadata: z4.record(z4.string(), z4.any()).optional(),
                }),
                paid_amount: z4.number(),
                paid_at: z4.string(),
                payment_method: z4.literal("boleto"),
                status: z4.string(),
                updated_at: z4.string(),
            });

            const DataSchema = z4.discriminatedUnion("payment_method", [PixSchema, BoletoSchema, CartaoDeCreditoSchema]);

            export const InputSchema = z4.object({
                id: z4.string(),
                account: z4.object({
                    id: z4.string(),
                    name: z4.string(),
                }),
                type: z4.string(),
                created_at: z4.string(),
                data: DataSchema,
            });
            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = z4.object({});

            export type Output = {
                data: z4.infer<typeof OutputSchema>;
            };
        }
    }
}

export default ServicePagarme;
