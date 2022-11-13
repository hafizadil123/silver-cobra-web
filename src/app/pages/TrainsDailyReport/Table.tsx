/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import {useToasts} from 'react-toast-notifications'
import './table.css'
import moment from 'moment'
import axios from 'axios'
type Props = {
  className: string
  trData: any[]
  thData: any[]
  drivers: any[]
  reloadApi: (type: string, data: any) => any
  selectedDate: any
}
const baseUrl = process.env.REACT_APP_API_URL

const ReportTable: React.FC<Props> = ({
  className,
  trData,
  thData,
  drivers,
  reloadApi,
  selectedDate,
}) => {
  const {addToast} = useToasts()
  const [y, setY] = useState(0)
  const [stickyCss, setStickyCss] = useState('')
  const handleToastMessage = (message: any, appearance: any) => {
    addToast(message, {appearance: appearance, autoDismiss: true})
  }
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

  return (
    <div className={`card ${className}`}>
      <div className='card-body py-3'>
        {/* begin::Table container */}
        {trData.length > 0 && thData.length > 0 ? (
          <div>
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
                          severity={severity}
                          driverName={driverName}
                          signedByDriver={signedByDriver}
                          status={status}
                          trainId={trainId}
                          drivers={drivers}
                          handleToastMessage={handleToastMessage}
                          index={index}
                          className='min-w-150px'
                          text={trainName}
                          reloadApi={reloadApi}
                          selectedDate={selectedDate}
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
                          return (
                            <TableDataView
                              index={index}
                              carId={carId}
                              severity={severity}
                              status={status}
                              carName={carName}
                              handleToastMessage={handleToastMessage}
                              checkId={checkId}
                              trainId={trainId}
                              reloadApi={reloadApi}
                              checkValue={checkValue}
                              flexValue={1}
                              text={carName}
                              selectedDate={selectedDate}
                            />
                          )
                        })}
                      </tr>
                    )
                  })}
                  <tr>
                    {}
                    {thData.map((item: any, index: any) => {
                      const {notes, trainId} = item
                      return (
                        <TableFootView
                          index={index}
                          handleToastMessage={handleToastMessage}
                          trainId={trainId}
                          flexValue={1}
                          text={notes}
                          reloadApi={reloadApi}
                          selectedDate={selectedDate}
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

export {ReportTable}
const TableDataView = (props: any) => {
  const {
    flexValue,
    text,
    type,
    className,
    index,
    carId,
    checkId,
    checkValue,
    trainId,
    reloadApi,
    handleToastMessage,
    selectedDate,
    severity,
  } = props
  const SaveTrainDailyCheckValue = `${baseUrl}/api/Common/SaveTrainDailyCheckValue`
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

    const response = await axios.post(SaveTrainDailyCheckValue, dataToSend, headerJson)
    if (response.data.result == true) {
      handleToastMessage(`שדה בדיקה עודכן בהצלחה`, 'success')
      reloadApi('checkValue', dataToSend)
    } else {
      handleToastMessage(response.data.message, 'error')
    }
    //
  }
  const renderFields = () => {
    return (
      <td
        className={`${className}  ${index === 0 ? 'table_header' : 'table_inner_rows'}  ${
          severity === 1 ? 'bg-red' : ''
        }`}
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
  const {flexValue, text, index, trainId, handleToastMessage, reloadApi, selectedDate} = props
  const [notes, setNotes] = useState('')

  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  const SaveTrainDailyNotes = `${baseUrl}/api/Common/SaveTrainDailyNotes`
  const handleUpdateNote = async (value: any) => {
    setNotes(value)
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
      notes: value,
      date: dateFormatted,
    }

    const response = await axios.post(SaveTrainDailyNotes, dataToSend, headerJson)
    if (response.data.result == true) {
      reloadApi('notes', dataToSend)
      handleToastMessage(`שדה הערות עודכן בהצלחה`, 'success')
      // reloadApi('checkValue', dataToSend)
    } else {
      handleToastMessage(response.data.message, 'error')
    }
  }
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
              onChange={(e) => setNotes(e.target.value)}
              onBlur={(e) => {
                handleUpdateNote(e.target.value)
              }}
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
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  const SaveTrainDailyStatus = `${baseUrl}/api/Common/SaveTrainDailyStatus`
  const SaveTrainDailyDriverEndPoint = `${baseUrl}/api/Common/SaveTrainDailyDriver`

  const {
    text,
    className,
    index,
    drivers,
    driverName,
    driverId,
    status,
    trainId,
    reloadApi,
    handleToastMessage,
    selectedDate,
    severity,
    signedByDriver,
  } = props
  const [selectedDriver, setSelectedDriver] = useState('')
  useEffect(() => {
    if (driverId == null || driverId === undefined || driverId == '') {
      setSelectedDriver('')
    } else {
      setSelectedDriver(driverId)
    }
  }, [driverId])
  const handleChangeTrainStatus = async (statusToChange: number) => {
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

    const DataToSend = {
      status: statusToChange,
      trainId,
      date: dateFormatted,
    }

    const response = await axios.post(SaveTrainDailyStatus, DataToSend, headerJson)
    // reloadApi()
    if (response.data.result == true) {
      reloadApi('trainStatus', DataToSend)
      handleToastMessage(`סטטוס רכבת עודכן בהצלחה`, 'success')
    } else {
      handleToastMessage(response.data.message, 'error')
    }
  }
  const handleDriverChangeUpdate = async (value: any) => {
    setSelectedDriver(value)
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
      date: dateFormatted,
      driverId: Number(value),
    }
    const response = await axios.post(SaveTrainDailyDriverEndPoint, dataToSend, headerJson)
    if (response.data.result == true) {
      handleToastMessage(`נהג עודכן בהצלחה`, 'success')
      reloadApi('driver', dataToSend)
    } else {
      handleToastMessage(response.data.message, 'error')
    }
  }
  return (
    <th
      style={{minWidth: '100px !important'}}
      className={`${className} ${severity === 1 ? 'bg-red' : ''}`}
    >
      {index === 0 ? (
        <span>{text}</span>
      ) : (
        <>
          <div>
            <span className='header_fix'>{text}</span>
            <br />
            {/* Status */}
            {/* {driverName !== null ? <span>Driver : {driverName}</span> : null}<br /> */}
            <select
              className='form-control-sm'
              style={{
                marginRight: '20px',
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onChange={(e) => {
                handleDriverChangeUpdate(e.target.value)
              }}
              value={selectedDriver}
            >
              <option value=''></option>
              {drivers?.map((driver: any) => {
                return <option value={driver.id}>{driver.name}</option>
              })}
            </select>
            <br />
            <span>{signedByDriver}</span>
          </div>
        </>
      )}
    </th>
  )
}
