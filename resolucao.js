const fs = require('fs');// módulo JS para interação com arquivos
const broken_database = require('./broken-database.json')// importação do arquivo original
let database = JSON.parse(JSON.stringify(broken_database))// criação variável da base de dados corrigida

//#region 1. Recuperação dos dados originais do banco de dados 

//Verifica as letras e corrige as erradas
function verifica_letra(letra) {
    switch (letra) {// verifica se a letra atual possui uma conversão
        case "æ": return "a"
        case "ø": return "o"
        case "¢": return "c"
        case "ß": return "b"
        default: return letra
    }
    /* if (letra === "æ")
        letra = "a"
    if (letra === "ø")
        letra = "o"
    if (letra === "¢")
        letra = "c"
    if (letra === "ß")
        letra = "b" */
    //return letra
}

function corrige_nome(entrada) {
    //logica do nome
    let name = entrada.name
    //separa todas as letras do nome do produto para a verificação de cada uma
    let splited = name.split("")
    //faz a verificação letra por letra do nome do produto
    splited = splited.map(verifica_letra).join("")
    entrada.name = splited
    return entrada
}

function corrige_preco(entrada) {
    //logica do preço
    //transforma qualquer tipo para number e caso nao consiga irá transformar para nan(not a number)
    entrada.price = +entrada.price
    return entrada
}

function corrige_quantidades(entrada) {
    //logica aplicada para correção de quantidade
    //verifica caso a chave de quantidade não exista ele atribui o valor 0 para a chave
    if (entrada.quantity === undefined)
        entrada.quantity = 0;
    return entrada
}

// 1.Etapa - Corrige nome
database = database.map(corrige_nome)

// 2.Etapa - Corrige preço
database = database.map(corrige_preco)

// 3.Etapa - Corrige quantidade
database = database.map(corrige_quantidades)

//Para gerar um arquivo JSON, utilizei do link abaixo
// https://stackabuse.com/reading-and-writing-json-files-with-node-js/
let data = JSON.stringify(database);
fs.writeFileSync('database.json', data);

//#endregion

//#region 2. Validação do banco de dados corrigido 


//#endregion