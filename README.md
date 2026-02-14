# CRUD de Alunos - DELTA Challenge

Este é um projeto fullStack desenvolvido em **Codeigniter** e **ReactJS** como parte do processo seletivo para a **Delta GLobal**. O projeto consiste em um CRUD de alunos consumindo um banco local MySql, demonstrando a implementação de fluxos assíncronos, gerenciamento de estado reativo e boas práticas de arquitetura.

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

- PHP 8.1+
- Composer
- Node.js 18+
- MySQL 8+
- Docker (opcional)

### 1. Clone o repositório

**HTTPS:**
```bash
git clone https://github.com/Viniciusfflores/teste_delta_global.git
cd student-management-system
```

**SSH:**
```bash
git clone git@github.com:Viniciusfflores/teste_delta_global.git
cd student-management-system
```

### 2. Instale as dependências

***COM Docker:***
```bash
docker-compose up -d --build
docker-compose exec api composer require firebase/php-jwt
docker-compose exec api php spark migrate
docker-compose exec api php spark db:seed UserSeeder
```
***SEM Docker:***
```bash
composer install
php spark migrate
php spark db:seed UserSeeder
php spark serve
```