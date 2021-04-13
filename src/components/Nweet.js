import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/fontawesome-free";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        <div className="nweet">
            {
                editing ? (
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input 
                        type="text" 
                        placeholder="Edit your nweet" 
                        value={newNweet} 
                        required
                        onChange={onChange} />
                        <input type="submit" value="Update Nweet" className="formBtn"/>
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                        </span>
                </>
                ) : (
            <div>
            <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl}/>}
            {isOwner && (
                <>
                <div class="nweet__actions">
                    <span onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrash} />
                    </span>
                    <span onClick={toggleEditing}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </span>
                </div>
                </>
            )}
            </div>
                )}
        </div>
    );
}

export default Nweet;