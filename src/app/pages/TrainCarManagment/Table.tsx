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
  } = props
  const [errors, setErrors] = useState<any>([])

  const [activeCar, setActiveCar] = useState({
    name: '',
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
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState<any>({})
  const handleUpdateUser = () => {
    saveUserDetails(activeCar)
  }
  const saveUserDetails = async (details: any, type = 'Updated') => {
    const response = await axios.post(saveUserDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      addToast(`Car ${type} successfully`, {appearance: 'success', autoDismiss: true})
    }
    getCarsList()
  }
 

  const handleChangeActions = (isDelete: boolean, id: any) => {
    let car = getSelectedCar(id)
    if (!isDelete) {
      setActiveCar({
        name: car.name,
        lastUpdated: car.lastUpdated,
        id: car.id,
      })
      setShowModal(true)
      setErrors([])
    } else {
      handleDelete(id)
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
                let car = getSelectedCar(carId)

                setActiveCar({
                  name: car.name,
                  lastUpdated: car.lastupdated,
                  id: car.id
                })
                setShowModal(true)
              }}
              className='fa fa-edit'
            ></i>
             <i
              style={{float: 'right', cursor: 'pointer'}}
              onClick={(e) => handleChangeActions(true, carId)}
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
