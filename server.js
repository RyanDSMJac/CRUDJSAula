const express = require('express');
const path = require('path');
const { GerenciadorPessoas } = require('./crud');

const app = express();
const gerenciador = new GerenciadorPessoas();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/pessoas', (req, res) => {
  res.json(gerenciador.pessoas);
});

app.post('/api/pessoas', (req, res) => {
  try {
    const { cpf } = req.body;
    if (cpf && gerenciador.lerPorCpf(cpf)) {
      return res.status(409).json({ erro: 'Já existe uma pessoa com esse CPF.' });
    }
    const pessoa = gerenciador.criar(req.body);
    return res.status(201).json(pessoa);
  } catch (erro) {
    return res.status(400).json({ erro: erro.message });
  }
});

app.put('/api/pessoas/:cpf', (req, res) => {
  const pessoa = gerenciador.atualizar(req.params.cpf, req.body);
  if (!pessoa) {
    return res.status(404).json({ erro: 'Pessoa não encontrada.' });
  }
  return res.json(pessoa);
});

app.delete('/api/pessoas/:cpf', (req, res) => {
  const removida = gerenciador.deletar(req.params.cpf);
  if (!removida) {
    return res.status(404).json({ erro: 'Pessoa não encontrada.' });
  }
  return res.status(204).end();
});

if (require.main === module) {
  const porta = process.env.PORT || 3000;
  app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
  });
}

module.exports = app;
