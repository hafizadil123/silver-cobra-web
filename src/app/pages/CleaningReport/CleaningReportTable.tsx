/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import {useToasts} from 'react-toast-notifications'
import './table.css'
import axios from 'axios'
import moment from 'moment'
type Props = {
  className: string
  trData: any[]
  thData: any[]
  drivers: any[]
  updateData: (data: any, type: any) => any
  selectedDate: any
}

const CleaningReportTable: React.FC<Props> = ({
  className,
  trData,
  thData,
  drivers,
  updateData,
  selectedDate,
}) => {
  const {addToast} = useToasts()
  const handleToastMessage = (message: any, appearance: any) => {
    addToast(message, {appearance: appearance, autoDismiss: true})
  }
  const [y, setY] = useState(0)
  const [stickyCss, setStickyCss] = useState('')
  const handleNavigation = (e: any) => {
    const window = e.currentTarget
    if (window.scrollY >= 176) {
      setStickyCss('white')
    } else if (y < window.scrollY) {
      setStickyCss('')
    }
    setY(window.scrollY)
  }

  useEffect(() => {
    setY(window.scrollY)

    window.addEventListener('scroll', (e) => handleNavigation(e))
  }, [])

  let px = '65px'
  return (
    <div className={`card ${className}`}>
      <div className='card-body py-3'>
        {/* begin::Table container */}
        {trData.length > 0 && thData.length > 0 ? (
          <div className='table-responsive'>
            {/* begin::Table */}
            <div className='tscroll'>
              <table className='table fixed-table colum-divider'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bolder text-muted'>
                    {thData.map((item: any, index) => {
                      const {
                        driverId,
                        driverName,
                        notes,
                        status,
                        trainId,
                        trainName,
                        severity,
                        signedByDriver,
                      } = item
                      return (
                        <TableHeadView
                          driverId={driverId}
                          driverName={driverName}
                          status={status}
                          severity={severity}
                          trainId={trainId}
                          drivers={drivers}
                          index={index}
                          className='min-w-150px'
                          text={trainName}
                          selectedDate={selectedDate}
                          signedByDriver={signedByDriver}
                        />
                      )
                    })}
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {trData.map((item: any, index: any) => {
                    return (
                      <tr>
                        {item.map((_item: any, index: any) => {
                          const {carId, carName, checkId, checkValue, trainId, status, severity} =
                            _item
                          // const {carId, carName, checkId, checkValue} = _item
                          return (
                            <TableDataView
                              handleToastMessage={handleToastMessage}
                              index={index}
                              severity={severity}
                              flexValue={1}
                              carId={carId}
                              checkId={checkId}
                              updateData={updateData}
                              checkValue={checkValue}
                              trainId={trainId}
                              text={carName}
                              selectedDate={selectedDate}
                            />
                          )
                        })}
                      </tr>
                    )
                  })}
                  <tr>
                    {thData.map((item: any, index: any) => {
                      const {notes, trainId} = item
                      return (
                        <TableFootView
                          handleToastMessage={handleToastMessage}
                          index={index}
                          trainId={trainId}
                          flexValue={1}
                          text={notes}
                          selectedDate={selectedDate}
                          updateData={updateData}
                        />
                      )
                    })}
                  </tr>
                </tbody>
                {/* end::Table body */}
              </table>
            </div>
            {/* end::Table */}
          </div>
        ) : (
          <p>לא נמצאו נתונים</p>
        )}

        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {CleaningReportTable}
const TableDataView = (props: any) => {
  const {
    text,
    className,
    index,
    carId,
    checkId,
    trainId,
    checkValue,
    handleToastMessage,
    updateData,
    selectedDate,
    severity,
  } = props
  const baseUrl = process.env.REACT_APP_API_URL
  const SaveTrainCleaningCheckValue = `${baseUrl}/api/Common/SaveTrainDailyCleaningCheckValue`
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }
  const handleUpdateCheckValue = async (statusToChange: boolean) => {
    let date
    let dateFormatted
    // let date = new Date()
    // let dateFormatted = moment(date).format('yyyy-MM-DD')
    if (selectedDate == '') {
      date = new Date()
      dateFormatted = moment(date).format('yyyy-MM-DD')
    } else {
      date = new Date(selectedDate)
      dateFormatted = moment(date).format('yyyy-MM-DD')
    }
    const dataToSend = {
      trainId,
      checkValue: statusToChange,
      checkid: checkId,
      carid: carId,
      date: dateFormatted,
    }

    const response = await axios.post(SaveTrainCleaningCheckValue, dataToSend, headerJson)
    if (response.data.result == true) {
      updateData(dataToSend, 'checkValue')
      handleToastMessage(`שדה בדיקה עודכן בהצלחה`, 'success')
    } else {
      handleToastMessage(response.data.message, 'error')
    }

    //

    // reloadApi()
  }
  const getBackgroundColorAccordingToSeverity = (severity: any) => {
    switch (severity) {
      case 1:
        return 'bg-red'
      case -1:
        return 'bg-green'
      case -2:
        return 'bg-grey'
    }
  }
  const renderFields = () => {
    return (
      <td
        className={`${className}  ${
          index === 0 ? 'table_header' : 'table_inner_rows'
        } ${getBackgroundColorAccordingToSeverity(severity)}`}
        style={{minWidth: '100px'}}
      >
        {index === 0 ? (
          <span style={{float: 'right'}}> {text}</span>
        ) : (
          <>
            <span style={{float: 'right'}}> {text}</span>
            <span style={{float: 'left'}}>
              <button
                onClick={() => {
                  handleUpdateCheckValue(false)
                }}
                className='btn btn-secondary btn-sm'
                style={{
                  background: checkValue == false ? '#3F4254' : '#E4E6EF',
                  marginLeft: '16px',
                }}
              >
                <i
                  className='fa fa-times'
                  style={{color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
                ></i>
                {/* {'sssss' + checkValue} */}
              </button>
              <button
                onClick={() => {
                  handleUpdateCheckValue(true)
                }}
                className='btn btn-secondary btn-sm'
                style={{background: checkValue == true ? '#3F4254' : '#E4E6EF'}}
              >
                <i
                  className='fa fa-check'
                  style={{color: '#1dd61d', fontWeight: 'bold', cursor: 'pointer'}}
                  aria-hidden='true'
                ></i>
              </button>
            </span>
          </>
        )}
      </td>
    )
  }

  return <>{renderFields()}</>
}

const TableFootView = (props: any) => {
  const {flexValue, text, index, trainId, handleToastMessage, updateData, selectedDate} = props
  const baseUrl = process.env.REACT_APP_API_URL
  const SaveTrainCleaningNotes = `${baseUrl}/api/Common/SaveTrainDailyCleaningNotes`
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }
  const handleUpdateNote = async () => {
    let date
    let dateFormatted
    // let date = new Date()
    // let dateFormatted = moment(date).format('yyyy-MM-DD')
    if (selectedDate == '') {
      date = new Date()
      dateFormatted = moment(date).format('yyyy-MM-DD')
    } else {
      date = new Date(selectedDate)
      dateFormatted = moment(date).format('yyyy-MM-DD')
    }
    const dataToSend = {
      trainId,
      notes: notes,
      // date: dateFormatted,
    }

    const response = await axios.post(SaveTrainCleaningNotes, dataToSend, headerJson)
    if (response.data.result == true) {
      updateData(dataToSend, 'checkValue')
      handleToastMessage(`שדה בדיקה עודכן בהצלחה`, 'success')
    } else {
      handleToastMessage(response.data.message, 'error')
    }
  }
  const [notes, setNotes] = useState('')
  useEffect(() => {
    //
    setNotes(text)
  }, [text])

  const renderFields = () => {
    return (
      <td style={{minWidth: '100px'}} className={` ${index === 0 ? 'table_header' : ''}`}>
        {index !== 0 ? (
          <>
            <label>הערות</label>
            <input
              type='text'
              onChange={(e) => {
                setNotes(e.target.value)
              }}
              onBlur={() => handleUpdateNote()}
              value={notes}
              className='form-control-sm'
            />
          </>
        ) : null}
      </td>
    )
  }

  return <>{renderFields()}</>
}

const TableHeadView = (props: any) => {
  const {text, className, index, status, trainId, selectedDate, severity, signedByDriver} = props

  // const handleChangeTrainStatus = (statusToChange: number) => {
  //   let date = new Date()
  //   let dateFormatted = moment(date).format('yyyy-MM-DD')
  //
  //   const DataToSend = {
  //     status: statusToChange,
  //     trainId,
  //     date: dateFormatted,
  //   }
  //
  // }
  const getBackgroundColorAccordingToSeverity = (severity: any) => {
    switch (severity) {
      case 1:
        return 'bg-red'
      case -1:
        return 'bg-green'
      case -2:
        return 'bg-grey'
    }
  }
  return (
    <>
      <th
        style={{minWidth: '100px !important'}}
        className={`${className} ${getBackgroundColorAccordingToSeverity(severity)} `}
      >
        <span>{text}</span>
        <br />
        <span> {signedByDriver}</span>
      </th>
    </>
    //     <span>{text}</span>
    // <th style={{minWidth: '530px !important'}} className={`${className}`}>
    //   {index === 0 ? (
    //     <span>{text}</span>
    //   ) : (
    //     <>
    //       <span style={{float: 'right'}}>{text}</span>

    //       {/* Status */}

    //       <button
    //         onClick={() => {
    //           handleChangeTrainStatus(0)
    //         }}
    //         style={{marginRight: '20px', background: status === 0 ? '#3F4254' : '#E4E6EF'}}
    //         className='btn btn-secondary btn-sm'
    //       >
    //         <i
    //           className='fa fa-times'
    //           style={{color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
    //         ></i>
    //       </button>
    //       <button
    //         onClick={() => {
    //           handleChangeTrainStatus(1)
    //         }}
    //         style={{background: status === 1 ? '#3F4254' : '#E4E6EF'}}
    //         className='btn btn-secondary btn-sm'
    //       >
    //         <i
    //           onClick={() => {
    //
    //           }}
    //           className='fa fa-check'
    //           style={{color: '#1dd61d', fontWeight: 'bold', cursor: 'pointer'}}
    //           aria-hidden='true'
    //         ></i>
    //       </button>
    //     </>
    //   )}
    // </th>
  )
}
