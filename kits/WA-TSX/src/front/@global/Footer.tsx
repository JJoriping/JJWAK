import React = require("react");

import JJorm from "../JJorm";

export default class Footer extends JJorm{
  ACTION_RECEIVER_TABLE = {};

  render():React.ReactNode{
    return <footer>
      ---FOOTER---
    </footer>;
  }
}