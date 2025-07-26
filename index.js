const {readFileSync} = require('fs');
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

function getPeca(apre) {
    return pecas[apre.id];
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}


class ServicoCalculoFatura{
    calcularTotalApresentacao(apre) {
        let total = 0;
        const tipo = getPeca(apre).tipo;
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
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        if (getPeca(apre).tipo === "comedia") {
            creditos += Math.floor(apre.audiencia / 5);
        }
        return creditos;
    }

    calcularTotalFatura(fatura) {
        return fatura.apresentacoes
            .reduce((acc, apre) => acc + this.calcularTotalApresentacao(apre), 0);
    }

    calcularTotalCreditos(fatura) {
        return fatura.apresentacoes
            .reduce((acc, apre) => acc + this.calcularCredito(apre), 0);
    }
}


function gerarFaturaStr(fatura, pecas, calc) {

    calc = new ServicoCalculoFatura();
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} \n`;
    return faturaStr;
}

const faturaStr = gerarFaturaStr(faturas, pecas);
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
