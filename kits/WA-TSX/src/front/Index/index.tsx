import React = require("react");

import JJorm from "../JJorm";
import Bind from "../ReactBootstrap";
import L from "../@global/Language";

export default class Index extends JJorm<JJWAK.Page.Props>{
  ACTION_RECEIVER_TABLE = {};

  render():React.ReactNode{
    return <section>
      Hello, {this.props.page} and {L.get("test")}!
    </section>;
  }
}
Bind(Index);