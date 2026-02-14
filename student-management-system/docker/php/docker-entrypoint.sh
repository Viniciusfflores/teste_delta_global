#!/bin/bash
set -e
echo "Iniciando Configuração da API..."

echo "Ajustando permissões de pastas..."
chmod -R 777 writable/ 2>/dev/null || true
mkdir -p public/uploads/students
chmod -R 777 public/uploads/ 2>/dev/null || true

if [ ! -d "vendor" ]; then
    echo "Vendor não encontrado. Instalando dependências..."
    composer install --no-interaction --optimize-autoloader
else
    echo "Dependências já instaladas."
fi

echo "Aguardando conexão com o Banco de Dados..."

until php -r "
    try {
        \$pdo = new PDO('mysql:host=${DB_HOST};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');
        echo 'Conexão bem sucedida!';
        exit(0);
    } catch (PDOException \$e) {
        exit(1);
    }
" > /dev/null 2>&1; do
    echo " ...MySQL indisponível, aguardando 3 segundos..."
    sleep 3
done
echo "MySQL conectado!"

echo "Executando Migrations..."
php spark migrate

echo "Executando Seeders..."
php spark db:seed UserSeeder

echo "Iniciando servidor CodeIgniter na porta 8000..."
echo ""

exec "$@"