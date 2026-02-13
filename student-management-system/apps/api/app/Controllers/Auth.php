<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class Auth extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format    = 'json';

    public function register()
    {
        $userModel = new UserModel();

        $json = $this->request->getJSON(true);
        
        $data = [
            'name'     => $json['name'] ?? $this->request->getPost('name'),
            'email'    => $json['email'] ?? $this->request->getPost('email'),
            'password' => $json['password'] ?? $this->request->getPost('password')
        ];

        if (!$userModel->insert($data)) {
            return $this->fail(
                $userModel->errors(),
                ResponseInterface::HTTP_BAD_REQUEST
            );
        }

        $userId = $userModel->getInsertID();
        $user = $userModel->find($userId);

        helper('jwt');
        $token = generateToken($user['id'], $user['email']);

        return $this->respond([
            'success' => true,
            'message' => 'Usuário registrado com sucesso',
            'data' => [
                'user' => [
                    'id'    => $user['id'],
                    'name'  => $user['name'],
                    'email' => $user['email']
                ],
                'token' => $token
            ]
        ], ResponseInterface::HTTP_CREATED);
    }

    public function login()
    {
        $userModel = new UserModel();

        $json = $this->request->getJSON(true);

        $email    = $json['email'] ?? $this->request->getPost('email');
        $password = $json['password'] ?? $this->request->getPost('password');

        if (!$email || !$password) {
            return $this->fail(
                'Email e senha são obrigatórios',
                ResponseInterface::HTTP_BAD_REQUEST
            );
        }

        $user = $userModel->findByEmail($email);

        if (!$user) {
            return $this->fail(
                'Credenciais inválidas',
                ResponseInterface::HTTP_UNAUTHORIZED
            );
        }

        if (!$userModel->verifyPassword($password, $user['password'])) {
            return $this->fail(
                'Credenciais inválidas',
                ResponseInterface::HTTP_UNAUTHORIZED
            );
        }

        helper('jwt');
        $token = generateToken($user['id'], $user['email']);

        return $this->respond([
            'success' => true,
            'message' => 'Login realizado com sucesso',
            'data' => [
                'user' => [
                    'id'    => $user['id'],
                    'name'  => $user['name'],
                    'email' => $user['email']
                ],
                'token' => $token
            ]
        ], ResponseInterface::HTTP_OK);
    }

    public function me()
    {
        helper('jwt');
        
        $userData = getUserFromToken();
        
        if (!$userData) {
            return $this->fail(
                'Token inválido',
                ResponseInterface::HTTP_UNAUTHORIZED
            );
        }

        $userModel = new UserModel();
        $user = $userModel->find($userData->sub);

        if (!$user) {
            return $this->fail(
                'Usuário não encontrado',
                ResponseInterface::HTTP_NOT_FOUND
            );
        }

        return $this->respond([
            'success' => true,
            'data' => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email']
            ]
        ]);
    }
}