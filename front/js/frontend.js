const protocolo = "http://";
const baseURL = "localhost:3000";

async function buscaFilmes() {
  const endpoint = "/filmes";
  const URLcompleta = `${protocolo}${baseURL}${endpoint}`;
  console.log(URLcompleta);
  const filmes = (await axios.get(URLcompleta)).data;
  console.log(filmes);
  let tabelaDados = document.querySelector(".filmes");
  let corpoTabela = tabelaDados.getElementsByTagName("tbody")[0];
  //varrer a lista de filmes utilizando um for aprimorado
  for (let filme of filmes) {
    //adicionar uma linha à tabela, sempre no início
    let linha = corpoTabela.insertRow(0);
    //adicionar 2 celulas
    let celulaTitulo = linha.insertCell(0);
    let celulaSinopse = linha.insertCell(1);
    //preencher os dados de cada celula com os valores do filme
    celulaTitulo.innerHTML = filme.titulo;
    celulaSinopse.innerHTML = filme.sinopse;
  }
}

async function cadastrarFilme() {
  const endpoint = "/filmes";
  URLcompleta = `${protocolo}${baseURL}${endpoint}`;
  let tituloInput = document.querySelector("#tituloInput");
  let sinopseInput = document.querySelector("#sinopseInput");
  let titulo = tituloInput.value;
  let sinopse = sinopseInput.value;
  tituloInput.value = "";
  sinopseInput.value = "";  
  if (titulo && sinopse) {
    const filmes = (await axios.post(URLcompleta, { titulo, sinopse })).data;
    let tabela = document.querySelector(".filmes");
    let corpoTabela = tabela.getElementsByTagName("tbody")[0];
    corpoTabela.innerHTML = "";
    for (let filme of filmes) {
      let linha = corpoTabela.insertRow(0);
      let celulaTitulo = linha.insertCell(0);
      let celulaSinopse = linha.insertCell(1);
      celulaTitulo.innerHTML = filme.titulo;
      celulaSinopse.innerHTML = filme.sinopse;
    }
  }
  else {
    let alert = document.querySelector('.alert')
    alert.classList.add('show')
    alert.classList.remove('d-none')
    setTimeout (() => {
        alert.classList.add('d-none')
        alert.classList.remove('show')
    }, 3000)
  }
}
