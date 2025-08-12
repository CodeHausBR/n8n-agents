import z4 from "zod/v4";

namespace ControllerSalaDeAula {

    export const SalaDeAulaBaseSchema = z4.object({
        _id: z4.uuid(),
        data_criacao: z4.date(),
        data_atualizacao: z4.date().nullable(),
        usuario_create_id: z4.uuidv4(),
        sala: z4.string(),
        quantidade_de_lugares: z4.number(),
        andar: z4.number(),
        tipo: z4.string(),
        disponivel: z4.boolean()
    });
    export type SalaDeAulaBase = z4.infer<typeof SalaDeAulaBaseSchema>;

    export namespace Criar {
        export const InputSchema = z4.object({
            data: z4.object({
                sala_de_aula: z4.object({
                    sala: z4.string(),
                    quantidade_de_lugares: z4.number(),
                    andar: z4.number(),
                    tipo: z4.string(),
                    disponivel: z4.boolean(),
                })
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = SalaDeAulaBaseSchema;
        export type Output = {
            data: {
                sala_de_aula: z4.infer<typeof OutputSchema>;
            }
        }
    }

    export namespace BuscarPeloFiltro {
        export const InputSchema = z4.object({
            filtros: z4.object({
                sala_de_aula: z4.object({
                    pagina: z4.number().min(0),
                    _id: z4.uuidv4().optional().nullable(),
                    sala: z4.string().optional().nullable(),
                    quantidade_de_lugares: z4.number().optional().nullable(),
                    andar: z4.number().optional().nullable(),
                    tipo: z4.string().optional().nullable(),
                    disponivel: z4.boolean().optional().nullable(),
                    usuario_create_id: z4.uuidv4().optional().nullable(),
                }),

            })
        });

        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = z4.array(SalaDeAulaBaseSchema);
        export type Output = {
            data: {
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    itens_por_pagina: number;
                    total_itens_pagina_atual: number;
                },
                sala_de_aula: z4.infer<typeof OutputSchema>;
            }
        }
    }

    export namespace BuscarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                _id: z4.uuidv4()
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = SalaDeAulaBaseSchema;
        export type Output = {
            data: {
                sala_de_aula: z4.infer<typeof OutputSchema>
            }
        }
    }

    export namespace AtualizarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                sala_de_aula: z4.object({
                    _id: z4.uuidv4(),
                    sala: z4.string().optional(),
                    quantidade_de_lugares: z4.number().optional(),
                    andar: z4.number().optional(),
                    tipo: z4.string().optional(),
                    disponivel: z4.boolean().optional()
                })
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = SalaDeAulaBaseSchema;
        export type Output = {
            data: {
                sala_de_aula: z4.infer<typeof OutputSchema>
            }
        }
    }

    export namespace DeletarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
		        _id: z4.string()
	        })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = SalaDeAulaBaseSchema;
        export type Output = {
            data: {
                sala_de_aula: {}
            }
        }
    }
}

export default ControllerSalaDeAula;
