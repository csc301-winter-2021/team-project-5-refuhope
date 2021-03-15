import React from 'react'
import { useState } from 'react'
import './MatchedRefugee.css'

/**
 * Creates a mapping between the attributes of a Refugee, and labels. Enables us to programatically
 * generate a list of HTML elements. 
 */
export const MATCH_TEMPLATE = {
    name: "NAME",
    email: "EMAIL",
    location: "LOCATION",
    schedule: "SCHEDULE",
}

/**
 * Expects props to have the following structure.
 * 
 * {
 *  name: String,
 *  email: String,
 *  location: String,
 *  schedule: String,
 * }
 * 
 * In the near future, schedule should be updated so that its a 3-dimensional array.
 */
const MatchedRefugee = (props) => {

    // Stores a Refugees' details
    const [info, setInfo] = useState(props)

    // Acts like a buffer for updated details.
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

    const acceptRefugee = () => {
        // TODO: Match refugee with Post using server calls.
    }

    const declineRefugee = () => {
        // TODO: Decline refugee 
    }

    const createButtons = () => {

        // Create the appropriate edit and save and cancel buttons.
        if (beingEdited) {
            return (
                <div className="refugee-card-btn-tray">
                    <button onClick={() => saveEdit(true)}>Save</button>
                    <button onClick={() => saveEdit(false)}>Cancel</button>
                </div>
            )
        } else {
            return (
                <div className="refugee-card-btn-tray">
                    <button onClick={() => setBeingEdited(true)}>Edit</button>
                </div>
            )
        }
    }

    const createBody = () => {

        // Create a label and Detail component for each attribute of Refugee.
        const details = Object.keys(MATCH_TEMPLATE).map(key => {
            return (
                <Detail
                    key={key}
                    detailKey={key}
                    beingEdited={beingEdited}
                    label={MATCH_TEMPLATE[key]}
                    value={info[key]}
                    editBufferValue={editDetailsBuffer[key]}
                    handleEdit={handleEdit}>
                </Detail>
            )
        })

        return details
    }

    return (
        <div className="refugee-card">
            {createButtons()}
            {createBody()}
            <button onClick={() => acceptRefugee()}> Accept </button>
            <button onClick={() => declineRefugee()}> Decline </button>
        </div>
    )
}

export const Detail = (props) => {

    const { detailKey, beingEdited, label, value, editBufferValue, handleEdit } = props

    if (beingEdited) {
                return (
                    <React.Fragment>
                        <p className="refugee-label">{label}</p>
                        <input
                            className="refugee-detail"
                            value={editBufferValue}
                            onChange={(e) => handleEdit(e, detailKey)}>
                        </input>
                    </React.Fragment>
                )
    }
    else {
        switch (label) {
            case "NAME":
                return <p className="refugee-name">{value}</p>
            default:
                return (
                    <React.Fragment>
                        <p className="refugee-label">{label}</p>
                        <p className="refugee-detail">{value}</p>
                    </React.Fragment>
                )
        }
    }
}

export default MatchedRefugee