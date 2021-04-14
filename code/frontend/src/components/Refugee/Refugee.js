import React from 'react'
import './Refugee.css'

/**
 * Creates a mapping between the attributes of a Refugee, and labels. Enables us to programatically
 * generate a list of HTML elements. 
 */
const REFUGEE_TEMPLATE = {
    name: "NAME",
    phone: "PHONE",
    email: "EMAIL",
    location: "LOCATION",
    workType: "WORK TYPE",
    additionalInfo: "ADDITIONAL INFO"
}

/**
 *  Component that represents and displays a summarized set of details of a given Refugee.
 * 
 *  @param {Object} props   Expects props to have the following string attributes: name, phone,
 *                          email, location, workType, and additionalInfo. Additionally, props must
 *                          also contain an edit attribute, which is a callback that will be
 *                          executed when the edit button is pressed.                            
 */
const Refugee = (props) => {

    const createBody = () => {
        // Create a label and Detail component for each attribute of Refugee.
        const details = Object.keys(REFUGEE_TEMPLATE).map(key => {
            return (
                <RefugeeDetail
                    key={key}
                    label={REFUGEE_TEMPLATE[key]}
                    value={props[key]}
                ></RefugeeDetail>
            )
        })
        return details
    }

    return (
        <div className="refugee-card">
            <div className="refugee-card-btn-tray">
                <button onClick={() => props.edit(props._id)}>Edit</button>
            </div>
            {createBody()}
        </div>
    )
}

export const RefugeeDetail = (props) => {

    const { label, value } = props

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

export default Refugee