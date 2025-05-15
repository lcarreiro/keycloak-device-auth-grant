# 🔐 Auth CLI - NestJS + Keycloak Device Flow

Este projeto demonstra como usar o **OAuth 2.0 Device Flow** com **Keycloak** em um aplicativo **Node.js/NestJS**, ideal para **CLIs, chatbots, IoT e dispositivos sem navegador**.

---

## 📦 Tecnologias utilizadas

- [NestJS](https://nestjs.com/)
- [Keycloak](https://www.keycloak.org/)
- OAuth 2.0 Device Authorization Grant
- CLI com [Commander](https://www.npmjs.com/package/commander) e [Inquirer](https://www.npmjs.com/package/inquirer)
- Docker Compose para ambiente local

---

## 🚀 O que este projeto faz?

- Inicia um **Device Flow OAuth 2.0** com o Keycloak.
- Exibe o link de autenticação e o código para o usuário autenticar em outro dispositivo.
- Aguarda a autenticação e, ao final, exibe o `access_token`.
- Arquitetura pronta para integração com **chatbots ou scripts automatizados**.

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 🧪 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/auth-cli-device-flow.git
cd auth-cli-device-flow

### 2. Suba o ambiente com Keycloak

```bash
docker-compose up -d
```

Acesse o Keycloak em: [http://localhost:8080](http://localhost:8080)
Usuário padrão: `admin`
Senha: `admin`

---

### 3. Configure o client no Keycloak

1. Vá até o **Realm** `teste` (ou crie um novo).
2. Crie um **Client** com os seguintes parâmetros:

   * `Client ID`: `device-client`
   * **Client authentication**: ❌ Desabilitado
   * **Device Flow Enabled**: ✅ Habilitado
3. Salve e anote o `client_id`.

---

### 4. Instale as dependências do projeto

```bash
npm install
```

---

### 5. Execute a CLI de autenticação

```bash
npm start -- auth
```

Você verá algo como:

```
? Deseja iniciar a autenticação? (Y/n)
🔗 Acesse e autentique-se:
👉 http://localhost:8080/realms/teste/device
📄 Código: R4FK-8XMP
✅ Link direto: http://localhost:8080/realms/teste/device?user_code=R4FK-8XMP
```

---

### 6. Faça login no navegador

* Acesse o link mostrado.
* Faça login com um usuário do Keycloak.

Após confirmar, volte ao terminal e pressione ENTER.

---

### 7. Resultado

Se o login for bem-sucedido, você verá:

```
✅ Autenticação bem-sucedida!
Access Token: eyJhbGciOi...
```

---

## 💡 Exemplos de uso

* CLIs que precisam de login sem abrir navegador.
* Chatbots (Telegram, WhatsApp) que precisam autenticar usuários.
* TVs, set-top boxes, dispositivos IoT.

---

## 📁 Estrutura

```
src/
├── cli/
│   ├── cli.ts                  # Interface de linha de comando com prompts
│   └── device-auth.service.ts # Serviço que lida com Device Flow
├── app.module.ts
├── main.ts
docker-compose.yml             # Sobe o Keycloak
```

---

## ✅ Próximos passos

* 🔐 Salvar `access_token` localmente
* ♻️ Suporte a `refresh_token`
* 📡 Chamada de API protegida usando o token
* 🤖 Integração com chatbot (Telegram, WhatsApp)

---

## 🧑‍💻 Autor

Feito por Luciano Carreiro com NestJS e Keycloak 💙
