<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuthFilter implements FilterInterface
{
    /**
     * Valida se o usuário está autenticado via JWT
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        helper('jwt');
        
        $token = getTokenFromHeader();
        
        if (!$token) {
            return $this->unauthorizedResponse('Token não fornecido');
        }
        
        $userData = validateToken($token);
        
        if (!$userData) {
            return $this->unauthorizedResponse('Token inválido ou expirado');
        }
        
        $request->userData = $userData;
        
        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {}

    private function unauthorizedResponse(string $message)
    {
        $response = service('response');
        $response->setStatusCode(401);
        $response->setJSON([
            'success' => false,
            'message' => $message
        ]);
        
        return $response;
    }
}