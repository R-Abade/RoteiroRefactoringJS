function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}

class Repositorio {
    constructor() {
        this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }
    getPeca(apre) {
        return this.pecas[apre.id];
    }
}


class ServicoCalculoFatura {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    calcularTotalApresentacao(apre) {
        let total = 0;
        const tipo = this.repositorio.getPeca(apre).tipo;

        if (tipo === "tragedia") {
            total = 40000;
            if (apre.audiencia > 30) {
                total += 1000 * (apre.audiencia - 30);
            }
        } else if (tipo === "comedia") {
            total = 30000;
            if (apre.audiencia > 20) {
                total += 10000 + 500 * (apre.audiencia - 20);
            }
            total += 300 * apre.audiencia;
        } else {
            throw new Error(`Peça desconhecida: ${tipo}`);
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


function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (const apre of fatura.apresentacoes) {
        const valor = calc.calcularTotalApresentacao(apre);
        faturaStr += ` ${calc.repositorio.getPeca(apre).nome}: ${formatarMoeda(valor)} (${apre.audiencia} assentos)\n`;
    }
    const totalFatura = calc.calcularTotalFatura(fatura);
    const totalCreditos = calc.calcularTotalCreditos(fatura);
    faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
    faturaStr += `Créditos acumulados: ${totalCreditos}\n`;
    return faturaStr;
}

const {readFileSync} = require('fs');
const faturas = JSON.parse(readFileSync('./faturas.json'));
const repositorio = new Repositorio();
const calc = new ServicoCalculoFatura(repositorio);
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);


/*function gerarFaturaHTML(fatura, pecas) {
    let faturaStr = `<html>\n<body>\n`;

    faturaStr += '<ul>\n';
    for(let apre of fatura.apresentacoes) {
        const peca = getPeca(apre);
        faturaStr += `<li> ${peca.nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)</li>\n`;
    }
    faturaStr += '</ul>\n';

    faturaStr += `<p>Valor total: ${formatarMoeda(calcularTotalFatura(fatura))}</p>\n`;

    faturaStr += `<p>Créditos acumulados: ${calcularTotalCreditos(fatura)}</p>\n`;

    faturaStr += '</body>\n</html>';

    return faturaStr;
}
console.log(gerarFaturaHTML(faturas, pecas));

 */
