/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import {useToasts} from 'react-toast-notifications'
import {useFormik} from 'formik'

import './train.css'

type Props = {
  className: string
  trainList: any[]
  getSelectedTrain: (id: any) => any
  css: string
  getTrainList: () => any
  handleDelete: any
}

const ReportTable: React.FC<Props> = ({
  trainList,
  className,
  getSelectedTrain,
  css,
  getTrainList,
  handleDelete,
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
                <TableHeadView className='' text={'שם קרוןadsss'} />
                <TableHeadView className='' text={'האם פעיל'} />
                <TableHeadView className='' text={'תאריך עדכון אחרון'} />
                <TableHeadView className='' text={'פעולות'} />
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
          
            <tbody>
              {trainList && trainList.length > 0 && trainList &&
                trainList.length > 0 &&
                trainList.map((item: any, index: any) => {
                  return (
                    <tr>
                      <TableDataView
                        className=''
                        index={index}
                        flexValue={1}
                        text={item.name}
                        getSelectedTrain={getSelectedTrain}
                        isEdit={false}
                        IsEnabledButton={false}
                        getTrainList={getTrainList}
                      />

                      <TableDataView
                        className=''
                        index={index}
                        flexValue={1}
                        text={item.IsEnabled}
                        getSelectedTrain={getSelectedTrain}
                        isEdit={false}
                        trainId={item.id}
                        isDelete={false}
                        getTrainList={getTrainList}
                        IsEnabledButton={true}
                      />
                      {/* <td>{item.IsEnabled === true ? `✅` : `❌`}</td> */}

                      <TableDataView
                        className=''
                        index={index}
                        flexValue={1}
                        text={item.lastUpdated}
                        getSelectedTrain={getSelectedTrain}
                        isEdit={false}
                        getTrainList={getTrainList}
                        IsEnabledButton={false}
                      />

                      <TableDataView
                        className=''
                        index={index}
                        flexValue={1}
                        // text={`edit`}
                        getSelectedTrain={getSelectedTrain}
                        trainId={item.id}
                        isEdit={true}
                        getTrainList={getTrainList}
                        isDelete={false}
                        id={item.id}
                        IsEnabledButton={false}
                        handleDelete={handleDelete}
                        text={item.IsEnabled}

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

  const {
    isEdit,
    text,
    className,
    getSelectedTrain,
    trainId,
    getUsers,
    getTrainList,
    IsEnabledButton,
    handleDelete,
    isDelete,
  } = props
  const [errors, setErrors] = useState<any>([])

  const [activeTrain, setActiveTrain] = useState({
    name: '',
    lastUpdated: '',
    lastUpdater: '',
    car1: [],
    car1Id: 0,
    car2Id: 0,
    car2: [],
    IsEnabled: '',
    id: '',
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
  const setTrainVisibilityEndpoint = `${baseUrl}/api/Common/SetTrainUsability`
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState<any>({})
  const handleUpdateTrain = () => {
    saveTrainDetails(activeTrain)
  }
  const showAlert = (customText: any) => {
    // const customText = "This is your custom alert text!";
    window.alert(customText);
    // window.confirm(customText)
  };

  const saveTrainDetails = async (details: any, type = 'Updated') => {
      console.log("saveTrainDetails", details);
      const reqObj = {
        id: details?.id,
        name : details?.name,
        car1Id: details?.car1Id,
        car2Id: details?.car2Id
      }
    const response = await axios.post(saveTrainDetailsEndPoint, reqObj, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      // addToast(`${type} successfully`, {appearance: 'success', autoDismiss: true})
      addToast(`עדכון התבצע בהצלחה`, {appearance: 'success', autoDismiss: true})
    }
    getTrainList()
  }

  const setTrainVisibility = async ({trainId, IsEnabled, type}: any) => {
    // alert('are you sure, you want to execute this?')
    const response = await axios.post(
      setTrainVisibilityEndpoint,
      {trainId: trainId, IsEnabled: IsEnabled},
      headerJson
    )
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      // addToast(`${type} updated successfully`, {appearance: 'success', autoDismiss: true})
      addToast(`עדכון סטטוס הרכבת בוצע בהצלחה`, {appearance: 'success', autoDismiss: true})

    }
    getTrainList()
    // window.location.reload();
  }
  const handleChangeActions = (isDelete: boolean, id: any) => {
     getSelectedTrain(id).then((res: any) => {
      if (!isDelete) {
        setActiveTrain({
          name: res.name,
          car1: res.availableCars,
          car2: res.availableCars,
          lastUpdated: res.lastUpdated,
          IsEnabled: res.IsEnabled,
          car1Id: 0,
          car2Id: 0,
          lastUpdater: res.lastUpdater,
          id: res.id,
        })
        setShowModal(true)
        setErrors([])
      } else {
        handleDelete(id)
      }
    })
  }

  const renderFields = () => {
  
    return (
      <td className={`${className} `}>
        {/* {!isEdit && !isDelete && IsEnabledButton && (
          <button
            style={{float: 'right', cursor: 'pointer', marginLeft: '20px'}}
            onClick={(e) => {
              let Train = setTrainVisibility({trainId, IsEnabled: !text, type: 'Train visibility'})
              console.log({
                Train,
              })
            }}
            className={`${!text ? `btn btn-success mx-2` : `btn btn-danger mx-2`}`}
          >
            {!text ? 'Enable' : 'Disable'}
          </button>
        )} */}

        {!isEdit && !isDelete && IsEnabledButton &&
          <td>{text === true ? `✅` : `❌`}</td>

        }

        {!IsEnabledButton && isEdit === false ? (
          <span style={{float: 'right'}}>{text}</span>
        ) : (
          !IsEnabledButton && (
            <>
              {/* Modal Start */}
              <i
                style={{float: 'right', cursor: 'pointer', marginLeft: '20px'}}
                onClick={(e) => {
                   getSelectedTrain(trainId).then((res: any) => {
                    setActiveTrain({
                      name: res.name,
                      car1: res.availableCars,
                      car2: res.availableCars,
                      lastUpdated: res.lastUpdated,
                      // car1Id: 0,
                      // car2Id: 0,
                      car1Id: res.car1Id,
                      car2Id: res.car2Id,
                      lastUpdater: res.lastUpdater,
                      IsEnabled: res.isIsEnabled,
                      id: res.id,
                    })
                    setShowModal(true)
                  })
                
                }}
                className='fa fa-edit'
              ></i>
              <i
                style={{float: 'right', cursor: 'pointer'}}
                onClick={(e) => 
                  {
                  showAlert("האם בטוח למחוק את הרכבת?");
                  handleChangeActions(true, trainId)
                }
                }
                className={`fa fa-trash`}
              ></i>


                <button
                  style={{ float: "right", cursor: "pointer", marginLeft: "20px", paddingLeft: "10px", paddingRight: "10px", paddingTop: "5px", paddingBottom: "5px" }}
                  onClick={(e) => {

                    showAlert(!text ? "האם בטוח להפעיל את הרכבת?" : "האם בטוח להשבית את הרכבת?");
                    let car = setTrainVisibility({ trainId, IsEnabled: !text, type: 'Train visibility' })
                    console.log({
                      car
                    })
                  }}
                  className={`${!text ? `btn btn-success mx-2` : `btn btn-danger mx-2`}`}

                >
                  {!text ? 'הפעל' : 'השבת'}
                </button>
                

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
                          <label> קרון 1</label>

                          <select
                            className='form-select form-select-solid'
                            data-kt-select2='true'
                            data-placeholder='Select option'
                            data-allow-clear='true'
                            onChange={(e) => {
                              setActiveTrain({
                                ...activeTrain,
                                car1Id: +(e.target.value),
                              })
                            }}
                            value={activeTrain.car1Id} // Set the default value here
                          >
                            <option />
                            {activeTrain.car1.map((item: any) =>  <option value={item.id}>{item.name}</option>)}
                           
                          </select>
                        </div>
                        <div className='form-group'>
                          <label >קרון 2</label>
                          <select
                            className='form-select form-select-solid'
                            data-kt-select2='true'
                            data-placeholder='Select option'
                            data-allow-clear='true'
                            onChange={(e) => {
                              setActiveTrain({
                                ...activeTrain,
                                car2Id: +(e.target.value),
                              })
                            }}
                            value={activeTrain.car2Id} // Set the default value here
                          >
                             <option />
                            {activeTrain.car1.map((item: any) =>  <option value={item.id}>{item.name}</option>)}
                          </select>
                        </div>
                        <div className='form-group'>
                          <label>מעדכן אחרון</label>
                          <input
                            type='text'
                            value={activeTrain.lastUpdater}
                            readOnly={true}
                            className='form-control'
                          />
                        </div>
                        <div className='form-group'>
                          <label>תאריך עדכון אחרון</label>
                          <input
                            type='text'
                            value={activeTrain.lastUpdated}
                            readOnly={true}
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
          )
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
