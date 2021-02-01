import {Icon} from "@material-ui/core";

export default function ChatImage(props){
    const {file, setFile} = props;

    const onChangeFile = (e) => {
        setFile(e.target.files[0]);
    }
    

    return(
        <form className="image-field">
            <label 
                htmlFor="profilepic" 
                className="label-file"
            >
                    <Icon>image</Icon>
                    {file ? file.name : "Send Picture..."}
            </label>
            <input onChange={onChangeFile} className="input-file" type="file" id="profilepic" alt="image"/>
        </form>
    )
}