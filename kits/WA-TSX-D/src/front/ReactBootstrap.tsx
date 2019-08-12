import React = require("react");
import ReactDOM = require("react-dom");

import Footer from "./@global/Footer";
import Header from "./@global/Header";
import L from "./@global/Language";
import JJorm from "./JJorm";

type State = {
  'error': Error
};
export default function Bind(TargetClass:any):void{
  const $root = document.createElement("main");
  const props:JJWAK.Page.Props<any> = "/*{JSON.stringify($)}*/" as any;

  ReactDOM.render(<Root {...props}>
    {React.createElement(TargetClass, props)}
  </Root>, $root);
  document.body.appendChild($root);
}
export class Root extends JJorm<JJWAK.Page.Props<any>, State>{
  static getDerivedStateFromError(error:Error):Partial<State>{
    return { error };
  }

  state:State = {
    error: null
  };

  componentDidMount():void{
    super.componentDidMount();
    JJorm.flush();
  }
  render():React.ReactNode{
    if(this.state.error){
      return L.render("ERROR", this.state.error.message);
    }
    return <section id="stage">
      <Header />
      {this.props.children}
      <Footer />
    </section>;
  }
}