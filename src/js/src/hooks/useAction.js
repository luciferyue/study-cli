import { useDispatch } from "react-redux";
import isPlainObject from "lodash/isPlainObject";

function useAction(type, payload) {
  const dispatch = useDispatch();
  return (params) => {
    const newPayload = isPlainObject(payload) && isPlainObject(params) ? { ...payload, ...params } : params !== undefined ? params : payload;
    dispatch({ type, payload: newPayload });
  };
}

export default useAction;
