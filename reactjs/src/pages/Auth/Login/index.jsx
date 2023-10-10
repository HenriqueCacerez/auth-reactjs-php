import React, { useEffect, useState } from 'react'
import { useNavigate, Link }          from 'react-router-dom';

import API              from '../../../helpers/api';
import Sanitize         from '../../../helpers/sanitize';

import InputFloating    from '../../../components/form/input/floating'
import ContainerAuthBox from '../../../components/container/ContainerAuthBox';
import AlertClosable    from '../../../components/Alert/closable';

function Login() {

    const navigate = useNavigate();

    const [warning, setWarning] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);

    const [formData, setFormData] = useState({
        email:    '',
        password: ''
    });

    const validateFormValues = () => {
        const { email, password, password_confirmation } = formData;
        enableButtonSubmit(email, password, password_confirmation);
    };

    const enableButtonSubmit = (email, password) => {
        const isValidEmail = Sanitize.isValidEmail(email);
        const isPasswordValid = password.length >= 6;
        return isValidEmail && isPasswordValid;
    };

    const cleanFormInputs = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            password: ''
        }));
    };

    const onSignIn = async (e) => {
        e.preventDefault();

        setWarning(null);
        setButtonLoading(true);
        cleanFormInputs();

        const response = await API.sendRequestToAPI('POST', 'auth/sign-in', formData);
        setButtonLoading(false);

        if (response.data.status !== 'success') {
            setWarning(response.data.message || 'ocorreu um erro inesperado.');
            return;
        }

        localStorage.setItem("authToken", response.data.authToken);
        navigate('/dashboard');
    }

    useEffect(() => {
        const checkAuthentication = async () => {
            return (await API.isLogged() ? navigate('/dashboard') : null);
        };
        checkAuthentication();
    }, []);

    return (
        <>
            <ContainerAuthBox title="Login">

                {
                    warning && (
                        <AlertClosable onClose={() => setWarning(null)}
                            title={"Ops!"}
                            message={warning}
                        />
                    )
                }

                <form onChange={validateFormValues} onSubmit={onSignIn}>
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
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div className="d-grid">
                        <button
                            type="submit"
                            className={`btn btn-info m-b-xs`}
                            disabled={!enableButtonSubmit(
                                formData.email,
                                formData.password
                            )}
                        >
                            {buttonLoading ? (
                                <span className="spinner-border spinner-border-sm mr-5"></span>
                            ) : (
                                'Continuar'
                            )}
                        </button>
                    </div>
                </form>
                <div className="authent-reg">
                    <p>Não tem uma conta? <Link to={'/register'}>Cadastre-se</Link></p>
                </div>
            </ContainerAuthBox>
        </>
    )
}

export default Login