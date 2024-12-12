import React from 'react';
import "../styles/custom.css"
export default function LoadingPage() {


  return (
    <div className="container mt-3">
      <div className="row h-100 p-2" >
        <div className="lds-dual-ring" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}> <h2>Loading...</h2></div>
      </div>
    </div>
  );
};