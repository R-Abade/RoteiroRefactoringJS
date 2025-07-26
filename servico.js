class ServicoCalculoFatura {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    calcularTotalApresentacao(apre) {
        const peca = this.repositorio.getPeca(apre);
        let total = peca.tipo === "tragedia" ? 40000 : 30000;  // Corrigido: peca.tipo em vez de tipo
        if (peca.tipo === "tragedia") {
            if (apre.audiencia > 30) total += 1000 * (apre.audiencia - 30);
        } else if (peca.tipo === "comedia") {
            if (apre.audiencia > 20) total += 10000 + 500 * (apre.audiencia - 20);
            total += 300 * apre.audiencia;
        } else {
            throw new Error(`Peça desconhecida: ${peca.tipo}`);
        }
        return total;
    }

    calcularCredito(apre) {
        const peca = this.repositorio.getPeca(apre);
        let creditos = Math.max(apre.audiencia - 30, 0);
        if (peca.tipo === "comedia") {
            creditos += Math.floor(apre.audiencia / 5);
        }
        return creditos;
    }

    calcularTotalFatura(fatura) {
        return fatura.apresentacoes
            .reduce((sum, apre) => sum + this.calcularTotalApresentacao(apre), 0);
    }

    calcularTotalCreditos(fatura) {
        return fatura.apresentacoes
            .reduce((sum, apre) => sum + this.calcularCredito(apre), 0);
    }
}

module.exports = ServicoCalculoFatura;