<?php

    namespace App\Controllers;
    use App\Core\Controller;
    use App\Helpers\Sanitize;
    use App\Models\User;
    use App\View\View;

    class UserController extends Controller {

        /**
         * Router:
         * GET "/user"
         */
        public function renderLoggedData()
        {
            parent::setAccessToEndpoint(1);

            $userId    = (int) $this->userLogged->id;
            $userData  = (new User)->findById($userId);

            return View::renderJson([
                "status" => "success",
                "user"   => $userData ?? []
            ]);
        }

        private function isEmailExists(string $email)
        {
            $email = Sanitize::email( $email );
            $user  = (new User)->findByEmail( $email );

            return isset($user->id);
        }

        public function create()
        {
            $dataRequest = $this->checkDataRequest(requiredFields: ['name', 'email', 'password', 'password_confirmation']);

            $dataRequest['name'] = Sanitize::peopleName($dataRequest['name']);

            if (!$dataRequest['password'] === $dataRequest['password_confirmation']) {
                throw new \InvalidArgumentException("as senhas não são iguais");
            }

            if (mb_strlen($dataRequest['password']) < 5) {
                throw new \InvalidArgumentException("senha muito curta. Minimo: 6 caracteres");
            }
           
            if ($this->isEmailExists($dataRequest['email'])) {
                throw new \InvalidArgumentException("este email já está sendo usado.");
            }

            $userRegisterId = (new User)->registerWithInitialData( $dataRequest );

            if (!$userRegisterId) {
                throw new \PDOException("não foi possível salvar os dados do usuário.");
            }

            return View::renderJson([
                "status" => "success",
                "id"     => $userRegisterId
            ]);            
        }


    }