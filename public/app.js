const API = '/api/pessoas';

const form = document.getElementById('form-pessoa');
const campoCpf = document.getElementById('cpf');
const campoNome = document.getElementById('nome');
const campoData = document.getElementById('dataNascimento');
const tituloForm = document.getElementById('titulo-form');
const btnCancelar = document.getElementById('btn-cancelar');
const mensagem = document.getElementById('mensagem');
const lista = document.getElementById('lista');
const vazio = document.getElementById('vazio');

// CPF da pessoa em edição (null = modo de criação)
let cpfEmEdicao = null;

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo || '';
}

function formatarCpf(cpf) {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

async function chamarApi(url, opcoes) {
  const resposta = await fetch(url, opcoes);
  if (resposta.status === 204) return null;
  const corpo = await resposta.json();
  if (!resposta.ok) throw new Error(corpo.erro || 'Erro na requisição.');
  return corpo;
}

function criarBotao(texto, classe, aoClicar) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = texto;
  if (classe) botao.className = classe;
  botao.addEventListener('click', aoClicar);
  return botao;
}

function criarLinha(pessoa) {
  const tr = document.createElement('tr');

  [
    formatarCpf(pessoa.cpf),
    pessoa.nome,
    formatarData(pessoa.dataNascimento),
    `${pessoa.idade} anos`,
  ].forEach((valor) => {
    const td = document.createElement('td');
    td.textContent = valor;
    tr.appendChild(td);
  });

  const acoes = document.createElement('td');
  acoes.appendChild(criarBotao('Editar', '', () => iniciarEdicao(pessoa)));
  acoes.appendChild(
    criarBotao('Excluir', 'perigo', () => excluirPessoa(pessoa)),
  );
  tr.appendChild(acoes);

  return tr;
}

async function carregarLista() {
  try {
    const pessoas = await chamarApi(API);
    lista.replaceChildren(...pessoas.map(criarLinha));
    vazio.hidden = pessoas.length > 0;
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
}

function resetarFormulario() {
  cpfEmEdicao = null;
  form.reset();
  campoCpf.disabled = false;
  tituloForm.textContent = 'Nova pessoa';
  btnCancelar.hidden = true;
}

function iniciarEdicao(pessoa) {
  cpfEmEdicao = pessoa.cpf;
  campoCpf.value = pessoa.cpf;
  campoCpf.disabled = true; // o CPF identifica o registro, então não muda
  campoNome.value = pessoa.nome;
  campoData.value = pessoa.dataNascimento;
  tituloForm.textContent = 'Editando pessoa';
  btnCancelar.hidden = false;
  mostrarMensagem('', '');
  campoNome.focus();
}

async function excluirPessoa(pessoa) {
  if (!confirm(`Excluir ${pessoa.nome}?`)) return;
  try {
    await chamarApi(`${API}/${pessoa.cpf}`, { method: 'DELETE' });
    if (cpfEmEdicao === pessoa.cpf) resetarFormulario();
    mostrarMensagem('Pessoa excluída.', 'ok');
    carregarLista();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const cpf = campoCpf.value.trim();
  const nome = campoNome.value.trim();
  const dataNascimento = campoData.value;

  if (!cpfEmEdicao && !/^\d{11}$/.test(cpf)) {
    mostrarMensagem('O CPF deve ter 11 dígitos numéricos.', 'erro');
    return;
  }

  const opcoes = {
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    if (cpfEmEdicao) {
      await chamarApi(`${API}/${cpfEmEdicao}`, {
        ...opcoes,
        method: 'PUT',
        body: JSON.stringify({ nome, dataNascimento }),
      });
      mostrarMensagem('Pessoa atualizada.', 'ok');
    } else {
      await chamarApi(API, {
        ...opcoes,
        method: 'POST',
        body: JSON.stringify({ cpf, nome, dataNascimento }),
      });
      mostrarMensagem('Pessoa cadastrada.', 'ok');
    }
    resetarFormulario();
    carregarLista();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});

btnCancelar.addEventListener('click', () => {
  resetarFormulario();
  mostrarMensagem('', '');
});

carregarLista();
