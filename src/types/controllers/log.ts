import z4 from "zod/v4";

namespace ControllerLog {
    export const LogTypeSchema = z4.union([z4.literal("error"), z4.literal("log")]);

    export type LogType = z4.infer<typeof LogTypeSchema>;

    export const LogSchema = z4.object({
        _id: z4.uuid(),
        class_name: z4.string(),
        matrix: z4.string(),
        static_function: z4.string(),
        error_message: z4.string(),
        error_returned_by_system: z4.unknown(),
        organization: z4.string(),
        type: LogTypeSchema,
        user: z4.string(),
        type_user: z4.string(),
        created_at: z4.string().optional(),
    });

    export type LogBase = z4.infer<typeof LogSchema>;

    export namespace Criar {
        export const InputSchema = z4.object({
            data: z4.object({
                log: z4.object({
                    class_name: z4.string(),
                    matrix: z4.string(),
                    static_function: z4.string(),
                    error_message: z4.string(),
                    error_returned_by_system: z4.unknown(),
                    organization: z4.string(),
                    type: LogTypeSchema,
                    user: z4.string(),
                    type_user: z4.string(),
                }),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = LogSchema;
        export type Output = {
            data: {
                log: z4.infer<typeof OutputSchema>;
            };
        };
    }

    export namespace BuscarPeloFiltro {
        export const InputSchema = z4.object({
            filtros: z4.object({
                log: z4.object({
                    _id: z4.string().optional().nullable(),
                    class_name: z4.string().optional().nullable(),
                    matrix: z4.string().optional().nullable(),
                    static_function: z4.string().optional().nullable(),
                    error_message: z4.string().optional().nullable(),
                    error_returned_by_system: z4.unknown().optional().nullable(),
                    organization: z4.string().optional().nullable(),
                    type: LogTypeSchema.optional().nullable(),
                    user: z4.string().optional().nullable(),
                    type_user: z4.string().optional().nullable(),
                    created_at: z4.string().optional().nullable(),
                }),
            }),
        });
        export type Input = z4.infer<typeof InputSchema>;

        export const OutputSchema = z4.array(LogSchema);
        export type Output = {
            data: {
                log: z4.infer<typeof OutputSchema>;
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
            Input: any;
            Output: any;
        };
        AtualizarPeloId: {
            Input: any;
            Output: any;
        };
        DeletarPeloId: {
            Input: any;
            Output: any;
        };
        states: {
            modal: {
                item: BuscarPeloFiltro.Output["data"]["log"][0];
                loading: boolean;
                open: boolean;
            };
            pagina: {
                loading: boolean;
                itens: BuscarPeloFiltro.Output["data"]["log"];
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    total_itens_pagina_atual: number;
                    itens_por_pagina: number;
                };
            };
            pagina_mini_select: {
                loading: boolean;
                itens: BuscarPeloFiltro.Output["data"]["log"];
                item_selecionado: BuscarPeloFiltro.Output["data"]["log"][0];
                paginacao: {
                    total_itens: number;
                    total_paginas: number;
                    total_itens_pagina_atual: number;
                    itens_por_pagina: number;
                };
            };
            formulario: {
                open: boolean;
                atualizar: any;
                criar: Criar.Input["data"]["log"];
                progress: number;
                loading: boolean;
                loading_submit: boolean;
            };
        };
    };
}

export default ControllerLog;
