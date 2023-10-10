<?php

    namespace App\Database;
    use App\Helpers\Env;

    class Database {

        private static $connection;
    
        public static function getInstance()
        {
            if (self::$connection === null) {
                self::$connection = self::initConnection();
            }
    
            return self::$connection;
        }
    
        private static function getDNS()
        {
            $db = [
                "driver" => Env::get("DB_DRIVER"),
                "name"   => Env::get("DB_NAME"),
                "host"   => Env::get("DB_HOST"),
                "user"   => Env::get("DB_USER"),
                "port"   => Env::get("DB_PORT"),
                "pass"   => Env::get("DB_PASS")
            ];

            $db = json_decode(json_encode($db));

            return "{$db->driver}:dbname={$db->name};host={$db->host};port={$db->port};charset=utf8mb4;user={$db->user};password={$db->pass}";
        }

        private static function initConnection()
        {
            $pdo = new \PDO(self::getDNS());
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            
            return $pdo;
        }

    }