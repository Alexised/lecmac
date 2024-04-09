import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import illustration from "../../assets/logoImg.svg";
import logo from "../../assets/logo.jpg";
import axios from "axios";
import { useSnackbar } from 'notistack';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const handleSubmit = () => {
    try {
      setErrors([]);
      const newErrors = {};

      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        newErrors.email = "Por favor, ingrese una correo electrónico válido..";
      }
      setErrors(newErrors);
      let url = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_RECOVER_URL;
      if (Object.keys(newErrors).length === 0) {
        axios
          .post(url, {
            email,
          })
          .then((res) => {
            console.log("Correo enviado exitosamente")
            enqueueSnackbar('Correo enviado exitosamente', { variant: 'success' }); 
          })
          .catch((err) => {
            console.log(err)
            setErrors(err.response.data.message);
            enqueueSnackbar('Error al enviar correo intente nuevamente', { variant: 'error' }); 

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
                    type="email"
                    value={email}
                    id="email"
                    placeholder="Ingresa tu correo"
                    className="form-control form-control-lg"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="text-danger">{errors["email"]}</span>
                </div>
                <button
                  onClick={handleSubmit}
                  className=" btn btn-primary btn-lg w-100"
                >
                  Enviar correo de recuperación
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

export default ForgotPassword;
