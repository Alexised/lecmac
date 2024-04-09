import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Router from "./router/router.jsx";
import React, { useState } from "react";
import Main from "./components/Main.jsx";
import "./helpers/requestInterceptor.jsx";
import { SnackbarProvider } from "notistack";
function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token')!==null?true:false);
  const userDetail = (localStorage.getItem('user')!==null?JSON.parse(localStorage.getItem('user')):null);
  const loaderSizeStyle={
      width: "3rem",
      height: "3rem"
  }
const showLoder = () =>{
  var loader = document.getElementById('loader');
  loader.style.display = "visible";
}
  const hideLoder = () =>{
      var loader = document.getElementById('loader');
      loader.style.display = "hidden";
  }
  return (
  <>
      <div id="loader" className="d-flex loader d-none justify-content-center">
          <div className="spinner-border text-primary" style={loaderSizeStyle} role="status">
              <span className="visually-hidden">Loading...</span>
          </div>
      </div>
      <Router isLoggedIn={isLoggedIn} user={user} setIsLoggedIn={setIsLoggedIn}></Router>
  </>
)
}

export default App