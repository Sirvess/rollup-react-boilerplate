import * as React from "react";
import styled from "styled-components";
import { render } from "react-dom";

import { TicTacToe } from "./components";

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20vh;
`;

const Container = styled.div`
  max-width: 400px;
  max-height: 400px;
`;

export const Main = () => (
  <Root>
    <Container>
      <TicTacToe />
    </Container>
  </Root>
);

render(<Main />, document.body);
