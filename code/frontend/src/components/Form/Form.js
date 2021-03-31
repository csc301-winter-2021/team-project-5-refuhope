import React, { useState } from 'react'
import './Form.css'

import Post, { Detail, POST_TEMPLATE } from '../Post/Post'

const formKeys = {
    title: "TITLE",
    status: "STATUS",
    host: "HOST",
    workType: "WORK TYPE",
    location: "LOCATION",
    schedule: "SCHEDULE",
    hours: "HOURS PER WEEK",
    hasCar: false,
    hasPhone: false,
    education: "EDUCATION",
    gradeLevel: "GRADE LEVEL",
    additionalInfo: "ADDITIONAL INFO"
}
/**
 * formType - Either "REFUGEE" or "OPPORTUNITY"
 */
const Form = ({ formType, workType }) => {

    const [page, setPage] = useState(0)
    const [newForm, setNewForm] = useState(Object.create(formKeys))

    const changePage = (incr) => {
        let newPage = Math.abs(page + incr) % 2
        setPage(newPage)
    }

    const getFormPage = () => {

        if (page == 0) {
            return (
                <Details
                    formType={formType}
                ></Details>
            )
        } else if (page == 1) {
            if (workType === "TUTORING") {
                return (
                    <TutoringOpportunity>
                    </TutoringOpportunity>
                )
            } else if (workType === "GROCERIES") {
                return (
                    <GroceryOpportunity>
                    </GroceryOpportunity>
                )
            }
        }
    }

    return (
        <div className="form-container">
            {getFormPage()}
            <div className="form-btn-tray">
                <button onClick={(e) => changePage(1)}>Next</button>
                <button onClick={(e) => changePage(-1)}>Back</button>
            </div>
        </div>
    )
}

const Details = (props) => {

    return (
        <div>
            {/* 
                The only difference between refugee and opportunity forms is the header and 
                title/name fields.
            */}
            {props.formType === "REFUGEE" ?
                <React.Fragment>
                    <h1 className="form-header">Refugee Details</h1>

                    <p className="form-label">Name</p>
                    <input
                        id="name"
                        className="form-detail"
                        value={props.name}
                    ></input>
                </React.Fragment>
                :
                <React.Fragment>
                    <h1 className="form-header">Opportunity Details</h1>

                    <p className="form-label">Title</p>
                    <input
                        id="name"
                        className="form-detail"
                        value={props.title}
                    ></input>
                </React.Fragment>
            }

            <p className="form-label">City</p>
            <input
                id="city"
                className="form-detail"
                value={props.city}
            ></input>

            <p className="form-label">Province</p>
            <input
                id="province"
                className="form-detail"
                value={props.province}
            ></input>

            <p className="form-label">Schedule</p>
            <input
                id="schedule"
                className="form-detail"
                value={props.schedule}
            ></input>

            <p className="form-label">Work Hours</p>
            <input
                id="hours"
                className="form-detail"
                value={props.hours}
            ></input>

            <p className="form-label">Work-Type</p>
            <select className="form-drop-menu">
                <option className="form-drop-option">GROCERIES</option>
                <option className="form-drop-option">TUTORING</option>
            </select>
        </div>
    )
}

const GroceryOpportunity = (props) => {
    return (
        <div>
            <h1 className="form-header">Work Details</h1>

            <p className="form-label">Access to a Car</p>
            <select className="form-drop-menu">
                <option className="form-drop-option">Yes</option>
                <option className="form-drop-option">No</option>
            </select>

            <p className="form-label">Access to a Phone</p>
            <select className="form-drop-menu">
                <option className="form-drop-option">Yes</option>
                <option className="form-drop-option">No</option>
            </select>

            <p className="form-label">Additional Information</p>
            <textarea
                id="additionalInfo"
                className="form-text-area"
                value={props.additionalInfo}
            ></textarea>
        </div>
    )
}

const TutoringOpportunity = (props) => {
    return (
        <div>
            <h1 className="form-header">Work Details</h1>

            <p className="form-label">Subject</p>
            <select className="form-drop-menu">
                <option className="form-drop-option">Math</option>
                <option className="form-drop-option">Biology</option>
                <option className="form-drop-option">Chemistry</option>
                <option className="form-drop-option">Physics</option>
                <option className="form-drop-option">English</option>
                <option className="form-drop-option">History</option>
                <option className="form-drop-option">Social Studies</option>
                <option className="form-drop-option">Geography</option>
            </select>

            <p className="form-label">Highest Level</p>
            <select className="form-drop-menu">
                <option className="form-drop-option">01</option>
                <option className="form-drop-option">02</option>
                <option className="form-drop-option">03</option>
                <option className="form-drop-option">04</option>
                <option className="form-drop-option">05</option>
                <option className="form-drop-option">06</option>
                <option className="form-drop-option">07</option>
                <option className="form-drop-option">08</option>
                <option className="form-drop-option">09</option>
                <option className="form-drop-option">10</option>
                <option className="form-drop-option">11</option>
                <option className="form-drop-option">12</option>
            </select>

            <p className="form-label">Additional Information</p>
            <textarea
                id="additionalInfo"
                className="form-text-area"
                value={props.additionalInfo}
            ></textarea>
        </div>
    )
}

export default Form
