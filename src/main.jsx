import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'font-awesome/css/font-awesome.min.css';
import {BrowserRouter} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


ReactDOM.createRoot(document.getElementById('root')).render(

      <BrowserRouter>
          <App></App>
      </BrowserRouter>

)
