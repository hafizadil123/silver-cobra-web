/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import {useToasts} from 'react-toast-notifications'
import {FormattedMessage} from 'react-intl'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'

import './user.css'
const API_URL = process.env.REACT_APP_API_URL

type Props = {
  className: string
  carsList: any[]
  getSelectedCar : (id: any) => any
  css: string
  getCarsList: ()=> any
  getUsersAfterUpdate: () => any
  handleDelete: any
}

const ReportTable: React.FC<Props> = ({
  carsList,
  className,
  getSelectedCar,
  css,
  getCarsList,
  handleDelete,
  getUsersAfterUpdate,
}) => {
  const [y, setY] = useState(0)
  const [stickyCss, setStickyCss] = useState('')
  const handleNavigation = (e: any) => {
    const window = e.currentTarget
    if (window.scrollY >= 238) {
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
  console.log({
    stickyCss,
    y,
    px: window.screenY,
  })

  console.log("carsList", carsList)
  return (
    <div className={`card ${className}`}>
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className={`table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3`}>
            {/* begin::Table head */}
            <thead style={{background: stickyCss, top: `${stickyCss && '65px'}`}}>
              <tr className='fw-bolder text-muted'>
                <TableHeadView className='' text={'שם קרון'} />
                <TableHeadView className='' text={'שם רכבת'} />
                <TableHeadView className='' text={'האם פעיל'} />
                <TableHeadView className='' text={'תאריך עדכון אחרון'} />
                <TableHeadView className='' text={'פעולות'} />
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {carsList.map((item: any, index: any) => {
                return (
                  <tr>
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={item.name}
                      getSelectedCar={getSelectedCar}
                      isEdit={false}
                    />
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={item.trainName}
                      getSelectedCar={getSelectedCar}
                      isEdit={false}
                    />
                    <td>
                      <input
                        type='checkbox'
                        checked={isItemEnabled(item.isEnabled)}
                        readOnly
                        disabled
                        style={{float: 'right'}}
                      />
                    </td>
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={item.lastUpdated}
                      getSelectedCar={getSelectedCar}
                      isEdit={false}                   
                    />
                  
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={`edit`}
                      getSelectedCar={getSelectedCar}
                      carId={item.id}
                      isEdit={true}
                      getCarsList={getCarsList}
                      isDelete={false}
                      id={item.id}
                      handleDelete={handleDelete}
                      getUsersAfterUpdate={getUsersAfterUpdate}
                      isEnabled={item.isEnabled}
                    />
                  </tr>
                )
              })}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {ReportTable}

const isItemEnabled = (value: any): boolean => {
  return value === true || value === 'true' || value === 1 || value === '1'
}

const TableDataView = (props: any) => {
  const [openSecondModal, setOpenSecondModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const getUser = JSON.parse(logged_user_detail)
  const {addToast} = useToasts()
  const initialValues = {
    oldPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
  }

  

  const formik = useFormik({
    initialValues,
    validationSchema: {},
    onSubmit: () => {},
  })

  const {
    isEdit,
    text,
    className,
    getSelectedCar,
    carId,
    getUsers,
    getCarsList,
    handleDelete,
    isEnabled,
  } = props
  const [errors, setErrors] = useState<any>([])

  const [activeCar, setActiveCar] = useState({
    name: '',
    lastUpdater: '',
    lastUpdated: '',
    id:'',
  })
  const baseUrl = process.env.REACT_APP_API_URL
  const logged_user_details: any = localStorage.getItem('logged_user_detail')

  const loggedInUserDetails = JSON.parse(logged_user_details)

  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }
  const saveUserDetailsEndPoint = `${baseUrl}/api/Common/SaveCarDetails`
  const getCarDetailsEndPoint = `${baseUrl}/api/Common/GetCarDetails`
  const setCarUsabilityEndPoint = `${baseUrl}/api/Common/SetCarUsability`
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState<any>({})
  const handleUpdateUser = () => {
    const type = activeCar.id ? 'Updated' : 'Created'
    saveUserDetails(activeCar, type)
  }
  const saveUserDetails = async (details: any, type = 'Updated') => {
    // Prepare data for SaveCarDetails API - only send id and name
    const dataToSend = {
      id: details.id ? parseInt(details.id) : 0,
      name: details.name,
    }

    const response = await axios.post(saveUserDetailsEndPoint, dataToSend, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      setShowModal(false)
      if (type === 'Created') {
        addToast('הקרון החדש נוצר בהצלחה', {appearance: 'success', autoDismiss: true})
      } else {
        addToast('עדכון התבצע בהצלחה', {appearance: 'success', autoDismiss: true})
      }
      getCarsList()
    }
  }

  const handleSetCarUsability = async (carId: number, isEnabled: boolean) => {
    try {
      const response = await axios.post(setCarUsabilityEndPoint, {
        carId: carId,
        isEnabled: isEnabled
      }, headerJson)
      
      if (response.data.result === true) {
        addToast('עדכון סטטוס הקרון בוצע בהצלחה', {appearance: 'success', autoDismiss: true})
        getCarsList()
      } else {
        addToast(response.data.message || 'שגיאה בעדכון סטטוס הקרון', {appearance: 'error', autoDismiss: true})
      }
    } catch (error) {
      console.error('Error setting car usability:', error)
      addToast('שגיאה בעדכון סטטוס הקרון', {appearance: 'error', autoDismiss: true})
    }
  }
 

  const handleChangeActions = (isDelete: boolean, id: any) => {
    if (!isDelete) {
      // Call GetCarDetails API
      getCarDetails(id)
    } else {
      handleDelete(id)
    }
  }

  const getCarDetails = async (id: number) => {
    try {
      const response = await axios.post(getCarDetailsEndPoint, {id: id}, headerJson)
      if (response && response.data && response.data.result) {
        const data = response.data
        setActiveCar({
          name: data.name || '',
          lastUpdater: data.lastUpdater || '',
          lastUpdated: data.lastUpdated || '',
          id: data.id || '',
        })
        setShowModal(true)
        setErrors([])
      }
    } catch (error) {
      console.error('Error fetching car details:', error)
      addToast('שגיאה בטעינת פרטי הקרון', {appearance: 'error', autoDismiss: true})
    }
  }

  const renderFields = () => {
   
    return (
      <td className={`${className} `}>
        {isEdit === false ? (
          <span style={{float: 'right'}}> {text}</span>
        ) : (
          <>
            {/* Modal Start */}
            <i
              style={{float: 'right', cursor: 'pointer' , marginLeft: '20px'}}
              onClick={(e) => {
                getCarDetails(carId)
              }}
              className='fa fa-edit'
            ></i>
            {isItemEnabled(isEnabled) ? (
              <button
                className='btn btn-danger mx-2'
                style={{float: 'right', cursor: 'pointer', marginLeft: '20px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px', paddingBottom: '5px'}}
                onClick={(e) => {
                  if (window.confirm('האם בטוח להשבית את הקרון?')) {
                    handleSetCarUsability(carId, false)
                  }
                }}
              >
                השבת
              </button>
            ) : (
              <button
                className='btn btn-success mx-2'
                style={{float: 'right', cursor: 'pointer', marginLeft: '20px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px', paddingBottom: '5px'}}
                onClick={(e) => {
                  if (window.confirm('האם בטוח להפעיל את הקרון?')) {
                    handleSetCarUsability(carId, true)
                  }
                }}
              >
                הפעל
              </button>
            )}
             <i
              style={{float: 'right', cursor: 'pointer'}}
              onClick={(e) => {
                if (window.confirm('האם בטוח למחוק את הקרון?')) {
                  handleChangeActions(true, carId)
                }
              }}
              className={`fa fa-trash`}
            ></i>
            <Modal
              show={showModal}
              style={{direction: 'rtl'}}
              onHide={() => {
                setShowModal(false)
                setOpenSecondModal(false)
                setStatus({})
              }}
              // style={{    minWidth: "700px"}}
              size='lg'
              backdrop='static'
              keyboard={false}
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <>
                  {!openSecondModal && (
                    <form>
                      {errors &&
                        errors.length > 0 &&
                        errors.map((item: any) => (
                          <>
                            <span style={{color: 'red'}}>{item}</span>
                            <br />
                          </>
                        ))}
                      <div className='form-group'>
                        <label>שם קרון</label>
                        <input
                          type='text'
                          maxLength={50}
                          value={activeCar.name}
                          onChange={(e) => {
                            setActiveCar({
                              ...activeCar,
                              name: e.target.value,
                            })
                          }}
                          className='form-control'
                        />
                      </div>
                      {activeCar.id && (
                        <>
                          <div className='form-group'>
                            <label>מעדכן אחרון</label>
                            <input
                              type='text'
                              value={activeCar.lastUpdater}
                              className='form-control'
                              readOnly
                              disabled
                            />
                          </div>
                          <div className='form-group'>
                            <label>תאריך עדכון אחרון</label>
                            <input
                              type='text'
                              value={activeCar.lastUpdated}
                              className='form-control'
                              readOnly
                              disabled
                            />
                          </div>
                        </>
                      )}
                       
                    </form>
                  )}

                  
                </>
              </Modal.Body>
              {!openSecondModal && (
                <Modal.Footer>
                  <div
                    className=''
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <button
                      type='button'
                      onClick={() => {
                        setShowModal(false)
                        handleUpdateUser()
                      }}
                      className='btn btn-primary'
                    >
                      שמירה
                    </button>
                  </div>
                </Modal.Footer>
              )}
            </Modal>

            {/* Modal End */}
          </>
        )}
      </td>
    )
  }

  return <>{renderFields()}</>
}

const TableHeadView = (props: any) => {
  const {text, className} = props

  return (
    <th className={`${className}`}>
      <span>{text}</span>
    </th>
  )
}
