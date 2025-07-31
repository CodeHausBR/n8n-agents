import {Context} from "hono";
import {ContentfulStatusCode} from "hono/utils/http-status";
import z4 from "zod/v4";

namespace Response {
    // Schema base para responses
    export const BaseResponseSchema = z4.object({
        status: z4.number(),
        code: z4.string(),
        type: z4.enum(["success", "error", "warning"]),
        message: z4.string(),
        results: z4.any().optional(),
        error: z4.any().optional(),
    });

    export type BaseResponse<T = any> = z4.infer<typeof BaseResponseSchema>;

    // Schema para parâmetros de sucesso
    export const SuccessParamsSchema = z4.object({
        message: z4.string().optional(),
        results: z4.union([z4.array(z4.any()), z4.any()]).optional(),
        c: z4.custom<Context>().optional(),
    });

    export type SuccessParams<T = any> = z4.infer<typeof SuccessParamsSchema>;

    // Schema para parâmetros de criação (extends SuccessParams)
    export const CreatedParamsSchema = SuccessParamsSchema;
    export type CreatedParams<T = any> = SuccessParams<T>;

    // Schema para parâmetros de warning
    export const WarningParamsSchema = z4.object({
        message: z4.string().optional(),
        results: z4.array(z4.any()).optional(),
        c: z4.custom<Context>().optional(),
    });

    export type WarningParams<T = any> = z4.infer<typeof WarningParamsSchema>;

    // Schema para parâmetros de error warning
    export const ErrorWarningParamsSchema = z4.object({
        message: z4.string(),
        results: z4.array(z4.any()).optional().nullable(),
    });

    export type ErrorWarningParams<T = any> = z4.infer<typeof ErrorWarningParamsSchema>;

    // Schema para parâmetros de erro
    export const ErrorParamsSchema = z4.object({
        message: z4.string().optional(),
        results: z4.array(z4.any()).optional(),
        error: z4.any().optional(),
        c: z4.custom<Context>().optional(),
    });

    export type ErrorParams<T = any> = z4.infer<typeof ErrorParamsSchema>;

    // Schema para parâmetros de erro do servidor
    export const ServerErrorParamsSchema = z4.object({
        error: z4
            .object({
                status: z4.custom<ContentfulStatusCode>().optional(),
                code: z4.string().optional(),
                type: z4.string().optional(),
                message: z4.string().optional(),
                results: z4.array(z4.any()).optional(),
            })
            .optional()
            .nullable(),
        c: z4.custom<Context>(),
    });

    export type ServerErrorParams = z4.infer<typeof ServerErrorParamsSchema>;

    // Schema para parâmetros de resposta de arquivo
    export const FileResponseParamsSchema = z4.object({
        message: z4.string().optional(),
        file_buffer: z4.union([z4.custom<Blob>(), z4.custom<ArrayBuffer>(), z4.custom<Uint8Array>()]),
        content_type: z4.string(),
        filename: z4.string().optional(),
        c: z4.custom<Context>().optional(),
    });

    export type FileResponseParams = z4.infer<typeof FileResponseParamsSchema>;

    // Schema para parâmetros de não encontrado ou não autorizado
    export const NotFoundOrUnauthorizedParamsSchema = z4.object({
        message: z4.string().optional(),
        c: z4.custom<Context>().optional(),
    });

    export type NotFoundOrUnauthorizedParams = z4.infer<typeof NotFoundOrUnauthorizedParamsSchema>;

    // Funções de validação para facilitar o uso
    export const validateSuccessParams = (data: any) => SuccessParamsSchema.parse(data);

    export const validateCreatedParams = (data: any) => CreatedParamsSchema.parse(data);

    export const validateWarningParams = (data: any) => WarningParamsSchema.parse(data);

    export const validateErrorWarningParams = (data: any) => ErrorWarningParamsSchema.parse(data);

    export const validateErrorParams = (data: any) => ErrorParamsSchema.parse(data);

    export const validateServerErrorParams = (data: any) => ServerErrorParamsSchema.parse(data);

    export const validateFileResponseParams = (data: any) => FileResponseParamsSchema.parse(data);

    export const validateNotFoundOrUnauthorizedParams = (data: any) => NotFoundOrUnauthorizedParamsSchema.parse(data);

    export const validateBaseResponse = (data: any) => BaseResponseSchema.parse(data);
}

export default Response;
