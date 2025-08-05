typescript
import z4 from "zod/v4";

namespace ControllerContasPagar {

    export const ContasPagarBaseSchema = z4.object({
        id: z4.number(),
        descricao: z4.string(),
        tipo: z4.union([z4.literal("receita"), z4.literal("despesa")]),
        valor: z4.number(),
        data: z4.string(),
        categoria: z4.string(),
        usuario_id: z4.number()
    });
    export type ContasPagarBase = z4.infer<typeof ContasPagarBaseSchema>;

    export namespace Criar {
        export const InputSchema = z4.object({
            data: ContasPagarBaseSchema
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ContasPagarBaseSchema;
        export type Output = {
            data: z4.infer<typeof OutputSchema>;
        }
    }

    export namespace BuscarPeloFiltro {
        export const InputSchema = z4.object({
            filtros: z4.object({
                id: z4.number().optional(),
                descricao: z4.string().optional(),
                tipo: z4.union([z4.literal("receita"), z4.literal("despesa")]).optional(),
                valor: z4.number().optional(),
                data: z4.string().optional(),
                categoria: z4.string().optional(),
                usuario_id: z4.number().optional()
            })
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
                },
                contasPagar: z4.infer<typeof OutputSchema>;
            }
        }
    }

    export namespace BuscarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                id: z4.number()
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ContasPagarBaseSchema;
        export type Output = {
            data: {
                contasPagar: z4.infer<typeof OutputSchema>
            }
        }
    }

    export namespace AtualizarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                id: z4.number(),
                descricao: z4.string().optional(),
                tipo: z4.union([z4.literal("receita"), z4.literal("despesa")]).optional(),
                valor: z4.number().optional(),
                data: z4.string().optional(),
                categoria: z4.string().optional(),
                usuario_id: z4.number().optional()
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ContasPagarBaseSchema;
        export type Output = {
            data: {
                contasPagar: z4.infer<typeof OutputSchema>
            }
        }
    }

    export namespace DeletarPeloId {
        export const InputSchema = z4.object({
            id: z4.number()
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ContasPagarBaseSchema;
        export type Output = {
            data: {
                contasPagar: {}
            }
        }
    }
}

export default ControllerContasPagar;
