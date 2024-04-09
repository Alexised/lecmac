import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import illustration from "../../assets/logoImg.svg";
import logo from "../../assets/logo.jpg";
import axios from "axios";

const Login = ({ childern }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [user, setUser] = useState("");
  const [errors, setErrors] = useState([]);
  var [screen, setScreen] = useState(1);
  const navigate = useNavigate();
  const countdownTime = 1 * 60; // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(countdownTime);

  const handleLogin = () => {
    try {
      setErrors([]);
      setUser("");
      const newErrors = {}; // Initialize empty error object

      // Email validation (using a regular expression for more robust validation)
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        newErrors.email = "Por favor, ingrese una correo electrónico válido..";
      }

      // Password validation (encourage strong passwords)
      if (password.length < 3) {
        newErrors.password = "La contraseña debe tener al menos 3 caracteres.";
      }
      setErrors(newErrors);
      let url = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_LOGIN_URL;
      if (Object.keys(newErrors).length === 0) {
        axios
          .post(url, {
            email,
            password,
          })
          .then((res) => {
            let token = res.data.token;
            localStorage.setItem("token", "Bearer " + token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            window.location.reload();
          })
          .catch((err) => {
            if (err.response.data.errors.length == 0) {
              err.response.data.errors["password"] = err.response.data.message;
              setErrors(err.response.data.errors);
            } else {
              setErrors(err.response.data.message);
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
                <h2 >Iniciar Sesión </h2>
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
                  onClick={handleLogin}
                  className=" btn btn-primary btn-lg w-100"
                >
                  Iniciar sesión
                </button>
                <a style={{color:'#27AE60'}} href="/forgot-password" className="forgot-password-link">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
