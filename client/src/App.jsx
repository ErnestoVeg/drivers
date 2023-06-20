import { Route, Switch} from "react-router-dom";

import Home from "./views/Home/home";
import Detail from "./views/Detail/detail";
import Landing from "./views/Landing/landing";
import Create from "./views/Form/form";
import Update from './views/Update/update';

import "./App.css";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/home" component={Home} />
        <Route path="/update" component={Update} />
        <Route path="/home/:id" component={Detail} />
        <Route path="/create" component={Create} />
      </Switch>
    </div>
  );
}

export default App;
