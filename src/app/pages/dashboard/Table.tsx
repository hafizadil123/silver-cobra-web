/* eslint-disable jsx-a11y/anchor-is-valid */
import React ,{useState,useEffect} from 'react';
import {KTSVG} from '../../../_metronic/helpers';
import moment from 'moment';
type Props = {
  className: string,
  trData:any[],
  thData:any[],
  drivers:any[],
}

const ReportTable: React.FC<Props> = ({className,trData,thData,drivers}) => {
  return (
    <div className={`card ${className}`}>

    
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted'>
                {
                    thData.map((item:any,index)=>{
                        const{driverId,driverName,notes,status,trainId,trainName}=item;
                        return (
                            <TableHeadView driverId={driverId} driverName={driverName} status={status} trainId={trainId} drivers={drivers} index={index} className="min-w-150px" text={trainName} />
                        )
                    })
                }
                
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
                          
            {trData.map((item:any, index:any) => {
                                return (
                                    <tr >
                                        {
                                            item.map((_item:any,index:any)=>{
                                                const {carId,carName,checkId,checkValue}=_item;
                                                return (

                                                   
                                                    <TableDataView index={index}  flexValue={1} text={carName}  />
                                                )
                                            })
                                        }
                                    </tr>
                                )
                                 

                              })}
                               <tr >
                              {thData.map((item:any, index:any) => {
                                const {notes,trainId}=item;
                                return (
                                   
                                  <TableFootView index={index} trainId={trainId}  flexValue={1} text={notes}  />
                                )})}
                               </tr>
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
    const { flexValue, text, type, className,index } = props;

    const renderFields = () => {
        return (
              <td className={`${className} `} style={{minWidth:'530px'}}>
                {index===0? 
                <span  style={{float:'right'}}> {text}</span>
                :
                <>
                <span  style={{float:'right'}}> {text}</span>
                <span style={{float:'left'}}>  
                <button onClick={()=>{console.log('clicked')}} className='btn btn-secondary btn-sm'><i  className="fa fa-times" style={{color:"#c18080",fontWeight:"bold",cursor:'pointer'}}></i></button>
                <button onClick={()=>{console.log('clicked')}} className='btn btn-secondary btn-sm'><i onClick={()=>{console.log('clicked')}} className="fa fa-check" style={{color:"#1dd61d",fontWeight:"bold",cursor:'pointer'}} aria-hidden="true"></i></button> 
                </span> 
                </>
              }
                
              </td>
        )
    }

    return (
        <>
            {
                renderFields()
            }
        </>


    )
}




const TableFootView = (props: any) => {
  const { flexValue, text, index,trainId } = props;
  const handleUpdateNote =(value:any)=>{
    setNotes(value);
    let date=new Date();
    let dateFormatted=moment(date).format('DD-MM-yyyy');
    const dataToSend ={
      trainId,
      notes:value,
      date:dateFormatted
    };
    console.log({dataToSend})
  }
  const [notes,setNotes]=useState("")
  useEffect (()=>{
    setNotes(text);
  },[])

  const renderFields = () => {
      return (
            <td  style={{minWidth:'530px'}}>
             
             {
              index !== 0 ?
              <input type="text" onChange={e=>{handleUpdateNote(e.target.value)}} value={notes} className="form-control-sm" />
              :
              null
             }
              
            </td>
      )
  }

  return (
      <>
          {
              renderFields()
          }
      </>


  )
}


const TableHeadView = (props: any) => {
  const {  text,className,index,drivers,driverName,driverId,status,trainId } = props;
  const [selectedDriver,setSelectedDriver]=useState(drivers[0].id)
  useEffect(() => {
    if(driverId){
      setSelectedDriver(driverId)
    }
  },[])
  const handleChangeTrainStatus =(statusToChange:number) =>{
    let date=new Date();
    let dateFormatted=moment(date).format('DD-MM-yyyy');
    console.log({dateFormatted})
    const DataToSend ={
      status:statusToChange,
      trainId,
      date:dateFormatted
    };
    console.log({DataToSend})

  }
  const handleDriverChangeUpdate =(value:any) =>{
    setSelectedDriver(value);
    let date=new Date();
    let dateFormatted=moment(date).format('DD-MM-yyyy');
    const dataToSend ={
      trainId,
      date:dateFormatted,
      driverid:Number(value)
    };
    console.log({dataToSend})
  }
  return (
      <th style={{minWidth:'530px !important'}} className={`${className}`}>
        {

          index === 0 ?
          <span>{text}</span>
          :
          <> 
             <span style={{float:'right'}}>{text}</span>
             {
              driverName!==null ?
              <span style={{float:'left'}}>Driver : {driverName}</span> 
              :null
             }
            

             {/* Status */}

             <button onClick={()=>{
              handleChangeTrainStatus(0);
             }} style={{marginRight:'20px',background: status ===0 ? '#3F4254': '#E4E6EF'} } className='btn btn-secondary btn-sm'><i  className="fa fa-times" style={{color:"#c18080",fontWeight:"bold",cursor:'pointer'}}></i></button>
              <button onClick={()=>{handleChangeTrainStatus(1);}} style={{background: status ===1 ? '#3F4254': '#E4E6EF'}} className='btn btn-secondary btn-sm'><i onClick={()=>{console.log('clicked')}} className="fa fa-check" style={{color:"#1dd61d",fontWeight:"bold",cursor:'pointer'}} aria-hidden="true"></i></button> 
             {/* Status */}
             <select  className="form-control-sm" style={{marginRight:'20px',marginTop:'-5px'}} onChange={e=>{handleDriverChangeUpdate(e.target.value)}} value={selectedDriver}>
              {
                drivers?.map((driver:any)=>{
                  return(
                    <option value={driver.id}>{driver.name}</option>
                  )
                })
              }
             </select>
            
          </>
        }
      </th>
  )
}