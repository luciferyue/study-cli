import toUpper from "lodash/toUpper";
import md5 from "./md5";

export function sign(map, appSecret) {
  let signStr = appSecret || "";

  const keys = Object.keys(map);
  const count = keys.length;

  keys.sort();
  for (let i = 0; i < count; i++) {
    const k = keys[i];
    const v = map[k];
    if (v == null || v === undefined) {
      continue;
    }

    signStr = signStr + k + v;
  }
  const result = toUpper(md5(signStr));
  return result;
}
