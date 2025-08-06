typescript
import z4 from "zod/v4";

// tipagem:
// COMO USAR ESE NAMESPACE NA HORA DE IMPORTAR: 
// import t from "onda-types"
// t.Banco.Controllers.ContasPagar.Criar.Input
namespace ControllerContasPagar {

    export const ContasPagarBaseSchema = z4.object({
        id: z4.number(),
        descricao: z4.string(),
        tipo: z4.string(),
        valor: z4.number(),
        data: z4.string().transform((arg) => new Date(arg)),
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
                descricao: z4.string().optional().nullable(),
                tipo: z4.string().optional().nullable(),
                categoria: z4.string().optional().nullable(),
                usuario_id: z4.number().optional().nullable()
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
                contaPagar: z4.infer<typeof OutputSchema>
            }
        }
    }

    export namespace AtualizarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                contaPagar: z4.object({
                    id: z4.number(),
                    descricao: z4.string().optional(),
                    tipo: z4.string().optional(),
                    valor: z4.number().optional(),
                    data: z4.string().optional().transform((arg) => new Date(arg)),
                    categoria: z4.string().optional(),
                    usuario_id: z4.number().optional()
                })
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ContasPagarBaseSchema;
        export type Output = {
            data: {
                contaPagar: z4.infer<typeof OutputSchema>
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
                contaPagar: {}
            }
        }
    }
}

export default ControllerContasPagar;
