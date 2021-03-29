import React, { useState } from 'react'
import './Post.css'

/**
 * Creates a mapping between the attributes of a Refugee, and labels. Enables us to programatically
 * generate a list of HTML elements. 
 */

export const POST_TEMPLATE = {
    title: "TITLE",
    status: "STATUS",
    host: "HOST",
    workType: "WORK TYPE",
    location: "LOCATION",
    schedule: "SCHEDULE",
    hours: "HOURS PER WEEK",
    additionalInfo: "ADDITIONAL INFO"
}

/**
 * Expects props to have the following structure.
 * 
 * {
 *  title: String,
 *  status: String,
 *  host: String,
 *  workType: String,
 *  location: String,
 *  schedule: String,
 *  hours: int,
 *  additionalInfo: String
 * }
 * 
 * In the near future, schedule should be updated so that its a 3-dimensional array.
 */

const Post = (props) => {

    // Stores a Posts' details
    const [info, setInfo] = useState(props)

    // Acts like a buffer for updated details
    const [editDetailsBuffer, setEditDetailsBuffer] = useState(props)
    const [beingEdited, setBeingEdited] = useState(false)

    const handleEdit = (event, detailToUpdate) => {
        // Modified attributes are first stored in the buffer.
        let updatedInfo = { ...editDetailsBuffer }
        updatedInfo[detailToUpdate] = event.target.value
        setEditDetailsBuffer(updatedInfo)
    }

    const saveEdit = (save) => {
        if (save) {
            // TODO: Create a PUT request; only update state if response is OK
            setInfo(editDetailsBuffer)
        } else {
            // Reset the update buffer object.
            setEditDetailsBuffer(info)
        }
        setBeingEdited(false)
    }

    const createButtons = () => {

        // Create the appropriate edit and save and cancel buttons.
        if (beingEdited) {
            return (
                <div className="post-card-btn-tray">
                    <button onClick={() => saveEdit(true)}>Save</button>
                    <button onClick={() => saveEdit(false)}>Cancel</button>
                </div>
            )
        } else {
            return (
                <div className="post-card-btn-tray">
                    <button onClick={() => setBeingEdited(true)}>Edit</button>
                </div>
            )
        }
    }

    const createBody = () => {

        // Create a label and Detail component for each attribute of Refugee.
        const details = Object.keys(POST_TEMPLATE).map(key => {
            return (
                <Detail
                    key={key}
                    detailKey={key}
                    beingEdited={beingEdited}
                    label={POST_TEMPLATE[key]}
                    value={info[key]}
                    editBufferValue={editDetailsBuffer[key]}
                    handleEdit={handleEdit}>
                </Detail>
            )
        })

        return details
    }

    return (
        <div className="post-card">
            {createButtons()}
            {createBody()}
        </div>
    )
}

export const Detail = (props) => {

    const { detailKey, beingEdited, label, value, editBufferValue, handleEdit } = props

    if (beingEdited) {
        switch (label) {
            case "ADDITIONAL INFO":
                return (
                    <React.Fragment>
                        <p className="post-label">{label}</p>
                        <textarea
                            className="post-detail-text"
                            value={editBufferValue}
                            onChange={(e) => handleEdit(e, detailKey)}>
                        </textarea>
                    </React.Fragment>
                )
            default:
                return (
                    <React.Fragment>
                        <p className="post-label">{label}</p>
                        <input
                            className="post-detail"
                            value={editBufferValue}
                            onChange={(e) => handleEdit(e, detailKey)}>
                        </input>
                    </React.Fragment>
                )
        }
    } else {
        switch (label) {
            case "TITLE":
                return <p className="post-title">{value}</p>
            case "STATUS":
                if (value === "Matched") {
                    return <p className="post-status-matched">{value}</p>
                }
                else {
                    return <p className="post-status-review">{value}</p>
                }
            default:
                return (
                    <React.Fragment>
                        <p className="post-label">{label}</p>
                        <p className="post-detail">{value}</p>
                    </React.Fragment>
                )
        }
    }
}

export default Post