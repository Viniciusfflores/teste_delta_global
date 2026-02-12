<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'name'       => 'Administrador',
            'email'      => 'admin@test.com',
            'password'   => password_hash('admin123', PASSWORD_DEFAULT),
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        $builder = $this->db->table('users');
        
        if (!$builder->where('email', $data['email'])->get()->getRow()) {
            $builder->insert($data);
            echo "✅ Usuário admin criado com sucesso!\n";
            echo "   Email: admin@test.com\n";
            echo "   Senha: admin123\n";
        } else {
            echo "⚠️  Usuário admin já existe.\n";
        }
    }
}