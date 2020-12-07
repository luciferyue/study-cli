import React, { forwardRef, useContext } from "react";
import classnames from "classnames";
import Context from "./context";

function pulldown(props, ref) {
  const { pullDownRefreshConfig, pullDownTheme, pullingDownState } = props;
  const cls = classnames("refresh-icon", pullingDownState == 3 ? " rotate" : "");
  const { bScroll } = useContext(Context);
  console.log(bScroll);
  const finishedImg = require(pullDownTheme === 2 ? "./imgs/pullingDown2.gif" : "./imgs/pullingDown1.gif") + `?ts=${new Date().getTime()}`;

  let component = (
    <div className={cls} ref={ref}>
      <img className="img" width="100%" src={require(pullDownTheme === 2 ? "./imgs/pullingDown2.png" : "./imgs/pullingDown1.png")} alt="" />
    </div>
  );
  if (pullingDownState === 4) {
    component = (
      <div className="finished-icon">
        <img className="img" width="100%" src={finishedImg} alt="" />
      </div>
    );
  }

  return (
    <div className="scroll-pulldown-wrapper">
      {component}
      <p className="pulldown-desc">{pullDownRefreshConfig.stateTxt[pullingDownState]}</p>
    </div>
  );
}

export default forwardRef(pulldown);
