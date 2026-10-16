class GerenciadorPessoas {
  constructor() {
    this.pessoas = [];
  }

  _calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  criar({ cpf, nome, dataNascimento }) {
    if (!cpf || !nome || !dataNascimento) {
      throw new Error('Campos obrigatórios faltando.');
    }

    const novaPessoa = {
      id: Date.now().toString(),
      cpf,
      nome,
      dataNascimento,
      idade: this._calcularIdade(dataNascimento)
    };

    this.pessoas.push(novaPessoa);
    return novaPessoa;
  }

  lerPorCpf(cpf) {
    return this.pessoas.find(p => p.cpf === cpf);
  }

  atualizar(cpf, novosDados) {
    const pessoa = this.lerPorCpf(cpf);
    if (!pessoa) return null;

    if (novosDados.nome) pessoa.nome = novosDados.nome;
    if (novosDados.dataNascimento) {
      pessoa.dataNascimento = novosDados.dataNascimento;
      pessoa.idade = this._calcularIdade(novosDados.dataNascimento);
    }
    return pessoa;
  }

  deletar(cpf) {
    const index = this.pessoas.findIndex(p => p.cpf === cpf);
    if (index === -1) return false;
    
    this.pessoas.splice(index, 1);
    return true;
  }
}

module.exports = { GerenciadorPessoas };