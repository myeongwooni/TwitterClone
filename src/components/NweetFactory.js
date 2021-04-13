import React, {useState} from "react";
import { storageService, dbService} from "fbase";
import {v4 as uuidv4} from "uuid";

const NweetFactory = ({ userObj }) => {
    const [attachment, setAttachment] = useState("");
    const [nweet, setNweet] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";

        if (attachment !== ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
    };

    const onChange = (event)=>{
        const { target:{value}} = event;
        setNweet(value);
    };
    
    const onFileChange = (event) => {
        const {
            target : {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachmentClick =() => setAttachment((""));

    return (
        <form onSubmit={onSubmit}>
            <input 
                value={nweet} 
                onChange={onChange} 
                type="text" 
                placeholder="What's on your mind?" 
                maxLength={120}
            />
            <input onChange={onFileChange} type="file" accept="image/*"/>
            <input type="submit" value="Nweet" />
            {attachment && (
            <div>
                <img src={attachment} width="50px" height="50px"/>
                <button onClick={onClearAttachmentClick}>Clear</button>
            </div>)}
        </form>
    )
}

export default NweetFactory;