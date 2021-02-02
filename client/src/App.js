import {useEffect, useState} from "react";
import './App.scss';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

// Context
import {AccountContext} from "./context/context";

// Views
import HomePage from "./views/HomePage/HomePage";
import SignUpPage from "./views/SignUpPage/SignUpPage";
import LoginPage from './views/LoginPage/LoginPage';
import ChatPage from "./views/ChatPage/ChatPage";
import LandingPage from "./views/LandingPage/LandingPage";
import ProfilePage from "./views/ProfilePage/ProfilePage";

// Components
import SideMenu from "./components/SideMenu/SideMenu";
import LogoIcon from "./components/LogoIcon/LogoIcon";

function App() {
    const [context, setContext] = useState("");
    

    useEffect(() => {
        if(localStorage.getItem("user") && !context){
            setContext(JSON.parse(localStorage.getItem("user")));
        }
    }, [context])

    console.log(context);

    return (
        <div className="App">
            <AccountContext.Provider value={{context, setContext}}>
                <Router>
                    <SideMenu />
                    <LogoIcon />
                    <Switch>
                        <Route path="/" exact component={LandingPage} />
                        <Route path="/home" component={HomePage} />
                        <Route path="/signup" component={SignUpPage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/room/:id" component={ChatPage} />
                        <Route path="/profile/:id" component={ProfilePage} />
                    </Switch>
                </Router>
            </AccountContext.Provider>
        </div>
    );
}

export default App;
