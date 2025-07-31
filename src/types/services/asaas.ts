import z4, {optional, uuidv4} from "zod/v4";

namespace ServiceAsaas {
    export namespace Cobranca {
        export namespace CriarCobrancaBoleto {
            const billingTypes = ["boleto", "pix", "credit_card"] as const;

            const fineObject = z4.union([z4.literal("PERCENTAGE"), z4.literal("FIXED")]);

            export const billingTypeSchema = z4.enum(billingTypes).transform((value) => value.toUpperCase() as Uppercase<typeof value>);

            export const InputSchema = z4.object({
                data: z4.object({
                    cobranca: z4.object({
                        billingType: billingTypeSchema,
                        customer: z4.string(),
                        dueDate: z4.date(),
                        description: z4.string(),
                        externalReference: z4.string(),
                        installmentCount: z4.number(),
                        totalValue: z4.number(),
                        postalService: z4.boolean().default(false),
                        interest: z4
                            .object({
                                value: z4.number(),
                            })
                            .optional(),
                        fine: z4
                            .object({
                                value: z4.number(),
                                type: fineObject,
                            })
                            .optional(),
                    }),
                }),
            });
            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = z4.object({
                object: z4.string(),
                id: z4.string(),
                dateCreated: z4.string(),
                customer: z4.string(),
                installment: z4.string(),
                checkoutSession: z4.string().nullable(),
                paymentLink: z4.string().nullable(),
                value: z4.number(),
                netValue: z4.number(),
                originalValue: z4.number().nullable(),
                interestValue: z4.number().nullable(),
                description: z4.string(),
                billingType: z4.string(),
                canBePaidAfterDueDate: z4.boolean(),
                pixTransaction: z4.string().nullable(),
                status: z4.string(),
                dueDate: z4.string(),
                originalDueDate: z4.string(),
                paymentDate: z4.string().nullable(),
                clientPaymentDate: z4.string().nullable(),
                installmentNumber: z4.number(),
                invoiceUrl: z4.string(),
                invoiceNumber: z4.string(),
                externalReference: z4.string(),
                deleted: z4.boolean(),
                anticipated: z4.boolean(),
                anticipable: z4.boolean(),
                creditDate: z4.string().nullable(),
                estimatedCreditDate: z4.string().nullable(),
                transactionReceiptUrl: z4.string().nullable(),
                nossoNumero: z4.string(),
                bankSlipUrl: z4.string(),
                lastInvoiceViewedDate: z4.string().nullable(),
                lastBankSlipViewedDate: z4.string().nullable(),
                discount: z4.object({
                    value: z4.number(),
                    limitDate: z4.string().nullable(),
                    dueDateLimitDays: z4.number(),
                    type: z4.string(),
                }),
                fine: z4.object({
                    value: z4.number(),
                    type: z4.string(),
                }),
                interest: z4.object({
                    value: z4.number(),
                    type: z4.string(),
                }),
                postalService: z4.boolean(),
                custody: z4.string().nullable(),
                escrow: z4.string().nullable(),
                refunds: z4.string().nullable(),
            });
            export type Output = {
                data: {
                    cobranca: z4.infer<typeof OutputSchema>;
                };
            };
        }
        export namespace BuscarCobranca {
            export const InputSchema = z4.object({
                data: z4.object({
                    cobranca: z4.object({
                        installment: z4.string().optional().nullable(),
                        customer: z4.string().optional().nullable(),
                        limit: z4.number().int().optional().nullable(),
                        status: z4.string().optional().nullable(),
                        externalReference: z4.string().optional().nullable(),
                        "dateCreate[ge]": z4.string().optional().nullable(),
                        "dateCreate[le]": z4.string().optional().nullable(),
                        "dueDate[ge]": z4.string().optional().nullable(),
                        "dueDate[le]": z4.string().optional().nullable(),
                    }),
                }),
            });
            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = z4.object({
                object: z4.string(),
                hasMore: z4.boolean(),
                totalCount: z4.number(),
                limit: z4.number(),
                offset: z4.number(),
                data: z4.array(
                    z4.object({
                        object: z4.string(),
                        id: z4.string(),
                        dateCreated: z4.string(),
                        customer: z4.string(),
                        installment: z4.string(),
                        checkoutSession: z4.string().nullable(),
                        paymentLink: z4.string().nullable(),
                        value: z4.number(),
                        netValue: z4.number(),
                        originalValue: z4.number().nullable(),
                        interestValue: z4.number().nullable(),
                        description: z4.string(),
                        billingType: z4.string(),
                        canBePaidAfterDueDate: z4.boolean(),
                        pixTransaction: z4.string().nullable(),
                        status: z4.string(),
                        dueDate: z4.string(),
                        originalDueDate: z4.string(),
                        paymentDate: z4.string().nullable(),
                        clientPaymentDate: z4.string().nullable(),
                        installmentNumber: z4.number(),
                        invoiceUrl: z4.string(),
                        invoiceNumber: z4.string(),
                        externalReference: z4.string(),
                        deleted: z4.boolean(),
                        anticipated: z4.boolean(),
                        anticipable: z4.boolean(),
                        creditDate: z4.string().nullable(),
                        estimatedCreditDate: z4.string().nullable(),
                        transactionReceiptUrl: z4.string().nullable(),
                        nossoNumero: z4.string(),
                        bankSlipUrl: z4.string(),
                        lastInvoiceViewedDate: z4.string().nullable(),
                        lastBankSlipViewedDate: z4.string().nullable(),
                        discount: z4.object({
                            value: z4.number(),
                            limitDate: z4.string().nullable(),
                            dueDateLimitDays: z4.number(),
                            type: z4.string(),
                        }),
                        fine: z4.object({
                            value: z4.number(),
                            type: z4.string(),
                        }),
                        interest: z4.object({
                            value: z4.number(),
                            type: z4.string(),
                        }),
                        postalService: z4.boolean(),
                        custody: z4.any().nullable(),
                        escrow: z4.any().nullable(),
                        refunds: z4.any().nullable(),
                    })
                ),
            });
            export type Output = {
                data: {
                    cobrancas: z4.infer<typeof OutputSchema>;
                };
            };
        }
        export namespace DeletarCobranca {
            export const InputSchema = z4.object({
                data: z4.object({
                    id: z4.string(),
                }),
            });
            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = z4.object({
                deleted: z4.boolean(),
                id: z4.string(),
            });
            export type Output = {
                data: {
                    cobranca: z4.infer<typeof OutputSchema>;
                };
            };
        }
    }

    export namespace Cliente {
        export namespace Criar {
            export const InputSchema = z4.object({
                data: z4.object({
                    cliente: z4.object({
                        name: z4.string(),
                        cpfCnpj: z4.string(),
                        email: z4.email(),
                        phone: z4.string(),
                        mobilePhone: z4.string(),
                        address: z4.string(),
                        addressNumber: z4.string(),
                        complement: z4.string(),
                        province: z4.string(),
                        postalCode: z4.string(),
                        externalReference: z4.string(),
                        notificationDisabled: z4.boolean(),
                        additionalEmails: z4.string(),
                        municipalInscription: z4.string(),
                        stateInscription: z4.string(),
                        observations: z4.string(),
                        groupName: z4.null(),
                        company: z4.null(),
                        foreignCustomer: z4.boolean(),
                    }),
                }),
            });

            export const OutputSchema = z4.object({
                data: z4.object({
                    cliente: z4.object({
                        object: z4.literal("customer"),
                        id: z4.string(),
                        dateCreated: z4.string(),
                        name: z4.string(),
                        email: z4.string(),
                        phone: z4.string(),
                        mobilePhone: z4.string(),
                        address: z4.string(),
                        addressNumber: z4.string(),
                        complement: z4.string(),
                        province: z4.string(),
                        city: z4.string(),
                        cityName: z4.string(),
                        state: z4.string(),
                        country: z4.string(),
                        postalCode: z4.string(),
                        cpfCnpj: z4.string(),
                        personType: z4.string(),
                        deleted: z4.boolean(),
                        additionalEmails: z4.string(),
                        externalReference: z4.string(),
                        notificationDisabled: z4.boolean(),
                        observations: z4.string(),
                        foreignCustomer: z4.boolean(),
                    }),
                }),
            });

            export type Input = z4.infer<typeof InputSchema>;

            export type Output = z4.infer<typeof OutputSchema>;
        }

        export namespace BuscarPeloFiltro {
            export const InputSchema = z4.object({
                filtros: z4.object({
                    cliente: z4.object({
                        offset: z4.number().min(0).optional().nullable(),
                        limit: z4.number().min(1).optional().nullable(),
                        name: z4.string().optional().nullable(),
                        email: z4.email().optional().nullable(),
                        cpfCnpj: z4.string().optional().nullable(),
                        groupName: z4.string().optional().nullable(),
                        externalReference: z4.string().optional().nullable(),
                    }),
                }),
            });

            export const OutputSchema = z4.object({
                object: z4.literal("list"),
                hasMore: z4.boolean(),
                totalCount: z4.number(),
                limit: z4.number(),
                offset: z4.number(),
                data: z4.array(
                    z4.object({
                        object: z4.literal("customer"),
                        id: z4.string(),
                        dateCreated: z4.string(),
                        name: z4.string(),
                        email: z4.string(),
                        phone: z4.string(),
                        mobilePhone: z4.string(),
                        address: z4.string(),
                        addressNumber: z4.string(),
                        complement: z4.string(),
                        province: z4.string(),
                        city: z4.string(),
                        cityName: z4.string(),
                        state: z4.string(),
                        country: z4.string(),
                        postalCode: z4.string(),
                        cpfCnpj: z4.string(),
                        personType: z4.string(),
                        deleted: z4.boolean(),
                        additionalEmails: z4.string(),
                        externalReference: z4.string(),
                        notificationDisabled: z4.boolean(),
                        observations: z4.string(),
                        foreignCustomer: z4.boolean(),
                    })
                ),
            });

            export type Input = z4.infer<typeof InputSchema>;

            export type Output = {
                data: {
                    clientes: z4.infer<typeof OutputSchema>;
                };
            };
        }
    }

    export namespace Notification {
        export const NotificationEventSchema = z4.union([
            z4.literal("PAYMENT_RECEIVED"),
            z4.literal("PAYMENT_OVERDUE"),
            z4.literal("PAYMENT_DUEDATE_WARNING"),
            z4.literal("PAYMENT_CREATED"),
            z4.literal("PAYMENT_UPDATED"),
            z4.literal("SEND_LINHA_DIGITAVEL"),
        ]);
        export type NotificationEvent = z4.infer<typeof NotificationEventSchema>;

        export const NotificationConfigSchema = z4.object({
            object: z4.literal("notification"),
            id: z4.string(),
            customer: z4.string(),
            enabled: z4.boolean(),
            emailEnabledForProvider: z4.boolean(),
            smsEnabledForProvider: z4.boolean(),
            emailEnabledForCustomer: z4.boolean(),
            smsEnabledForCustomer: z4.boolean(),
            phoneCallEnabledForCustomer: z4.boolean(),
            whatsappEnabledForCustomer: z4.boolean(),
            event: NotificationEventSchema,
            scheduleOffset: z4.number(),
            deleted: z4.boolean(),
        });
        export type NotificationConfig = z4.infer<typeof NotificationConfigSchema>;
    }

    export namespace Transferencia {
        const TipoDeChavePix = z4.union([z4.literal("CPF"), z4.literal("CNPJ"), z4.literal("PHONE"), z4.literal("EMAIL"), z4.literal("EVP")]);

        const TipoDeStatus = z4.union([z4.literal("PENDING"), z4.literal("DONE"), z4.literal("CANCELLED")]);

        export const TransferenciaSchema = z4.object({
            _id: z4.uuidv4(),
            value: z4.number().transform((val) => val * 100),
            bankAccount: z4
                .object({
                    bank: z4.object({
                        code: z4.string(),
                    }),
                    accountName: z4.string().optional().nullable(),
                    ownerName: z4.string(),
                    ownerBirthDate: z4.string().optional().nullable(),
                    cpfCnpj: z4.string(),
                    agency: z4.string(),
                    account: z4.string(),
                    accountDigit: z4.string(),
                    bankAccountType: z4.literal("CONTA_CORRENTE").optional(),
                    ispb: z4.string().optional().nullable(),
                })
                .optional(),
            operationType: z4.string().default("PIX"),
            pixAddressKey: z4.string(),
            pixAddressKeyType: z4.array(TipoDeChavePix).min(1),
            description: z4.string().optional().nullable,
            scheduleDate: z4.string().optional().nullable,
            externalReference: z4.string().optional().nullable,
            recurring: z4
                .object({
                    frequency: z4.literal("MONTHLY"),
                    quantity: z4.number(),
                })
                .optional()
                .nullable(),
        });

        export namespace PagarPix {
            export const InputSchema = z4.object({
                data: z4.object({
                    transferencia: TransferenciaSchema,
                }),
            });
            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = z4.object({
                data: {
                    transferencia: z4.object({
                        object: z4.literal("transfer"),
                        id: z4.uuidv4(), //external_id que veio do asaas
                        value: z4.number(),
                        netValue: z4.number(),
                        transferFee: z4.number(),
                        dateCreated: z4.string(),
                        status: z4.array(TipoDeStatus),
                        effectiveDate: z4.string().optional(),
                        confirmedDate: z4.string().optional(),
                        endToEndIdentifier: z4.null(),
                        transactionReceiptUrl: z4.null(),
                        operationType: z4.literal("PIX"),
                        failReason: z4.null(),
                        walletId: z4.null(),
                        description: z4.string().optional().nullable(),
                        externalReference: z4.string(),
                        authorized: z4.boolean(),
                        scheduleDate: z4.string().optional().nullable(),
                        type: z4.literal("PIX"),
                        bankAccount: z4
                            .object({
                                bank: z4.object({
                                    code: z4.literal("461"),
                                    name: z4.literal("ASAAS GESTÃO FINANCEIRA INSTITUIÇÃO DE PAGAMENTO S.A."),
                                    ispb: z4.literal("19540550"),
                                }),
                                accountName: z4.null(),
                                ownerName: z4.literal("ASAAS GESTAO FINANCEIRA S.A."),
                                cpfCnpj: z4.literal("65.140.847/0001-17"),
                                type: z4.literal("PAYMENT_ACCOUNT"),
                                agency: z4.literal("0000"),
                                agencyDigit: z4.null(),
                                account: z4.literal("000000"),
                                accountDigit: z4.literal("0"),
                                pixAddressKey: z4.literal("41aed6c8-b68c-4d5a-a906-3ac56da9521e"),
                            })
                            .optional()
                            .nullable(),
                        recurring: z4.null(),
                        canBeCancelled: z4.boolean(),
                    }),
                },
            });
            export type Output = {};
        }

        export namespace BuscarPeloFiltro {
            export const InputSchema = z4.object({
                filtros: z4.object({
                    transferencia: z4.object({
                        value: z4.number().optional().nullable(),
                        operationType: z4.string().optional().nullable(),
                        pixAddressKey: z4.string().optional().nullable(),
                        pixAddressKeyType: z4.array(z4.string()).optional().nullable(),
                        description: z4.string().optional().nullable(),
                        scheduleDate: z4.string().optional().nullable(),
                        externalReference: z4.string().optional().nullable(),
                    }),
                }),
            });
            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = TransferenciaSchema;
            export type Output = {
                data: {
                    paginacao: {
                        total_itens: number;
                        total_paginas: number;
                        itens_por_pagina: number;
                        total_itens_pagina_atual: number;
                    };
                    trasnferencia: z4.infer<typeof OutputSchema>;
                };
            };
        }

        export namespace BuscarPeloId {
            export const InputSchema = z4.object({
                data: z4.object({
                    _id: z4.string(),
                }),
            });
            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = TransferenciaSchema;
            export type Output = {
                data: {
                    resultado: z4.infer<typeof OutputSchema>;
                };
            };
        }

        export namespace DeletarPeloId {
            export const InputSchema = z4.object({
                _id: uuidv4(),
            });

            export type Input = z4.infer<typeof InputSchema>;

            export const OutputSchema = TransferenciaSchema;

            export type Output = {
                data: {
                    recebedor: {};
                };
            };
        }
    }
}

export default ServiceAsaas;
