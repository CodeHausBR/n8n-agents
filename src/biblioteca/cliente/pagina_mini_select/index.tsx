import React, {useEffect, useState} from "react";
import {Search, User, Mail, Hash, Phone, MapPin, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Check, Calendar, Building2} from "lucide-react";

import utils from "onda-utils";
import t from "../../../types";

interface MiniSelectClienteProps {
    showActions?: boolean;
    setReferenciaExternaCliente?: string;
}

export const ClientePaginaMiniSelect: React.FC<MiniSelectClienteProps> = ({showActions = true, setReferenciaExternaCliente}) => {
    const store_cliente = new utils.controller<t.Controllers.Cliente.TController>({
        entidade: "cliente",
        servidor: "worker_financeiro",
    });
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const get_pagina_cliente = store_cliente.get_jsx.pagina_mini_select;

    async function buscarDados(pagina: number, termo_busca: string) {
        await store_cliente.api.buscar_pelo_filtro({
            filtros: {
                cliente: {
                    referencia_externa: setReferenciaExternaCliente,
                    pagina: pagina || 1,
                    nome: termo_busca,
                },
            },
        });
    }

    useEffect(() => {
        buscarDados(1, "");
    }, []);

    function handleBuscar() {
        setPaginaAtual(1);
        buscarDados(1, searchTerm);
    }

    function handleSelectItem(cliente: t.Controllers.Cliente.ClienteBase) {
        store_cliente.set_state((store) => {
            store.pagina_mini_select.item_selecionado = cliente;
        });
    }

    const totalItens = get_pagina_cliente?.paginacao?.total_itens || 0;
    const totalPaginas = Math.ceil(totalItens / (get_pagina_cliente?.paginacao?.itens_por_pagina || 1));

    function irParaPagina(pagina: number) {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaAtual(pagina);
            buscarDados(pagina, searchTerm);
        }
    }

    const gerarBotoesPaginacao = () => {
        const botoes = [];
        const maxBotoes = 3;

        let inicio = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2));
        let fim = Math.min(totalPaginas, inicio + maxBotoes - 1);

        if (fim - inicio + 1 < maxBotoes) {
            inicio = Math.max(1, fim - maxBotoes + 1);
        }

        for (let i = inicio; i <= fim; i++) {
            botoes.push(
                <button
                    key={i}
                    onClick={() => irParaPagina(i)}
                    className={`flex items-center justify-center h-7 w-7 text-sm rounded transition-colors duration-200
            ${paginaAtual === i ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
            ${get_pagina_cliente?.loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
          `}
                    disabled={get_pagina_cliente?.loading}
                >
                    {i}
                </button>
            );
        }

        return botoes;
    };

    const getInitials = (name: string) => {
        const names = name.split(" ");
        if (names?.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names?.[names?.length - 1].charAt(0)).toUpperCase();
    };

    const formatarTipo = (tipo: string) => {
        const tipos = {
            individual: "Individual",
            corporativo: "Corporativo",
        };
        return tipos[tipo as keyof typeof tipos] || tipo;
    };

    const formatarGenero = (genero: string) => {
        const generos = {
            masculino: "Masculino",
            feminino: "Feminino",
            outro: "Outro",
        };
        return generos[genero as keyof typeof generos] || genero;
    };

    return (
        <div className="bg-white rounded-lg flex flex-col h-full">
            {/* Header com busca */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Selecione um cliente</h3>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="search"
                        placeholder="Buscar cliente pelo nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyUp={(e) => e.key === "Enter" && handleBuscar()}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    />
                </div>
            </div>

            {/* Lista de clientes */}
            <div className="flex-1 overflow-y-auto p-3 min-h-0">
                {get_pagina_cliente?.loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                            <span className="text-sm text-gray-600">Buscando clientes...</span>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {get_pagina_cliente?.itens?.map((cliente) => (
                        <div
                            key={cliente._id}
                            onClick={() => handleSelectItem(cliente)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                                get_pagina_cliente?.item_selecionado?._id === cliente._id
                                    ? "border-orange-500 bg-orange-50 shadow-sm"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">
                                    {getInitials(cliente.nome)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-gray-900 truncate text-sm">{utils.form.formatar_nomes(cliente.nome)}</h4>
                                        {get_pagina_cliente?.item_selecionado?._id === cliente._id && <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                                        {cliente.tipo && (
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    cliente.tipo === "corporativo" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {formatarTipo(cliente.tipo)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                        {cliente.email && (
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate max-w-[180px]">{cliente.email}</span>
                                            </div>
                                        )}

                                        {cliente.cpf_cnpj && (
                                            <div className="flex items-center gap-1">
                                                <Hash className="w-3 h-3" />
                                                <span className="font-mono">{utils.form.formatar_cpf_cnpj(cliente.cpf_cnpj)}</span>
                                            </div>
                                        )}

                                        {cliente.celular && (
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                <span className="font-mono">{utils.form.formatar_celular(cliente.celular)}</span>
                                            </div>
                                        )}

                                        {cliente.telefone && (
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                <span className="font-mono">{utils.form.formatar_celular(cliente.telefone)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Linha adicional com informações extras */}
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                                        {cliente.data_nascimento && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{utils.data.DD_MM_YYYY(cliente.data_nascimento)}</span>
                                            </div>
                                        )}

                                        {cliente.genero && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                <span>{formatarGenero(cliente.genero)}</span>
                                            </div>
                                        )}

                                        {cliente.cidade && cliente.estado && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{`${cliente.cidade}/${cliente.estado}`}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Endereço completo se disponível */}
                                    {cliente.endereco && (
                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                            <Building2 className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">
                                                {`${cliente.endereco}${cliente.complemento ? `, ${cliente.complemento}` : ""}`}
                                                {cliente.cep && ` - CEP: ${utils.form.formatar_cep(cliente.cep)}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {!get_pagina_cliente?.loading && get_pagina_cliente?.itens?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">Nenhum cliente encontrado</p>
                            <p className="text-xs text-gray-400 mt-1">Tente ajustar sua busca</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer com paginação e ações */}
            <div className="p-3 border-t border-gray-200 flex-shrink-0">
                {/* Paginação */}
                {totalPaginas > 1 && (
                    <div className="flex items-center justify-center mb-3">
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() => irParaPagina(1)}
                                disabled={paginaAtual === 1 || get_pagina_cliente?.loading}
                                title="Primeira página"
                                className="p-2 rounded-md transition-colors duration-200 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => irParaPagina(paginaAtual - 1)}
                                disabled={paginaAtual === 1 || get_pagina_cliente?.loading}
                                title="Página anterior"
                                className="p-2 rounded-md transition-colors duration-200 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="flex items-center space-x-1">{gerarBotoesPaginacao()}</div>
                            <button
                                onClick={() => irParaPagina(paginaAtual + 1)}
                                disabled={paginaAtual === totalPaginas || get_pagina_cliente?.loading}
                                title="Próxima página"
                                className="p-2 rounded-md transition-colors duration-200 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => irParaPagina(totalPaginas)}
                                disabled={paginaAtual === totalPaginas || get_pagina_cliente?.loading}
                                title="Última página"
                                className="p-2 rounded-md transition-colors duration-200 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Ações */}
                {showActions && (
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="text-xs text-gray-500">
                            {totalItens} cliente{totalItens !== 1 ? "s" : ""} encontrado
                            {totalItens !== 1 ? "s" : ""}
                        </div>
                        {get_pagina_cliente?.item_selecionado ? (
                            <span className="flex items-center gap-1">
                                <Check className="w-3 h-3 text-green-500" />
                                {utils.form.formatar_nomes(get_pagina_cliente?.item_selecionado.nome)}
                            </span>
                        ) : (
                            "Selecione um cliente acima"
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
