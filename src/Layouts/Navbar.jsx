import React from "react";
import { Button } from "antd";
import { PoweroffOutlined } from '@ant-design/icons';
function Navbar() {
  let user = JSON.parse(localStorage.getItem("user"));
  user == null ? window.location.reload() : (user.name = user.email);
  let image_source =
    "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" +
    user.email +
    "&rounded=true";
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid d-flex justify-content-end">
          <div>
            <img src={image_source} width="30" height="30" /> {user.name}
          </div>
          <div>
            <Button
              style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '#1C4008', borderColor: '#1C4008'}}
              type="primary"
              icon={<PoweroffOutlined />}
              onClick={logout}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
