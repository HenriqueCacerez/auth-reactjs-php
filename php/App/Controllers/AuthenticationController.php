<?php

    namespace App\Controllers;
    use App\Core\Controller;
    use App\Helpers\Env;
    use App\Helpers\JWT;
    use App\Helpers\Sanitize;
    use App\Models\User;
    use App\View\View;

    class AuthenticationController extends Controller {

        // in Minutes
        const JWT_AUTH_EXPIRE = 1440;  // 24 hours

        /**
         * Router:
         * POST "/auth/sign-in"
        */
        public function signIn()
        {
            $dataRequest = $this->checkDataRequest(requiredFields: ["email", "password"]);

            $email    = Sanitize::email($dataRequest['email']);
            $password = $dataRequest['password'];

            $userExists      = (new User)->findByEmail( $email );
            $isMatchPassword = isset($userExists->id) ? password_verify($password, $userExists->password_hash) : false;

            if (!$isMatchPassword) {
                throw new \InvalidArgumentException("email e/ou senha inválidos.");
            }

            $authToken = $this->createAuthTokenJWT( $userExists->id );
            
            return View::renderJson([
                'status'    => "success",
                'authToken' => $authToken
            ]);
        }

        /**
         * Router:
         * POST "/auth/sign-up"
        */
        public function signUp()
        {
            return (new UserController)->create();
        }

        /**
         * Router:
         * GET "/auth/check-login"
        */
        public function checkLogin()
        {
            return View::renderJson([
                "status"   => "success",
                "isLogged" => $this->isLogged() ? true : false
            ]);
        }

        public function isLogged()
        {
            $authToken  = $this->checkBearerIsValid();
            
            $userId     = JWT::decode( $authToken )->userId;
            $userExists = (new User)->findById( $userId );

            return $userExists ? $userExists : false;
        }
        

        private function createJWT( string $secretKey, int $minutesToExpire, int $userId )
        {
            $currentDateTime = new \DateTime();
            $currentDateTime->format('Y-m-d H:i:s');

            $expireTokenDateTime = $currentDateTime->modify("+{$minutesToExpire} minutes");

            $payload = [
                'exp'    => $expireTokenDateTime->getTimestamp(),
                'userId' => $userId
            ];

            return JWT::encode($secretKey, $payload, "HS256");
        }

        private function createAuthTokenJWT(int $userId)
        {
            $secretKey = Env::get("JWT_AUTH");

            return $this->createJWT( $secretKey, self::JWT_AUTH_EXPIRE, $userId );
        }

    }