import React, { Suspense } from "react";
import { Router } from "@reach/router";

import { GlobalStyle } from "./styles/GlobalStyles";
import { LayoutCmp } from "./components/Layout";

import { Home } from "./pages/Home";
import Gateways from "./pages/Gateways";
import Gateway from "./pages/Gateway";
import { NotFound } from "./pages/NotFound";

export const App = () => {
  return (
    <Suspense fallback={<div />}>
      <GlobalStyle />
      <LayoutCmp>
        <Router>
          <NotFound default />
          <Home path="/" />
          <Gateways path="gateways" />
          <Gateway path="gateways/:gatewayId" />
        </Router>
      </LayoutCmp>
    </Suspense>
  );
};
