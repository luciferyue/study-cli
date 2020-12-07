import React from "react";
import classnames from "classnames";

function Pullup(props) {
  const { needPullUpload, isLast, showLastTips, showBrand, pullingUpState, pullUploadConfig } = props;
  // 默认开启漏出加载全部，且 开启上拉加载 ，且是最后一页
  if (showLastTips && needPullUpload && isLast) {
    return <div className="bottom-brand-load-all" />;
  } else if (showBrand && this.isNativeApp && (!needPullUpload || (needPullUpload && isLast))) {
    // 开启了底部品牌露出 且 （未开启上拉加载 或者 开始了上拉加载且最后一页 && 只在给到中）
    return <div className="bottom-brand-container" />;
  } else if (needPullUpload && !isLast) {
    //开启上拉加载
    const cls = classnames("refresh-icon", pullingUpState === 2 ? "rotate" : "");
    return (
      <div className="scroll-pullup-wrapper">
        <div className={cls}>
          <img className="img" width="100%" src={require("./imgs/pullingDown1.png")} alt="" />
        </div>
        <p className="pullup-desc">{pullUploadConfig.stateTxt[pullingUpState]}</p>
      </div>
    );
  } else {
    //未开启底部品牌露出 且 未开启上拉加载
    return null;
  }
}

export default Pullup;
