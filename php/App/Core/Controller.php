<?php

    namespace App\Core;

    use App\Controllers\AuthenticationController;
    use App\Exceptions\AuthorizationException;
    use App\Helpers\Env;
    use App\Helpers\JWT;

    abstract class Controller {

        protected int       $endpointAccess;
        protected array     $dataRequest;
        protected string    $authorizationBearer;
        protected           $userLogged = null;
        
        /**
         * Responsável por capturar o token JWT "Authorization Bearer" do cabeçalho da requisição.
         */
        function __construct()
        {
            $headers = getallheaders();

            if (!isset($headers['Authorization'])) {
                throw new \App\Exceptions\AuthorizationException("Authorization Bearer não foi encontrado no header da requisição.");
            }

            $this->authorizationBearer = str_replace('Bearer ', '', $headers['Authorization']);
            $this->authorizationBearer = htmlspecialchars(trim($this->authorizationBearer));
        }

        public function checkBearerIsValid()
        {
            $authTokenIsValid = JWT::validate(Env::get("JWT_AUTH"), $this->authorizationBearer);

            if (!$authTokenIsValid) {
                throw new AuthorizationException("Bearer token não é válido.");
            }

            return $this->authorizationBearer;
        }

        protected function checkDataRequest(array $requiredFields = null)
        {
            $data = json_decode(file_get_contents('php://input'), true)['data'] ?? false;

            if (!$data) {
                throw new \InvalidArgumentException("nenhum dado enviado na requisição.");
            }

            if ($requiredFields) {
                foreach ($requiredFields as $key) {
                    if (!isset($data[$key])) {
                        $values = implode(", ", $requiredFields);
                        throw new \InvalidArgumentException("({$values}). São dados obrigatórios.");
                    }
                }
            }

            return $this->dataRequest = $data;
        }

        public function setAccessToEndpoint(int $access)
        {
            $this->endpointAccess = $access;
            return $this->checkUserHaveAccess();
        }


        private function checkUserHaveAccess()
        {
            if ($this->endpointAccess === 0) {
                return true;
            }

            $this->userLogged = (new AuthenticationController)->isLogged();

            if (!$this->userLogged OR $this->userLogged->access < $this->endpointAccess) {
                return false;
            }
        }

    }
