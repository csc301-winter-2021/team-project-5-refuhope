import React from 'react'
import { useState } from 'react'
import './Refugee.css'

/**
 * Creates a mapping between the attributes of a Refugee, and labels. Enables us to programatically
 * generate a list of HTML elements. 
 */
export const REFUGEE_TEMPLATE = {
    name: "NAME",
    phone: "PHONE",
    email: "EMAIL",
    location: "LOCATION",
    workType: "WORK TYPE",
    schedule: "SCHEDULE",
    numWorkHours: "HOURS PER WEEK",
    additionalInfo: "ADDITIONAL INFO"
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
        const details = Object.keys(REFUGEE_TEMPLATE).map(key => {
            return (
                <Detail
                    key={key}
                    detailKey={key}
                    beingEdited={beingEdited}
                    label={REFUGEE_TEMPLATE[key]}
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
                        <p className="refugee-label">{label}</p>
                        <textarea
                            className="refugee-detail-text"
                            value={editBufferValue}
                            onChange={(e) => handleEdit(e, detailKey)}>
                        </textarea>
                    </React.Fragment>
                )
            default:
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
    } else {
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

export default Refugee