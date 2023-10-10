import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

function Logout() {

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken");
    navigate('/login');
}, []);

}

export default Logout;