import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";

/**
 * 下拉刷新状态码1，2，3，4
 * 1:默认状态
 * 2:下拉中状态
 * 3:触发下拉，数据加载中状态
 * 4:下拉完成动画
 */

function pulldown(props) {
  const { pullDownRefreshConfig, pullDownTheme, posY, pullingDownState } = props;
  const [pullingState, setPullingState] = useState(1);
  const rotateIcon = useRef(null);

  useEffect(() => {
    if (pullingDownState === 1 || pullingDownState === 4) {
      if (rotateIcon.current) {
        rotateIcon.current.style.webkitTransform = "rotate(0deg)";
      }
    }
    setPullingState(pullingDownState);
  }, [pullingDownState]);

  useEffect(() => {
    if (pullingState === 1 || pullingState === 2) {
      const h = pullDownRefreshConfig.stop;
      const threshold = pullDownRefreshConfig.threshold;
      //根据下拉距离计算 icon旋转角度
      const rotate = (posY / h) * 135;
      //设置旋转角度
      if (rotateIcon.current) {
        rotateIcon.current.style.webkitTransform = "rotate(" + rotate + "deg)";
      }
      //比较下拉距离 及 触发下拉刷新临界值， 设置当前状态
      const currentState = posY < threshold ? 1 : 2;
      //截流  判断当前状态是否 和 之前状态 是否一致
      if (currentState === pullingState) return;
      setPullingState(currentState);
    }
  }, [posY]);

  const cls = classnames("refresh-icon", pullingState == 3 ? " rotate" : "");
  let component = (
    <div className={cls} ref={rotateIcon}>
      <img className="img" width="100%" src={require(pullDownTheme === 2 ? "./imgs/pullingDown2.png" : "./imgs/pullingDown1.png")} alt="" />
    </div>
  );
  if (pullingState === 4) {
    const finishedImg = require(pullDownTheme === 2 ? "./imgs/pullingDown2.gif" : "./imgs/pullingDown1.gif") + `?ts=${new Date().getTime()}`;
    component = (
      <div className="finished-icon">
        <img className="img" width="100%" src={finishedImg} alt="" />
      </div>
    );
  }

  return (
    <div className="scroll-pulldown-wrapper">
      {component}
      <p className="pulldown-desc">{pullDownRefreshConfig.stateTxt[pullingState]}</p>
    </div>
  );
}

export default pulldown;
