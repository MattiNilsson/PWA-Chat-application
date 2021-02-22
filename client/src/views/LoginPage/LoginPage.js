import axios from "axios";
import {useState, useContext} from "react";
import {Redirect, Link} from "react-router-dom";
import {AccountContext} from "../../context/context";

import LoadingSpinner from "../../mini-components/LoadingSpinner/LoadingSpinner"; 

import { URL } from "../../constants/constants";

export default function LoginPage(){
    const {setContext} = useContext(AccountContext);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        username : "",
        password : "",
    })

    const onChangeForm = (e) => {
        let newData = {...data};
        newData[e.target.id] = e.target.value;
        setData(newData);
    }

    const onSubmitForm = (e) => {
        setLoading(true);
        e.preventDefault();
        axios
            .post(URL + "/auth/local", {
                "identifier" : data.username,
                "password" : data.password,
            })
            .then(res => {
                localStorage.setItem('jwt', res.data.jwt);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setContext(res.data.user);
                console.log(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setErr(true);
                setLoading(false);
            })
    }

    if(localStorage.getItem("user")){
        return(
            <Redirect to="/" />
        )
    }

    return(
        <div className="log-container">
            <h1>Sign In</h1>
            {err ? <p className="err">wrong name or password!</p> : ""}
            <form onSubmit={onSubmitForm}>
                <label htmlFor="username">Username</label>
                <input onChange={onChangeForm} autoComplete="username" type="text" id="username"/>
                <label htmlFor="email">Password</label>
                <input onChange={onChangeForm} autoComplete="current-password" type="password" id="password"/>
                <button type="submit">Login</button>
            </form>
            <Link to="/signup">Do Not Have An Account? Sign Up!</Link>
            {loading ? <LoadingSpinner /> : ""}
        </div>
    )
}