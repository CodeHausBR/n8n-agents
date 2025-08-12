import z4 from "zod/v4";

namespace ControllerProfessor {

    export const ProfessorBaseSchema = z4.object({
        _id: z4.uuid(),
        data_criacao: z4.date(),
        data_atualizacao: z4.date().nullable(),
        usuario_create_id: z4.uuidv4(),
        nome: z4.string(),
        matricula: z4.string(),
        disciplina: z4.string(),
        email: z4.string(),
        telefone: z4.string(),
        sexo: z4.string(),
        dataNascimento: z4.string()
    });
    export type ProfessorBase = z4.infer<typeof ProfessorBaseSchema>;

    export namespace Criar {
        export const InputSchema = z4.object({
            data: z4.object({
                professor: z4.object({
                    nome: z4.string(),
                    matricula: z4.string(),
                    disciplina: z4.string(),
                    email: z4.string(),
                    telefone: z4.string(),
                    sexo: z4.string(),
                    dataNascimento: z4.string(),
                })
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ProfessorBaseSchema;
        export type Output = {
            data: {
                professor: z4.infer<typeof OutputSchema>;
            }
        }
    }

    export namespace BuscarPeloFiltro {
        export const InputSchema = z4.object({
            filtros: z4.object({
                professor: z4.object({
                    pagina: z4.number().min(0),
                    _id: z4.uuidv4().optional().nullable(),
                    nome: z4.string().optional().nullable(),
                    matricula: z4.string().optional().nullable(),
                    disciplina: z4.string().optional().nullable(),
                    email: z4.string().optional().nullable(),
                    telefone: z4.string().optional().nullable(),
                    sexo: z4.string().optional().nullable(),
                    dataNascimento: z4.string().optional().nullable(),
                    usuario_create_id: z4.uuidv4().optional().nullable(),
                }),

            })
        });

        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = z4.array(ProfessorBaseSchema);
        export type Output = {
            data: {
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    itens_por_pagina: number;
                    total_itens_pagina_atual: number;
                },
                professor: z4.infer<typeof OutputSchema>;
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

        export const OutputSchema = ProfessorBaseSchema;
        export type Output = {
            data: {
                professor: z4.infer<typeof OutputSchema>
            }
        }
    }

    export namespace AtualizarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                professor: z4.object({
                    _id: z4.uuidv4(),
                    nome: z4.string().optional(),
                    matricula: z4.string().optional(),
                    disciplina: z4.string().optional(),
                    email: z4.string().optional(),
                    telefone: z4.string().optional(),
                    sexo: z4.string().optional(),
                    dataNascimento: z4.string().optional()
                })
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ProfessorBaseSchema;
        export type Output = {
            data: {
                professor: z4.infer<typeof OutputSchema>
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

        export const OutputSchema = ProfessorBaseSchema;
        export type Output = {
            data: {
                professor: {}
            }
        }
    }
}

export default ControllerProfessor;
