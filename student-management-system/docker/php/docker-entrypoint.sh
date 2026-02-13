#!/bin/bash
set -e

echo "🚀 Iniciando API CodeIgniter..."

# Instalar dependências se necessário
if [ ! -d "vendor" ]; then
    echo "📦 Instalando dependências..."
    composer install --no-interaction --optimize-autoloader
    composer require firebase/php-jwt --no-interaction
else
    echo "✅ Dependências já instaladas"
fi

# Ajustar permissões
echo "🔧 Ajustando permissões..."
chmod -R 777 writable/ 2>/dev/null || true
mkdir -p public/uploads/students
chmod -R 777 public/uploads/ 2>/dev/null || true

# Garantir que estamos usando porta 8000
export CI_SERVER_PORT=8000

echo "✨ Iniciando servidor na porta 8000..."
echo ""

# Iniciar servidor EXPLICITAMENTE na porta 8000
exec php -S 0.0.0.0:8000 -t public public/index.php