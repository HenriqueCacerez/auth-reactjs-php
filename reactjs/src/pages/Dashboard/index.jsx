import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

import API from '../../helpers/api';

function Dashboard() {

  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    
    const captureUserData = async () => {
        const user = await API.getUserLoggedData();
        return (!user ? navigate('/login') : setUserData( user ));
    }  
    captureUserData();
}, []);


  return (
    <>
      <div className='d-flex py-5 justify-content-center'>

        {userData && (
          <div className='d-block text-center'>

            <h1>Olá,   {userData.name}!</h1>
            <h2 className='text-muted'>{userData.email}</h2>

            {
              userData.access >= 2 && (
                <div className='mt-5'>
                  <h3 className='fw-bold text-danger'>logado como admin</h3>
                </div>
              )
            }

          <div className='mt-5'>
            <Link className={`btn btn-danger m-b-xs`} to={'/logout'}>Desconectar-se</Link>
          </div>

          </div>
        )}

      </div>
    </>
  )
}

export default Dashboard;