import logo from "../../assets/ChatLogo-trans.png";
import LandingCard from "../../mini-components/LandingCard/LandingCard";
import {AccountContext} from "../../context/context";
import { Redirect } from "react-router-dom" ;
import { useContext } from "react";

export default function LandingPage(){
    const {context} = useContext(AccountContext);
    console.log(context);
    if(context){
        return <Redirect to="/home" />
    }

    return(
        <article className="land-container">
            <img src={logo} alt="company-logo"/>
            <section>
                <h1>Welcome to BiteChat!</h1>
                <p>This is a place where people from around the world shall come and chat with each other and have a good time.</p>
                <p>Jump Right into it! Go create an account and talk to strangers!</p>
            </section>
            <div className="card-container">
                <LandingCard purpose="Create Account" icon="person_add" to="/signup" desc="Create an account here!"/>
                <LandingCard purpose="Login" icon="login" to="/login" desc="If you have an account login here!"/>
            </div>
        </article>
    )
}