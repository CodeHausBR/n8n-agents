import z4 from "zod/v4";

// tipagem:
// COMO USAR ESE NAMESPACE NA HORA DE IMPORTAR:
// import t from "onda-types"
// t.Controllers.ContasPagar.Criar.Input
namespace ControllerContasPagar {
    export const CheckoutSchema = z4.union([z4.literal("asaas"), z4.literal("stripe"), z4.literal("mercadopago")]);
    export type ContasPagarCheckout = z4.infer<typeof CheckoutSchema>;

    export const MetodoPagamentoSchema = z4.union([z4.literal("pix"), z4.literal("ted")]);
    export type ContasPagarMetodoPagamento = z4.infer<typeof MetodoPagamentoSchema>;

    export const ContasPagarBaseSchema = z4.object({
        _id: z4.uuid(),
        data_criacao: z4.date(),
        data_atualizacao: z4.date().nullable(),
        usuario_create_id: z4.uuidv4(),
        checkout: CheckoutSchema.default("asaas"),
        cliente_id: z4.string(),
        parcelas: z4.number(),
        valor: z4.number(),
        vencimento: z4.iso.datetime(),
        codigo: z4.string(),
        metodo_pagamento: z4.array(MetodoPagamentoSchema).min(1),
        tipo_pagamento: z4.number(),
        descricao: z4.string(),
        referencia_externa_primaria: z4.string(),
        referencia_externa_secundaria: z4.string(),
        referencia_externa_terciaria: z4.string(),
        referencia_externa_quartenaria: z4.string(),
        documento_titular: z4.string(),
        titular: z4.string(),
        status: z4.number(),
        status_descricao: z4.string(),
        pagamento_id: z4.string(),
        parcela: z4.number().optional(),
        valor_pacela: z4.number(),
        metadata: z4.record(z4.string(), z4.any()).optional(),
    });
    export type ContasPagarBase = z4.infer<typeof ContasPagarBaseSchema>;

    export namespace Criar {
        export const InputSchema = z4.object({
            data: z4.object({
                conta_pagar: z4
                    .object({
                        checkout: z4.string(),
                        cliente_id: z4.string(),
                        parcelas: z4.number(),
                        valor: z4.number(),
                        vencimento: z4.iso.datetime().optional(),
                        codigo: z4.string(),
                        metodo_pagamento: MetodoPagamentoSchema,
                        tipo_pagamento: z4.number(),
                        descricao: z4.string(),
                        referencia_externa_primaria: z4.string(),
                        referencia_externa_secundaria: z4.string(),
                        referencia_externa_terciaria: z4.string(),
                        referencia_externa_quartenaria: z4.string(),
                        documento_titular: z4.string(),
                        titular: z4.string(),
                        status: z4.number(),
                        status_descricao: z4.string(),
                        pagamento_id: z4.string(),
                        parcela: z4.number(),
                        valor_pacela: z4.number(),
                        metadata: z4.object({
                            origem: z4.string(),
                            observacoes: z4.string(),
                        }),
                    })
                    .refine((data) => !(data.metodo_pagamento === "pix" && data.parcelas !== 1), {
                        path: ["parcelas"],
                        message: "Para pagamento via PIX, o número de parcelas deve ser 1.",
                    }),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ContasPagarBaseSchema;
        export type Output = {
            data: {
                conta_pagar: z4.infer<typeof OutputSchema>;
            };
        };
    }

    export namespace BuscarPeloFiltro {
        export const InputSchema = z4.object({
            filtros: z4.object({
                conta_pagar: z4.object({
                    pagina: z4.number().min(0),
                    _id: z4.uuidv4().optional().nullable(),
                    checkout: z4.string().optional().nullable(),
                    cliente_id: z4.string().optional().nullable(),
                    parcelas: z4.number().optional().nullable(),
                    valor: z4.number().optional().nullable(),
                    vencimento: z4.date().optional().nullable(),
                    codigo: z4.string().optional().nullable(),
                    metodo_pagamento: z4.string().optional().nullable(),
                    tipo_pagamento: z4.number().optional().nullable(),
                    descricao: z4.string().optional().nullable(),
                    referencia_externa_primaria: z4.string().optional().nullable(),
                    referencia_externa_secundaria: z4.string().optional().nullable(),
                    referencia_externa_terciaria: z4.string().optional().nullable(),
                    referencia_externa_quartenaria: z4.string().optional().nullable(),
                    documento_titular: z4.string().optional().nullable(),
                    titular: z4.string().optional().nullable(),
                    status: z4.number().optional().nullable(),
                    status_descricao: z4.string().optional().nullable(),
                    pagamento_id: z4.string().optional().nullable(),
                    parcela: z4.number().optional().nullable(),
                    valor_pacela: z4.number().optional().nullable(),
                    usuario_create_id: z4.uuidv4().optional().nullable(),
                }),
            }),
        });

        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = z4.array(ContasPagarBaseSchema);
        export type Output = {
            data: {
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    itens_por_pagina: number;
                    total_itens_pagina_atual: number;
                };
                conta_pagar: z4.infer<typeof OutputSchema>;
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

        export const OutputSchema = ContasPagarBaseSchema;
        export type Output = {
            data: {
                conta_pagar: z4.infer<typeof OutputSchema>;
            };
        };
    }

    export namespace AtualizarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                conta_pagar: z4.object({
                    _id: z4.uuidv4(),
                    checkout: z4.string().optional(),
                    cliente_id: z4.string().optional(),
                    parcelas: z4.number().optional(),
                    valor: z4.number().optional(),
                    vencimento: z4.date().optional(),
                    codigo: z4.string().optional(),
                    metodo_pagamento: z4.string().optional(),
                    tipo_pagamento: z4.number().optional(),
                    descricao: z4.string().optional(),
                    referencia_externa_primaria: z4.string().optional(),
                    referencia_externa_secundaria: z4.string().optional(),
                    referencia_externa_terciaria: z4.string().optional(),
                    referencia_externa_quartenaria: z4.string().optional(),
                    documento_titular: z4.string().optional(),
                    titular: z4.string().optional(),
                    status: z4.number().optional(),
                    status_descricao: z4.string().optional(),
                    pagamento_id: z4.string().optional(),
                    parcela: z4.number().optional(),
                    valor_pacela: z4.number().optional(),
                    metadata: z4
                        .object({
                            origem: z4.string(),
                            observacoes: z4.string(),
                        })
                        .optional(),
                }),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ContasPagarBaseSchema;
        export type Output = {
            data: {
                conta_pagar: z4.infer<typeof OutputSchema>;
            };
        };
    }

    export namespace DeletarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                _id: z4.uuidv4(),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ContasPagarBaseSchema;
        export type Output = {
            data: {
                conta_pagar: {};
            };
        };
    }
}

export default ControllerContasPagar;
