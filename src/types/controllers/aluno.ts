import z4 from "zod/v4";

namespace ControllerAluno {

    export const AlunoBaseSchema = z4.object({
        _id: z4.uuid(),
        data_criacao: z4.date(),
        data_atualizacao: z4.date().nullable(),
        usuario_create_id: z4.uuidv4(),
        nome: z4.string(),
        matricula: z4.string(),
        serie: z4.string(),
        turma: z4.string(),
        dataNascimento: z4.string(),
        sexo: z4.string()
    });
    export type AlunoBase = z4.infer<typeof AlunoBaseSchema>;

    export namespace Criar {
        export const InputSchema = z4.object({
            data: z4.object({
                aluno: z4.object({
                    nome: z4.string(),
                    matricula: z4.string(),
                    serie: z4.string(),
                    turma: z4.string(),
                    dataNascimento: z4.string(),
                    sexo: z4.string(),
                })
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = AlunoBaseSchema;
        export type Output = {
            data: {
                aluno: z4.infer<typeof OutputSchema>;
            }
        }
    }

    export namespace BuscarPeloFiltro {
        export const InputSchema = z4.object({
            filtros: z4.object({
                aluno: z4.object({
                    pagina: z4.number().min(0),
                    _id: z4.uuidv4().optional().nullable(),
                    nome: z4.string().optional().nullable(),
                    matricula: z4.string().optional().nullable(),
                    serie: z4.string().optional().nullable(),
                    turma: z4.string().optional().nullable(),
                    dataNascimento: z4.string().optional().nullable(),
                    sexo: z4.string().optional().nullable(),
                    usuario_create_id: z4.uuidv4().optional().nullable(),
                }),

            })
        });

        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = z4.array(AlunoBaseSchema);
        export type Output = {
            data: {
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    itens_por_pagina: number;
                    total_itens_pagina_atual: number;
                },
                aluno: z4.infer<typeof OutputSchema>;
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

        export const OutputSchema = AlunoBaseSchema;
        export type Output = {
            data: {
                aluno: z4.infer<typeof OutputSchema>
            }
        }
    }

    export namespace AtualizarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                aluno: z4.object({
                    _id: z4.uuidv4(),
                    nome: z4.string().optional(),
                    matricula: z4.string().optional(),
                    serie: z4.string().optional(),
                    turma: z4.string().optional(),
                    dataNascimento: z4.string().optional(),
                    sexo: z4.string().optional()
                })
            })
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = AlunoBaseSchema;
        export type Output = {
            data: {
                aluno: z4.infer<typeof OutputSchema>
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

        export const OutputSchema = AlunoBaseSchema;
        export type Output = {
            data: {
                aluno: {}
            }
        }
    }
}

export default ControllerAluno;
