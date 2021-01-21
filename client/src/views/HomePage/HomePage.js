import axios from "axios";
import { useContext, useEffect, useState } from "react";

import {URL} from "../../constants/constants";

import {AccountContext} from "../../context/context";

import SearchAvatar from "../../mini-components/SearchAvatar/SearchAvatar";

export default function HomePage(){
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const {context} = useContext(AccountContext);

    useEffect(() => {
        const debounce = setTimeout(() => {
            axios
            .get(`${URL}/users?_where[_or][username_contains]=${search}${context ? "&[id_ne]="+context.id : ""}`)
            .then((res) => {
                setUsers(res.data);
            })
            .catch(err => console.error(err))
        }, 300)

        return () => {
            clearTimeout(debounce);
        }
    }, [search])

    const searchInput = (e) => {
        setSearch(e.target.value);
    }

    return(
        <div>
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