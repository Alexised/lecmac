import React from 'react';
import Sidebar from "../Layouts/Sidebar.jsx";
import Navbar from "../Layouts/Navbar.jsx";


function Main(props) {
    return (
        <>
            <Navbar></Navbar>
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <Sidebar></Sidebar>
                    <div className="col py-3 main-part">
                        {props.component}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;