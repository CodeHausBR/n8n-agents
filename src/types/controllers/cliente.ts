import z4 from "zod/v4";

// tipagem:
// COMO USAR ESE NAMESPACE NA HORA DE IMPORTAR:
// import t from "onda-types"
// t.Controllers.Cliente.Criar.Input
namespace ControllerCliente {
    export const ClienteTipoSchema = z4.union([z4.literal("individual"), z4.literal("corporativo")]);
    export type ClienteTipo = z4.infer<typeof ClienteTipoSchema>;

    export const ClienteGeneroSchema = z4.union([z4.literal("masculino"), z4.literal("feminino"), z4.literal("outro")]);
    export type ClienteGenero = z4.infer<typeof ClienteGeneroSchema>;

    export const ClienteBaseSchema = z4.object({
        _id: z4.uuidv4(),
        data_criacao: z4.date(),
        usuario_criacao: z4.string(),
        data_atualizacao: z4.date().nullable(),
        usuario_atualizacao: z4.string().nullable(),
        excluido: z4.boolean(),
        usuario_exclusao: z4.string().nullable(),
        data_exclusao: z4.date().nullable(),
        nome: z4.string(),
        email: z4.email(),
        referencia_externa: z4.uuidv4(),
        cpf_cnpj: z4.string(),
        tipo: ClienteTipoSchema,
        genero: ClienteGeneroSchema,
        data_nascimento: z4.string(),
        endereco: z4.string(),
        complemento: z4.string(),
        cep: z4.string(),
        cidade: z4.string(),
        estado: z4.string(),
        pais: z4.string(),
        telefone: z4.string(),
        celular: z4.string(),
        asaas_external_id: z4.string(),
        pagarme_external_id: z4.string(),
    });
    export type ClienteBase = z4.infer<typeof ClienteBaseSchema>;

    export namespace Criar {
        export const InputSchema = z4.object({
            data: z4.object({
                cliente: z4.object({
                    nome: z4.string(),
                    email: z4.email(),
                    referencia_externa: z4.uuidv4(),
                    cpf_cnpj: z4.string().transform((val) => val.replace(/\D/g, "")),
                    tipo: ClienteTipoSchema.optional().nullable(),
                    genero: ClienteGeneroSchema.optional().nullable(),
                    data_nascimento: z4.string().optional().nullable(),
                    endereco: z4.string().optional().nullable(),
                    complemento: z4.string().optional().nullable(),
                    cep: z4.string().optional().nullable(),
                    cidade: z4.string().optional().nullable(),
                    estado: z4.string().max(2).uppercase().optional().nullable(),
                    pais: z4.string().optional().nullable(),
                    telefone: z4
                        .string()
                        .optional()
                        .nullable()
                        .transform((val) => val && val.replace(/\D/g, "")),
                    celular: z4.string().transform((val) => val.replace(/\D/g, "")),
                }),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ClienteBaseSchema;
        export type Output = {
            data: {
                cliente: z4.infer<typeof OutputSchema>;
            };
        };
    }

    export namespace BuscarPeloFiltro {
        export const InputSchema = z4.object({
            filtros: z4.object({
                cliente: z4.object({
                    pagina: z4.number().min(0),
                    _id: z4.uuidv4().optional().nullable(),
                    nome: z4.string().optional().nullable(),
                    email: z4.string().optional().nullable(),
                    referencia_externa: z4.uuidv4().optional().nullable(),
                    cpf_cnpj: z4.string().optional().nullable(),
                    tipo: ClienteTipoSchema.optional().nullable(),
                    genero: ClienteGeneroSchema.optional().nullable(),
                    data_nascimento: z4.string().optional().nullable(),
                    endereco: z4.string().optional().nullable(),
                    complemento: z4.string().optional().nullable(),
                    cep: z4.string().optional().nullable(),
                    cidade: z4.string().optional().nullable(),
                    estado: z4.string().optional().nullable(),
                    pais: z4.string().optional().nullable(),
                    telefone: z4.string().optional().nullable(),
                    celular: z4.string().optional().nullable(),
                    excluido: z4.boolean().optional().nullable(),
                    usuario_criacao: z4.string().optional().nullable(),
                }),
            }),
        });

        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = z4.array(ClienteBaseSchema);
        export type Output = {
            data: {
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    itens_por_pagina: number;
                    total_itens_pagina_atual: number;
                };
                cliente: z4.infer<typeof OutputSchema>;
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

        export const OutputSchema = ClienteBaseSchema;
        export type Output = {
            data: {
                cliente: z4.infer<typeof OutputSchema>;
            };
        };
    }
    export namespace AtualizarPeloId {
        export const InputSchema = z4.object({
            data: z4.object({
                cliente: z4.object({
                    _id: z4.uuidv4(),
                    nome: z4.string().optional().nullable(),
                    email: z4.email().optional().nullable(),
                    referencia_externa: z4.uuidv4().optional().nullable(),
                    cpf_cnpj: z4.string().optional().nullable(),
                    tipo: ClienteTipoSchema.optional().nullable(),
                    genero: ClienteGeneroSchema.optional().nullable(),
                    data_nascimento: z4.string().optional().nullable(),
                    endereco: z4.string().optional().nullable(),
                    complemento: z4.string().optional().nullable(),
                    cep: z4.string().optional().nullable(),
                    cidade: z4.string().optional().nullable(),
                    estado: z4.string().optional().nullable(),
                    pais: z4.string().optional().nullable(),
                    telefone: z4.string().optional().nullable(),
                    celular: z4.string().optional().nullable(),
                    asaas_external_id: z4.string().optional().nullable(),
                    pagarme_external_id: z4.string().optional().nullable(),
                    excluido: z4.boolean().optional().nullable(),
                }),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = ClienteBaseSchema;
        export type Output = {
            data: {
                cliente: z4.infer<typeof OutputSchema>;
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

        export const OutputSchema = ClienteBaseSchema;
        export type Output = {
            data: {
                cliente: {};
            };
        };
    }

    export type TController = {
        Criar: {
            Input: Criar.Input;
            Output: Criar.Output;
        };
        BuscarPeloFiltro: {
            Input: BuscarPeloFiltro.Input;
            Output: BuscarPeloFiltro.Output;
        };
        BuscarPeloId: {
            Input: BuscarPeloId.Input;
            Output: BuscarPeloId.Output;
        };
        AtualizarPeloId: {
            Input: AtualizarPeloId.Input;
            Output: AtualizarPeloId.Output;
        };
        DeletarPeloId: {
            Input: DeletarPeloId.Input;
            Output: DeletarPeloId.Output;
        };
        states: {
            modal: {
                item: BuscarPeloId.Output["data"]["cliente"];
                loading: boolean;
                open: boolean;
            };
            pagina: {
                loading: boolean;
                itens: BuscarPeloFiltro.Output["data"]["cliente"];
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    total_itens_pagina_atual: number;
                    itens_por_pagina: number;
                };
            };
            pagina_mini_select: {
                loading: boolean;
                itens: BuscarPeloFiltro.Output["data"]["cliente"];
                item_selecionado: BuscarPeloId.Output["data"]["cliente"];
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    total_itens_pagina_atual: number;
                    itens_por_pagina: number;
                };
            };
            formulario: {
                open: boolean;
                atualizar: BuscarPeloId.Output["data"]["cliente"];
                criar: Criar.Input["data"]["cliente"];
                progress: number;
                loading: boolean;
                loading_submit: boolean;
            };
        };
    };
}

export default ControllerCliente;
