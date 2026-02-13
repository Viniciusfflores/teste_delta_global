<?php

namespace App\Models;

use CodeIgniter\Model;

class StudentModel extends Model
{
    protected $table = 'students';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = true;
    protected $protectFields = true;

    protected $allowedFields = [
        'name',
        'email',
        'phone',
        'address',
        'photo'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    protected $validationRules = [
        'name' => 'required|min_length[3]|max_length[100]',
        'email' => 'required|valid_email|max_length[100]|is_unique[students.email,id,{id}]',
        'phone' => 'permit_empty|max_length[20]',
        'address' => 'permit_empty|max_length[500]',
        'photo' => 'permit_empty|max_length[255]'
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
        'phone' => [
            'max_length' => 'O telefone deve ter no máximo 20 caracteres'
        ],
        'address' => [
            'max_length' => 'O endereço deve ter no máximo 500 caracteres'
        ]
    ];

    protected $skipValidation = false;
    protected $cleanValidationRules = true;


    public function findByEmail(string $email): ?array
    {
        return $this->where('email', $email)->first();
    }

    public function getAllActive(): array
    {
        return $this->findAll();
    }

    public function getAllWithDeleted(): array
    {
        return $this->withDeleted()->findAll();
    }

    public function restore(int $id): bool
    {
        return $this->update($id, ['deleted_at' => null]);
    }
}