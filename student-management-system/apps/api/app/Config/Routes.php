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

    $routes->group('students', ['filter' => 'auth'], function($routes) {
        $routes->get('', 'Students::index');  // GET /api/students - Listar todos
        $routes->get('all', 'Students::getAll'); // GET /api/students/all - Listar todos (incluindo deletados)
        $routes->get('(:num)', 'Students::show/$1');   // GET /api/students/1 - Buscar por ID
        $routes->post('', 'Students::create');         // POST /api/students - Criar novo
        $routes->put('(:num)', 'Students::update/$1'); // PUT /api/students/1 - Atualizar
        $routes->delete('(:num)', 'Students::delete/$1'); // DELETE /api/students/1 - Deletar
    });
});