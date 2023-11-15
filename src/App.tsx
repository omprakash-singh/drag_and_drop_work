import { observer } from "mobx-react";
import * as React from "react";
import "./App.css";
import CardColumns from "./components/card-columns";
import Store from "./store";
import Reactions from "./store/Reaction";

interface Props {}

class App extends React.Component<Props> {
  store = new Store();

  render() {
    return (
      <>
        <CardColumns
          store={this.store}
          createString={this.store.createString}
        />
        <Reactions store={this.store} fireImmediately={true} />
      </>
    );
  }
}

export default observer(App);
