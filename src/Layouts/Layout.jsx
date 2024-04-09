import React from 'react';
import Main from "../components/Main.jsx";

function Layout({ childern }) {
  return (
    <div>
      <Main>
        {childern}
      </Main>
    </div>
  );
}

export default Layout;