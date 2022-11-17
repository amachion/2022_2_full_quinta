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
  } else {
    let alert = document.querySelector(".alert");
    alert.classList.add("show");
    alert.classList.remove("d-none");
    setTimeout(() => {
      alert.classList.add("d-none");
      alert.classList.remove("show");
    }, 2000);
  }
}

async function cadastrarUsuario() {
  let usuarioCadastroInput = document.querySelector("#usuarioCadastroInput");
  let senhaCadastroInput = document.querySelector("#senhaCadastroInput");
  let usuarioCadastro = usuarioCadastroInput.value;
  let senhaCadastro = senhaCadastroInput.value;
  if (usuarioCadastro && senhaCadastro) {
    //vamos realizar cadastro
    try {
      const cadastroUsuarioEndpoint = "/signup";
      const URLcompleta = `${protocolo}${baseURL}${cadastroUsuarioEndpoint}`;
      await axios.post(URLcompleta, {
        login: usuarioCadastro,
        senha: senhaCadastro,
      });
      usuarioCadastroInput.value = "";
      senhaCadastroInput.value = "";
      let alert = document.querySelector(".alert-modal-cadastro");
      alert.innerHTML = "usuário cadastrado com sucesso";
      alert.classList.add("show", "alert-sucsses");
      alert.classList.remove("d-none");
      setTimeout(() => {
        alert.classList.remove("show");
        alert.classList.add("d-none");
      }, 2000);
      let modal = bootstrap.Modal.getInstance(
        document.querySelector("#modalCadastro")
      );
      modal.hide();
    } catch (error) {}
  } else {
    let alert = document.querySelector(".alert-modal-cadastro");
    alert.innerHTML = "Preencha toda as informações";
    alert.classList.add("show", "alert-danger");
    alert.classList.remove("d-none");
    setTimeout(() => {
      alert.classList.remove("show");
      alert.classList.add("d-none");
    }, 2000);
  }
}
