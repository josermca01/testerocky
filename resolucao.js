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

console.log("Questão 1 inteira \n")
// 1.Etapa - Corrige nome
database = database.map(corrige_nome)

// 2.Etapa - Corrige preço
database = database.map(corrige_preco)

// 3.Etapa - Corrige quantidade
database = database.map(corrige_quantidades)

console.log(database)
//Para gerar um arquivo JSON, utilizei do link abaixo
// https://stackabuse.com/reading-and-writing-json-files-with-node-js/
let data = JSON.stringify(database);
fs.writeFileSync('database.json', data);

//#endregion

//#region 2. Validação do banco de dados corrigido 

//arrays utilizados para ordenção e soma de valores por categoria

//função para ordenar o array por categoria
function ordenaCategoriaPorNome(a, b) {
    if (a.category > b.category)
        return 1
    if (a.category < b.category)
        return -1
    return 0
}

function ordenaProdutos(produtos) {
    let novosProdutos = JSON.parse(JSON.stringify(produtos))
    //ordenando por categorias
    //utiliaz-se a função sort para ordenação por categoria
    novosProdutos.sort(ordenaCategoriaPorNome)

    let arrayNovosProdutos = []
    let arrayCategorias = []
    //ordenando por id
    //lógica utilizada para ordenação de produtos pelo id
    //primeiro verifica todas as categorias existentes e adiciona em um array de arrays os produtos de mesma categoria 
    novosProdutos.forEach(novoProduto => {
        const index = arrayCategorias.indexOf(novoProduto.category)
        if (index === -1) {
            arrayCategorias.push(novoProduto.category);
            arrayNovosProdutos.push([novoProduto])
        }
        else {
            arrayNovosProdutos[index].push(novoProduto)
        }
    });
    
    //com o array de arrays pronto, começa o processo de ordenação de id
    //verifica cada array dentro do array e ordena o mesmo pelo id, atraves da função sort
    arrayNovosProdutos = arrayNovosProdutos.map(produtosPorCategoria => {
        produtosPorCategoria.sort((a, b) => a.id - b.id)
        return produtosPorCategoria
    })
    //com o array de arrays ordenado realiza-se a inserção dos valores para um outro array, tendo assim o valor de retorno no mesmo molde do valor de entrada
    //e junto somando os valores dos produtos de cada categoria
    let arrayOrdenado = []
    arrayNovosProdutos.forEach(produtosPorCategoria => {
        produtosPorCategoria.forEach(produto => {
            arrayOrdenado.push(produto)            
        });
    });

    return arrayOrdenado
}

console.log("\nQuestão 2 a) \n")
let arrayDataOrdenado = ordenaProdutos(database)
console.log(arrayDataOrdenado)

//funcao para calcular preço total dsa categorias
function somaValoresDasCategorias(produtos){

    let precos = []
    let arrayCategorias = []
    //percorre por todos os produtos para ver suas quantidades e valores
    produtos.forEach(produto => {
        const index = arrayCategorias.indexOf(produto.category)
        if (index === -1) {
            arrayCategorias.push(produto.category);
            //salva no array um objeto com atributos de categoria e preço
            precos.push({category: produto.category, price: produto.price * produto.quantity})
        }
        else {
            //adiciona no objeto de mesma categoria o preço de outro produto
            precos[index].price += (produto.price * produto.quantity)
        }
    });

    return precos
}


console.log("\nQuestão 2 b) \n")
console.log(somaValoresDasCategorias(database))
//#endregion