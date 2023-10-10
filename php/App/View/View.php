<?php

    namespace App\View;

    class View {

        public static function renderJson($data, string $title = "data")
        {
            $data = json_decode(json_encode($data), true);
        
            header("Content-Type: application/json");
            die (json_encode([$title => $data], JSON_PRETTY_PRINT));
        }
    }