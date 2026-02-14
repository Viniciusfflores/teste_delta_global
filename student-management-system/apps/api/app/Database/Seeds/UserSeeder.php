<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use App\Models\UserModel;

class UserSeeder extends Seeder
{
    public function run()
    {
        $model = new UserModel();

        $email = 'admin@admin.com';
        $password = 'admin123';

        if ($model->where('email', $email)->first()) {
            echo "Usuário admin já existe ({$email}).\n";
            return;
        }

        $data = [
            'name'     => 'Administrador',
            'email'    => $email,
            'password' => $password,
        ];

        if ($model->insert($data)) {
            echo "Usuário admin criado com sucesso!\n";
            echo "   Email: {$email}\n";
            echo "   Senha: {$password}\n";
        } else {
            echo "Erro ao criar usuário:\n";
            print_r($model->errors());
        }
    }
}