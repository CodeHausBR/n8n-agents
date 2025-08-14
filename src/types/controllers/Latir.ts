typescript
import z4 from "zod/v4";

// tipagem:
// COMO USAR ESE NAMESPACE NA HORA DE IMPORTAR: 
// import t from "onda-types"
// t.Cachorro.Controllers.Latir.Input
namespace ControllerLatir {

    export const LatirBaseSchema = z4.object({
        id: z4.number(),
        descricao: z4.string(),
        tipo: z4.string(),
        valor: z4.number(),
        data: z4.string(),
        categoria: z4.string(),
        usuario_id: z4.number(),
        raca: z4.string(),
        idade: z4.string()
    });
    export type LatirBase = z4.infer<typeof LatirBaseSchema>;

    export namespace Criar {
        export const InputSchema = z4.object({
            data: LatirBaseSchema
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = LatirBaseSchema;
        export type Output = {
            data: {
                latir: z4.infer<typeof OutputSchema>;
            }
        }
    }

    export namespace BuscarPeloFiltro {
        export const InputSchema = z4.object({
            filtros: z4.object({
                latir: z4.object({
                    pagina: z4.number().min(0),
                    id: z4.number().optional().nullable(),
                    descricao: z4.string().optional().nullable(),
                    tipo: z4.string().optional().nullable(),
                    valor: z4.number().optional().nullable(),
                    data: z4.string().optional().nullable(),
                    categoria: z4.string().optional().nullable(),
                    usuario_id: z4.number().optional().nullable(),
                    raca: z4.string().optional().nullable(),
                    idade: z4.string().optional().nullable()
                }),
            })
        });

        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = z4.array(LatirBaseSchema);
        export type Output = {
            data: {
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    itens_por_pagina: number;
                    total_itens_pagina_atual: number;
                },
                latir: z4.infer<typeof OutputSchema>;
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

        export const OutputSchema = LatirBaseSchema;
        export type Output = {
            data: {
                latir: z4.infer<typeof OutputSchema>
            }
        }
    }

    export namespace AtualizarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                latir: z4.object({
                    id: z4.number(),
                    descricao: z4.string().optional(),
                    tipo: z4.string().optional(),
                    valor: z4.number().optional(),
                    data: z4.string().optional(),
                    categoria: z4.string().optional(),
                    usuario_id: z4.number().optional(),
                    raca: z4.string().optional(),
                    idade: z4.string().optional()
                })
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = LatirBaseSchema;
        export type Output = {
            data: {
                latir: z4.infer<typeof OutputSchema>
            }
        }
    }

    export namespace DeletarPeloId {
        export const InputSchema = z4.object({
            id: z4.number()
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = LatirBaseSchema;
        export type Output = {
            data: {
                latir: {}
            }
        }
    }
}

export default ControllerLatir;
