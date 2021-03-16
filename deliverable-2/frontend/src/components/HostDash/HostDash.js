import React from 'react'
import { useState, useEffect } from 'react'

import Post, { Detail, POST_TEMPLATE } from '../Post/Post'
import './HostDash.css'

/* API Calls. */

const getOpportunities = async () => {

    const request = new Request('/api/opportunitySearch', { method: 'GET' })
    const response = await fetch(request)

    if (response.ok) {
        const data = await response.json()
        return data.response
    } else {
        return null
    }
}

const postOpportunity = async (newPost) => {

    const body = {
        title: newPost.title,
        // New posts are always in review
        // status: "STATUS",
        // Right now we must create some random ID for the host/poster.
        // host: "HOST",
        workType: newPost.workType,
        // Expects location to be in the form: city, province
        city: newPost.location.split(",")[0],
        province: newPost.location.split(",")[1],
        schedule: [],
        numWorkHours: newPost.hours,
        description: newPost.additionalInfo
    }

    const request = new Request(
        '/api/opportunityAdd',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(body)
        }
    )

    const response = await fetch(request)
    return response.ok
}

const HostDash = () => {

    /* Setup */

    const [posts, setPosts] = useState([])
    const [beingEdited, setBeingEdited] = useState(false)
    const [newPost, setNewPost] = useState(Object.create(POST_TEMPLATE))

    // The empty array argument indicates that this funciton should only be run on this component's intial render.
    useEffect(() => {

        // Apparently this IIFE is needed to avoid race conditions in rendering.
        (async () => {
            const postList = await getOpportunities()
            if (postList === null) {
                alert("Couldn't load Posts.")
            } else {
                const postComponents = postList.map(p => {
                    return (
                        <Post
                            key={p._id}
                            title={p.title}
                            status={p.status}
                            host={p.poster}
                            workType={p.workType}
                            location={p.city + ", " + p.province}
                            schedule={"WIP"}
                            hours={p.numWorkHours}
                            additionalInfo={p.description}
                        ></Post>
                    )
                })
                setPosts(postComponents)
            }
        })()
    }, [])

    const handleEdit = (event, key) => {
        // Modified attributes are first stored in the buffer.
        let updatedInfo = { ...newPost }
        updatedInfo[key] = event.target.value
        setNewPost(updatedInfo)
    }

    const saveEdit = (save) => {

        // Try to write Post to DB.
        if (save) {
            const successful = postOpportunity(newPost)
            // Post successfully stored in DB; create UI element.
            if (successful) {
                let newPostComp = <Post {...newPost}></Post>
                setPosts([...posts, newPostComp])
            } else {
                // Write to databse failed.
                alert("Woops! Couldn't write Post to DB, please try again!")
            }
            setNewPost(Object.create(POST_TEMPLATE))
        }
        // Reset edit buffer.
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
                        <div className="post-card-btn-tray">
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
        <div className="hostdash-container">
            <nav className="hostdash-nav">
                <p>RefuTalent</p>
                <button onClick={() => setBeingEdited(true)}>Create New Post</button>
            </nav>
            <div className="hostdash">
                {renderModal()}
                {posts}
            </div>
        </div>
    )
}

export default HostDash