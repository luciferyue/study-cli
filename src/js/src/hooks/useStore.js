import { useSelector } from "react-redux";

function useStore(str) {
  // eslint-disable-next-line no-unused-vars
  return useSelector((state) => eval(`state.${str}`));
}

export default useStore;
