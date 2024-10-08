<h1 align="center">Projeto FlexiLease Autos</h1>
<p><img alt="Static Badge" src="https://img.shields.io/badge/license%20-%20ISC%20-%20green"> <img alt="Static Badge" src="https://img.shields.io/badge/version-1.0.0-blue"> <img alt="Static Badge" src="https://img.shields.io/badge/release%20date-october-turquoise"></p>

<p align="center">Este repositório é o projeto <strong>FlexiLease Autos</strong> do Desafio Final da trilha de NODE.JS + AWS_JUL24.</p>

<p align="center">
    <a href="#sobre">Sobre</a> /
    <a href="#tecnologias">Tecnologias</a> /
    <a href="#pré-requisitos">Pré-requisitos</a> /
    <a href="#passo-a-passo">Passo a passo</a> /
    <a href="#rotas">Rotas</a> /
    <a href="#autor">Autor</a>
</p>

# Sobre

Este projeto é a parte Back-End de uma concessionária especializada na locação de veículos. Nele podem ser feitas a criação, atualização e deleção de um usuário, carro ou reserva. Além disso é possivel fazer a listagem de todos os carros da locadora e de todas as reservas de um usuário específico que esteja autenticado, conseguindo listar também seu sua próprias informações de usuário. Todas as rotas de carros e reservas são autenticadas com Token JWT, sendo assim, um usuário não consegue ver as informações de outro usuário.

# Tecnologias

Foi desenvolvido na linguagem [TypeScript](https://www.typescriptlang.org/) juntamente com [Node.js](https://nodejs.org/en/about), o framework [Express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction), e o Object-Relational Mapping (ORM) [TypeORM](https://typeorm.io/) conectado ao banco de dados relacional [SQLite](https://www.sqlite.org/about.html).

Toda a documentação foi feita com [Swagger](https://swagger.io/specification/).

Obs: O link da API irá funcionar depois que rodar o projeto (passo 4 do "passo a passo").

Link da documentação da API: http://localhost:3000/v1/docs/

Versões das dependências utilizadas:

- axios: 1.7.7
- bcryptjs: 2.4.3
- celebrate: 15.0.3
- class-transformer: 0.5.1
- express: 4.19.2
- express-async-errors: 3.1.1
- jsonwebtoken: 9.0.2
- sqlite3: 5.1.7
- swagger-ui-express: 5.0.1
- typeorm: 0.2.29
- yamljs: 0.3.0

OBS.: Caso o código não funcione devido à atualizações das versões das dependências (versão atual), instale cada dependência com a versão utilizada na criação do projeto. Assim o código funcionará sem nenhum erro.

# Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina as seguintes ferramentas: [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en), e [Postman](https://www.postman.com/downloads/) ou [Insomnia](https://insomnia.rest/).

Além disso, é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/).

# Passo a passo

Passo a passo para executar o projeto:

- Baixe o projeto em arquivo zip e abra a pasta no editor de código ou clone este repositório usando seu URL: https://github.com/sthephanny-jrv/FlexiLease-Autos.git.

Siga as instruções abaixo para rodar o projeto:

1 - No seu editor de código abra o terminal da pasta do projeto.

2 - Digite o comando abaixo para baixar os pacotes/dependências do projeto:

      npm install

3 - Execute esse comando para rodar as migrações e criar o banco de dados:

      npm run typeorm migration:run

4 - Para rodar o projeto digite o comando abaixo no terminal do projeto:

      npm run dev

Feito isso a plicação deve estar rodando na porta 3000 (localholst:3000)

**OBS.:** Após cumprir estes 4 passos ao executar o projeto pela primeira vez, nas próximas vezes que desejar inicializar a aplicação para utilizar o projeto basta realizar novamente o passo 4 (utilizar o comando `npm run dev` no terminal).

5 - Abra o Postman ou o Insomnia para utilizar o projeto através das rotas.

6 - `LEMBRETE`: Todas as rotas de carros, reservas e usuários exigem autenticação, exceto as rotas de criação e autenticação de usuário. Para acessar as outras rotas da API, primeiro crie um usuário com "POST /user" e depois autentique-o com "POST /auth", gerando um token de acesso com validade de 12 horas. Durante esse período, o token deve ser usado como Bearer Token no campo Authorization. Quando o token expirar, será necessário autenticar novamente para gerar um novo.

# Rotas

Rotas da API REST

O servidor será executado em `http://localhost:3000/v1`

Complemento das rotas:

- Para Usuários:

  - POST `/user` -> Registrar um usuário
  - POST `/auth` -> Autenticar/logar um usuário (gera um token de autenticação)
  - GET `/user` -> Buscar informações do usuário autenticado
  - PUT `/user` -> Atualizar informações do usuário autenticado
  - DELETE `/user` -> Deleta um usuário autenticado

- Para Caros:

  - POST `/car` -> Registre um carro
  - GET `/car` -> Liste todos os carros
  - GET `/car/:id` -> Liste um carro pelo ID
  - PUT `/car/:id` -> Atualize um carro
  - PATCH `/car/:id` -> Modificação de um acessório específico (esse update pode ser adição ou remoção de um acessório)
  - DELETE `/car/:id` -> Remova um carro

- Para Reservas:

  - POST `/reserve` -> Registre uma reserva
  - GET `/reserve` -> Liste todas as reservas do usuário autenticado
  - GET `/reserve/:id` -> Busque uma reserva pelo seu ID
  - PUT `/reserve/:id` -> Atualize uma reserva
  - DELETE `/reserve/:id` -> Remova uma reserva

# Autor

Projeto desenvolvido por Sthephanny Jamilly. [Veja meu LinkedIn](https://www.linkedin.com/in/sthephanny-jamilly)
