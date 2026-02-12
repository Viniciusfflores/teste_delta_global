#!/bin/bash
set -e

echo "🚀 Iniciando API CodeIgniter..."

if [ ! -d "vendor" ]; then
    echo "📦 Instalando dependências do Composer..."
    composer install --no-interaction --optimize-autoloader
    
    echo "🔐 Instalando biblioteca JWT..."
    composer require firebase/php-jwt --no-interaction
else
    echo "✅ Dependências já instaladas"
fi

echo "🔧 Ajustando permissões..."
chmod -R 777 writable/ 2>/dev/null || true
mkdir -p public/uploads/students
chmod -R 777 public/uploads/ 2>/dev/null || true

echo "✨ API pronta!"
echo ""

exec "$@"