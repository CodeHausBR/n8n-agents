// TYPES
import t from "../../../types";

import z4 from "zod/v4";

const set_response = class set_response {
    static SUCCESS<T>({message, results, c}: t.Controllers.Response.SuccessParams<T>) {
        const payload: t.Controllers.Response.BaseResponse<T> = {
            status: 200,
            code: "SUCCESS",
            type: "success",
            message: message || "Realizado com sucesso!",
            results: results || [],
        };
        return c ? c.json(payload, {status: 200}) : payload;
    }

    static CREATED<T>({message, results, c}: t.Controllers.Response.CreatedParams<T>) {
        const payload: t.Controllers.Response.BaseResponse = {
            status: 201,
            code: "CREATED",
            type: "success",
            message: message || "Criado com sucesso!",
            results: results || [],
        };
        return c ? c.json(payload, {status: 201}) : payload;
    }

    static WARNING<T>({message, results, c}: t.Controllers.Response.WarningParams<T>) {
        const payload: t.Controllers.Response.BaseResponse<T> = {
            status: 400,
            code: "WARNING",
            type: "warning",
            message: message || "Aviso!",
            results: results || [],
        };
        if (c) c.json(payload, {status: 400});
        throw payload;
    }

    static DATABASE_ERROR<T>({message, results, error, c}: t.Controllers.Response.ErrorParams<T>) {
        const payload: t.Controllers.Response.BaseResponse<T> = {
            status: 500,
            code: "DATABASE_ERROR",
            type: "error",
            message: message || "Erro no banco de dados!",
            results: results || [],
            error: error || null,
        };
        return c ? c.json(payload, {status: 500}) : payload;
    }

    static SCHEMA_VALIDATION<T>({results}: {results?: T[]}) {
        const payload: t.Controllers.Response.BaseResponse<T> = {
            status: 500,
            code: "SCHEMA_VALIDATION",
            type: "error",
            message: "Erro ao validar dados!",
            results: results || [],
        };
        throw payload;
    }

    static SERVER_ERROR({error, c}: t.Controllers.Response.ServerErrorParams | any) {
        const payload: t.Controllers.Response.BaseResponse = {
            status: error?.status || 500,
            code: error?.code || "SERVER_ERROR",
            type: (error?.type as "error" | "warning" | "success") || "error",
            message: error?.message || "Erro interno no servidor!",
            results: error?.results || [],
        };
        return c.json(payload, {status: 500});
    }

    static UNAUTHORIZED({message, c}: t.Controllers.Response.NotFoundOrUnauthorizedParams) {
        const payload: t.Controllers.Response.BaseResponse = {
            status: 401,
            code: "UNAUTHORIZED",
            type: "error",
            message: message || "Não autorizado!",
        };
        return c ? c.json(payload, {status: 401}) : payload;
    }

    static INVALID_TOKEN({message, c}: t.Controllers.Response.NotFoundOrUnauthorizedParams) {
        const payload: t.Controllers.Response.BaseResponse = {
            status: 401,
            code: "INVALID_TOKEN",
            type: "warning",
            message: message || "Token inválido!",
            results: [],
        };
        return c ? c.json(payload, {status: 401}) : payload;
    }

    static NOT_FOUND({message, c}: t.Controllers.Response.NotFoundOrUnauthorizedParams) {
        const payload: t.Controllers.Response.BaseResponse = {
            status: 404,
            code: "NOT_FOUND",
            type: "error",
            message: message || "Recurso não encontrado!",
        };
        return c ? c.json(payload, {status: 404}) : payload;
    }

    static async SUCCESS_FILE({message, file_buffer, content_type, filename, c}: t.Controllers.Response.FileResponseParams) {
        if (c && content_type) {
            const headers = {
                "Content-Type": content_type,
                "Content-Disposition": filename ? `inline; filename="${filename}"` : "inline",
            };
            return new Response(file_buffer, {status: 200, headers});
        }

        const payload: t.Controllers.Response.BaseResponse = {
            status: 200,
            code: "SUCCESS_FILE",
            type: "success",
            message: message || "Erro ao retornar arquivo!",
        };

        return c ? c.json(payload, {status: 200}) : payload;
    }

    static c = class c {
        static SUCCESS<T>({message, results, c}: t.Controllers.Response.SuccessParams<T>) {
            const payload: t.Controllers.Response.BaseResponse<T> = {
                status: 200,
                code: "SUCCESS",
                type: "success",
                message: message || "Realizado com sucesso!",
                results: results || [],
            };
            if (c) {
                return c.json(payload, {status: 200});
            }
            return;
        }

        static CREATED<T>({message, results, c}: t.Controllers.Response.CreatedParams<T>) {
            const payload: t.Controllers.Response.BaseResponse<T> = {
                status: 201,
                code: "CREATED",
                type: "success",
                message: message || "Criado com sucesso!",
                results: results || [],
            };
            return c ? c.json(payload, {status: 201}) : payload;
        }

        static WARNING<T>({message, results, c}: t.Controllers.Response.WarningParams<T>) {
            const payload: t.Controllers.Response.BaseResponse<T> = {
                status: 400,
                code: "WARNING",
                type: "warning",
                message: message || "Aviso!",
                results: results || [],
            };
            if (c) c.json(payload, {status: 400});
            throw payload;
        }

        static DATABASE_ERROR<T>({message, results, error, c}: t.Controllers.Response.ErrorParams<T>) {
            const payload: t.Controllers.Response.BaseResponse<T> = {
                status: 500,
                code: "DATABASE_ERROR",
                type: "error",
                message: message || "Erro no banco de dados!",
                results: results || [],
                error: error || null,
            };
            return c ? c.json(payload, {status: 500}) : payload;
        }

        static SCHEMA_VALIDATION<T>({results}: {results?: T[]}) {
            const payload: t.Controllers.Response.BaseResponse<T> = {
                status: 500,
                code: "SCHEMA_VALIDATION",
                type: "error",
                message: "Erro ao validar dados!",
                results: results || [],
            };

            throw payload;
        }

        static SERVER_ERROR({error, c}: t.Controllers.Response.ServerErrorParams) {
            if (error instanceof z4.ZodError) {
                const payload: t.Controllers.Response.BaseResponse = {
                    status: 500,
                    code: "SCHEMA_VALIDATION",
                    type: "warning",
                    message: "Erro ao validar dados!",
                    results: z4.treeifyError(error),
                };
                return c.json(payload, {status: 500});
            }

            const payload: t.Controllers.Response.BaseResponse = {
                status: error?.status || 500,
                code: error?.code || "SERVER_ERROR",
                type: (error?.type as "error" | "warning" | "success") || "error",
                message: error?.message || "Erro interno no servidor!",
                results: error?.results || [],
            };
            return c.json(payload, {status: 500});
        }

        static UNAUTHORIZED({message, c}: t.Controllers.Response.NotFoundOrUnauthorizedParams) {
            const payload: t.Controllers.Response.BaseResponse = {
                status: 401,
                code: "UNAUTHORIZED",
                type: "error",
                message: message || "Não autorizado!",
            };
            return c ? c.json(payload, {status: 401}) : payload;
        }

        static INVALID_TOKEN({message, c}: t.Controllers.Response.NotFoundOrUnauthorizedParams) {
            const payload: t.Controllers.Response.BaseResponse = {
                status: 401,
                code: "INVALID_TOKEN",
                type: "warning",
                message: message || "Token inválido!",
                results: [],
            };
            return c ? c.json(payload, {status: 401}) : payload;
        }

        static NOT_FOUND({message, c}: t.Controllers.Response.NotFoundOrUnauthorizedParams) {
            const payload: t.Controllers.Response.BaseResponse = {
                status: 404,
                code: "NOT_FOUND",
                type: "error",
                message: message || "Recurso não encontrado!",
            };
            return c ? c.json(payload, {status: 404}) : payload;
        }

        static async SUCCESS_FILE({message, file_buffer, content_type, filename, c}: t.Controllers.Response.FileResponseParams) {
            if (c && content_type) {
                const headers = {
                    "Content-Type": content_type,
                    "Content-Disposition": filename ? `inline; filename="${filename}"` : "inline",
                };
                return new Response(file_buffer, {status: 200, headers});
            }

            const payload: t.Controllers.Response.BaseResponse = {
                status: 200,
                code: "SUCCESS_FILE",
                type: "success",
                message: message || "Erro ao retornar arquivo!",
            };

            return c ? c.json(payload, {status: 200}) : payload;
        }
    };

    static error = class error {
        static SUCCESS<T>({message, results, c}: t.Controllers.Response.SuccessParams<T>) {
            const payload: t.Controllers.Response.BaseResponse<T> = {
                status: 200,
                code: "SUCCESS",
                type: "success",
                message: message || "Realizado com sucesso!",
                results: results || [],
            };
            if (c) {
                return c.json(payload, {status: 200});
            }
            return;
        }

        static CREATED<T>({message, results, c}: t.Controllers.Response.CreatedParams<T>) {
            const payload: t.Controllers.Response.BaseResponse<T> = {
                status: 201,
                code: "CREATED",
                type: "success",
                message: message || "Criado com sucesso!",
                results: results || [],
            };
            return c ? c.json(payload, {status: 201}) : payload;
        }

        static WARNING<T>({message, results}: t.Controllers.Response.ErrorWarningParams<T>) {
            const payload: t.Controllers.Response.BaseResponse<T> = {
                status: 400,
                code: "WARNING",
                type: "warning",
                message: message || "Aviso!",
                results: results || [],
            };
            throw payload;
        }

        static DATABASE_ERROR<T>({message, results, error, c}: t.Controllers.Response.ErrorParams<T>) {
            const payload: t.Controllers.Response.BaseResponse<T> = {
                status: 500,
                code: "DATABASE_ERROR",
                type: "error",
                message: message || "Erro no banco de dados!",
                results: results || [],
                error: error || null,
            };
            throw payload;
        }

        static SCHEMA_VALIDATION<T>({results}: {results?: T[]}) {
            const payload: t.Controllers.Response.BaseResponse<T> = {
                status: 500,
                code: "SCHEMA_VALIDATION",
                type: "error",
                message: "Erro ao validar dados!",
                results: results || [],
            };
            throw payload;
        }

        static UNAUTHORIZED({message, c}: t.Controllers.Response.NotFoundOrUnauthorizedParams) {
            const payload: t.Controllers.Response.BaseResponse = {
                status: 401,
                code: "UNAUTHORIZED",
                type: "error",
                message: message || "Não autorizado!",
            };
            return c ? c.json(payload, {status: 401}) : payload;
        }

        static INVALID_TOKEN({message, c}: t.Controllers.Response.NotFoundOrUnauthorizedParams) {
            const payload: t.Controllers.Response.BaseResponse = {
                status: 401,
                code: "INVALID_TOKEN",
                type: "warning",
                message: message || "Token inválido!",
                results: [],
            };
            return c ? c.json(payload, {status: 401}) : payload;
        }

        static NOT_FOUND({message, c}: t.Controllers.Response.NotFoundOrUnauthorizedParams) {
            const payload: t.Controllers.Response.BaseResponse = {
                status: 404,
                code: "NOT_FOUND",
                type: "error",
                message: message || "Recurso não encontrado!",
            };
            return c ? c.json(payload, {status: 404}) : payload;
        }

        static async SUCCESS_FILE({message, file_buffer, content_type, filename, c}: t.Controllers.Response.FileResponseParams) {
            if (c && content_type) {
                const headers = {
                    "Content-Type": content_type,
                    "Content-Disposition": filename ? `inline; filename="${filename}"` : "inline",
                };
                return new Response(file_buffer, {status: 200, headers});
            }

            const payload: t.Controllers.Response.BaseResponse = {
                status: 200,
                code: "SUCCESS_FILE",
                type: "success",
                message: message || "Erro ao retornar arquivo!",
            };

            return c ? c.json(payload, {status: 200}) : payload;
        }
    };
};

export default set_response;
