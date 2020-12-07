import { isBrowser } from "./tools";

const computerHTMLFontSize = () => {
  if (!isBrowser()) return;

  const docEl = document.documentElement;
  let clientWidth = docEl.clientWidth;

  if (clientWidth <= 320) {
    clientWidth = 320;
  }

  if (clientWidth > 500) {
    clientWidth = 500;
  }

  docEl.style.fontSize = 10 * (clientWidth / 375) + "px";
};

window.onresize = computerHTMLFontSize;

export default computerHTMLFontSize;
