import {neon, neonConfig} from "@neondatabase/serverless";
import t from "../../../types";

import helpers from "../../helpers/helpers";

neonConfig.useSecureWebSocket = true;
neonConfig.wsProxy = "https://us-east.hyperdrive.neon.tech";
neonConfig.pipelineTLS = true;

const model_log = class model_log {
    static async criar(data: t.Controllers.Log.Criar.Input, c: t.Context): Promise<t.Controllers.Log.Criar.Output> {
        const sql = neon(c.env.POSTGRESQL_DATABASE_URL);

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        try {
            const result: any = await sql`
                INSERT INTO log (
                    class_name,
                    matrix,
                    static_function,
                    error_message,
                    error_returned_by_system,
                    organization,
                    type,
                    users,
                    type_user
                ) VALUES (
                    ${data.data.log.class_name},
                    ${data.data.log.matrix},
                    ${data.data.log.static_function},
                    ${data.data.log.error_message},
                    ${JSON.stringify(data.data.log.error_returned_by_system)},
                    ${data.data.log.organization},
                    ${data.data.log.type},
                    ${data.data.log.user},
                    ${data.data.log.type_user}
                )
                RETURNING 
                    class_name,
                    matrix,
                    static_function,
                    error_message,
                    error_returned_by_system,
                    organization,
                    type,
                    users as user,
                    type_user
            `;

            return {
                data: {
                    log: result?.[0],
                },
            };
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao registrar log!"}) as any;
        }
    }

    static async buscar_pelo_filtro(filtros: t.Controllers.Log.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Controllers.Log.BuscarPeloFiltro.Output> {
        const sql = neon(c.env.POSTGRESQL_DATABASE_URL);
        const f = filtros.filtros.log;

        const conditions: string[] = [];
        const values: any[] = [];

        if (f._id) {
            conditions.push(`l._id = $${values.length + 1}`);
            values.push(f._id);
        }

        if (f.class_name) {
            conditions.push(`l.class_name = $${values.length + 1}`);
            values.push(f.class_name);
        }

        if (f.matrix) {
            conditions.push(`l.matrix = $${values.length + 1}`);
            values.push(f.matrix);
        }

        if (f.static_function) {
            conditions.push(`l.static_function = $${values.length + 1}`);
            values.push(f.static_function);
        }

        if (f.error_message) {
            conditions.push(`l.error_message = $${values.length + 1}`);
            values.push(f.error_message);
        }

        if (f.organization) {
            conditions.push(`l.organization = $${values.length + 1}`);
            values.push(f.organization);
        }

        if (f.type) {
            conditions.push(`l.type = $${values.length + 1}`);
            values.push(f.type);
        }

        if (f.user) {
            conditions.push(`l.users = $${values.length + 1}`);
            values.push(f.user);
        }

        if (f.type_user) {
            conditions.push(`l.type_user = $${values.length + 1}`);
            values.push(f.type_user);
        }

        let query = `
            SELECT 
                l._id,
                l.class_name,
                l.matrix,
                l.static_function,
                l.error_message,
                l.error_returned_by_system,
                l.organization,
                l.type,
                l.users AS user,
                l.type_user,
                l.created_at
            FROM log l
        `;

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        const log: any[] = await sql.query(query, values);

        return {
            data: {
                log: log,
            },
        };
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Context): Promise<void> {
        const sql = neon(c.env.POSTGRESQL_DATABASE_URL);

        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        await sql`
            CREATE TABLE IF NOT EXISTS log (
                _id SERIAL PRIMARY KEY,
                class_name TEXT,
                matrix TEXT NOT NULL,
                static_function TEXT,
                error_message TEXT,
                error_returned_by_system JSONB,
                organization TEXT,
                type VARCHAR(20) NOT NULL CHECK (type IN ('error', 'log')),
                users TEXT,
                type_user TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
    }
};

export default model_log;
