import React = require("react");

import JJorm from "../JJorm";

export default class Header extends JJorm{
  ACTION_RECEIVER_TABLE = {};

  render():React.ReactNode{
    return <header>
      ---HEADER---
    </header>;
  }
}