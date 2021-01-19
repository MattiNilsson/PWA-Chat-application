import axios from "axios";
import {useState} from "react";

import { URL } from "../../constants/constants";

export default function LoginPage(){
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
        e.preventDefault();
        axios
            .post(URL + "/auth/local", {
                "identifier" : data.username,
                "password" : data.password,
            })
            .then(res => {
                localStorage.setItem('jwt', res.data.jwt);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            })
    }

    return(
        <div className="log-container">
            <h1>Sign In</h1>
            <form onSubmit={onSubmitForm}>
                <label htmlFor="username">Username</label>
                <input onChange={onChangeForm} autoComplete="username" type="text" id="username"/>
                <label htmlFor="email">Password</label>
                <input onChange={onChangeForm} autoComplete="current-password" type="password" id="password"/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}