import React from "react";
import ReactDOM from "react-dom/client";

import { JJWAK } from "common/JJWAK";
import Footer from "./@global/Footer";
import Header from "./@global/Header";
import L from "./@global/Language";
import JJorm from "./JJorm";
import { PROPS } from "./@global/Utility";

type State = {
  error?: Error;
};
export default function Bind(
  TargetClass:
    | typeof React.Component<JJWAK.Page.Props<any>>
    | React.FC<JJWAK.Page.Props<any>>
): void {
  const $stage = document.getElementById("stage") as HTMLElement;
  const root = ReactDOM.createRoot($stage);

  root.render(
    <Root {...PROPS}>{React.createElement(TargetClass, PROPS)}</Root>
  );
}
export class Root extends JJorm<JJWAK.Page.Props<any>, State> {
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  state: State = {};

  componentDidMount(): void {
    super.componentDidMount();
    JJorm.flush();
  }
  render(): React.ReactNode {
    if (this.state.error) {
      return L.render("ERROR", this.state.error.message);
    }
    return (
      <>
        <Header />
        {this.props.children}
        <Footer />
      </>
    );
  }
}
