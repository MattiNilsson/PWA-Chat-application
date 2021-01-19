import './App.scss';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

// Views
import HomePage from "./views/HomePage/HomePage";
import SignUpPage from "./views/SignUpPage/SignUpPage";
import LoginPage from './views/LoginPage/LoginPage';

// Components
import SideMenu from "./components/SideMenu/SideMenu";
import LogoIcon from "./components/LogoIcon/LogoIcon";

function App() {
return (
    <div className="App">
        <Router>
            <SideMenu />
            <LogoIcon />
            <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/signup" component={SignUpPage} />
                <Route path="/login" component={LoginPage} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
