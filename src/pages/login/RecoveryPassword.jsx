import { useParams } from 'react-router-dom';
import { useLocation, Route, Routes } from 'react-router-dom';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import illustration from "../../assets/logoImg.svg";
import logo from "../../assets/logo.jpg";
import axios from "axios";
import { useSnackbar } from 'notistack';

const RecoveryPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  var [screen, setScreen] = useState(1);
  const navigate = useNavigate();
  const countdownTime = 1 * 60; // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(countdownTime);
  const { enqueueSnackbar } = useSnackbar();

  // Aquí puedes usar el token para procesar el cambio de contraseña
  // ...
  const handleRecoveryPassword = () => {
    try {
      setErrors([]);
      const newErrors = {}; // Initialize empty error object

      // Password validation (encourage strong passwords)
      if (password.length < 3) {
        newErrors.password = "La contraseña debe tener al menos 3 caracteres.";
      }
      setErrors(newErrors);
      let url = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_RECOVER_PASSWORD_URL;
      if (Object.keys(newErrors).length === 0) {
        axios
          .post(url, {
            token,
            password,
          })
          .then((res) => {
            enqueueSnackbar('Contraseña recuperada', { variant: 'success' }); 
            navigate("/login");
          })
          .catch((err) => {
            if (err.response.data.errors.length == 0) {
              err.response.data.errors["password"] = err.response.data.message;
              setErrors(err.response.data.errors);
              enqueueSnackbar('Error al cambiar contraseña intente nuevamente', { variant: 'error' }); 

            } else {
              setErrors(err.response.data.message);
              enqueueSnackbar('Error al cambiar contraseña intente nuevamente', { variant: 'error' }); 

            }
          });
      }
    } catch (error) {
      if (localStorage.getItem("token") !== null) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  };
  return (
    <div>
      <section
        className="vh-100"
        style={{ backgroundColor: "#f5f5f5", overflow: "hidden" }}
      >
        <div className="container py-5 h-100">
          <div className="row d-flex align-items-center justify-content-center h-100">
            <div className="col-md-8 col-lg-7 col-xl-6">
              <img src={illustration} className="img-fluid" alt="Phone image" />
            </div>
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
              <div
                className="login-block move-right"
              >
                <img className="logo-login" src={logo} width="150px" />
                <h2 >Recuperar Contraseña</h2>
                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="password"
                    placeholder="Ingresa tu contraseña"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="text-danger">{errors["password"]}</span>
                </div>
                <button
                  onClick={handleRecoveryPassword}
                  className=" btn btn-primary btn-lg w-100"
                >
                  Iniciar sesión
                </button>
                <a style={{color:'#27AE60'}} href="/login" className="forgot-password-link">
                  Iniciar sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecoveryPassword;