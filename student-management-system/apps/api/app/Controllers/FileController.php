<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class FileController extends Controller
{
    public function serve($filename)
    {
        $path = FCPATH . 'uploads/students/' . $filename;

        if (!is_file($path)) {
            throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
        }

        $mime = mime_content_type($path);

        return $this->response
            ->setHeader('Content-Type', $mime)
            ->setHeader('Cache-Control', 'public, max-age=86400')
            ->setBody(file_get_contents($path));
    }
}