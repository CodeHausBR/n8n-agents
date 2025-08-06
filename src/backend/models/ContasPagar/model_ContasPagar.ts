typescript
import t from "onda-types";
import helpers from "helpers/helpers";

const model_contas_pagar = class model_contas_pagar {
    static async criar(data: t.Banco.Controllers.ContasPagar.Criar.Input, c: t.Banco.Context): Promise<t.Banco.Controllers.ContasPagar.Criar.Output> {
        const sql = helpers.banco_dados.get_connection_neon(c.env)

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        try {
            const result: any = await sql
                INSERT INTO contas_pagar (
                    _id,
                    descricao,
                    tipo,
                    valor,
                    data,
                    categoria,
                    usuario_id,
                    data_criacao
                ) VALUES (
                    uuid_generate_v4(),
                    ${data?.data?.contasPagar?.descricao},
                    ${data?.data?.contasPagar?.tipo},
                    ${data?.data?.contasPagar?.valor},
                    ${data?.data?.contasPagar?.data},
                    ${data?.data?.contasPagar?.categoria},
                    ${data?.data?.contasPagar?.usuario_id},
                    CURRENT_TIMESTAMP
                )
                RETURNING _id, descricao, tipo, valor, data, categoria, usuario_id, data_criacao, data_atualizacao, usuario_criacao, usuario_atualizacao, excluido, usuario_exclusao, data_exclusao;
            ;

            return {
                data: {
                    contasPagar: result?.[0]
                }
            }
        } catch (error) {
            helpers.set_response.error.DATABASE_ERROR({ message: "Erro ao criar contas a pagar!" });
        }
    }

    static async buscar_pelo_filtro(filtros: t.Banco.Controllers.ContasPagar.BuscarPeloFiltro.Input, c: t.Banco.Context): Promise<t.Banco.Controllers.ContasPagar.BuscarPeloFiltro.Output> {
        const sql = helpers.banco_dados.get_connection_neon(c.env)

        const conditionStrings: string[] = [];
        const values: any[] = [];

        const s_filtros = filtros?.filtros;

        const paginaAtual = s_filtros?.pagina || 1;
        const itensPorPagina = 30;
        const offset = (paginaAtual - 1) * itensPorPagina;

        if (s_filtros?.categoria) {
            conditionStrings.push("cp.categoria = $" + (values.length + 1));
            values.push(s_filtros.categoria);
        }

        if (s_filtros?.usuario_id) {
            conditionStrings.push("cp.usuario_id = $" + (values.length + 1));
            values.push(s_filtros.usuario_id);
        }

        if (s_filtros?.data) {
            conditionStrings.push("cp.data = $" + (values.length + 1));
            values.push(s_filtros.data);
        }

        if (s_filtros?.tipo) {
            conditionStrings.push("cp.tipo = $" + (values.length + 1));
            values.push(s_filtros.tipo);
        }

        const queryString = 
            SELECT 
                cp.*
            FROM 
                contas_pagar cp
        ;

        const totalItensParaPaginacaoQuery = 
            SELECT 
                COUNT(*)::INTEGER as total_itens,
                CEIL(COUNT(*) / 30.0)::INTEGER as total_paginas
            FROM contas_pagar cp
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

        const [get_contas_pagar, [setPaginacao]]: any = await Promise.all([
            sql.query(finalQuery, valuesComPaginacao),
            sql.query(finalQueryPaginacao, values),
        ]);

        return {
            data: {
                contasPagar: get_contas_pagar,
                paginacao: {
                    total_itens: setPaginacao?.total_itens,
                    total_paginas: setPaginacao?.total_paginas,
                    total_itens_pagina_atual: get_contas_pagar?.length,
                    itens_por_pagina: itensPorPagina
                }
            }
        }
    }

    static async buscar_pelo_id(props: t.Banco.Controllers.ContasPagar.BuscarPeloId.Input, c: t.Banco.Context): Promise<t.Banco.Controllers.ContasPagar.BuscarPeloId.Output> {
        const sql = helpers.banco_dados.get_connection_neon(c.env)
        const result: any = await sql
            SELECT 
                cp.*
            FROM 
                contas_pagar cp
            WHERE cp.id = ${props.data.id}
            AND cp.excluido IS FALSE
        ;

        return {
            data: {
                contasPagar: result[0]
            }
        }
    }

    static async atualizar_pelo_id(data: t.Banco.Controllers.ContasPagar.AtualizarPeloId.Input, c: t.Banco.Context): Promise<t.Banco.Controllers.ContasPagar.AtualizarPeloId.Output> {
        try {
            const sql = helpers.banco_dados.get_connection_neon(c.env)
            const updates = [];
            const values = [];

            const fields = data.data.contasPagar;

            if (fields?.descricao !== undefined) {
                updates.push(descricao = $${updates.length + 1});
                values.push(fields.descricao);
            }

            if (fields?.tipo !== undefined) {
                updates.push(tipo = $${updates.length + 1});
                values.push(fields.tipo);
            }

            if (fields?.valor !== undefined) {
                updates.push(valor = $${updates.length + 1});
                values.push(fields.valor);
            }

            if (fields?.data !== undefined) {
                updates.push(data = $${updates.length + 1});
                values.push(fields.data);
            }

            if (fields?.categoria !== undefined) {
                updates.push(categoria = $${updates.length + 1});
                values.push(fields.categoria);
            }

            if (fields?.usuario_id !== undefined) {
                updates.push(usuario_id = $${updates.length + 1});
                values.push(fields.usuario_id);
            }

            updates.push(data_atualizacao = CURRENT_TIMESTAMP);

            const setClause = updates.join(", ");

            await sql.query(
                
                UPDATE contas_pagar SET ${setClause} 
                WHERE id = $${values.length + 1}
                RETURNING *;
            ,
                [...values, data.data.contasPagar.id]
            );

            return await model_contas_pagar.buscar_pelo_id({ data: { id: data.data.contasPagar.id } }, c)
        } catch (error) {
            helpers.set_response.error.DATABASE_ERROR({ message: "Erro ao atualizar campos no model contas a pagar!" })
        }
    }

    static async deletar_pelo_id(id: number, c: t.Banco.Context): Promise<t.Banco.Controllers.ContasPagar.DeletarPeloId.Output> {
        const sql = helpers.banco_dados.get_connection_neon(c.env)

        const result = await sql
            UPDATE contas_pagar 
            SET 
                excluido = TRUE,
                data_exclusao = NOW()
            WHERE id = ${id}
            AND excluido = FALSE
            RETURNING *
        ;

        return {
            data: {
                contasPagar: {}
            }
        }
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Banco.Context) {
        const sql = helpers.banco_dados.get_connection_neon(c.env)

        await sqlCREATE EXTENSION IF NOT EXISTS "uuid-ossp";;

        await sql
            CREATE TABLE IF NOT EXISTS contas_pagar (
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
                usuario_id INTEGER NOT NULL
            )
        
    }
};

export default model_contas_pagar;
