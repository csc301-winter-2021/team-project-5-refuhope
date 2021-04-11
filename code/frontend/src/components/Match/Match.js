import React from 'react'
import { useState, useEffect } from 'react'

import Refugee from '../Refugee/Refugee'
import Post from '../Post/Post'
import './Match.css'

/* API Calls. */
const getPost = async (props) => {
    if (props === undefined)
        return
    if (props.location.postDetails === undefined)
        return null
    const id = props.location.postID
    const request = new Request(`/api/opportunityByID/${id}`, { method: 'GET' })
    const response = await fetch(request)

    if (response.ok) {
        const data = await response.json()
        return data.response
    } else {
        return null
    }
}


const getRefugees = async () => {

    const request = new Request('/api/refugeeMatches', { method: 'GET' })
    const response = await fetch(request)

    if (response.ok) {
        const data = await response.json()
        return data.response
    } else {
        return null
    }
}

const updateMatch = async () => {} // Server call

const Match = () => {

    /* Setup */
    const [post, setPost] = useState([])
    const [refugees, setRefugees] = useState([])

    // The empty array argument indicates that this funciton should only be run on this component's intial render.
    useEffect(() => {

        // Apparently this IIFE is needed to avoid race conditions in rendering.
        (async () => {
            const postInfo = await getPost()
            if (postInfo === null) {
                alert("Couldn't load Post.")
            } else {
                const postComponent = 
                        <Post
                            key={postInfo._id}
                            title={postInfo.title}
                            status={postInfo.status}
                            host={postInfo.poster}
                            workType={postInfo.workType}
                            location={postInfo.city + ", " + postInfo.province}
                            schedule={"WIP"}
                            hours={postInfo.numWorkHours}
                            additionalInfo={postInfo.additionalInfo}
                        ></Post>
                setPost(postComponent)
            }
            const refugeeList = await getRefugees()
            if (refugeeList === null) {
                alert("Couldn't load  Refugees.")
            } else {
                const refugeeComponents = refugeeList.map(ref => {
                    return (
                        <Refugee
                            key={ref._id}
                            name={ref.name}
                            phone={ref.phone}
                            email={ref.email}
                            location={ref.city + ", " + ref.province}
                            workType={ref.workType}
                            schedule={"WIP"}
                            numWorkHours={ref.numWorkHours}
                            additionalInfo={ref.additionalInfo}
                        ></Refugee>
                    )
                })
                setRefugees(refugeeComponents)
            }
        })()
    }, [])

    /* Helpers and callbacks. */
    return (
        <div className="match-container">
            <nav className="match-nav">
                <p>RefuTalent</p>
                <form onSubmit={updateMatch}>
                    <label>
                    Match:
                    <input type="text" name="RefugeeID"/>
                    </label>
                    <input type="submit" value="Enter RefugeeID" />
                </form>
            </nav>
            <div className="match">
                {post}
                {refugees}
            </div>
        </div>
    )
}

export default Match
