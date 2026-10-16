const { GerenciadorPessoas } = require('./crud');

describe('Gerenciador de Pessoas (CRUD + TDD)', () => {
  let gerenciador;

  beforeEach(() => {
    gerenciador = new GerenciadorPessoas();
  });

  test('Tem que criar uma pessoa e calcular a idade corretamente', () => {
    const dados = {
      cpf: '12345678909',
      nome: 'Ana Silva',
      dataNascimento: '1995-05-15'
    };

    const novaPessoa = gerenciador.criar(dados);

    expect(novaPessoa).toHaveProperty('id');
    expect(novaPessoa.cpf).toBe(dados.cpf);
    expect(novaPessoa.nome).toBe(dados.nome);
    expect(typeof novaPessoa.idade).toBe('number');
  });

  test('Tem que ler (buscar) uma pessoa pelo CPF', () => {
    gerenciador.criar({
      cpf: '98765432100',
      nome: 'Carlos Souza',
      dataNascimento: '1990-10-20'
    });

    const pessoa = gerenciador.lerPorCpf('98765432100');
    expect(pessoa).toBeDefined();
    expect(pessoa.nome).toBe('Carlos Souza');
  });

  test('Deve atualizar os dados de uma pessoa', () => {
    gerenciador.criar({
      cpf: '11122233344',
      nome: 'Mariana',
      dataNascimento: '2000-01-01'
    });

    const atualizado = gerenciador.atualizar('11122233344', { nome: 'Mariana Costa' });
    expect(atualizado.nome).toBe('Mariana Costa');
  });

  test('Deve deletar uma pessoa pelo CPF', () => {
    gerenciador.criar({
      cpf: '55566677788',
      nome: 'João',
      dataNascimento: '1985-12-10'
    });

    const removido = gerenciador.deletar('55566677788');
    expect(removido).toBe(true);
    expect(gerenciador.lerPorCpf('55566677788')).toBeUndefined();
  });
});