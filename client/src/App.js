import './App.scss';
import Helmet from "react-helmet";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

// Views
import HomePage from "./views/HomePage/HomePage";

// Components
import SideMenu from "./components/SideMenu/SideMenu";
import LogoIcon from "./components/LogoIcon/LogoIcon";

function App() {
return (
    <div className="App">
        <Helmet>
            <title>BiteChat</title>
            <meta name="description" content="Helmet application" />
        </Helmet>
        <Router>
            <SideMenu />
            <LogoIcon />
            <Switch>
                <Route exact to="/" component={HomePage} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
