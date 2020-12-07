import React, { Component } from "react";
import Bscroll from "better-scroll";
import PropTypes from "prop-types";
import classnames from "classnames";
import platform from "gatling-utils/lib/platform";
import { isBrowser } from "@src/utils/tools";
import "./index.css";

/**
 * 滚动组件，支持下拉刷新，上拉加载
 */

class ScrollView extends Component {
  constructor(props) {
    super(props);
    this.bScroll = null;
    this.isNativeApp = isBrowser() && platform.isNativeApp();
    this.state = {
      pullingDownState: 1,
      pullingUpState: 1,
    };
    this.scrollWrapper = React.createRef();

    this.isIosVerLgThan1304 = this.isIosVerLgThan1304Fn();
    this.isTouching = false;
    this.scrollYBottom = 0; //滚动到底部的最大值
    this.isPullingDown = false;
    this.isPullingUp = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //判断 开启下拉刷新 且 不是首次下拉 且 下一次的下拉状态为完成 且当前下拉状态为未完成    触发完成下拉动作
    if (this.props.needPullDownRefresh && nextProps.pullingDownFinished && !this.props.pullingDownFinished) {
      this.finishedPullDown();
    }
    //console.log(this.props.needPullUpload, nextProps.pullingUploadFinished, this.props.pullingUploadFinished)
    //判断 开启上拉加载 且 下一次的上拉状态为完成 且 当前上拉状态为未完成  触发完成上拉动作
    if (this.props.needPullUpload && nextProps.pullingUploadFinished && !this.props.pullingUploadFinished) {
      this.finishedPullUp();
    }

    //多个数据共用一个scroll时，解决isLast冲突问题
    if (this.props.needPullUpload && this.props.isLast && !nextProps.isLast) {
      this.bScroll.openPullUp();
    }

    /*if (nextProps.isLast && nextProps.needPullUpload) {
    this.bScroll && this.bScroll.closePullUp();
  }*/
  }

  componentDidMount() {
    const { scrollX, scrollY, probeType, pullDownRefreshConfig, pullUploadConfig, needPullDownRefresh, needPullUpload, isLast, eventPassthrough, bounce, onScroll } = this.props;
    //初始化bScroll
    this.bScroll = new Bscroll(this.scrollWrapper.current, {
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

    needPullDownRefresh && this._bindPulllingDownEvent();
    needPullUpload && this._bindPullingUploadEvent();

    if (onScroll) this.bScroll.on("scroll", onScroll);
    this.pulldownRotateIcon = React.createRef();

    if (isLast && needPullUpload) {
      this.bScroll && this.bScroll.closePullUp();
    }

    this.isIosVerLgThan1304 && this.bindIos1304Event();
  }

  componentDidUpdate() {
    const { isLast, needPullUpload } = this.props;
    isLast && needPullUpload && this.bScroll.closePullUp();
  }

  componentWillUnmount() {
    this.bScroll.destroy();
    this.isIosVerLgThan1304 && this.unbindIos1304Event();
  }

  bindIos1304Event = () => {
    this.scrollYBottom = this.bScroll.wrapperHeight - this.bScroll.scrollerHeight;
    this.bScroll.on("scroll", this.onScrollIos1304);
    this.scrollWrapper.current.addEventListener("touchstart", this.onTouchStartHandleIos1304);
    this.scrollWrapper.current.addEventListener("touchend", this.onTouchEndHandleIos1304);
  };

  unbindIos1304Event = () => {
    this.scrollWrapper.current.removeEventListener("touchstart", this.onTouchStartHandleIos1304);
    this.scrollWrapper.current.removeEventListener("touchend", this.onTouchEndHandleIos1304);
  };

  onScrollIos1304 = (pos) => {
    if (pos.y <= 0 && this.isPullingDown) {
      this.isPullingDown = false;
    }

    if (pos.y >= this.scrollYBottom && this.isPullingUp) {
      this.isPullingUp = false;
    }

    if (this.isTouching) return;

    //兼容ios 13.4
    if (!this.isPullingDown && pos.y >= -1) {
      this.scrollYTo(0, 0);
      return;
    }
    if (!this.isPullingUp && this.scrollYBottom >= pos.y) {
      this.scrollYTo(this.scrollYBottom, 0);
      return;
    }
  };

  onTouchStartHandleIos1304 = () => {
    this.scrollYBottom = this.bScroll.wrapperHeight - this.bScroll.scrollerHeight;
    this.isTouching = true;
  };

  onTouchEndHandleIos1304 = () => {
    this.isTouching = false;
    if (this.bScroll.y > 0) {
      this.isPullingDown = true;
    }

    if (this.bScroll.y < this.scrollYBottom) {
      this.isPullingUp = true;
    }
  };

  //判断ios是否13.4以上（包含13.4）
  isIosVerLgThan1304Fn = () => {
    const ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return ver && ver.length >= 3 && parseInt(ver[1]) >= 13 && parseInt(ver[2]) >= 1;
  };

  /**
   * 下拉刷新事件绑定
   * @private
   */
  _bindPulllingDownEvent() {
    this.bScroll.on("pullingDown", this._pullingDownHandle);
    this.bScroll.on("scroll", this._pullingingDownScrollHandle);
  }

  /**
   * 触发下拉刷新事件，回调，改变下拉状态为刷新中
   * @private
   */
  _pullingDownHandle = () => {
    const { onPullingDown, pullingUploadFinished } = this.props;

    //判断上拉加载是否正在进行中， 如果有直接结束当前下拉操作
    if (!pullingUploadFinished) {
      this.finishedPullDown();
    } else {
      //没有正在进行上拉加载数据
      // 设置状态为刷新中，请求数据中
      this.setState({
        pullingDownState: 3,
      });
      onPullingDown && onPullingDown();
    }
  };

  /**
   * 下拉过程中，通过Y值来计算状态
   * @param pos
   * @private
   */
  _pullingingDownScrollHandle = (pos) => {
    const { pullingDownState } = this.state;

    //当状态为1或者2的时候计算旋转角度
    if (pullingDownState === 1 || pullingDownState === 2) {
      const { pullDownRefreshConfig } = this.props;
      const h = pullDownRefreshConfig.stop;
      const threshold = pullDownRefreshConfig.threshold;

      //根据下拉距离计算 icon旋转角度
      const rotate = (pos.y / h) * 135;

      //设置旋转角度
      if (this.pulldownRotateIcon.current) {
        this.pulldownRotateIcon.current.style.webkitTransform = "rotate(" + rotate + "deg)";
      }

      //比较下拉距离 及 触发下拉刷新临界值， 设置当前状态
      const currentState = pos.y < threshold ? 1 : 2;

      //截流  判断当前状态是否 和 之前状态 是否一致
      if (currentState === pullingDownState) return;

      this.setState({
        pullingDownState: currentState,
      });
    }
  };

  /**
   * 下拉加载完成，监听滚动结束事件
   */
  finishedPullDown = () => {
    //设置下拉状态为完成
    this.setState({
      pullingDownState: 4,
    });

    const { needPullUpload, isLast } = this.props;

    if (!isLast && needPullUpload && !this.bScroll.pullupWatching) {
      this.bScroll.openPullUp();
    }

    //等待icon动画完成后，并且监听scrollEnd事件
    setTimeout(() => {
      this.bScroll.finishPullDown();
      this.bScroll.on("scrollEnd", this._finishedPullDownScrollEndHandle);
    }, 1150);
  };

  /**
   * 下拉加载完成并动画结束后设置状态还原/归位
   * @private
   */
  _finishedPullDownScrollEndHandle = () => {
    //将下拉刷新还原至初始化状态
    this.setState({
      pullingDownState: 1,
    });
    //设置旋转角度
    if (this.pulldownRotateIcon.current) {
      this.pulldownRotateIcon.current.style.webkitTransform = "rotate(0deg)";
    }

    this.bScroll.refresh();
    //解除绑定事件
    this.bScroll.off("scrollEnd", this._finishedPullDownScrollEndHandle);
  };

  /**
   * 根据下拉状态渲染显示内容
   * @returns {XML}
   */
  renderPullDown() {
    const { pullDownRefreshConfig, needPullDownRefresh, pullDownTheme } = this.props;

    //未开启下拉刷新
    if (!needPullDownRefresh) {
      return null;
    }

    const { pullingDownState, pullingDownIconRotate } = this.state;
    const iconStyle = {
      //icon图标下拉旋转样式设置
      transform: " rotate(" + pullingDownIconRotate + "deg)",
    };

    const cls = classnames("refresh-icon", pullingDownState == 3 ? " rotate" : "");
    const finishedImg = require(pullDownTheme === 2 ? "./imgs/pullingDown2.gif" : "./imgs/pullingDown1.gif") + `?ts=${new Date().getTime()}`;

    let component = (
      <div className={cls} ref={this.pulldownRotateIcon} style={iconStyle}>
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

  /** ==============================================================================
   * 上拉加载事件绑定
   */
  _bindPullingUploadEvent() {
    this.bScroll.on("pullingUp", this._pullingUploadHandle);
  }

  /**
   * 上拉事件触发，回调，及修改状态
   * @private
   */
  _pullingUploadHandle = () => {
    const { onPullingUpload, pullingDownFinished, pullingUploadFinished } = this.props;

    //判断下拉加载是否未完成
    if (!pullingDownFinished) {
      this.finishedPullUp(); //下拉加载未完成，直接结束
    } else if (pullingUploadFinished && onPullingUpload) {
      this.setState({
        pullingUpState: 2,
      });
      onPullingUpload();
    }
  };

  /**
   * 上拉加载完成
   */
  finishedPullUp = () => {
    //设置未初始化状态
    this.setState({
      pullingUpState: 1,
    });
    const { isLast } = this.props;

    this.bScroll.finishPullUp();

    this.bScroll.refresh();
    //当下拉加载为最后一页结束后，关闭上拉加载监听事件     注：closePullUp必须在finishPullUp之后执行
    isLast && this.bScroll.closePullUp();
  };

  /**
   * 提供子组件内部图片加载完成后refresh
   */
  refresh = () => {
    const { pullingDownState, pullingUpState } = this.state;

    if (pullingDownState === 1 && pullingUpState === 1) {
      this.bScroll.refresh();
    }
  };

  scrollYTo(y, time) {
    this.bScroll.scrollTo(0, y, time);
  }

  /**
   * 渲染下拉状态显示
   * @returns {XML}
   */
  renderPullUp() {
    const { pullingUpState } = this.state;
    const { pullUploadConfig } = this.props;

    const cls = classnames("refresh-icon", pullingUpState === 2 ? "rotate" : "");

    return (
      <div className="scroll-pullup-wrapper">
        <div className={cls}>
          <img className="img" width="100%" src={require("./imgs/pullingDown1.png")} alt="" />
        </div>
        <p className="pullup-desc">{pullUploadConfig.stateTxt[pullingUpState]}</p>
      </div>
    );
  }

  /**
   * 渲染底部
   */
  renderFooter() {
    const { needPullUpload, isLast, showLastTips, showBrand } = this.props;

    // 默认开启漏出加载全部，且 开启上拉加载 ，且是最后一页
    if (showLastTips && needPullUpload && isLast) {
      return <div className="bottom-brand-load-all" />;
    } else if (showBrand && this.isNativeApp && (!needPullUpload || (needPullUpload && isLast))) {
      // 开启了底部品牌露出 且 （未开启上拉加载 或者 开始了上拉加载且最后一页 && 只在给到中）
      return <div className="bottom-brand-container" />;
    } else if (needPullUpload && !isLast) {
      //开启上拉加载
      return this.renderPullUp();
    } else {
      //未开启底部品牌露出 且 未开启上拉加载
      return null;
    }
  }

  render() {
    const { className } = this.props;
    const cls = classnames("scroll-view", className);
    return (
      <div className={cls} ref={this.scrollWrapper}>
        <div className="scroll-content">
          {this.renderPullDown()}
          {this.props.children}
          {this.renderFooter()}
        </div>
      </div>
    );
  }
}

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
