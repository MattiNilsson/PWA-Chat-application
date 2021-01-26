import io from "socket.io-client";
import {URL} from "../constants/constants"
export const socket = io(URL)