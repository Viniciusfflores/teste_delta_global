# CRUD de Alunos - DELTA Challenge

Este é um projeto fullStack desenvolvido em **Codeigniter** e **ReactJS** como parte do processo seletivo para a **Delta GLobal**. O projeto consiste em um CRUD de alunos consumindo um banco local MySql, demonstrando a implementação de fluxos assíncronos, gerenciamento de estado reativo e boas práticas de arquitetura.

---

**Stack:** CodeIgniter 4 (Backend) + React (Frontend) + MySQL

---

## 📋 Sobre o Projeto

Sistema CRUD completo para gerenciamento de alunos com:
- ✅ Autenticação JWT
- ✅ API RESTful
- ✅ Validações robustas
- ✅ Soft delete
- ✅ Documentação completa

### Funcionalidades

**Backend (API):**
- Autenticação com JWT (login/register)
- CRUD completo de alunos
- Validações de dados
- Tratamento de erros
- CORS configurado

**Frontend (WEB):**
- Interface React moderna
- Autenticação de usuários
- Listagem de alunos
- Formulários de cadastro/edição
- Visualização de detalhes
- Confirmação de exclusão

---

## 🚀 Setup do Projeto

### Pré-requisitos

**Com Docker (Recomendado):**
- Docker e Docker Compose instalados
- Git

**Sem Docker:**
- PHP 8.1+ (extensões: intl, mbstring, mysqli, gd, zip)
- MySQL 8.0+
- Composer
- Node.js 22+
---

## 🐳 Instalação com Docker (Recomendado)

### 1. Clone o repositório

**HTTPS:**
```bash
git clone https://github.com/Viniciusfflores/teste_delta_global.git
cd teste_delta_global/student-management-system
```

**SSH:**
```bash
git clone git@github.com:Viniciusfflores/teste_delta_global.git
cd teste_delta_global/student-management-system
```

### 2. Configure as variáveis de ambiente

```bash
# Copie os arquivos de exemplo
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

### 3. Inicie os containers

```bash
# Suba todos os containers (instala dependências automaticamente)
docker-compose up -d --build

# Aguarde 15-20 segundos para inicialização completa
```

### 4. Acesse os serviços

- 🔧 **API:** http://localhost:8000
- ⚛️ **Frontend:** http://localhost:5173
- 📦 **MySQL:** localhost:3306

### 6. Credenciais de teste
```
Email: admin@admin.com
Senha: admin123
```

---

## 💻 Instalação sem Docker

### 1. Clone e configure

```bash
# Clone o repositório
git clone https://github.com/Viniciusfflores/teste_delta_global.git
cd teste_delta_global/student-management-system

# Copie os arquivos de ambiente
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

### 2. Edite as variáveis de ambiente

Abra `apps/api/.env` e ajuste:

```env
database.default.hostname = localhost
database.default.database = student_system
database.default.username = root
database.default.password = sua_senha_mysql
```

### 3. Instale as dependências

```bash
# Backend
cd apps/api
composer install
composer require firebase/php-jwt

# Frontend
cd ../web
npm install
```

### 4. Configure o banco

```sql
-- Crie o banco de dados
CREATE DATABASE student_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
cd apps/api

# Rode as migrations
php spark migrate

# Rode o seeder
php spark db:seed UserSeeder
```

### 5. Inicie os serviços

```bash
# Terminal 1 - API
cd apps/api
php spark serve

# Terminal 2 - Frontend
cd apps/web
npm run dev
```
---

## 📚 Endpoints da API

### Autenticação

```http
POST /api/auth/register
POST /api/auth/login
```

### Alunos (requer autenticação)

```http
GET    /api/students          # Listar todos
GET    /api/students/{id}     # Buscar por ID
POST   /api/students          # Criar novo
PATCH  /api/students/{id}     # Atualizar
DELETE /api/students/{id}     # Excluir (soft delete)
```

**Headers obrigatórios:**
```
Authorization: Bearer {seu_token_jwt}
Content-Type: application/json
```

---

## 🛠️ Comandos Úteis

### Docker

```bash
# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs da API
docker-compose logs -f api

# Parar containers
docker-compose down

# Reiniciar containers
docker-compose restart

# Acessar terminal da API
docker-compose exec api bash

# Acessar MySQL
docker-compose exec mysql mysql -u root -proot student_system
```

### CodeIgniter

```bash
# Rodar migrations
docker-compose exec api php spark migrate

# Reverter última migration
docker-compose exec api php spark migrate:rollback

# Rodar seeder específico
docker-compose exec api php spark db:seed NomeDoSeeder

# Ver rotas disponíveis
docker-compose exec api php spark routes

# Criar migration
docker-compose exec api php spark make:migration NomeDaMigration

# Criar controller
docker-compose exec api php spark make:controller NomeController

# Criar model
docker-compose exec api php spark make:model NomeModel
```

---

## 🧪 Testando a API

### Postman
```
O diretório **docs** na raiz do projeto possui o arquivo json do postman 
para ser importado contendo todos os endpoints.
```

### Manualmente

**1. Registrar um usuário**

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

**2. Fazer login**

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

**3. Listar alunos (com token)**

```bash
curl http://localhost:8000/api/students \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📂 Estrutura do Projeto

```
student-management-system/
├── apps/
│   ├── api/                    # Backend CodeIgniter 4
│   │   ├── app/
│   │   │   ├── Config/
│   │   │   ├── Controllers/
│   │   │   ├── Models/
│   │   │   ├── Filters/
│   │   │   ├── Helpers/
│   │   │   └── Database/
│   │   │       ├── Migrations/
│   │   │       └── Seeds/
│   │   ├── public/
│   │   ├── writable/
│   │   └── .env
│   └── web/                    # Frontend React
│       ├── src/
│       ├── public/
├── database/
│   └── init.sql               # Schema inicial
├── docker/
│   ├── php/
│   │   ├── Dockerfile
│   │   └── docker-entrypoint.sh
│   └── mysql/
│       └── my.cnf
├── docs/                       # Documentação
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico para a Delta Global.

---

## 👤 Autor

**Vinicius Flores**

- GitHub: [@Viniciusfflores](https://github.com/Viniciusfflores)
- Email: viniciusfeflores@gmail.com
