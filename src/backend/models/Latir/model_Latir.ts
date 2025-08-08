typescript
import t from "onda-types";
import helpers from "helpers/helpers";

const model_latir = class model_latir {
    static async criar(data: t.Cachorro.Controllers.Latir.Criar.Input, c: t.Banco.Context): Promise<t.Cachorro.Controllers.Latir.Criar.Output> {
        const sql = helpers.banco_dados.get_connection_neon(c.env)

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        try {
            const result: any = await sql
                INSERT INTO latir (
                    _id,
                    descricao,
                    tipo,
                    valor,
                    data,
                    categoria,
                    usuario_id,
                    raca,
                    idade,
                    data_criacao
                ) VALUES (
                    uuid_generate_v4(),
                    ${data?.data?.latir?.descricao},
                    ${data?.data?.latir?.tipo},
                    ${data?.data?.latir?.valor},
                    ${data?.data?.latir?.data},
                    ${data?.data?.latir?.categoria},
                    ${data?.data?.latir?.usuario_id},
                    ${data?.data?.latir?.raca},
                    ${data?.data?.latir?.idade},
                    CURRENT_TIMESTAMP
                )
                RETURNING _id, descricao, tipo, valor, data, categoria, usuario_id, raca, idade, data_criacao, data_atualizacao, usuario_criacao, usuario_atualizacao, excluido, usuario_exclusao, data_exclusao;
            ;

            return {
                data: {
                    latir: result?.[0]
                }
            }
        } catch (error) {
            helpers.set_response.error.DATABASE_ERROR({ message: "Erro ao criar latir!" });
        }
    }

    static async buscar_pelo_filtro(filtros: t.Cachorro.Controllers.Latir.BuscarPeloFiltro.Input, c: t.Banco.Context): Promise<t.Cachorro.Controllers.Latir.BuscarPeloFiltro.Output> {
        const sql = helpers.banco_dados.get_connection_neon(c.env)

        const conditionStrings: string[] = [];
        const values: any[] = [];

        const s_filtros = filtros?.filtros;

        const paginaAtual = s_filtros?.pagina || 1;
        const itensPorPagina = 30;
        const offset = (paginaAtual - 1) * itensPorPagina;

        if (s_filtros?.id) {
            conditionStrings.push("l._id = $" + (values.length + 1));
            values.push(s_filtros?.id);
        }

        if (s_filtros?.descricao) {
            conditionStrings.push("l.descricao = $" + (values.length + 1));
            values.push(s_filtros.descricao);
        }

        if (s_filtros?.tipo) {
            conditionStrings.push("l.tipo = $" + (values.length + 1));
            values.push(s_filtros.tipo);
        }

        if (s_filtros?.valor) {
            conditionStrings.push("l.valor = $" + (values.length + 1));
            values.push(s_filtros.valor);
        }

        if (s_filtros?.data) {
            conditionStrings.push("l.data = $" + (values.length + 1));
            values.push(s_filtros.data);
        }

        if (s_filtros?.categoria) {
            conditionStrings.push("l.categoria = $" + (values.length + 1));
            values.push(s_filtros.categoria);
        }

        if (s_filtros?.usuario_id) {
            conditionStrings.push("l.usuario_id = $" + (values.length + 1));
            values.push(s_filtros.usuario_id);
        }

        if (s_filtros?.raca) {
            conditionStrings.push("l.raca = $" + (values.length + 1));
            values.push(s_filtros.raca);
        }

        if (s_filtros?.idade) {
            conditionStrings.push("l.idade = $" + (values.length + 1));
            values.push(s_filtros.idade);
        }

        const queryString = 
            SELECT 
                l.*
            FROM 
                latir l
        ;

        const totalItensParaPaginacaoQuery = 
            SELECT 
                COUNT(*)::INTEGER as total_itens,
                CEIL(COUNT(*) / 30.0)::INTEGER as total_paginas
            FROM latir l
        ;

        let finalQuery = queryString;
        let finalQueryPaginacao = totalItensParaPaginacaoQuery;

        if (conditionStrings.length > 0) {
            const whereClause = " WHERE " + conditionStrings.join(" AND ");
            finalQuery += whereClause;
            finalQueryPaginacao += whereClause;
        }

        finalQuery +=  LIMIT $${values.length + 1} OFFSET $${values.length + 2};
        const valuesComPaginacao = [...values, itensPorPagina, offset];

        const [get_latir, [setPaginacao]]: any = await Promise.all([
            sql.query(finalQuery, valuesComPaginacao),
            sql.query(finalQueryPaginacao, values),
        ]);

        return {
            data: {
                latir: get_latir,
                paginacao: {
                    total_itens: setPaginacao?.total_itens,
                    total_paginas: setPaginacao?.total_paginas,
                    total_itens_pagina_atual: get_latir?.length,
                    itens_por_pagina: itensPorPagina
                }
            }
        }
    }

    static async buscar_pelo_id(props: t.Cachorro.Controllers.Latir.BuscarPeloId.Input, c: t.Banco.Context): Promise<t.Cachorro.Controllers.Latir.BuscarPeloId.Output> {
        const sql = helpers.banco_dados.get_connection_neon(c.env)
        const result: any = await sql
            SELECT 
                l.*
            FROM 
                latir l
            WHERE l._id = ${props.data.id}
            AND l.excluido IS FALSE
        ;

        return {
            data: {
                latir: result[0]
            }
        }
    }

    static async atualizar_pelo_id(data: t.Cachorro.Controllers.Latir.AtualizarPeloId.Input, c: t.Banco.Context): Promise<t.Cachorro.Controllers.Latir.AtualizarPeloId.Output> {

        try {
            const sql = helpers.banco_dados.get_connection_neon(c.env)
            const updates = [];
            const values = [];

            const fields = data.data.latir;

            if (fields?.descricao !== undefined) {
                updates?.push(descricao = $${updates?.length + 1});
                values.push(fields?.descricao);
            }

            if (fields?.tipo !== undefined) {
                updates?.push(tipo = $${updates?.length + 1});
                values.push(fields?.tipo);
            }

            if (fields?.valor !== undefined) {
                updates?.push(valor = $${updates?.length + 1});
                values.push(fields?.valor);
            }

            if (fields?.data !== undefined) {
                updates?.push(data = $${updates?.length + 1});
                values.push(fields?.data);
            }

            if (fields?.categoria !== undefined) {
                updates?.push(categoria = $${updates?.length + 1});
                values.push(fields?.categoria);
            }

            if (fields?.usuario_id !== undefined) {
                updates?.push(usuario_id = $${updates?.length + 1});
                values.push(fields?.usuario_id);
            }

            if (fields?.raca !== undefined) {
                updates?.push(raca = $${updates?.length + 1});
                values.push(fields?.raca);
            }

            if (fields?.idade !== undefined) {
                updates?.push(idade = $${updates?.length + 1});
                values.push(fields?.idade);
            }

            updates?.push(data_atualizacao = CURRENT_TIMESTAMP);

            const setClause = updates?.join(", ");

            await sql.query(
                
                UPDATE latir SET ${setClause} 
                WHERE _id = $${values.length + 1}
                RETURNING *;
            ,
                [...values, data.data.latir.id]
            );

            return await model_latir.buscar_pelo_id({ data: { id: data.data.latir.id } }, c)
        } catch (error) {
            helpers.set_response.error.DATABASE_ERROR({ message: "Erro ao atualizar campos no model latir!" })
        }

    }

    static async deletar_pelo_id(id: number, c: t.Banco.Context): Promise<t.Cachorro.Controllers.Latir.DeletarPeloId.Output> {
        const sql = helpers.banco_dados.get_connection_neon(c.env)

        const result = await sql
            UPDATE latir 
            SET 
                excluido = TRUE,
                data_exclusao = NOW()
            WHERE _id = ${id}
            AND excluido = FALSE
            RETURNING *
        ;

        return {
            data: {
                latir: result[0]
            }
        }
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Banco.Context) {
        const sql = helpers.banco_dados.get_connection_neon(c.env)

        await sqlCREATE EXTENSION IF NOT EXISTS "uuid-ossp";;

        await sql
            CREATE TABLE IF NOT EXISTS latir (
                -- colunas padrões
                _id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                usuario_criacao TEXT,
                data_atualizacao TIMESTAMP WITH TIME ZONE,
                usuario_atualizacao TEXT,
                excluido BOOLEAN DEFAULT FALSE NOT NULL,
                usuario_exclusao TEXT,
                data_exclusao TIMESTAMP WITH TIME ZONE,
                aplicativo TEXT NOT NULL,
                -- fim colunas padrões
                descricao TEXT NOT NULL,
                tipo TEXT NOT NULL,
                valor NUMERIC NOT NULL,
                data TEXT NOT NULL,
                categoria TEXT NOT NULL,
                usuario_id INTEGER NOT NULL,
                raca TEXT NOT NULL,
                idade TEXT NOT NULL
            )
        
    }
};

export default model_latir;
