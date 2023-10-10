<?php

namespace App\Helpers;

abstract class Sanitize
{

    // limpa o paramêtro para impedir XSS Attack.
    public static function doCleanParam($param)
    {
        return is_string($param) ? strip_tags(htmlspecialchars($param)) : $param;
    }

    public static function email(string $email = "")
    {
        $email = self::doCleanParam($email);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException("informe um email válido!");
        }

        return $email;
    }

    public static function peopleName(string $name = "")
    {
        $name = self::doCleanParam($name);

        if (!preg_match('/^[A-Za-zÀ-ú\s]+$/', $name)) {
            throw new \InvalidArgumentException("informe um nome válido! Apenas letras, espaços e acentos.");
        }

        return $name;
    }
}
