import z4 from "zod/v4";

export namespace Controller {
    export const SchemaBase = z4.object({
        external_code: z4.string(),
        external_id: z4.number(),
        customer: z4.string(),
        paymente_types: z4.number(),
        payer: z4.string(),
        document: z4.string(),
        checkout: z4.string(),
        status: z4.number(),
        card_number: z4.string(),
        serial_number: z4.string(),
        description: z4.string(),
        amount: z4.number(),
        installment_count: z4.number(),
        installment: z4.number(),
        installment_amaount: z4.number(),
        helper_type_order_id: z4.number(),
        due_date: z4.iso.datetime(),
        meta_data: z4.record(z4.string(), z4.unknown()),
        payment_id: z4.string(),
        code_installment: z4.string(),
        url_charge: z4.string().url(),
        url_invoice: z4.string().url(),
        external_reference_primary: z4.string(),
        external_reference_secondary: z4.string(),
        external_reference_tertiary: z4.string(),
        external_reference_quaternary: z4.string(),
        created_user: z4.string(),
        created_at: z4.iso.datetime(),
        updated_user: z4.string(),
        updated_at: z4.iso.datetime(),
        deleted: z4.boolean(),
    });

    export const MetodosPagamentoSchema = z4.union([z4.literal("boleto"), z4.literal("credit_card"), z4.literal("debit_card"), z4.literal("pix")]);

    export type MetodosPagamento = z4.infer<typeof MetodosPagamentoSchema>;

    export namespace Criar {
        export const ClienteCompletoSchema = z4.object({
            name: z4.string(),
            email: z4.string().email(),
            document: z4.string(),
            phone: z4.object({
                area_code: z4.string(),
                number: z4.string(),
                country_code: z4.string(),
            }),
            address: z4.object({
                street: z4.string(),
                number: z4.string(),
                complement: z4.string(),
                neighborhood: z4.string(),
                city: z4.string(),
                state: z4.string(),
                zipcode: z4.string(),
            }),
            external_reference: z4.string(),
        });

        export const ClienteIdSchema = z4.object({
            customer_id: z4.string(),
        });

        export const InputSchema = z4.object({
            data: z4.object({
                checkout: z4.string(),
                customer: z4.union([ClienteCompletoSchema, ClienteIdSchema]),
                installments: z4.number(),
                amount: z4.number(),
                code: z4.string(),
                method_payment: z4.array(MetodosPagamentoSchema),
                metadata: z4.record(z4.string(), z4.unknown()),
                description: z4.string(),
                external_reference: z4.array(z4.string()),
                due_at: z4.date().optional(),
            }),
        });

        export type Input = z4.infer<typeof InputSchema>;

        export type Output = {
            data: {
                order: z4.infer<typeof SchemaBase>;
            };
        };
    }

    export namespace BuscarPeloFiltro {
        export const InputSchema = z4.object({
            filter: z4.object({
                order: z4.object({
                    _id: z4.uuidv4().optional().nullable(),
                    checkout: z4.string().optional().nullable(),
                }),
            }),
        });

        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = z4.array(SchemaBase);
        export type Output = {
            data: {
                orders: z4.infer<typeof OutputSchema>;
            };
        };
    }

    export namespace BuscarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                _id: z4.uuidv4(),
            }),
        });

        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = SchemaBase;
        export type Output = {
            data: {
                order: z4.infer<typeof OutputSchema>;
            };
        };
    }

    export namespace AtualizarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                order: z4.object({
                    _id: z4.uuidv4(),
                    due_date: z4.iso.datetime().optional().nullable(),
                    deleted: z4.boolean().optional().nullable(),
                    status: z4.number().int().optional().nullable(),
                }),
            }),
        });

        export type Input = z4.infer<typeof InputSchema>;
        export const OutputSchema = SchemaBase;

        export type Output = {
            data: {
                order: z4.infer<typeof OutputSchema>;
            };
        };
    }

    export namespace DeletarPeloId {
        export const InputSchema = z4.object({
            _id: z4.uuidv4(),
        });

        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = SchemaBase;
        export type Output = {
            data: {
                order: {};
            };
        };
    }
}
