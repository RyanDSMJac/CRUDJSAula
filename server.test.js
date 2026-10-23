const request = require('supertest');
const app = require('./server');

describe('Testes de Integração - Rotas da API (/api/pessoas)', () => {
  const pessoaTeste = {
    cpf: '88877766655',
    nome: 'Fernanda Lima',
    dataNascimento: '1992-08-14',
  };

  test('GET /api/pessoas deve retornar o status 200 e uma lista', async () => {
    const resposta = await request(app).get('/api/pessoas');
    expect(resposta.status).toBe(200);
    expect(Array.isArray(resposta.body)).toBe(true);
  });

  test('POST /api/pessoas deve cadastrar uma nova pessoa com sucesso (201)', async () => {
    const resposta = await request(app).post('/api/pessoas').send(pessoaTeste);

    expect(resposta.status).toBe(201);
    expect(resposta.body).toHaveProperty('id');
    expect(resposta.body.cpf).toBe(pessoaTeste.cpf);
    expect(resposta.body.nome).toBe(pessoaTeste.nome);
  });

  test('POST /api/pessoas com CPF duplicado deve retornar conflito (409)', async () => {
    const resposta = await request(app).post('/api/pessoas').send(pessoaTeste);

    expect(resposta.status).toBe(409);
    expect(resposta.body).toHaveProperty('erro');
  });

  test('PUT /api/pessoas/:cpf deve atualizar o nome da pessoa com sucesso (200)', async () => {
    const resposta = await request(app)
      .put(`/api/pessoas/${pessoaTeste.cpf}`)
      .send({ nome: 'Fernanda Lima Souza' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.nome).toBe('Fernanda Lima Souza');
  });

  test('DELETE /api/pessoas/:cpf deve excluir a pessoa com sucesso (204)', async () => {
    const resposta = await request(app).delete(
      `/api/pessoas/${pessoaTeste.cpf}`
    );
    expect(resposta.status).toBe(204);
  });

  test('PUT ou DELETE em uma pessoa inexistente deve retornar 404', async () => {
    const resposta = await request(app).delete('/api/pessoas/00000000000');
    expect(resposta.status).toBe(404);
  });
});
