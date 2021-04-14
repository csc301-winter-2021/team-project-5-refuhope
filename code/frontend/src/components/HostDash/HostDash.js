import React from 'react'
import { useState, useEffect } from 'react'

import Post from '../Post/Post'
import Form from "../Form/Form"
import './HostDash.css'

/* API Calls. */

const getOpportunities = async () => {

    const request = new Request('/api/opportunities', { method: 'GET' })
    const response = await fetch(request)

    if (response.ok) {
        const data = await response.json()
        return data.response
    } else {
        return null
    }
}

const postOpportunity = async (newPost) => {

    const request = new Request(
        '/api/opportunities',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(newPost)
        }
    )
    const response = await fetch(request)
    return response.ok
}

const postLogout = async () => {

    const request = new Request('/api/logout',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', }
        }
    )
    const response = await fetch(request)
    return response.ok
}

const HostDash = () => {

    /* Setup */

    const [posts, setPosts] = useState([])
    const [beingEdited, setBeingEdited] = useState(false)

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
                            additionalInfo={p.additionalInfo}
                        ></Post>
                    )
                })
                setPosts(postComponents)
            }
        })()
    }, [])

    const save = (newPost) => {

        // Try to write Post to DB.
        const successful = postOpportunity(newPost)

        // Post successfully stored in DB; create UI element.
        if (successful) {
            let newPostComp = <Post {...newPost}></Post>
            setPosts([...posts, newPostComp])
        } else {
            alert("Woops! Couldn't write Post to DB, please try again!")
        }
        setBeingEdited(false)
    }

    const cancel = () => {
        setBeingEdited(false)
    }

    const renderModal = () => {

        if (beingEdited) {
            return (
                <div className="hostdash-modal-back">
                    <Form formType="OPPORTUNITY" save={save} cancel={cancel} />
                </div>
            )
        }
    }

    return (
        <div className="hostdash-container">
            <nav className="hostdash-nav">
                <p>RefuTalent</p>
                <button onClick={() => setBeingEdited(true)}>Create New Post</button>
                <button onClick={() => postLogout()}>Logout</button>
            </nav>
            <div className="hostdash">
                {renderModal()}
                {posts}
            </div>
        </div>
    )
}

export default HostDash