# Guia de Desenvolvimento, Qualidade e Operações

Este documento descreve os padrões obrigatórios para o ciclo de vida de desenvolvimento de software (SDLC) deste repositório.

---

## 1. Controle de Versionamento (Git Flow)
Utilizamos uma variação simplificada do Git Flow:
- **`main`**: Branch de produção. Código estável e testado.
- **`develop`**: Branch de integração para a próxima release.
- **Features/Bugfixes**: Criadas a partir de `develop` com o padrão de nomenclatura:
  - `feature/nome-da-funcionalidade`
  - `bugfix/descricao-do-problema`

---

## 2. Processo de Pull Request (PR)
Para enviar código para o repositório oficial:
1. Abra um Pull Request direcionado à branch `develop`.
2. O título deve seguir o padrão Conventional Commits (ex: `feat: adiciona calculo de idade no CRUD`).
3. **Critérios de aceite para merge:**
   - Aprovação de pelo menos 1 revisor (Code Review).
   - Sucesso em todas as etapas do Pipeline de CI/CD (Testes e Análise Estática).
   - Ausência de conflitos com a branch de destino.

---

## 3. Análise Estática e Formatação
Garantimos a padronização e qualidade do código através de ferramentas automatizadas:
- **Formatação (Prettier):**
  ```bash
  npm run format


* **Linting (ESLint):** Verifica erros de sintaxe e más práticas.
```bash
npm run lint

```



---

## 4. Testes Automatizados

O projeto conta com duas camadas de testes:

* **Testes Unitários:** Validam funções isoladas (ex: regras de negócio do CRUD e cálculo de idade).
```bash
npm run test:unit

```


* **Testes de Integração:** Validam a comunicação entre módulos ou rotas da API (usando Supertest, por exemplo).
```bash
npm run test:integration

```
---

### Comandos úteis:

* **Construir a imagem:**
```bash
docker build -t minha-aplicacao-crud:latest .

```


* **Executar o container:**
```bash
docker run -p 3000:3000 minha-aplicacao-crud:latest

```
