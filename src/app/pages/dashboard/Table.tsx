/* eslint-disable jsx-a11y/anchor-is-valid */
import React ,{useState} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
type Props = {
  className: string,
  trData:any[],
  thData:any[]
}

const ReportTable: React.FC<Props> = ({className,trData,thData}) => {
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
                        
                        return (
                            <TableHeadView className="min-w-150px" text={item} />
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

                                                   
                                                    <TableDataView  flexValue={1} text={carName}  />
                                                )
                                            })
                                        }
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
    const { flexValue, text, type, className } = props;

    const renderFields = () => {
        return (<td className={`${className} `} style={{minWidth:'300px'}}>
           <span  style={{float:'left'}}> {text}</span>
           <span style={{float:'right'}}>  
           <button onClick={()=>{console.log('clicked')}} className='btn btn-secondary btn-sm'><i  className="fa fa-times" style={{color:"#c18080",fontWeight:"bold",cursor:'pointer'}}></i></button>
           <button onClick={()=>{console.log('clicked')}} className='btn btn-secondary btn-sm'><i onClick={()=>{console.log('clicked')}} className="fa fa-check" style={{color:"#1dd61d",fontWeight:"bold",cursor:'pointer'}} aria-hidden="true"></i></button> 
           </span> 
        </td>)
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
  const {  text,className } = props;
  return (
      <th className={`${className}`}>{text}</th>
  )
}