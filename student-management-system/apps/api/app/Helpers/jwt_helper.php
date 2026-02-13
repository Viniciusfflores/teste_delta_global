<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (!function_exists('generateToken')) {
    /** 
     * @param int $userId
     * @param string $email
     * @return string 
     */
    function generateToken(int $userId, string $email): string
    {
        $key = getenv('JWT_SECRET');
        $timeToLive = getenv('JWT_TIME_TO_LIVE') ?: 3600;
        
        $payload = [
            'iss' => base_url(),
            'aud' => base_url(),
            'iat' => time(),
            'exp' => time() + $timeToLive,
            'sub' => $userId,
            'email' => $email
        ];

        return JWT::encode($payload, $key, 'HS256');
    }
}

if (!function_exists('validateToken')) {
    /**
     * @param string $token
     * @return object|null
     */
    function validateToken(string $token): ?object
    {
        try {
            $key = getenv('JWT_SECRET');
            
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            
            return $decoded;
        } catch (\Exception $e) {
            log_message('error', 'JWT Validation Error: ' . $e->getMessage());
            return null;
        }
    }
}

if (!function_exists('getTokenFromHeader')) {
    /**
     * @return string|null
     */
    function getTokenFromHeader(): ?string
    {
        $request = \Config\Services::request();
        $authHeader = $request->getHeaderLine('Authorization');
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
}

if (!function_exists('getUserFromToken')) {
    /**
     * @return object|null
     */
    function getUserFromToken(): ?object
    {
        $token = getTokenFromHeader();
        
        if (!$token) {
            return null;
        }
        
        return validateToken($token);
    }
}