import React, { useState } from 'react'
import './Opportunity.css'

/**
 * Creates a mapping between the attributes of an Opportunity, and labels. Enables us to 
 * programatically generate a list of HTML elements. 
 */
const POST_TEMPLATE = {
    title: "TITLE",
    status: "STATUS",
    location: "LOCATION",
    workType: "WORK TYPE",
    hours: "HOURS PER WEEK",
    additionalInfo: "ADDITIONAL INFO"
}

/**
 *  Component that represents and displays a summarized set of details of a given Opportunity.
 * 
 *  @param {Object} props   Expects props to have the following string attributes: title, status,
 *                          location, workType, numWorkHours, and additionalInfo. Additionally,
 *                          props must contain an edit attribute, which is a callback that will be
 *                          executed when the edit button is pressed.
 */
const Opportunity = (props) => {

    const createBody = () => {
        // Create a label and Detail component for each attribute of Opportunity.
        const details = Object.keys(POST_TEMPLATE).map(key => {
            return (
                <OpportunityDetail
                    key={key}
                    label={POST_TEMPLATE[key]}
                    value={props[key]}
                ></OpportunityDetail>
            )
        })
        return details
    }

    return (
        <div className="post-card">
            <div className="post-card-btn-tray">
                <button onClick={() => props.edit(props._id)}>Edit</button>
            </div>
            {createBody()}
        </div>
    )
}

export const OpportunityDetail = (props) => {

    const { label, value } = props

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

export default Opportunity