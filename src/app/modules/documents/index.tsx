import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {ShowDataTable}  from './ShowDataTable'
const Documents = () => {
    const [listData, setListData] = useState([]);

    const logged_user_detail: any = localStorage.getItem('logged_user_detail');
    const loggedInUserDetails = JSON.parse(logged_user_detail);

    const baseUrl = process.env.REACT_APP_API_URL;
    const getDocumentListEndpoint = `${baseUrl}/api/Inner/GetDocumentList`;
    const showDocumentEndpoint = `${baseUrl}/api/Inner/ShowDocument`;
    const authHeader = {
        headers: {
            Authorization: `bearer ${loggedInUserDetails.access_token}`
        }
    }

    useEffect(() => {
       fetchDocumentList();
    }, [])

    const fetchDocumentList = async () => {
        const response = await axios.post(getDocumentListEndpoint, {},
            authHeader)

        if (response && response.data) {
            const { result, rows } = response.data
            if (result) {
                setListData(rows);
                console.log('Data : ', response);
            }
        }
    }

    const HeaderTitleView = (props: any) => {
        const { headerTitle, flexValue } = props;
        return (
            <th style={{ flex: flexValue, textAlign: 'center', padding: '5px 0px', color: '#ffffff' }}>{headerTitle}</th>
        )
    }

    const DataView = (props: any) => {
        const { dataText, flexValue, isCheckbox } = props;
        return (
            <>
                {
                    isCheckbox ?
                        <td style={{ flex: flexValue, textAlign: 'center', padding: '5px 0px' }}> <input
                            type='checkbox'
                            checked={dataText}
                            disabled
                        /></td>
                        : <td style={{ flex: flexValue, textAlign: 'center', padding: '5px' }}>{dataText}</td>
                }
            </>
        )
    }

    return (
        <>
            <p></p>
            <ShowDataTable className='mb-5 mb-xl-8 xl-10' listData={listData} showDocumentEndpoint={showDocumentEndpoint} />

        </>
    )
}

export default Documents