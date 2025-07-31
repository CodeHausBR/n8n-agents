import React, {useEffect, useState} from "react";
import {
    Search,
    Trash2,
    Hash,
    Plus,
    FileText,
    Circle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Calendar,
    DollarSign,
    User,
    CreditCard,
    Receipt,
    Smartphone,
} from "lucide-react";
import t from "../../../types";
import utils from "onda-utils";

//COMPONENTES
import {ContaReceberFormulario} from "../formulario/FormularioContaReceber";
import LogPagina from "../../log/pagina";

const store = new utils.controller<t.Controllers.ContaReceber.TController>({
    entidade: "conta_receber",
    servidor: "worker_financeiro",
});

interface ContaReceberPaginaProps {
    setReferenciaExternaPrimaria: string;
    setButtonSearch?: boolean;
    setValorContaReceber?: number;
    setParcelasContaReceber?: number;
    setMetodoPagamentoContaReceber?: "pix" | "credit_card" | "boleto";
    setDesativarCamposEnviados?: boolean;
    setReferenciaExternaCliente?: string;
}

export const ContaReceberPagina: React.FC<ContaReceberPaginaProps> = ({
    setReferenciaExternaPrimaria,
    setButtonSearch,
    setValorContaReceber,
    setParcelasContaReceber,
    setMetodoPagamentoContaReceber: dicionario_metodos_pagamento,
    setDesativarCamposEnviados,
    setReferenciaExternaCliente,
}) => {
    const pagina_estados = store.get_jsx.pagina;

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const itensPorPagina = pagina_estados.paginacao?.itens_por_pagina || 10;
    const totalItens = pagina_estados.paginacao?.total_itens || 0;
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    async function buscarDados(pagina: number, termoBusca: string) {
        await store.api.buscar_pelo_filtro({
            filtros: {
                conta_receber: {
                    // referencia_externa_primaria: setReferenciaExternaPrimaria,
                    pagina: pagina,
                    excluido: false,
                },
            },
        });
    }

    useEffect(() => {
        buscarDados(1, "");
    }, []);

    function handleEdit(item: t.Controllers.ContaReceber.ContaReceberBase) {
        store.set_state((store) => {
            store.formulario.open = true;
            store.formulario.atualizar = item;
        });
    }

    async function handleDelete(id: string) {
        if (window.confirm("Tem certeza que deseja deletar esta conta a receber?")) {
            await store.api.deletar_pelo_id({data: {_id: id}});
        }
    }

    async function handleCreate() {
        store.set_state((store) => {
            store.formulario.open = true;
            store.formulario.criar = undefined;
        });
    }

    function handleBuscar() {
        setPaginaAtual(1);
        buscarDados(1, searchTerm);
    }

    function irParaPagina(pagina: number) {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaAtual(pagina);
            buscarDados(pagina, searchTerm);
        }
    }

    const gerarBotoesPaginacao = () => {
        const botoes = [];
        const maxBotoes = 5;
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
                    className={`px-3 cursor-pointer py-1 text-sm border rounded transition-colors ${
                        paginaAtual === i ? "bg-[#00386b] text-white border-[#00386b]" : "bg-white text-[#00386b] border-[#00386b] hover:bg-[#00386b] hover:text-white"
                    }`}
                >
                    {i}
                </button>
            );
        }
        return botoes;
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString("pt-BR");
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 1:
                return "text-green-600 bg-green-100";
            case 0:
                return "text-yellow-600 bg-yellow-100";
            case -1:
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 503:
                return "Pago";
            case 501:
                return "Pendente";
            case 502:
                return "Cancelado";
            default:
                return "Indefinido";
        }
    };

    const getCheckoutColor = (checkout: string) => {
        switch (checkout) {
            case "pagarme":
                return "text-blue-600 bg-blue-100";
            case "asaas":
                return "text-purple-600 bg-purple-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const getMetodoPagamentoIcon = (metodo: string) => {
        switch (metodo) {
            case "credit_card":
                return <CreditCard className="w-4 h-4" />;
            case "debit_card":
                return <CreditCard className="w-4 h-4" />;
            case "boleto":
                return <FileText className="w-4 h-4" />;
            case "pix":
                return <Smartphone className="w-4 h-4" />;
            default:
                return <DollarSign className="w-4 h-4" />;
        }
    };

    const getMetodoPagamentoText = (metodo: string) => {
        switch (metodo) {
            case "credit_card":
                return "Cartão de Crédito";
            case "debit_card":
                return "Cartão de Débito";
            case "boleto":
                return "Boleto";
            case "pix":
                return "PIX";
            default:
                return metodo;
        }
    };

    if (pagina_estados.loading && !pagina_estados.itens) {
        return (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00386b]"></div>
                    <span className="text-gray-600">Carregando contas a receber...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-w-full bg-gray-50 p-6 flex flex-col" style={{height: "calc(100vh - 64px)"}}>
            {/* FORMULÁRIO DE CRIAR CONTAS A RECEBER  */}
            {store?.get_state?.formulario?.open && (
                <ContaReceberFormulario
                    setReferenciaExternaPrimaria={setReferenciaExternaPrimaria}
                    setValorContaReceber={setValorContaReceber}
                    setParcelasContaReceber={setParcelasContaReceber}
                    setDesativarCamposEnviados={setDesativarCamposEnviados}
                    setMetodoPagamentoContaReceber={dicionario_metodos_pagamento}
                    setReferenciaExternaCliente={setReferenciaExternaCliente}
                />
            )}

            <LogPagina />

            <div className="w-full mx-auto flex-1 flex flex-col min-h-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0">
                    <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Contas a Receber</h1>
                            <p className="text-sm text-gray-500">Gerencie e filtre as contas a receber do contrato.</p>
                        </div>
                        <div className="flex items-center gap-x-3">
                            {setButtonSearch && (
                                <div className="relative w-2xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="search"
                                        placeholder="Buscar cliente..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                                        className="pl-10 pr-4 py-2 border border-[#00386b] rounded-lg 
             focus:outline-none focus:border-blue-[#00386b] focus:ring-1 focus:ring-blue-500 
             w-full placeholder-gray-400 text-gray-900"
                                    />
                                </div>
                            )}
                            <button
                                onClick={handleCreate}
                                className="inline-flex cursor-pointer items-center justify-center px-3 py-2 bg-[#00386b] text-white rounded-lg hover:bg-[#002851] transition-colors flex-shrink-0"
                                title="Nova Conta"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline sm:ml-2">Cadastrar nova conta</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 relative">
                        {pagina_estados.loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00386b]"></div>
                                    <span className="text-gray-600">Atualizando...</span>
                                </div>
                            </div>
                        )}
                        <div className="space-y-3">
                            {pagina_estados.itens?.map((item) => (
                                <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <h3 className="text-gray-600 text-lg font-semibold">{item?.cliente?.nome}</h3>
                                                    <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                        <User className="w-3 h-3 mr-1" />
                                                        {item.titular}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600">{item?.cliente?.celular}</span>
                                                        <span> | </span>
                                                        <span className="text-sm text-gray-600">{item?.cliente?.email}</span>
                                                        <span> | </span>
                                                        <span className="text-sm text-gray-600">Criada em: {formatarData(String(item?.data_criacao))}</span>
                                                        <span> | </span>
                                                    </div>
                                                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${getCheckoutColor(item.checkout)}`}>{item.checkout}</div>
                                                </div>
                                                <div className="flex items-start space-x-4 mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                                        <span className="text-lg font-bold text-green-600">{formatarMoeda(item.valor)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">Venc: {formatarData(String(item.vencimento))}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Receipt className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            Parcelas: {item.parcela}/{item.parcelas}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Hash className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{item._id}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <a
                                                        href={item.url_cobranca}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-500 hover:underline mt-1 pr-2.5 pl-2.5"
                                                    >
                                                        Link de pagamento
                                                    </a>
                                                    <span className="mt-2 text-sm text-gray-600">{item.descricao}</span>
                                                    <span> | </span>
                                                    <span>Paga em: {item?.data_pagamento}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6 ml-4">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>{getStatusText(item.status)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {item.metodo_pagamento && getMetodoPagamentoIcon(item.metodo_pagamento)}
                                                <span className="text-sm text-gray-600">{item.metodo_pagamento ? getMetodoPagamentoText(item.metodo_pagamento) : "N/A"}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Circle className={`w-3 h-3 ${item.ativo ? "text-green-500 fill-current" : "text-gray-400"}`} />
                                                <span className={`text-sm font-medium ${item.ativo ? "text-green-600" : "text-gray-500"}`}>{item.ativo ? "Ativo" : "Inativo"}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1 ml-4">
                                            {/* <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-gray-400 hover:text-[#00386b] hover:bg-[#00386b]/10 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button> */}

                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!pagina_estados.loading && (!pagina_estados.itens || pagina_estados.itens.length === 0) && (
                                <div className="text-center py-12 text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>Nenhuma conta a receber encontrada para os filtros aplicados.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Mostrando {totalItens > 0 ? (paginaAtual - 1) * itensPorPagina + 1 : 0} até {Math.min(paginaAtual * itensPorPagina, totalItens) || 0} de{" "}
                                {totalItens} resultados, total de {pagina_estados.paginacao?.total_itens_pagina_atual || 0} itens
                            </div>
                            {totalPaginas > 1 && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => irParaPagina(1)}
                                        disabled={paginaAtual === 1 || pagina_estados.loading}
                                        title="Primeira página"
                                        className="p-2 border cursor-pointer border-[#00386b] text-[#00386b] rounded hover:bg-[#00386b] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronsLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => irParaPagina(paginaAtual - 1)}
                                        disabled={paginaAtual === 1 || pagina_estados.loading}
                                        title="Página anterior"
                                        className="p-2 border cursor-pointer border-[#00386b] text-[#00386b] rounded hover:bg-[#00386b] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center space-x-1">{gerarBotoesPaginacao()}</div>
                                    <button
                                        onClick={() => irParaPagina(paginaAtual + 1)}
                                        disabled={paginaAtual === totalPaginas || pagina_estados.loading}
                                        title="Próxima página"
                                        className="p-2 border cursor-pointer border-[#00386b] text-[#00386b] rounded hover:bg-[#00386b] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => irParaPagina(totalPaginas)}
                                        disabled={paginaAtual === totalPaginas || pagina_estados.loading}
                                        title="Última página"
                                        className="p-2 border cursor-pointer border-[#00386b] text-[#00386b] rounded hover:bg-[#00386b] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronsRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
