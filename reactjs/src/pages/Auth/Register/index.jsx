import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import API from '../../../helpers/api';
import Sanitize from '../../../helpers/sanitize';

import InputFloating from '../../../components/form/input/floating';
import ContainerAuthBox from '../../../components/container/ContainerAuthBox';
import AlertClosable from '../../../components/Alert/closable';

function Register() {

  const navigate = useNavigate();

  const [warning,  setWarning]  = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [buttonLoading,   setButtonLoading]   = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const validateFormValues = () => {
    const { email, password, password_confirmation } = formData;
    enableButtonSubmit(email, password, password_confirmation);
  };

  const enableButtonSubmit = (email, password, password_confirmation) => {
    const isValidEmail = Sanitize.isValidEmail(email);
    const isPasswordValid = password.length >= 6;
    const passwordsMatch = password === password_confirmation;
    return isValidEmail && isPasswordValid && passwordsMatch;
  };

  const cleanFormInputs = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      password: '',
      password_confirmation: '',
    }));
  };

  const onSignUp = async (e) => {
    e.preventDefault();

    setWarning(null);
    setButtonLoading(true);
    cleanFormInputs();

      const response = await API.sendRequestToAPI('POST', 'auth/sign-up', formData);
      setButtonLoading(false);

      if (response.data.status !== 'success') {
         setWarning(response.data.message || 'ocorreu um erro inesperado.');
         setRegisterSuccess(false);
         return;
      }

      setRegisterSuccess(true);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
        return (await API.isLogged() ? navigate('/dashboard') : null);
    };
    checkAuthentication();
}, []);

  return (
    <ContainerAuthBox title="Cadastrar-se">

        {registerSuccess && (
            <AlertClosable
            color={"success"}
            message={"Feito! Realize o login para continuar"}
        />
      )}

      {warning && (
        <AlertClosable
          onClose={() => setWarning(null)}
          title="Ops!"
          message={warning}
        />
      )}

      <form className={registerSuccess ? "d-none" : ""}  onChange={validateFormValues} onSubmit={onSignUp}>
        <div className="mb-3">
          <InputFloating
            type="text"
            label="Nome"
            isRequired={true}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <InputFloating
            type="email"
            label="Email"
            isRequired={true}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <InputFloating
            type="password"
            label="Senha"
            isRequired={true}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <InputFloating
            type="password"
            label="Confirme a Senha"
            isRequired={true}
            value={formData.password_confirmation}
            onChange={(e) =>
              setFormData({
                ...formData,
                password_confirmation: e.target.value,
              })
            }
          />
        </div>
        <div className="d-grid">
          <button
            type="submit"
            className={`btn btn-info m-b-xs`}
            disabled={!enableButtonSubmit(
              formData.email,
              formData.password,
              formData.password_confirmation
            )}
          >
            {buttonLoading ? (
              <span
                className="spinner-border spinner-border-sm mr-5"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              'Continuar'
            )}
          </button>
        </div>
      </form>
      <div className="authent-reg">
        <p>
          Já tem uma conta? <Link to={'/login'}>Faça o login</Link>
        </p>
      </div>
    </ContainerAuthBox>
  );
}

export default Register;
