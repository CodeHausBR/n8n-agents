import {useForm, Controller} from "react-hook-form";
import t from "../../../types";
import utils from "onda-utils";

import {ClientePaginaMiniSelect} from "src/biblioteca/cliente/pagina_mini_select";

// const schema = t.Controllers.ContaReceber.Criar.InputSchema;
type FormData = t.Controllers.ContaReceber.Criar.Input;

const store_conta_receber = new utils.controller<t.Controllers.ContaReceber.TController>({entidade: "conta_receber", servidor: "worker_financeiro"});

const store_cliente = new utils.controller<t.Controllers.Cliente.TController>({
    entidade: "cliente",
    servidor: "worker_financeiro",
});

interface ContaReceberFormularioProps {
    setReferenciaExternaPrimaria?: string;
    setValorContaReceber?: number;
    setParcelasContaReceber?: number;
    setMetodoPagamentoContaReceber?: "pix" | "credit_card" | "boleto";
    setDesativarCamposEnviados?: boolean;
    setReferenciaExternaCliente?: string;
}

export const ContaReceberFormulario: React.FC<ContaReceberFormularioProps> = ({
    setReferenciaExternaPrimaria,
    setValorContaReceber,
    setParcelasContaReceber,
    setMetodoPagamentoContaReceber,
    setDesativarCamposEnviados,
    setReferenciaExternaCliente,
}) => {
    const formulario = store_conta_receber.get_state.formulario;
    const store_cliente_pagina_mini = store_cliente.get_state.pagina_mini_select;

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
        getValues,
        setValue,
    } = useForm<FormData>({
        // resolver: zodResolver(schema as any),
        mode: "onSubmit",
        defaultValues: {
            data: {
                conta_receber: {
                    checkout: "pagarme",
                    parcelas: setParcelasContaReceber ?? 1,
                    valor: setValorContaReceber ?? 0,
                    cliente_id: setReferenciaExternaCliente,
                    codigo: "",
                    metodo_pagamento: setMetodoPagamentoContaReceber ?? "pix",
                    tipo_pagamento: "241",
                    descricao: "",
                    referencia_externa_primaria: setReferenciaExternaPrimaria,
                    juros: {
                        tipo: "FIXED",
                        valor: 0,
                    },
                    vencimento: "",
                    multa: 5,
                },
            },
        },
    });

    function onClose() {
        reset();
        store_conta_receber.set_state((store) => {
            store.formulario = {
                atualizar: {},
                criar: {},
                loading: false,
                loading_submit: false,
                open: false,
                progress: 0,
            };
        });
        store_cliente.set_state((store) => {
            store.pagina_mini_select.item_selecionado = undefined;
        });
        store_conta_receber.set_state((store) => {
            store.pagina_mini_select.item_selecionado = undefined;
        });
    }

    function handleNextStep() {
        if (!store_cliente_pagina_mini.item_selecionado) {
            alert("Por favor, selecione um cliente antes de prosseguir.");
            return;
        }

        store_cliente.set_state((store) => {
            store.pagina_mini_select.item_selecionado = store_cliente_pagina_mini.item_selecionado;
        });

        store_conta_receber.set_state((store) => {
            store.formulario.progress++;
        });

        setValue("data.conta_receber.cliente_id", store_cliente_pagina_mini.item_selecionado._id);
    }

    async function onSubmit(data: FormData) {
        if (formulario.progress === 0) {
            if (!store_cliente_pagina_mini.item_selecionado) {
                alert("Por favor, selecione um cliente antes de prosseguir.");
                return;
            }

            handleNextStep();
            return;
        }

        const vencimento = data.data.conta_receber.vencimento;
        let vencimentoIso: string | undefined;

        if (vencimento) {
            const [year, month, day] = vencimento.split("-").map(Number);

            const dateInUtc = new Date(Date.UTC(year, month - 1, day, 23, 0, 0));

            vencimentoIso = dateInUtc.toISOString();
        }

        const new_conta_receber: t.Controllers.ContaReceber.Criar.Input = {
            data: {
                conta_receber: {
                    ...data.data.conta_receber,
                    vencimento: vencimentoIso,
                    multa: 5,
                },
            },
        };

        await store_conta_receber.api.criar(new_conta_receber);
        onClose();
    }

    const handlePreviousStep = () => {
        store_conta_receber.set_state((store) => {
            store.formulario.progress--;
        });
    };

    const incrementParcelas = () => {
        const currentParcelas = getValues("data.conta_receber.parcelas") || 0;
        setValue("data.conta_receber.parcelas", currentParcelas + 1);
    };

    const decrementParcelas = () => {
        const currentParcelas = getValues("data.conta_receber.parcelas") || 0;
        setValue("data.conta_receber.parcelas", Math.max(1, currentParcelas - 1));
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    };

    const parseToNumber = (value: string) => {
        const numericValue = value.replace(/\D/g, "");
        return numericValue ? parseInt(numericValue) / 100 : 0;
    };

    return (
        <div className={`fixed inset-0 z-10000 transition-opacity duration-300 ${formulario.open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div onClick={onClose} className="absolute inset-0 bg-black/60" aria-hidden="true"></div>

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-4xl transform bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
                    formulario.open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="h-full flex flex-col bg-gray-50">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="text-left">
                                <h1 className="text-3xl font-bold text-gray-800">💰 Cadastrar nova conta</h1>
                                <p className="text-gray-600">Cadastre uma nova conta a receber no sistema</p>
                                <div className="mt-2 text-sm text-gray-500">Etapa {formulario.progress + 1} de 2</div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full cursor-pointer text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto p-6 space-y-6">
                        <div style={{display: (formulario.progress === 0 && "flow") || "none"}}>
                            <ClientePaginaMiniSelect setReferenciaExternaCliente={setReferenciaExternaCliente} />
                        </div>

                        <div style={{display: (formulario.progress === 1 && "flow") || "none"}}>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Gateway de Pagamento</label>
                                <Controller
                                    name="data.conta_receber.checkout"
                                    control={control}
                                    render={({field}) => (
                                        <div className="relative">
                                            <select
                                                {...field}
                                                className={`w-full px-4 py-2 pr-10 text-gray-800 bg-white border-1 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 text-lg appearance-none cursor-pointer hover:border-gray-400 hover:shadow-md ${
                                                    errors.data?.conta_receber?.checkout
                                                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                                        : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                }`}
                                            >
                                                <option value="" disabled>
                                                    Selecione uma opção de pagamento
                                                </option>
                                                <option value="pagarme">💳 Pagar.me - Gateway de Pagamento</option>
                                                <option value="asaas">💰 Asaas - Soluções Financeiras</option>
                                            </select>

                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 mt-2">Valor Total</label>
                                    <Controller
                                        name="data.conta_receber.valor"
                                        control={control}
                                        render={({field}) => (
                                            <input
                                                disabled={setDesativarCamposEnviados}
                                                type="text"
                                                value={field.value ? formatarMoeda(field.value) : ""}
                                                onChange={(e) => {
                                                    const numericValue = parseToNumber(e.target.value);
                                                    field.onChange(numericValue);
                                                }}
                                                placeholder="R$ 0,00"
                                                className={`w-full px-4 py-2 ${
                                                    setDesativarCamposEnviados
                                                        ? "cursor-not-allowed bg-gray-100 text-gray-500 border-gray-200"
                                                        : "bg-white text-gray-800 border-gray-300"
                                                } border-1 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 text-lg ${
                                                    errors.data?.conta_receber?.valor
                                                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                                        : "focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                }`}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 mt-2">Nº de Parcelas</label>
                                    <Controller
                                        name="data.conta_receber.parcelas"
                                        control={control}
                                        render={({field}) => (
                                            <div className="relative flex items-center">
                                                <input
                                                    disabled={setDesativarCamposEnviados}
                                                    type="number"
                                                    min="1"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} // Default to 1 if empty/invalid
                                                    placeholder="0"
                                                    className={`w-full px-4 py-2 pr-16 ${
                                                        // Added pr-16 for button space
                                                        setDesativarCamposEnviados
                                                            ? "cursor-not-allowed bg-gray-100 text-gray-500 border-gray-200"
                                                            : "bg-white text-gray-800 border-gray-300"
                                                    } border-1 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 text-lg ${
                                                        errors.data?.conta_receber?.parcelas
                                                            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                                            : "focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                    }`}
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <button
                                                        type="button"
                                                        onClick={decrementParcelas}
                                                        disabled={setDesativarCamposEnviados || (field.value ?? 0) <= 1}
                                                        className={`p-1 rounded-md text-gray-500 hover:bg-gray-200 transition-colors duration-200
                                                        ${setDesativarCamposEnviados || (field.value && field.value <= 1) ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                                                        `}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={incrementParcelas}
                                                        disabled={setDesativarCamposEnviados}
                                                        className={`p-1 rounded-md text-gray-500 hover:bg-gray-200 transition-colors duration-200 ml-1
                                                        ${setDesativarCamposEnviados ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                                                        `}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={`block text-sm font-semibold mb-2 mt-2 ${setDesativarCamposEnviados ? "text-gray-400" : "text-gray-700"}`}>
                                    Método de Pagamento
                                </label>
                                <Controller
                                    name="data.conta_receber.metodo_pagamento"
                                    control={control}
                                    render={({field}) => (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {["pix", "credit_card", "boleto"].map((method) => (
                                                <label
                                                    key={method}
                                                    className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                                                        setDesativarCamposEnviados
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                                            : field.value?.includes(method as any)
                                                            ? "bg-blue-50 border-blue-500 cursor-pointer"
                                                            : "bg-white hover:bg-blue-50 border-gray-300 cursor-pointer"
                                                    }`}
                                                >
                                                    <input
                                                        disabled={setDesativarCamposEnviados}
                                                        type="radio"
                                                        name="metodo_pagamento_option"
                                                        checked={field.value?.includes(method as any)}
                                                        onChange={() => field.onChange(method)}
                                                        className={`w-5 h-5 ${
                                                            setDesativarCamposEnviados ? "text-gray-400 cursor-not-allowed" : "text-blue-600 focus:ring-blue-500"
                                                        }`}
                                                    />
                                                    <span className={`font-medium ${setDesativarCamposEnviados ? "text-gray-400" : "text-gray-700"}`}>
                                                        {method === "credit_card" ? "💳 Cartão de Crédito" : method === "boleto" ? "📄 Boleto" : "💱 PIX"}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={"block text-sm font-semibold mb-2 mt-2 text-gray-700 rounded-2xl"}>Vencimento</label>
                                <Controller
                                    name="data.conta_receber.vencimento"
                                    control={control}
                                    render={({field}) => (
                                        <input
                                            type="date"
                                            {...field}
                                            value={field.value ? String(field.value).split("T")[0] : ""}
                                            className={`w-full px-4 py-2 pr-10 text-gray-800 bg-white border-1 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 text-lg appearance-none cursor-pointer hover:border-gray-400 hover:shadow-md`}
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 mt-2">Descrição</label>
                                <Controller
                                    name="data.conta_receber.descricao"
                                    control={control}
                                    render={({field}) => (
                                        <textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            rows={4}
                                            placeholder="Descrição da conta a receber"
                                            className={`w-full px-4 py-4 text-gray-800 bg-white border-1 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 text-lg resize-none ${
                                                errors.data?.conta_receber?.descricao
                                                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                            }`}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 bg-white flex justify-between items-center space-x-4">
                        {formulario.progress === 1 && (
                            <button
                                onClick={handlePreviousStep}
                                className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 w-auto"
                            >
                                Voltar
                            </button>
                        )}

                        {formulario.progress === 0 && (
                            <button
                                onClick={handleNextStep}
                                disabled={formulario.loading_submit}
                                className={`w-full bg-gradient-to-r cursor-pointer from-blue-900 to-blue-800 hover:from-blue-950 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none`}
                            >
                                {formulario.loading_submit ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-1 border-white border-t-transparent mr-3"></div>
                                        Avançando...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">Próximo</div>
                                )}
                            </button>
                        )}

                        {formulario.progress > 0 && (
                            <button
                                onClick={handleSubmit(onSubmit)}
                                disabled={formulario.loading_submit}
                                className={`w-full bg-gradient-to-r cursor-pointer from-blue-900 to-blue-800 hover:from-blue-950 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none`}
                            >
                                {formulario.loading_submit ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-1 border-white border-t-transparent mr-3"></div>
                                        Salvando...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">💰 Criar Conta a Receber</div>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
