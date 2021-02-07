import axios from "axios";
import { useState, useContext, useEffect } from "react";
import {URL} from "../../constants/constants";
import {AccountContext} from "../../context/context";
import { Icon } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";

import SideMenuButton from "../../mini-components/SideMenuBtn/SideMenuBtn";
import SideMenuFriend from "../../mini-components/SideMenuFriend/SideMenuFriend";

import {socket} from "../../socket/socket";

export default function SideMenu(){
    const {context, setContext} = useContext(AccountContext);

    const [friends, setFriends] = useState([]);
    const [hamburger, setHamburger] = useState(false);
    const [note, setNote] = useState("");

    useEffect(() => {
        const getRooms = () =>{
            if(!context) return;
            axios
                .get(URL + "/rooms?_where[users_contains]=" + context.id, {
                    headers : {
                        'Authorization': "Bearer " + localStorage.getItem("jwt")
                    }
                })
                .then(res => {
                    setFriends(res.data);
                })
                .catch(err => console.error(err))
        }

        getRooms();
    }, [context, note])

    useEffect(() => {
        if(context){
            let myRooms = [];
            for(let i = 0; i < friends.length; i++){
                myRooms.push(friends[i].id);
            }

            socket.emit('notify-join', JSON.stringify({rooms : myRooms, user : context.username}), (msg, cb) => {
                console.log('connected')
            })

            return(() => {
                socket.off('notify-join');
            })
        }
    }, [friends, context])

    useEffect(() => {
        if(context){
            socket.on('broad-notify', data => {
                setNote(data);
            })
    
            return function cleanup(){
                socket.off("broad-notify")
            }
        }
    }, [note, context]);

    const onLogOut = (e) => {
        setContext(null);
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
    }

    const openHamburger = (e) => {
        setHamburger(!hamburger);
    }

    return(
        <aside className={hamburger ? "sidemenu-container hamburger" : "sidemenu-container"}>
            <div className="upper">
                <div className="ham" onClick={openHamburger}>
                    <Icon>{hamburger ? "clear" : "menu"}</Icon>
                </div>

                <SideMenuButton 
                    displayTo="Home"
                    icon="home"
                    to="/"
                    setCloseHam={setHamburger}
                />

                {context ? 
                    <SideMenuButton 
                        displayTo={context ? context.username : ""}
                        icon="home"
                        to={"/profile/" + context.id}
                        profile={context ? context.profilepic.url : ""}
                        setCloseHam={setHamburger}
                    />
                    : 
                    <></>
                }
            </div>
            <div className="middle">
                {context ? friends.map((friend) => {
                    return(
                        <SideMenuFriend
                            key={uuidv4()} 
                            displayTo={friend.title}
                            icon="home"
                            to={"/room/" + friend.id}
                            profile={friend.roomimage.url}
                            setCloseHam={setHamburger}
                            notify={note.room === friend.id ? note : false}
                            seen={friend.seen.includes(context.id) ? true : false}
                        />
                    )
                }) : <></>}
            </div>
            <div className="lower">
                {context ? 
                    <SideMenuButton 
                        displayTo="Logout"
                        icon="logout"
                        to="/"
                        click={onLogOut}
                        setCloseHam={setHamburger}
                    />
                : 
                    <>
                    <SideMenuButton 
                        displayTo="Login"
                        icon="login"
                        to="/login"
                        setCloseHam={setHamburger}
                    />
                    <SideMenuButton 
                        displayTo="Create Account"
                        icon="person_add"
                        to="/signup"
                        setCloseHam={setHamburger}
                    />
                    </>
                }
            </div>
        </aside>
    )
}