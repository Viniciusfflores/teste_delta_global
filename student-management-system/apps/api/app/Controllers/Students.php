<?php

namespace App\Controllers;

use App\Models\StudentModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class Students extends ResourceController
{
    protected $modelName = 'App\Models\StudentModel';
    protected $format = 'json';

    public function index()
    {
        $studentModel = new StudentModel();

        $students = $studentModel->getAllActive();

        return $this->respond([
            'success' => true,
            'message' => 'Lista de alunos',
            'data' => $students,
            'total' => count($students)
        ]);
    }

    public function getAll()
    {
        $studentModel = new StudentModel();

        $students = $studentModel->getAllWithDeleted();

        return $this->respond([
            'success' => true,
            'message' => 'Lista de alunos',
            'data' => $students,
            'total' => count($students)
        ]);
    }

    public function show($id = null)
    {
        $studentModel = new StudentModel();

        $student = $studentModel->find($id);

        if (!$student) {
            return $this->failNotFound('Aluno não encontrado');
        }

        return $this->respond([
            'success' => true,
            'message' => 'Aluno encontrado',
            'data' => $student
        ]);
    }

    public function create()
    {
        $studentModel = new StudentModel();

        $contentType = $this->request->getHeaderLine('Content-Type');
        $isJson = strpos($contentType, 'application/json') !== false;

        if ($isJson) {
            $json = $this->request->getJSON(true);
            $data = [
                'name' => $json['name'] ?? null,
                'email' => $json['email'] ?? null,
                'phone' => $json['phone'] ?? null,
                'address' => $json['address'] ?? null,
            ];
        } else {
            $data = [
                'name' => $this->request->getPost('name'),
                'email' => $this->request->getPost('email'),
                'phone' => $this->request->getPost('phone'),
                'address' => $this->request->getPost('address'),
            ];
        }

        $photo = $this->request->getFile('photo');
        if ($photo && $photo->isValid() && !$photo->hasMoved()) {
            $uploadResult = $this->uploadPhoto($photo);

            if ($uploadResult['success']) {
                $data['photo'] = $uploadResult['path'];
            } else {
                return $this->fail($uploadResult['message'], ResponseInterface::HTTP_BAD_REQUEST);
            }
        }

        if (!$studentModel->insert($data)) {
            return $this->fail(
                $studentModel->errors(),
                ResponseInterface::HTTP_BAD_REQUEST
            );
        }

        $studentId = $studentModel->getInsertID();
        $student = $studentModel->find($studentId);

        return $this->respondCreated([
            'success' => true,
            'message' => 'Aluno criado com sucesso',
            'data' => $student
        ]);
    }

    public function update($id = null)
    {
        $studentModel = new StudentModel();
        $student = $studentModel->find($id);

        if (!$student) {
            return $this->failNotFound('Aluno não encontrado');
        }

        $contentType = $this->request->getHeaderLine('Content-Type');

        if (strpos($contentType, 'application/json') !== false) {
            $input = $this->request->getJSON(true);
        } else {

            $input = $this->request->getPost();
        }

        $data = [
            'name' => $input['name'] ?? null,
            'email' => $input['email'] ?? null,
            'phone' => $input['phone'] ?? null,
            'address' => $input['address'] ?? null,
        ];

        $data = array_filter($data, fn($value) => !is_null($value));

        $photo = $this->request->getFile('photo');

       if ($photo) {
        if ($photo->isValid() && !$photo->hasMoved()) {
            $uploadResult = $this->uploadPhoto($photo);
            if ($uploadResult['success']) {

                if (!empty($student['photo'])) {
                    $this->deletePhoto($student['photo']);
                }
                $data['photo'] = $uploadResult['path'];

            } else {
                return $this->fail($uploadResult['message'], ResponseInterface::HTTP_BAD_REQUEST);
            }
        } else {
            return $this->fail('Arquivo de foto inválido', ResponseInterface::HTTP_BAD_REQUEST);
        }
       }

        if (empty($data)) {
            return $this->fail('Nenhum dado enviado para atualização.', 400);
        }

        if (!$studentModel->update($id, $data)) {
            return $this->fail($studentModel->errors(), 400);
        }

        return $this->respond([
            'success' => true,
            'message' => 'Aluno atualizado com sucesso',
            'data' => $studentModel->find($id)
        ]);
    }


    private function uploadPhoto($file): array
    {
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

        if (!in_array($file->getMimeType(), $allowedTypes)) {
            return [
                'success' => false,
                'message' => 'Tipo de arquivo não permitido. Use: JPG, PNG, GIF ou WEBP'
            ];
        }

        $maxSize = 5 * 1024 * 1024;
        if ($file->getSize() > $maxSize) {
            return [
                'success' => false,
                'message' => 'Arquivo muito grande. Tamanho máximo: 5MB'
            ];
        }

        $newName = $file->getRandomName();

        $uploadPath = WRITEPATH . '../public/uploads/students/';

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        if (!$file->move($uploadPath, $newName)) {
            return [
                'success' => false,
                'message' => 'Erro ao fazer upload da foto'
            ];
        }

        return [
            'success' => true,
            'path' => 'uploads/students/' . $newName,
            'message' => 'Upload realizado com sucesso'
        ];
    }

    private function deletePhoto(string $photoPath): bool
    {
        $fullPath = WRITEPATH . '../public/' . $photoPath;

        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }

        return false;
    }
}