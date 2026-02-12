CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `students` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `users` (`name`, `email`, `password`) VALUES
('Administrador', 'admin@test.com', '$2y$10$92IXUNpkjO')
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO `students` (`name`, `email`, `phone`, `address`) VALUES
('João Silva', 'joao.silva@email.com', '(11) 98765-4321', 'Rua das Flores, 123 - São Paulo, SP'),
('Maria Santos', 'maria.santos@email.com', '(21) 97654-3210', 'Av. Paulista, 456 - Rio de Janeiro, RJ'),
('Pedro Oliveira', 'pedro.oliveira@email.com', '(31) 96543-2109', 'Rua Principal, 789 - Belo Horizonte, MG')
ON DUPLICATE KEY UPDATE name=name;

CREATE INDEX idx_students_deleted_at ON students(deleted_at);

CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_users_email ON users(email);