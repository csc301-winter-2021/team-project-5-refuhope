import React, { useState, useEffect } from 'react'
import './Form.css'

// Structure to represnt an interval.
const interval = { startHour: -1, startMinute: -1, endHour: -1, endMinute: -1 }
const DAYS = ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"]
/**
 * Template used to create the default state of the Form component. It contains ALL the fields
 * necessary to create any combination of Refugee, Opporunity and Grocery, Tutoring.  
 */
const defaultState = {
    name: "",
    email: "",
    phone: "",
    title: "",
    city: "",
    province: "",
    schedule:
        { mon: null, tues: null, wed: null, thurs: null, fri: null, sat: null, sun: null },
    numWorkHours: 0,
    workType: "GROCERIES",
    status: "",
    additionalInfo: "",
    hasCar: false,
    hasPhone: false,
    subject: "MATH",
    level: "1"
}

/**
 *  Form component that dynamically generates the fields required for a specified combination of
 *  formType, and workType (which is determined by one of the fields of form itself).
 * 
 * @param {String} formType     Determines the fields of the work (second) form. 
 *                              Must be "REFUGEE" or "OPPORTUNITY"
 * @param {Object}  init        Initial state for Form. If null, the default state is used instead.
 * @param {Function} save       Callback that is executed when the form is saved. The stateful
 *                              object formValues is passed as its sole argument; it is up to the 
 *                              caller to extract the exact set of attributes they require.
 * @param {Function} cancel     Callback that is executed when the cancel button is pressed.
 * 
 * 
 */
const Form = ({ formType, init, save, cancel }) => {

    const [page, setPage] = useState(0)
    // If a not-null initial state is specified, use it. Otherwise, initialize default state.
    const [formValues, setFormValues] = useState(() => init ? init : defaultState)

    // If the initial state is an object originating from the server, its schedule might not contain
    // all 7 days
    useEffect(() => {
        let keys = Object.keys(formValues.schedule)
        DAYS.forEach(day => {
            if (!keys.includes(day)) {
                formValues.schedule[day] = null
            }
        })
    }, [])

    const changePage = (incr) => {
        let newPage = Math.abs(page + incr) % 3
        setPage(newPage)
    }

    const renderFormPage = () => {
        if (page === 0) {
            return <Details formType={formType} handleEdit={handleEdit}  {...formValues} />
        } else if (page === 1) {
            return <ScheduleDetails formType={formType} handleEdit={handleEdit}  {...formValues} />
        } else if (formValues.workType === "TUTORING") {
            return <TutoringOpportunity handleEdit={handleEdit} {...formValues} />
        } else {
            return <GroceryOpportunity handleEdit={handleEdit}  {...formValues} />
        }
    }

    const handleEdit = (key, value) => {

        let updatedInfo = { ...formValues }

        // Modifications to need to be handled carefully.
        if (key.includes("schedule")) {

            // Determine which interval has been modified.
            let position = key.includes("start") ? "start" : "end"
            let day = key.split("-")[0]
            let hour = parseInt(value.split(":")[0])
            let minute = parseInt(value.split(":")[1])

            if (updatedInfo.schedule[day] === null) {
                updatedInfo.schedule[day] = Object.create(interval)
            }

            if (position === "start") {
                updatedInfo.schedule[day].startHour = hour
                updatedInfo.schedule[day].startMinute = minute
            } else {
                updatedInfo.schedule[day].endHour = hour
                updatedInfo.schedule[day].endMinute = minute
            }
        } else {
            updatedInfo[key] = value
        }

        setFormValues(updatedInfo)
    }

    const saveForm = () => {

        // Remove empty days from schedule.
        DAYS.forEach(day => {
            if (formValues.schedule[day] === null) {
                delete formValues.schedule[day]
            }
        })

        save(formValues)
    }

    return (
        <div className="form-container">
            {/* Save/Cancel buttons */}
            <div className="form-btn-tray-top">
                <button onClick={(e) => saveForm()}>Save</button>
                <button onClick={(e) => cancel()}>Cancel</button>
            </div>
            {/* Conditional rendering of the form's fields. */}
            {renderFormPage()}
            {/* Pagination buttons. */}
            <div className="form-btn-tray">
                <button onClick={(e) => changePage(1)}>Next</button>
                <button onClick={(e) => changePage(-1)}>Back</button>
            </div>
        </div>
    )
}

/**
 * Generates the non-work related fields needed to create a new Refugee or Opportunity.
 * 
 * @param {String} formType     Must be one of "REFUGEE" or "OPPORTUNITY".
 * @param {Function} handleEdit Callback that updates the state of caller component (Form) according
 *                              to the specified key,value pair.
 * @param {Object} props        A copy of the attributes of the formValues state of the Form        
 *                              component.
 * 
 * Note that these arguments are actually passed in as a combined object, but are de-strucutred
 * within the Details component.
 */
const Details = ({ formType, handleEdit, ...props }) => {
    return (
        <div>
            {formType === "REFUGEE" ?
                // If formType is "REFUGEE", remove title field and add name and email fields.
                <React.Fragment>
                    <p className="form-header">Refugee Details</p>
                    <p className="form-label">Name</p>
                    <input
                        id="name"
                        className="form-detail"
                        value={props.name}
                        onChange={e => handleEdit(e.target.id, e.target.value)}
                    ></input>
                    <div className="form-location-tray">
                        <div>
                            <p className="form-label">Email</p>
                            <input
                                id="email"
                                className="form-detail"
                                value={props.email}
                                onChange={e => handleEdit(e.target.id, e.target.value)}
                            ></input>
                        </div>
                        <p></p>
                        <div>
                            <p className="form-label">Phone</p>
                            <input
                                id="phone"
                                className="form-detail"
                                value={props.phone}
                                onChange={e => handleEdit(e.target.id, e.target.value)}
                            ></input>
                        </div>
                    </div>

                </React.Fragment>
                :
                // formType is "OPPORTUNITY"; remove name and email fields, and add title field.
                <React.Fragment>
                    <p className="form-header">Opportunity Details</p>
                    <p className="form-label">Title</p>
                    <input
                        id="title"
                        className="form-detail"
                        value={props.title}
                        onChange={e => handleEdit(e.target.id, e.target.value)}
                    ></input>
                </React.Fragment>
            }

            <div className="form-location-tray">
                <div>
                    <p className="form-label">City</p>
                    <input
                        id="city"
                        className="form-detail"
                        value={props.city}
                        onChange={e => handleEdit(e.target.id, e.target.value)}
                    ></input>
                </div>
                <p></p>
                <div>
                    <p className="form-label">Province</p>
                    <input
                        id="province"
                        className="form-detail"
                        value={props.province}
                        onChange={e => handleEdit(e.target.id, e.target.value)}
                    ></input>
                </div>
            </div>

            <p className="form-label">Work Hours</p>
            <input
                id="numWorkHours"
                className="form-detail"
                value={props.numWorkHours}
                onChange={e => handleEdit(e.target.id, e.target.value)}
            ></input>

            <p className="form-label">Work-Type</p>
            <select
                id="workType"
                className="form-drop-menu"
                value={props.workType}
                onChange={e =>
                    handleEdit(e.target.id, e.target.options[e.target.selectedIndex].value)
                }>
                <option className="form-drop-option" value="GROCERIES">GROCERIES</option>
                <option className="form-drop-option" value="TUTORING">TUTORING</option>
            </select>
        </div>
    )
}

/**
 * Generates the schedule related fields needed to create a new Refugee or Opportunity.
 * 
 * @param {String} formType     Must be one of "REFUGEE" or "OPPORTUNITY".
 * @param {Function} handleEdit Callback that updates the state of caller component (Form) according
 *                              to the specified key,value pair.
 * @param {Object} props        A copy of the attributes of the formValues state of the Form        
 *                              component.
 * 
 * Note that these arguments are actually passed in as a combined object, but are de-strucutred
 * within the Details component.
 */
const ScheduleDetails = ({ formType, handleEdit, ...props }) => {
    return (
        <div>
            <p className="form-header">Opportunity Schedule</p>
            <p className="form-label">Schedule</p>
            {DAYS.map(day => <ScheduleDetail key={day} handleEdit={handleEdit} day={day}  {...props} />)}
        </div>
    )
}

/**
 * Generates the schedule related fields of a day needed to create a new Refugee or Opportunity.
 * 
 * @param {Function} handleEdit Callback that updates the state of caller component (Form) according
 *                              to the specified key,value pair.
 * @param {String} day          Determines day of the week the fields are related to.
 * @param {Object} props        A copy of the attributes of the formValues state of the Form        
 *                              component.
 * 
 * Note that these arguments are actually passed in as a combined object, but are de-strucutred
 * within the Details component.
 */
const ScheduleDetail = ({ handleEdit, day, ...props }) => {

    let startHour, startMinute, endHour, endMinute

    if (props.schedule[day] === null) {
        startHour = startMinute = endHour = endMinute = ""
    } else {
        startHour = props.schedule[day].startHour.toString().padStart(2, "0")
        startMinute = props.schedule[day].startMinute.toString().padStart(2, "0")
        endHour = props.schedule[day].endHour.toString().padStart(2, "0")
        endMinute = props.schedule[day].endMinute.toString().padStart(2, "0")
    }

    return (
        <div>
            <div className="form-time-tray">
                <p> {day.toUpperCase()} </p>
                {/* Date Start Interval*/}
                <input
                    id={`${day}-schedule-start`}
                    className="form-time"
                    type="time"
                    value={`${startHour}:${startMinute}`}
                    onChange={(e) => handleEdit(e.target.id, e.target.value)}>
                </input>
                <span> </span>
                {/* Date End Interval */}
                <input
                    id={`${day}-schedule-end`}
                    className="form-time"
                    type="time"
                    value={`${endHour}:${endMinute}`}
                    onChange={(e) => handleEdit(e.target.id, e.target.value)}>
                </input>
            </div>
        </div>
    )
}

/**
 * Generates the grocery-work related fields needed to create a new Refugee or Opportunity.
 * 
 * @param {Function} handleEdit Callback that updates the state of caller component (Form) according
 *                              to the specified key,value pair.
 * @param {Object} props        A copy of the attributes of the formValues state of the Form        
 *                              component.
 * 
 * Note that these arguments are actually passed in as a combined object, but are de-strucutred
 * within the Details component.
 */
const GroceryOpportunity = ({ handleEdit, ...props }) => {

    const handleDropDown = (event) => {
        const option = event.target.options[event.target.selectedIndex].value
        let bool = (option === "Yes") ? true : false
        handleEdit(event.target.id, bool)
    }

    return (
        <div>
            <p className="form-header">Work Details</p>

            {/* Car access dropdown */}
            <p className="form-label">Access to a Car</p>
            <select
                id="hasCar"
                className="form-drop-menu"
                value={props.hasCar ? "Yes" : "No"}
                onChange={e => handleDropDown(e)}>
                <option className="form-drop-option" value="Yes">Yes</option>
                <option className="form-drop-option" value="No">No</option>
            </select>

            {/* Phone access dropdown */}
            <p className="form-label">Access to a Phone</p>
            <select
                id="hasPhone"
                className="form-drop-menu"
                value={props.hasPhone ? "Yes" : "No"}
                onChange={e => handleDropDown(e)}>
                <option className="form-drop-option" value="Yes">Yes</option>
                <option className="form-drop-option" value="No">No</option>
            </select>

            {/* Additional information text field. */}
            <p className="form-label">Additional Information</p>
            <textarea
                id="additionalInfo"
                className="form-text-area"
                value={props.additionalInfo}
                onChange={e => handleEdit(e.target.id, e.target.value)}
            ></textarea>
        </div>
    )
}

/**
 * Generates the tutoring-work related fields needed to create a new Refugee or Opportunity.
 * 
 * @param {Function} handleEdit Callback that updates the state of caller component (Form) according
 *                              to the specified key,value pair.
 * @param {Object} props        A copy of the attributes of the formValues state of the Form        
 *                              component.
 * 
 * Note that these arguments are actually passed in as a combined object, but are de-strucutred
 * within the Details component.
 */
const TutoringOpportunity = ({ handleEdit, ...props }) => {

    const SUBJECTS = ["MATH", "BIOLOGY", "CHEMISTRY", "PHYSICS", "ENGLISH", "SOCIAL STUDIES", "HISTORY", "GEOGRAPHY", "COMPUTER SCIENCE"]
    const HIGHEST_GRADE = 12

    const generateLevels = () => {
        let optionsList = []
        for (let i = 1; i <= HIGHEST_GRADE; i++) {
            optionsList.push(<option key={i} className="form-drop-option">{i}</option>)
        }
        return optionsList
    }

    const generateSubjects = () => {
        let optionsList = SUBJECTS.map(sub => {
            return <option key={sub} className="form-drop-option" value={sub}>{sub}</option>
        })
        return optionsList
    }

    return (
        <div>
            <p className="form-header">Work Details</p>

            {/* Subject Dropdown */}
            <p className="form-label">Subject</p>
            <select
                id="subject"
                className="form-drop-menu"
                value={props.subject}
                onChange={e =>
                    handleEdit(e.target.id, e.target.options[e.target.selectedIndex].value)
                }>
                {generateSubjects()}
            </select>

            {/* Grade-level Dropdown */}
            <p className="form-label">Highest Level</p>
            <select
                id="level"
                className="form-drop-menu"
                value={props.level}
                onChange={e =>
                    handleEdit(e.target.id, e.target.options[e.target.selectedIndex].value)
                }>
                {generateLevels()}
            </select>

            {/* Additional information text field. */}
            <p className="form-label">Additional Information</p>
            <textarea
                id="additionalInfo"
                className="form-text-area"
                value={props.additionalInfo}
                onChange={e => handleEdit(e.target.id, e.target.value)}>
            </textarea>
        </div>
    )
}

export default Form
