<?php

    namespace App\Models;
    use App\Database\Database;
    use App\Helpers\Sanitize;

    class User extends Database {

        const TABLE_NAME = "users";

        public function findById(int $userId)
        {
            $sql  = "SELECT * FROM ".self::TABLE_NAME." WHERE id = :id";
            $stmt = Database::getInstance()->prepare($sql);

            $stmt->bindValue(":id", $userId);
            $stmt->execute();

            return $stmt->fetch(\PDO::FETCH_OBJ);
        }

        public function findByEmail(string $email)
        {
            $sql  = "SELECT * FROM ".self::TABLE_NAME." WHERE email = :email";
            $stmt = Database::getInstance()->prepare($sql);

            $stmt->bindValue(":email", Sanitize::doCleanParam($email));
            $stmt->execute();

            return $stmt->fetch(\PDO::FETCH_OBJ);
        }

        public function registerWithInitialData(array $data)
        {
            $sql  = "INSERT INTO ".self::TABLE_NAME." (name, email, password_hash, created_at) VALUES (:name, :email, :password_hash, :created_at)";
            $stmt = Database::getInstance()->prepare($sql);

            $stmt->bindValue(":name",          Sanitize::doCleanParam( $data['name'] ));
            $stmt->bindValue(":email",         Sanitize::doCleanParam( $data['email'] ));
            $stmt->bindValue(":password_hash", password_hash($data['password'], PASSWORD_ARGON2ID));
            $stmt->bindValue(":created_at",    date('Y-m-d H:i:s'));
            $stmt->execute();

            return Database::getInstance()->lastInsertId() ?? null;
        }

    }