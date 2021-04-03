import React, { useState } from 'react'
import './Form.css'

/**
 * Template used to create the initial state of the Form component. It contains ALL the fields
 * necessary to create any combination of Refugee, Opporunity and Grocery, Tutoring.  
 */
const initialState = {
    name: "",
    email: "",
    phone: "",
    title: "",
    city: "",
    province: "",
    schedule: [["",""], ["",""], ["", ""], ["", ""], ["", ""], ["", ""], ["", ""]],
    hours: "",
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
 * @param {Function} save       Callback that is executed when the form is saved. 
 * @param {Function} cancel     Callback that is executed when the cancel button is pressed.
 * 
 * 
 */
const Form = ({ formType, save, cancel }) => {

    const [page, setPage] = useState(0)
    const [formValues, setFormValues] = useState(initialState)

    const changePage = (incr) => {
        let newPage = Math.abs(page + incr) % 3
        setPage(newPage)
    }

    const renderFormPage = () => {
        if (page === 0) {
            return <Details formType={formType} handleEdit={handleEdit}  {...formValues} />
        }else if (page === 1) {
            return <ScheduleDetails formType={formType} handleEdit={handleEdit}  {...formValues} />
        } else if (formValues.workType === "TUTORING") {
            return <TutoringOpportunity handleEdit={handleEdit} {...formValues} />
        } else {
            return <GroceryOpportunity handleEdit={handleEdit}  {...formValues} />
        }
    }

    const handleEdit = (key, value) => {
        let updatedInfo = { ...formValues }
        if (key.includes("schedule")) {
            let position = 0
            if (key.includes("end")) {
                position = 1
            }
            updatedInfo["schedule"][parseInt(key)][position] = value
        } else {
            updatedInfo[key] = value
        }
        setFormValues(updatedInfo)
    }

    const saveForm = () => {

        const newObject = {
            workType: formValues.workType,
            city: formValues.city,
            schedule: formValues.schedule,
            numWorkHours: formValues.hours,
            additionalInfo: formValues.additionalInfo,
        }

        if (formType === "REFUGEE") {
            newObject.prov = formValues.province
            newObject.name = formValues.name
            newObject.email = formValues.email
            newObject.phone = formValues.phone
        } else if (formType === "OPPORTUNITY") {
            newObject.province = formValues.province
            newObject.title = formValues.title
        }

        if (formValues.workType === "TUTORING") {
            newObject.subjects = formValues.subject
            newObject.gradeLevel = formValues.level
        } else if (formValues.workType === "GROCERIES") {
            newObject.hasCar = formValues.hasCar
            newObject.hasPhone = formValues.hasPhone
        }

        console.log(newObject)
        save(newObject)
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
                id="hours"
                className="form-detail"
                value={props.hours}
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
            <ScheduleDetail handleEdit={handleEdit} day={"0"}  {...props} />
            <ScheduleDetail handleEdit={handleEdit} day={"1"}  {...props} />
            <ScheduleDetail handleEdit={handleEdit} day={"2"}  {...props} />
            <ScheduleDetail handleEdit={handleEdit} day={"3"}  {...props} />
            <ScheduleDetail handleEdit={handleEdit} day={"4"}  {...props} />
            <ScheduleDetail handleEdit={handleEdit} day={"5"}  {...props} />
            <ScheduleDetail handleEdit={handleEdit} day={"6"}  {...props} />

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
    const week = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    
    return (
        <div>
            <div className="form-time-tray">
                <p> { week[parseInt(day)] } </p>
                {/* Date Start Interval*/}
                <input 
                    id={`${day}-schedule-start`} 
                    className="form-time"
                    type="time" 
                    value={props.schedule[parseInt(day)][0]}
                    onChange={(e) => handleEdit(e.target.id, e.target.value)}>    
                </input>
                <span> </span>
                {/* Date End Interval */}
                <input 
                    id={`${day}-schedule-end`} 
                    className="form-time" 
                    type="time" 
                    value={props.schedule[parseInt(day)][1]}
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
