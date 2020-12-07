export function action(type, payload = {}) {
  return {
    type,
    payload,
  };
}

export const UPDATE_INITIALIZE = "UPDATE_INITIALIZE"; //更新页面级错误状态
