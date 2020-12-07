import React from "react";
import { withRouter } from "react-router";
// import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Context from "./context";

function Container(props) {
  const { children } = props;
  // const { loading } = useSelector((state) => state.commonReducer);
  // const dispatch = useDispatch();

  const showDialog = () => {
    console.log("showDialog");
  };

  const destroyDialog = () => {
    console.log("destroyDialog");
  };

  const showToast = () => {
    console.log("showToast");
  };

  const destroyToast = () => {
    console.log("destroyToast");
  };

  const updateLoading = () => {
    console.log("updateLoading");
  };

  return (
    <Context.Provider
      value={{
        history,
        showDialog: showDialog,
        destroyDialog: destroyDialog,
        showToast: showToast,
        destroyToast: destroyToast,
        updateLoading: updateLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
}

Container.propTypes = {
  children: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(Container);
