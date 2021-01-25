import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import {URL} from "../../constants/constants";

import {AccountContext} from "../../context/context";

import SearchAvatar from "../../mini-components/SearchAvatar/SearchAvatar";

export default function HomePage(){
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const {context} = useContext(AccountContext);

    const completeURL = `${URL}/users?_where[_or][username_contains]=${search}${context ? "&[id_ne]="+context.id : ""}`

    useEffect(() => {
        const debounce = setTimeout(() => {
            axios
            .get(completeURL)
            .then((res) => {
                setUsers(res.data);
            })
            .catch(err => console.error(err))
        }, 300)

        return () => {
            clearTimeout(debounce);
        }
    }, [completeURL])

    const searchInput = (e) => {
        setSearch(e.target.value);
    }

    if(!context){
        return <Redirect to="/" />
    }

    if(users.length < 1){
        return(
            <div className="mt-lmao">
                <h1>Find People to Chat With!</h1>
                <input type="text" onChange={searchInput} />
                <div className="hp-items-container">
                    {   Array(3).fill("lmao").map((i, j) => {
                        return (
                            <div className="ghost" key={j}>
                                <div className="ghost-anim"></div>
                            </div>
                        )})
                    }
                </div>
            </div>
        )
    }

    return(
        <div className="mt-lmao">
            <h1>Find People to Chat With!</h1>
            <input type="text" onChange={searchInput} />
            <div className="hp-items-container">
                {users.map((index) => {
                    return(
                        <SearchAvatar key={index.id} user={index}/>
                    )
                })}
            </div>
        </div>
    )
}