import React from 'react';

function Dashboard(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <h5 className="text-center py-5">Welcome {user.name}</h5>
    </>
  );
}

export default Dashboard;