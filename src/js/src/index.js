import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import "./styles/layout.css";
import computerHTMLFontSize from "@src/utils/rem";

computerHTMLFontSize();

ReactDOM.render(<App />, document.querySelector("#root"));
