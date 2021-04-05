import { dbService, storageService } from "fbase";
import {v4 as uuidv4} from "uuid";
import React, { useEffect } from "react";
import {useState} from "react";
import Nweet from "../components/Nweet";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect( () => {
        dbService.collection("nweets").orderBy("createdAt", "desc").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map(doc =>({
                id:doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);
    
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

    return(
    <div>
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
        <div>
            {nweets.map(nweet => 
                <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                )}
        </div>
    </div>
    );
    
}
export default Home;