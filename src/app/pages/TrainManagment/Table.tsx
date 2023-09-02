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
  trainsList: any[]
  getSelectedTrain : (id: any) => any
  css: string
  getTrainsList: ()=> any
  getTrainsAfterUpdate: () => any
  handleDelete: any
  handleUpdateTrain: () =>any
}

const ReportTable: React.FC<Props> = ({
  trainsList,
  className,
  getSelectedTrain,
  css,
  getTrainsList,
  handleDelete,
  getTrainsAfterUpdate,
  handleUpdateTrain
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

  console.log("trainsList", trainsList)
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
                <TableHeadView className='' text={'תאריך עדכון אחרון'} />
                <TableHeadView className='' text={'האם פעילה'} />
                <TableHeadView className='' text={'פעולות'} />
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {trainsList.map((item: any, index: any) => {
                return (
                  <tr>
                    
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={item.name}
                      getSelectedTrain={getSelectedTrain}
                      isEdit={false}
                    
                    />
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={item.lastUpdated}
                      getSelectedTrain={getSelectedTrain}
                      isEdit={false}
                      
                    />
                  
                    <td>
                      {item.IsEnabled === true ? 
                    (
                        <div
                          className=''
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            paddingLeft: "60%"
                          }}
                        >
                          <button
                            type='button'
                            onClick={() => {
                              handleUpdateTrain()
                            }}
                            className='btn btn-success'
                          >
                            הפעל רכבת
                          </button>
                        </div>
                      )
                      : (
                        <div
                          className=''
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            paddingLeft: "60%"
                          }}
                        >
                          <button
                            type='button'
                            onClick={() => {
                              handleUpdateTrain()
                            }}
                            className='btn btn-danger'
                          >
                            כבה רכבת
                          </button>
                        </div>
                      )
                    }
                    </td> 
                   
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={`edit`}
                      getSelectedTrain={getSelectedTrain}
                      userId={item.id}
                      isEdit={true}
                      getTrainsList={getTrainsList}
                      isDelete={false}
                      id={item.id}
                      handleDelete={handleDelete}
                      getTrainsAfterUpdate={getTrainsAfterUpdate}
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

  const updatePasswordSchema = Yup.object().shape({
    NewPassword: Yup.string().required(),
    ConfirmPassword: Yup.string().required(),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: updatePasswordSchema,
    onSubmit: () => {},
  })

  const {
    isEdit,
    text,
    className,
    getTrainsList,
    getSelectedTrain,
    userId,
    handleDelete,
  } = props
  const [errors, setErrors] = useState<any>([])

  const [activeTrain, setActiveTrain] = useState({
    name: '',
    isEnabled: '',
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
  const saveTrainDetailsEndPoint = `${baseUrl}/api/Common/SaveTrainDetails`
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState<any>({})
  const handleUpdateTrain = () => {
    saveTrainDetails(activeTrain)
  }
  const saveTrainDetails = async (details: any, type = 'Updated') => {
    const response = await axios.post(saveTrainDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      addToast(`User ${type} successfully`, {appearance: 'success', autoDismiss: true})
    }
    getTrainsList()
  }



  const handleChangeActions = (isDelete: boolean, id: any) => {
    let train = getSelectedTrain(id)
    if (!isDelete) {
      setActiveTrain({
        name: train.name,
        isEnabled: train.isEnabled,
        lastUpdated: train.lastUpdated,
        id: train.id,
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
                // let user = getSelectedUser(userId)
                let train = getSelectedTrain(userId)

                setActiveTrain({
                  name: train.name,
                  isEnabled: train.isEnabled,
                  lastUpdated: train.lastupdated,
                  id: train.id
                })
                setShowModal(true)
              }}
              className='fa fa-edit'
            ></i>
             <i
              style={{float: 'right', cursor: 'pointer'}}
              onClick={(e) => handleChangeActions(true, userId)}
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
                        <label>שם רכבת</label>
                        <input
                          type='text'
                          value={activeTrain.name}
                          onChange={(e) => {
                            setActiveTrain({
                              ...activeTrain,
                              name: e.target.value,
                            })
                          }}
                          className='form-control'
                        />
                      </div>
                      <div className='form-group'>
                        <label>תאריך עדכון אחרון</label>
                        <input
                          type='text'
                          onChange={(e) => {
                            setActiveTrain({
                              ...activeTrain,
                              lastUpdated: e.target.value,
                            })
                          }}
                          value={activeTrain.lastUpdated}
                          className='form-control'
                        />
                      </div>
                      <div className='form-group'>
                        <label>האם פעילה</label>
                        <input
                          type='text'
                          onChange={(e) => {
                            setActiveTrain({
                              ...activeTrain,
                              isEnabled: e.target.value,
                            })
                          }}
                          value={activeTrain.isEnabled}
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
                        handleUpdateTrain()
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
