import React from "react";

import "./loadingSpinner.css";

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
      <div className={props.className}></div>
    </div>
  );
};

export default LoadingSpinner;
