<?php
    
    header('Access-Control-Allow-Headers: *');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE');

    date_default_timezone_set('America/Sao_Paulo');

    require_once __DIR__ . '/../vendor/autoload.php';

    use CoffeeCode\Router\Router;

    use App\Helpers\Env;
    use App\Controllers\ErrorController;
    use App\Exceptions\RouterException;

    try {

        $router = new Router(Env::get('APP_URL'));

        $router->namespace("App\Controllers")->group(null);

        $router->get("/user", "UserController:renderLoggedData");

        $router->group("auth");
        $router->post("/sign-in",    "AuthenticationController:signIn");
        $router->post("/sign-up",    "AuthenticationController:signUp");
        $router->get("/check-login", "AuthenticationController:checkLogin");

        
        $router->dispatch();

        if ($router->error()) {
            throw new RouterException($router->error());
        }

    } catch (\Exception $e) {
        return ErrorController::getErrorMessage($e);
    }