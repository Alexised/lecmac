import axios from "axios";
import Swal from "sweetalert2";

axios.interceptors.request.use(
(config)=>{
    var loader = document.getElementById('loader');
    loader.classList.remove("d-none");

    config.headers.Authorization = localStorage.getItem('token');
        return config;
    }
)
axios.interceptors.response.use(

    (response)=>{
        var loader = document.getElementById('loader');
        loader.classList.add("d-none");
        if(response.data.status=== 401){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            Swal.fire("Error","Your session has expikred","error");
            setTimeout(()=>{window.location.reload()},800);

        }
        return response
    },
    (error)=>{
        var loader = document.getElementById('loader');
        loader.classList.add("d-none");
        if(error.response.status===401){
            if (localStorage.getItem('token')!==null) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                Swal.fire("Error","Your session has pired","error");
                setTimeout(()=>{window.location.reload()},800);
            }
            else
            {
                Swal.fire("Error","Datos de inicio de sesion incorrectos","error");
                
            }
        }
        else if(error.response.status===403){
            Swal.fire("Error","Sorry! You are not authorized to perform this action","error");
            axios.get(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_PROFILE_URL)
                .then((responseUser) => {
                    //  localStorage.setItem("token","Bearer "+token);
                    localStorage.removeItem("user");
                    localStorage.setItem("user", JSON.stringify(responseUser.data.data));


                }).catch((err) => {
            })
        }
        return Promise.reject(error);
    }
)
export default axios;