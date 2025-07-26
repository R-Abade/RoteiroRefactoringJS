function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (const apre of fatura.apresentacoes) {
        const peca = calc.repositorio.getPeca(apre);
        const valor = calc.calcularTotalApresentacao(apre);
        faturaStr += `  ${peca.nome}: ${formatarMoeda(valor)} (${apre.audiencia} assentos)\n`;
    }
    const totalFatura = calc.calcularTotalFatura(fatura);
    const totalCreditos = calc.calcularTotalCreditos(fatura);
    faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
    faturaStr += `Créditos acumulados: ${totalCreditos}\n`;
    return faturaStr;
}


const { readFileSync } = require('fs');
const { formatarMoeda } = require('./util.js');
const Repositorio = require('./repositorio');
const ServicoCalculoFatura = require('./servico');
const fatura = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const resultado = gerarFaturaStr(fatura, calc);
console.log(resultado);



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
