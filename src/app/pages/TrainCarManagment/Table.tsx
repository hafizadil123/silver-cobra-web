/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import { useToasts } from 'react-toast-notifications'
import { useFormik } from 'formik'

import './car.css'

type Props = {
  className: string
  carsList: any[]
  getSelectedCar: (id: any) => any
  css: string
  getCarsList: () => any
  handleDelete: any
}

const ReportTable: React.FC<Props> = ({
  carsList,
  className,
  getSelectedCar,
  css,
  getCarsList,
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
            <thead style={{ background: stickyCss, top: `${stickyCss && '65px'}` }}>
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
              {carsList && carsList.length > 0 && carsList.map((item: any, index: any) => {
                return (
                  <tr>
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      getCarsList={getCarsList}
                      text={item.name}
                      getSelectedCar={getSelectedCar}
                      isEdit={false}
                      isEnabledButton={false}

                    />
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      getCarsList={getCarsList}
                      text={item.trainName}
                      getSelectedCar={getSelectedCar}
                      isEdit={false}
                      isEnabledButton={false}
                    />
                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      getCarsList={getCarsList}
                      text={item.isEnabled}
                      getSelectedCar={getSelectedCar}
                      isEdit={false}
                      carId={item.id}
                      isDelete={false}
                      isEnabledButton={true}
                    />
                   {/* <td>{item.isEnabled === true ? `✅` : `❌`}</td> */}

                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      getCarsList={getCarsList}
                      text={item.lastUpdated}
                      getSelectedCar={getSelectedCar}
                      isEdit={false}
                      isEnabledButton={false}
                    />

                    <TableDataView
                      className=''
                      index={index}
                      flexValue={1}
                      // text={`edit`}
                      getSelectedCar={getSelectedCar}
                      carId={item.id}
                      isEdit={true}
                      getCarsList={getCarsList}
                      isDelete={false}
                      id={item.id}
                      isEnabledButton={false}
                      handleDelete={handleDelete}
                      text={item.isEnabled}

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

export { ReportTable }
const TableDataView = (props: any) => {
  const [openSecondModal, setOpenSecondModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const getUser = JSON.parse(logged_user_detail)
  const { addToast } = useToasts()

  const {
    isEdit,
    text,
    className,
    getSelectedCar,
    carId,
    getUsers,
    carsList,
    getCarsList,
    isEnabledButton,
    handleDelete,
    isDelete,
  } = props
  const [errors, setErrors] = useState<any>([])

  const [activeCar, setActiveCar] = useState({
    name: '',
    lastUpdated: '',
    lastUpdater: '',
    isEnabled: '',
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
  const saveCarDetailsEndPoint = `${baseUrl}/api/Common/SaveCarDetails`
  const setCarVisibilityEndpoint = `${baseUrl}/api/Common/SetCarUsability`
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState<any>({})
  const handleUpdateCar = () => {
    saveCarDetails(activeCar)
  }

  const showAlert = (customText: any) => {
    // window.alert(customText);
    window.confirm(customText)
  };

  const saveCarDetails = async (details: any, type = 'Updated') => {
    const response = await axios.post(saveCarDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        addToast(error, {appearance: 'error', autoDismiss: true});
        // setErrors(response.data.validationErrors)
        // setShowModal(true)
      })
    } else {
      // addToast(`Car ${type} successfully`, {appearance: 'success', autoDismiss: true})
      addToast(`עדכון התבצע בהצלחה`, { appearance: 'success', autoDismiss: true })
    }
    getCarsList()
  }

  const setCarVisibility = async ({ carId, isEnabled, type }: any) => {
    // alert('are you sure, you want to execute this?')
    const response = await axios.post(setCarVisibilityEndpoint, { carId: carId, isEnabled: isEnabled }, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        addToast(error, {appearance: 'error', autoDismiss: true});
        // setErrors(response.data.validationErrors)
        // setShowModal(true)
      })
    } else {
      // addToast(`${type} updated successfully`, {appearance: 'success', autoDismiss: true})
      addToast(`עדכון סטטוס הקרון בוצע בהצלחה`, { appearance: 'success', autoDismiss: true })
    }
    getCarsList()
  }
  const handleChangeActions = (isDelete: boolean, id: any) => {
    let car = getSelectedCar(id)

    if (!isDelete) {
      setActiveCar({
        name: car.name,
        lastUpdated: car.lastUpdated,
        isEnabled: '',
        lastUpdater: car.lastUpdater,
        id: car.id,
      })
      setShowModal(true)
      setErrors([])
    } else {
      handleDelete(id)
    }
  }




  const renderFields = () => {
    console.log({
      isDelete,
      isEnabledButton,
      isEdit
    })
    return (
      <td className={`${className} `}>

        {/* {!isEdit && !isDelete && isEnabledButton && <button
        style={{float: 'right', cursor: 'pointer' , marginLeft: '20px'}}
        onClick={(e) => {
          let car = setCarVisibility({carId, isEnabled: !text, type: 'car visibility'})
          console.log({
            car
          })
        }}
        className={`${!text ? `btn btn-success mx-2` : `btn btn-danger mx-2`}`}
        >
          {!text ? 'Enable' : 'Disable' }
        </button>} */}
        {!isEdit && !isDelete && isEnabledButton &&
          <td>{text === true ? `✅` : `❌`}</td>
        }


        {!isEnabledButton && isEdit === false ? (
          <span style={{ float: 'right' }}>{text}</span>
        ) : (
          !isEnabledButton &&
          <>
            {/* Modal Start */}
            <i
              style={{ float: 'right', cursor: 'pointer', marginLeft: '20px' }}
              onClick={(e) => {
                let car = getSelectedCar(carId)
                setActiveCar({
                  name: car.name,
                  lastUpdated: car.lastUpdated,
                  lastUpdater: car.lastUpdater,
                  isEnabled: car.isisEnabled,
                  id: car.id
                })
                setShowModal(true)
              }}
              className='fa fa-edit'
            ></i>
            <i
              style={{ float: 'right', cursor: 'pointer' }}
              onClick={(e) => {
              if (window.confirm("האם בטוח למחוק את הקרון?")) {
                // showAlert("האם בטוח למחוק את הקרון?");
                handleChangeActions(true, carId)
                 }else{}
              }}
              className={`fa fa-trash`}
            ></i>

            <button
              style={{ float: "right", cursor: "pointer", marginLeft: "20px", paddingLeft: "10px", paddingRight: "10px", paddingTop: "5px", paddingBottom: "5px" }}
              onClick={(e) => {
                 if (window.confirm(!text ? "האם בטוח להפעיל את הקרון?" : "האם בטוח להשבית את הקרון?")) {
                // showAlert(!text ? "האם בטוח להפעיל את הקרון?" : "האם בטוח להשבית את הקרון?");
                let car = setCarVisibility({ carId, isEnabled: !text, type: 'car visibility' })
                console.log({
                  car
                })
              }else{}
              }}
              className={`${!text ? `btn btn-success mx-2` : `btn btn-danger mx-2`}`}

            >
              {!text ? 'הפעל' : 'השבת'}
            </button>
          {/* {showAlert && (
        <CustomAlert
          message="This is your custom alert text!"
          onClose={handleCloseAlert}
        />
      )} */}
            <Modal
              show={showModal}
              style={{ direction: 'rtl' }}
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
                            <span style={{ color: 'red' }}>{item}</span>
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
                      <div className='form-group'>
                        <label>מעדכן אחרון</label>
                        <input
                          type='text'
                          value={activeCar.lastUpdater}
                          readOnly={true}
                          className='form-control'
                        />
                      </div>
                      <div className='form-group'>
                        <label>תאריך עדכון אחרון</label>
                        <input
                          type='text'
                          value={activeCar.lastUpdated}
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
                        handleUpdateCar()
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
  const { text, className } = props

  return (
    <th className={`${className}`}>
      <span>{text}</span>
    </th>
  )
}
