/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import {useToasts} from 'react-toast-notifications'
import {Link} from 'react-router-dom'

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
        {thData.length > 0 ? (
          <div>
            {/* begin::Table */}
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
                // signedByDriver,
              } = item

              return (
                <TableHeadViewInFloatingDiv
                  driverId={driverId}
                  severity={severity}
                  driverName={driverName}
                  status={status}
                  trainId={trainId}
                  signedByDriver={signedByDriver}
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

const TableHeadViewInFloatingDiv = (props: any) => {
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
  const getDate = () => {
    let date
    let dateFormatted

    // let dateFormatted = moment(date).format('yyyy-MM-DD')
    if (selectedDate == '') {
      date = new Date()
      dateFormatted = moment(date).format('yyyy-MM-DD')
    } else {
      date = new Date(selectedDate)
      dateFormatted = moment(date).format('yyyy-MM-DD')
    }
    return dateFormatted
  }
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
      handleToastMessage(`סטטוס רכבת עודכן בהצלחה`, 'success')
      reloadApi('trainStatus', DataToSend)
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
  const urlText = text.replaceAll(' ', 'trainNameQuery')
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
    <div
      style={{
        minWidth: '100px !important',
        float: 'left',
        width: '24%',
        height: '150px',
        padding: '0.75rem 0.75rem',
        border: '1px dashed black',
        margin: '2px',
      }}
      className={`${className} ${getBackgroundColorAccordingToSeverity(severity)}`}
    >
      <>
        <div>
          <Link
            style={{fontSize: '16px', fontWeight: 'bold'}}
            to={`/trains-daily-report/${urlText}/${getDate()}`}
            className='header_fix'
          >
            {text}
          </Link>
          <br />

          {/* Status */}
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
              width: '85%',
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
    </div>
  )
}
