import React from 'react'
import { useState, useEffect } from 'react'

import Post, { Detail, POST_TEMPLATE } from '../Post/Post'
import './HostDash.css'

const HostDash = () => {
    
    const [posts, setPosts] = useState([])
    const [beingEdited, setBeingEdited] = useState(false)
    const [newPost, setNewPost] = useState(Object.create(POST_TEMPLATE))

    const handleEdit = (event, key) => {
        // Modified attributes are first stored in the buffer.
        let updatedInfo = { ...newPost }
        updatedInfo[key] = event.target.value
        setNewPost(updatedInfo)
    }

    const saveEdit = (save) => {
        if (save) {
            // TODO: Create a POST request; only add new Refugee to state if status is OK.
            let newPostComp = <Post {...newPost}></Post>
            setPosts([...posts, newPostComp])
        } else {
            setNewPost(Object.create(POST_TEMPLATE))
        }
        setBeingEdited(false)
    }

    const renderModal = () => {
        if (beingEdited) {

            const details = Object.keys(POST_TEMPLATE).map(key => {
                return (
                    <Detail
                        key={key}
                        detailKey={key}
                        beingEdited={beingEdited}
                        label={POST_TEMPLATE[key]}
                        value={newPost[key]}
                        handleEdit={handleEdit}>
                    </Detail>
                )
            })

            return (
                <div className="hostdash-modal-back">
                    <div className="hostdash-modal-body">
                        <div className="host-card-btn-tray">
                            <button onClick={() => saveEdit(true)}>Save</button>
                            <button onClick={() => saveEdit(false)}>Cancel</button>
                        </div>
                        <p className="hostdash-modal-header">Add New Post</p>
                        {details}
                    </div>
                </div>
            )
        }
    }

    return (
        <React.Fragment>
            <nav className="hostdash-nav">
                <p>RefuTalent</p>
                <button onClick={() => setBeingEdited(true)}>Create New Post</button>
            </nav>
            <div className="hostdash">
                {renderModal()}
                {posts}
            </div>
        </React.Fragment>
    )
}

export default HostDash