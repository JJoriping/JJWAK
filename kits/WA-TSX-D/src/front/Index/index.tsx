import React from "react";

import JJorm from "../JJorm";
import Bind from "../ReactBootstrap";
import L from "../@global/Language";
import { JJWAK } from "common/JJWAK";

export default class Index extends JJorm<JJWAK.Page.Props<'Index'>>{
  render():React.ReactNode{
    return <article>
      Hello, {this.props.page}
      <br />
      {L.render("test")}
      <img src="/media/images/example-beach.jpg" />
    </article>;
  }
}
Bind(Index);