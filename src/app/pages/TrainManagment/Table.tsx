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
  handleSetTrainUsability: (trainId: number, isEnabled: boolean) => void
  getTrainDetails: (id: number) => void
}

const ReportTable: React.FC<Props> = ({
  trainsList,
  className,
  getSelectedTrain,
  css,
  getTrainsList,
  handleDelete,
  getTrainsAfterUpdate,
  handleSetTrainUsability,
  getTrainDetails,
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
                      <input
                        type='checkbox'
                        checked={isItemEnabled(item.IsEnabled)}
                        readOnly
                        disabled
                        style={{float: 'right'}}
                      />
                    </td>
                    {/* <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      text={item.userName}
                      userId={item.userId}
                      getSelectedUser={getSelectedUser}
                      userRoles={userRoles}
                      saveUserDetails={saveUserDetails}
                      isEdit={false}
                      resetUserPassword={resetUserPassword}
                      _initiateOtherPass={_initiateOtherPass}
                      _initateUpdateOtherPassMessage={_initateUpdateOtherPassMessage}
                      resetPasswordMessage={resetPasswordMessage}
                    />
                    <td>{item.isActive === true ? `✅` : `❌`}</td> */}
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
                      handleSetTrainUsability={handleSetTrainUsability}
                      getTrainDetails={getTrainDetails}
                      isEnabled={item.IsEnabled}
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
    resetUserPassword,
    getUsers,
    handleDelete,
    handleSetTrainUsability,
    getTrainDetails,
    isEnabled,
  } = props
  const [errors, setErrors] = useState<any>([])

  const [activeTrain, setActiveTrain] = useState({
    name: '',
    car1Id: '',
    car2Id: '',
    lastUpdater: '',
    lastUpdated: '',
    id:'',
    availableCars: [] as any[],
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
    const type = activeTrain.id ? 'Updated' : 'Created'
    saveTrainDetails(activeTrain, type)
  }
  const saveTrainDetails = async (details: any, type = 'Updated') => {
    // Prepare data for SaveTrainDetails API
    const dataToSend = {
      id: details.id ? parseInt(details.id) : 0,
      name: details.name,
      car1Id: details.car1Id ? parseInt(details.car1Id) : null,
      car2Id: details.car2Id ? parseInt(details.car2Id) : null,
    }

    const response = await axios.post(saveTrainDetailsEndPoint, dataToSend, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      setShowModal(false)
      if (type === 'Created') {
        addToast('הרכבת החדשה נוצרה בהצלחה', {appearance: 'success', autoDismiss: true})
      } else {
        addToast('עדכון התבצע בהצלחה', {appearance: 'success', autoDismiss: true})
      }
      getTrainsList()
    }
  }



  const handleChangeActions = (isDelete: boolean, id: any) => {
    if (!isDelete) {
      // Call GetTrainDetails API
      getTrainDetails(id)
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
              onClick={async (e) => {
                // Call GetTrainDetails API
                const baseUrl = process.env.REACT_APP_API_URL
                const getTrainDetailsEndPoint = `${baseUrl}/api/Common/GetTrainDetails`
                try {
                  const response = await axios.post(getTrainDetailsEndPoint, {id: userId}, headerJson)
                  if (response && response.data && response.data.result) {
                    const data = response.data
                    setActiveTrain({
                      name: data.name || '',
                      car1Id: data.car1Id != null && data.car1Id !== 0 ? String(data.car1Id) : '',
                      car2Id: data.car2Id != null && data.car2Id !== 0 ? String(data.car2Id) : '',
                      lastUpdater: data.lastUpdater || '',
                      lastUpdated: data.lastUpdated || '',
                      id: data.id ? String(data.id) : '',
                      availableCars: data.availableCars || [],
                    })
                    setShowModal(true)
                    setErrors([])
                  }
                } catch (error) {
                  console.error('Error fetching train details:', error)
                  addToast('שגיאה בטעינת פרטי הרכבת', {appearance: 'error', autoDismiss: true})
                }
              }}
              className='fa fa-edit'
            ></i>
            {isItemEnabled(isEnabled) ? (
              <button
                className='btn btn-danger mx-2'
                style={{float: 'right', cursor: 'pointer', marginLeft: '20px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px', paddingBottom: '5px'}}
                onClick={(e) => {
                  if (window.confirm('האם בטוח להשבית את הרכבת?')) {
                    handleSetTrainUsability(userId, false)
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
                  if (window.confirm('האם בטוח להפעיל את הרכבת?')) {
                    handleSetTrainUsability(userId, true)
                  }
                }}
              >
                הפעל
              </button>
            )}
             <i
              style={{float: 'right', cursor: 'pointer'}}
              onClick={(e) => {
                if (window.confirm('האם בטוח למחוק את הרכבת?')) {
                  handleChangeActions(true, userId)
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
                        <label>שם רכבת</label>
                        <input
                          type='text'
                          maxLength={50}
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
                        <label>קרון 1</label>
                        <select
                          onChange={(e) => {
                            setActiveTrain({
                              ...activeTrain,
                              car1Id: e.target.value,
                            })
                          }}
                          value={activeTrain.car1Id}
                          className='form-control'
                        >
                          <option value=''>בחר קרון</option>
                          {activeTrain.availableCars.map((car: any) => (
                            <option key={car.id} value={String(car.id)}>
                              {car.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='form-group'>
                        <label>קרון 2</label>
                        <select
                          onChange={(e) => {
                            setActiveTrain({
                              ...activeTrain,
                              car2Id: e.target.value,
                            })
                          }}
                          value={activeTrain.car2Id}
                          className='form-control'
                        >
                          <option value=''>בחר קרון</option>
                          {activeTrain.availableCars.map((car: any) => (
                            <option key={car.id} value={String(car.id)}>
                              {car.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='form-group'>
                        <label>מעדכן אחרון</label>
                        <input
                          type='text'
                          value={activeTrain.lastUpdater}
                          className='form-control'
                          readOnly
                          disabled
                        />
                      </div>
                      <div className='form-group'>
                        <label>תאריך עדכון אחרון</label>
                        <input
                          type='text'
                          value={activeTrain.lastUpdated}
                          className='form-control'
                          readOnly
                          disabled
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
