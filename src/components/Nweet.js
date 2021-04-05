import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';

const Nweet = ({nweetObj, isOwner}) => {

    const [editing, setEditing] = useState(false); //editing mode or not
    const [newNweet, setNweNweet] = useState(nweetObj.text); //update text in input
    
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if(ok){
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    };

    const toggleEditing = () => setEditing(prev => !prev);
    const onChange = (event) => {
        const {target:{value},} = event;
        setNweNweet(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet,
        });
        setEditing(false);
    };
    
    return (
        <div>
            {
                editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input 
                        type="text" 
                        placeholder="Edit your nweet" 
                        value={newNweet} 
                        required
                        onChange={onChange} />
                        <input type="submit" value="Update Nweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
                ) : (
            <div>
            <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width="50px" height="50px"/>}
            {isOwner && (
                <>
                <button onClick={onDeleteClick}>Delete Nweet</button>
                <button onClick={toggleEditing}>Edit Nweet</button>
                </>
            )}
            </div>
                )}
        </div>
    );
}

export default Nweet;