import React = require("react");
import ReactDOM = require("react-dom");

import Header from "./@global/Header";
import Footer from "./@global/Footer";

export default function Bind(TargetClass:any):void{
  const $root = document.createElement("article");

  ReactDOM.render(<section id="stage">
    <Header />
    {React.createElement(TargetClass, "/*{JSON.stringify($)}*/")}
    <Footer />
  </section>, $root);
  document.body.appendChild($root);
}