import Logo from "../../assets/ChatLogo-trans.png"
import { Link } from "react-router-dom";

export default function LogoIcon(){
    return(
        <div className="logo-container">
            <Link to="/"><img src={Logo} alt="company logo"/></Link>
        </div>
    )
}