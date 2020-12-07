import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Container from "@src/components/container";
import Routers from "./routes";
import { store } from "./store";

const App = () => (
  <BrowserRouter>
    <Provider store={store}>
      <Container>
        <Routers />
      </Container>
    </Provider>
  </BrowserRouter>
);

export default App;
