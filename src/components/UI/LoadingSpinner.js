import React from "react";

const LoadingSpinner = ({ text }) => {
  return (
    <>
      <div className="loading-spinner" />
      {text && <span>{text}</span>}
    </>
  );
};

export default LoadingSpinner;
