import Logo from "../../assets/ChatLogo-trans.png"


export default function LogoIcon(){
    return(
        <div className="logo-container">
            <img src={Logo} alt="company logo"/>
            <div></div>
        </div>
    )
}