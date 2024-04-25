import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";
function Sidebar(props) {
  const { isLoggedIn } = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (isLoggedIn !== null && user !== null) {
    // user_permissions=user.permissions.data.map((item)=>{
    //     return item.name;
    // })
  }

  return (
    <>
      <div className="col-auto col-md-3 col-lg-2   bg-sidebar">
        <strong className="logo">
          <img src={logo} />
        </strong>
        <div className=" nav flex-column">
          <ul className="nav nav-pills flex-column" id="menu">
              <li>
                <NavLink
                  activeclassname="is-active"
                  to="/"
                  className="nav-link px-0 align-middle mb-1 "
                >
                  <i className="fa fa-dashboard "></i>{" "}
                  <span className="ms-1 d-none d-sm-inline ">Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeclassname="is-active"
                  to="/forms"
                  className="nav-link px-0 align-middle mb-1 "
                >
                  <i className="fa fa-list-alt"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline ">Formularios</span>
                </NavLink>
              </li>
            {user.roleId=== 1 ? (
              <>
              <li>
                <NavLink
                  activeclassname="is-active"
                  to="/users"
                  className="nav-link px-0 align-middle mb-1 "
                >
                  <i className="fa fa-user"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline ">Usuarios</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeclassname="is-active"
                  to="/signature"
                  className="nav-link px-0 align-middle mb-1 "
                >
                  <i className="fa fa-pencil"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline ">Firmas</span>
                </NavLink>
              </li>
              </>
              
            ) : (
              ""
            )}
              <li>
                <NavLink
                  activeclassname="is-active"
                  to="/fills"
                  className="nav-link px-0 align-middle mb-1 "
                >
                  <i className="fa fa-book"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline ">Formularios Diligenciados</span>
                </NavLink>
              </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
