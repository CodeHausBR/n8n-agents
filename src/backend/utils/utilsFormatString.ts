const utilsFormatString = class utilsFormatString {
    static formatString(str: string): string {
        return str?.replace(/[.\-/]/g, "");
    }

    static abreviarNome(nomeCompleto: string, limiteCaracteres: number): string {
        const palavras: Array<string> = nomeCompleto.split(" ");
        const ignorar: Array<string> = ["de", "da", "do", "das", "dos", "e"];

        const primeiroNome: string = palavras[0];
        const ultimoNome: string = palavras[palavras.length - 1];

        let nomesDoMeio = palavras
            .slice(1, -1)
            .map((palavra) => {
                if (ignorar.includes(palavra.toLowerCase())) {
                    return palavra;
                }
                return palavra.charAt(0);
            })
            .join(" ");

        let nomeFinal = primeiroNome + " " + nomesDoMeio + " " + ultimoNome;

        if (nomeFinal.length > limiteCaracteres) {
            const limite = limiteCaracteres - (primeiroNome.length + ultimoNome.length + 2);
            nomesDoMeio = nomesDoMeio.slice(0, limite);
            nomeFinal = primeiroNome + " " + nomesDoMeio + ultimoNome;
        }

        return nomeFinal
            .trim()
            .replace(/[\u0300-\u036f]/g, "")
            ?.replace(/[^a-zA-Z0-9\s]/g, "");
    }
};

export default utilsFormatString;
