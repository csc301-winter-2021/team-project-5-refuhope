import React from 'react'
import { useState } from 'react'
import './Refugee.css'

/**
 * Creates a mapping between the attributes of a Refugee, and labels. Enables us to programatically
 * generate a list of HTML elements. 
 */
const DETAIL_LABELS = {
    name: "NAME",
    phone: "PHONE",
    email: "EMAIL",
    location: "LOCATION",
    workType: "WORK TYPE",
    schedule: "SCHEDULE",
    numWorkHours: "HOURS PER WEEK"
}

/**
 * Expects props to have the following structure.
 * 
 * {
 *  name: String,
 *  phone: String,
 *  email: String,
 *  location: String,
 *  workType: String,
 *  schedule: String,
 *  numWorkHours: int
 * }
 * 
 * In the near future, schedule should be updated so that its a 3-dimensional array.
 */
const Refugee = (props) => {

    // Stores a Refugees' details
    const [info, setInfo] = useState(props)

    // Acts like a buffer for updated details.
    const [editDetailsBuffer, setEditDetailsBuffer] = useState(props)
    const [beingEdited, setBeingEdited] = useState(false)

    const handleEdit = (event, detailToUpdate) => {
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

        const details = Object.keys(DETAIL_LABELS).map(key => {
            return (
                <Detail
                    key={key}
                    detailKey={key}
                    beingEdited={beingEdited}
                    label={DETAIL_LABELS[key]}
                    value={info[key]}
                    editBufferValue={editDetailsBuffer[key]}
                    handleEdit={handleEdit}>
                </Detail>
            )
        })
        return details
    }

    return (
        // Acts as a div, without creating a div in the DOM.
        <div className="refugee-card">
            {createButtons()}
            {createBody()}
        </div>
    )
}

const Detail = (props) => {

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
    } else {
        if (label === "NAME") {
            return <p className="refugee-name">{value}</p>
        }
        return (
            <React.Fragment>
                <p className="refugee-label">{label}</p>
                <p className="refugee-detail">{value}</p>
            </React.Fragment>
        )
    }
}

export default Refugee