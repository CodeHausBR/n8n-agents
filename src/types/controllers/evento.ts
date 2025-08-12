import z4 from "zod/v4";

namespace ControllerEvento {

    export const EventoBaseSchema = z4.object({
        _id: z4.uuid(),
        data_criacao: z4.date(),
        data_atualizacao: z4.date().nullable(),
        usuario_create_id: z4.uuidv4(),
        evento: z4.string(),
        data: z4.string(),
        hora: z4.string(),
        local: z4.string(),
        responsavel: z4.string(),
        aberto_ao_publico: z4.boolean()
    });
    export type EventoBase = z4.infer<typeof EventoBaseSchema>;

    export namespace Criar {
        export const InputSchema = z4.object({
            data: z4.object({
                evento: z4.object({
                    evento: z4.string(),
                    data: z4.string(),
                    hora: z4.string(),
                    local: z4.string(),
                    responsavel: z4.string(),
                    aberto_ao_publico: z4.boolean()
                })
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = EventoBaseSchema;
        export type Output = {
            data: {
                evento: z4.infer<typeof OutputSchema>;
            }
        }
    }

    export namespace BuscarPeloFiltro {
        export const InputSchema = z4.object({
            filtros: z4.object({
                evento: z4.object({
                    pagina: z4.number().min(0),
                    _id: z4.uuidv4().optional().nullable(),
                    evento: z4.string().optional().nullable(),
                    data: z4.string().optional().nullable(),
                    hora: z4.string().optional().nullable(),
                    local: z4.string().optional().nullable(),
                    responsavel: z4.string().optional().nullable(),
                    aberto_ao_publico: z4.boolean().optional().nullable(),
                    usuario_create_id: z4.uuidv4().optional().nullable()
                }),
            })
        });

        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = z4.array(EventoBaseSchema);
        export type Output = {
            data: {
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    itens_por_pagina: number;
                    total_itens_pagina_atual: number;
                },
                evento: z4.infer<typeof OutputSchema>;
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

        export const OutputSchema = EventoBaseSchema;
        export type Output = {
            data: {
                evento: z4.infer<typeof OutputSchema>
            }
        }
    }

    export namespace AtualizarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                evento: z4.object({
                    _id: z4.uuidv4(),
                    evento: z4.string().optional(),
                    data: z4.string().optional(),
                    hora: z4.string().optional(),
                    local: z4.string().optional(),
                    responsavel: z4.string().optional(),
                    aberto_ao_publico: z4.boolean().optional()
                })
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = EventoBaseSchema;
        export type Output = {
            data: {
                evento: z4.infer<typeof OutputSchema>
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

        export const OutputSchema = EventoBaseSchema;
        export type Output = {
            data: {
                evento: {}
            }
        }
    }
}

export default ControllerEvento;
