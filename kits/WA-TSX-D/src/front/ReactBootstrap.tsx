import React from "react";
import ReactDOM from "react-dom";

import { JJWAK } from "common/JJWAK";
import Footer from "./@global/Footer";
import Header from "./@global/Header";
import L from "./@global/Language";
import JJorm from "./JJorm";
import { PROPS } from "./@global/Utility";

type State = {
  'error'?: Error
};
export default function Bind(TargetClass:any):void{
  const $root = document.getElementById("stage");

  ReactDOM.render(<Root {...PROPS}>
    {React.createElement(TargetClass, PROPS)}
  </Root>, $root);
}
export class Root extends JJorm<JJWAK.Page.Props<any>, State>{
  static getDerivedStateFromError(error:Error):Partial<State>{
    return { error };
  }

  state:State = {};

  componentDidMount():void{
    super.componentDidMount();
    JJorm.flush();
  }
  render():React.ReactNode{
    if(this.state.error){
      return L.render("ERROR", this.state.error.message);
    }
    return <>
      <Header />
      {this.props.children}
      <Footer />
    </>;
  }
}