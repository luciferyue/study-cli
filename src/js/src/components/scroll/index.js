import React, { forwardRef, useEffect, useState, useRef } from "react";
import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";
// import BScroll from "better-scroll";
import PropTypes from "prop-types";
import classnames from "classnames";
// import platform from "gatling-utils/lib/platform";
// import { isBrowser } from "@src/utils/tools";
import Pulldown from "./pulldown";
import Pullup from "./pullup";
import "./index.css";
import Context from "./context";

//倒入插件
BScroll.use(PullDown);
/**
 * 滚动组件，支持下拉刷新，上拉加载
 */
function scrollView(props, ref) {
  const { className, children, needPullDownRefresh, needPullUpload, probeType, bounce, eventPassthrough, pullDownRefreshConfig, pullUploadConfig, scrollX, scrollY, onPullingDown, pullingUploadFinished, isLast } = props;

  const [pullingDownState, setPullingDownState] = useState(1);
  // const [bScroll, setBscroll] = useState(null);
  // const [pullingUpState, setPpullingUpState] = useState(1);

  //下拉刷新图标
  const pulldownRotateIcon = useRef(null);

  const cls = classnames("scroll-view", className);

  let bScroll = null;
  useEffect(() => {
    bScroll = new BScroll(ref.current, {
      scrollX: scrollX,
      scrollY: scrollY,
      probeType: probeType,
      bounce: bounce,
      click: false,
      tap: false,
      eventPassthrough: eventPassthrough,
      preventDefault: true,
      swipeBounceTime: 450,
      pullDownRefresh: needPullDownRefresh ? pullDownRefreshConfig : false,
      pullUpLoad: needPullUpload ? pullUploadConfig : false,
    });
    needPullDownRefresh && _bindPullingDownEvent();
    // needPullUpload && _bindPullingUploadEvent();
  }, []);

  //下拉刷新事件绑定
  const _bindPullingDownEvent = () => {
    bScroll.on("scroll", _pullingDownScrollHandle);
    bScroll.on("pullingDown", _pullingDownHandle);
  };

  //触发下拉刷新事件，回调，改变下拉状态为刷新中
  const _pullingDownHandle = () => {
    //判断上拉加载是否正在进行中， 如果有直接结束当前下拉操作
    if (!pullingUploadFinished) {
      finishedPullDown();
    } else {
      //没有正在进行上拉加载数据
      setPullingDownState(3);
      onPullingDown && onPullingDown();
    }
  };

  //下拉加载完成，监听滚动结束事件
  const finishedPullDown = () => {
    //设置下拉状态为完成
    setPullingDownState(4);

    if (!isLast && needPullUpload && !bScroll.pullupWatching) {
      bScroll.openPullUp();
    }

    //等待icon动画完成后，并且监听scrollEnd事件
    setTimeout(() => {
      bScroll.finishPullDown();
      bScroll.on("scrollEnd", _finishedPullDownScrollEndHandle);
    }, 1150);
  };

  //下拉加载完成并动画结束后设置状态还原
  const _finishedPullDownScrollEndHandle = () => {
    //将下拉刷新还原至初始化状态
    setPullingDownState(1);
    //设置旋转角度
    if (pulldownRotateIcon.current) {
      pulldownRotateIcon.current.style.webkitTransform = "rotate(0deg)";
    }

    bScroll.refresh();
    //解除绑定事件
    bScroll.off("scrollEnd", _finishedPullDownScrollEndHandle);
  };

  //下拉过程中，通过Y值来计算状态
  const _pullingDownScrollHandle = (pos) => {
    console.log(pullingDownState);
    //当状态为1或者2的时候计算旋转角度
    if (pullingDownState === 1 || pullingDownState === 2) {
      const h = pullDownRefreshConfig.stop;
      const threshold = pullDownRefreshConfig.threshold;
      //根据下拉距离计算 icon旋转角度
      const rotate = (pos.y / h) * 135;
      //设置旋转角度
      if (pulldownRotateIcon.current) {
        pulldownRotateIcon.current.style.webkitTransform = "rotate(" + rotate + "deg)";
      }
      //比较下拉距离 及 触发下拉刷新临界值， 设置当前状态
      const currentState = pos.y < threshold ? 1 : 2;
      //截流  判断当前状态是否 和 之前状态 是否一致
      if (currentState === pullingDownState) return;
      setPullingDownState(currentState);
    }
  };

  const logState = () => {
    // console.log(pullingDownState);
  };

  console.log(bScroll);

  return (
    <Context.Provider
      value={{
        bScroll,
      }}
    >
      <div className={cls} ref={ref}>
        <div className="scroll-content" onClick={() => logState()}>
          {needPullDownRefresh && <Pulldown {...props} ref={pulldownRotateIcon} pullingDownState={pullingDownState} />}
          {children}
          {needPullUpload && <Pullup {...props} pullingDownState={pullingDownState} />}
        </div>
      </div>
    </Context.Provider>
  );
}

const ScrollView = forwardRef(scrollView);

ScrollView.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onPullingDown: PropTypes.func,
  onPullingUpload: PropTypes.func,
  swipeBounceTime: PropTypes.number,
  click: PropTypes.bool,
  tap: PropTypes.bool,
  preventDefaultException: PropTypes.object,
  probeType: PropTypes.number,
  pullDownRefreshConfig: PropTypes.object,
  pullUploadConfig: PropTypes.object,
  pullingDownFinished: PropTypes.bool,
  pullingUploadFinished: PropTypes.bool,
  showBrand: PropTypes.bool,
  isLast: PropTypes.bool,
  children: PropTypes.any,
  needPullUpload: PropTypes.any,
  needPullDownRefresh: PropTypes.any,
  scrollX: PropTypes.bool,
  scrollY: PropTypes.bool,
  eventPassthrough: PropTypes.string,
  bounce: PropTypes.bool,
  showLastTips: PropTypes.bool,
  onScroll: PropTypes.func,
  pullDownTheme: PropTypes.oneOf([1, 2]),
};

ScrollView.defaultProps = {
  className: "", //样式名
  scrollX: false,
  scrollY: true,
  onPullingDown: null, //下拉刷新事件
  onPullingUpload: null, //上拉加载事件
  probeType: 3, //srcoll事件触发机制
  click: true, //是否允许click事件
  tap: false, //是否允许tap事件
  swipeBounceTime: 450,
  needPullDownRefresh: false, //是否开启下拉刷新
  needPullUpload: false, //是否开始上拉加载
  bounce: true, //默认就开启了
  useTransition: true, //默认就开启了
  eventPassthrough: "horizontal", //可以不要
  pullDownRefreshConfig: {
    //下拉刷新配置
    threshold: 80, //临界值，触发点
    stop: 80,
    stateTxt: {
      1: "下拉刷新",
      2: "松开刷新",
      3: "正在刷新...",
      4: "刷新完成",
    },
  },
  pullUploadConfig: {
    //上拉加载配置
    threshold: 50, //临界值，触发点
    stateTxt: {
      1: "上拉加载",
      2: "加载中...",
      3: "已全部加载完成",
    },
  },
  pullingDownFinished: true, //下拉刷新是否已完成
  pullingUploadFinished: true, //上拉加载是否已完成
  showBrand: false, //是否显示品牌露出
  showLastTips: false, //是否显示已加载全部提示
  isLast: false, //上拉加载开启生效，是否最后一页
  onScroll: null,
};

export default ScrollView;
