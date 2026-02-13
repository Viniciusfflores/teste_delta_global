<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'name',
        'email',
        'password'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    protected $validationRules = [
        'name' => 'required|min_length[3]|max_length[100]',
        'email' => 'required|valid_email|max_length[100]|is_unique[users.email,id,{id}]',
        'password' => 'required|min_length[6]'
    ];

    protected $validationMessages = [
        'name' => [
            'required' => 'O nome é obrigatório',
            'min_length' => 'O nome deve ter no mínimo 3 caracteres',
            'max_length' => 'O nome deve ter no máximo 100 caracteres'
        ],
        'email' => [
            'required' => 'O email é obrigatório',
            'valid_email' => 'Por favor, forneça um email válido',
            'is_unique' => 'Este email já está cadastrado'
        ],
        'password' => [
            'required' => 'A senha é obrigatória',
            'min_length' => 'A senha deve ter no mínimo 6 caracteres'
        ]
    ];

    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    protected function hashPassword(array $data): array
    {
        if (isset($data['data']['password'])) {
            $data['data']['password'] = password_hash(
                $data['data']['password'],
                PASSWORD_DEFAULT
            );
        }

        return $data;
    }

    public function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }


    public function findByEmail(string $email): ?array
    {
        return $this->where('email', $email)->first();
    }
}