import React, { useEffect, useCallback, useRef, useState, forwardRef, useImperativeHandle } from "react";
// import ScrollView from "@src/components/scroll-view";
import ScrollView from "@src/components/scroll";
// import { useDispatch } from "react-redux";
// import Context from "@context";

function Home() {
  // const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const [num, setNum] = useState(0);
  const inputEl = useCallback((node) => {
    // console.log(node);
    const nodes = node;
    console.log(nodes);
  });

  useEffect(() => {
    document.title = "这是测试页面";
    // console.log(inputEl);
    //dispatch({ type: FETCH_CONFIG });
  }, []);

  const onPullingDown = () => {
    setTimeout(() => {
      // scrollRef.current.finishedPullDown();
    }, 2000);
  };

  const click1 = () => {
    console.log(num);
    setNum(1);
  };

  const click2 = () => {
    console.log(num);
    setNum(2);
  };
  return (
    <ScrollView ref={scrollRef} needPullDownRefresh needPullUpload onPullingDown={onPullingDown}>
      <div className="item">
        <div style={{ height: "100px", background: "red" }}></div>
      </div>
      <TextInput ref={inputEl}></TextInput>
      <div className="item" onClick={click1}>
        test page
      </div>
      <div className="item" onClick={click2}>
        test page
      </div>
      <div className="item">test page</div>
      <div className="item">test page</div>
      <div className="item">test page</div>
      <div className="item">test page</div>
      <div className="item">test page</div>
      <div className="item">test page</div>
    </ScrollView>
  );
}

export default Home;

// eslint-disable-next-line react/display-name
const TextInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  // 关键代码
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));
  return <input ref={inputRef}></input>;
});

// class Home extends React.Component {
//   constructor(props) {
//     super(props);

//     this.scrollRef = React.createRef();
//   }
//   onPullingDown = () => {
//     setTimeout(() => {
//       // scrollRef.current.finishedPullDown();
//     }, 2000);
//   };

//   componentDidMount() {
//     console.log(this.scrollRef.current.bsScroll);
//   }

//   render() {
//     return (
//       <ScrollView ref={this.scrollRef} needPullDownRefresh onPullingDown={this.onPullingDown}>
//         <div className="item">
//           <div style={{ height: "100px", background: "red" }}></div>
//         </div>
//         <div className="item">test page</div>
//         <div className="item">test page</div>
//         <div className="item">test page</div>
//         <div className="item">test page</div>
//         <div className="item">test page</div>
//         <div className="item">test page</div>
//         <div className="item">test page</div>
//         <div className="item">test page</div>
//       </ScrollView>
//     );
//   }
// }

// export default Home;
