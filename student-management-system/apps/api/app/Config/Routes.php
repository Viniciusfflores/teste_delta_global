<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// Rota Heath Check
$routes->get('/', function() {
    return response()->setJSON([
        'status' => 'online',
        'message' => 'Health check OK',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
$routes->group('api', ['namespace' => 'App\Controllers'], function($routes) {
    

    $routes->group('auth', function($routes) {
        $routes->post('register', 'Auth::register');
        $routes->post('login', 'Auth::login');
        
        $routes->get('me', 'Auth::me', ['filter' => 'auth']);
    });
});