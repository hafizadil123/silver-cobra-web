import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'

export const HebrewBirthDate = (props: any) => {
    const [hebDays, setHebDays] = useState([]);
    const [hebMonths, setHebMonths] = useState([]);
    const [hebYears, setHebYears] = useState([]);

    const logged_user_detail: any = localStorage.getItem('logged_user_detail');
    const loggedInUserDetails = JSON.parse(logged_user_detail);

    const baseUrl = process.env.REACT_APP_API_URL;
    const getDataEndpoint = `${baseUrl}/api/Inner/GetData`;
    const UpdateHebBrithDateEndpoint = `${baseUrl}/api/Inner/UpdateHebBrithDate`;
    const HebBrithDateNotInterestedEndpoint = `${baseUrl}/api/Inner/HebBrithDateNotInterested`;
    const authHeader = {
        headers: {
            Authorization: `bearer ${loggedInUserDetails.access_token}`
        }
    }

    useEffect(() => {
        getDataAPI()
    },[])

    const getDataAPI = async () => {
        const response = await axios.post(getDataEndpoint, {}, authHeader)

        if (response && response.data.result) {
            const { data } = response;
            const { hebDays, hebMonths, hebYears } = data;
            console.log('Data : ',hebYears);
        }
    }

    return (
        <>
            <div className='date_container'>
                <div className='dropdown_section'>
                    <p>Day</p>
                    <select></select>
                </div>
                <div className='dropdown_section'>
                    <p>Month</p>
                    <select></select>
                </div>
                <div className='dropdown_section'>
                    <p>Year</p>
                    <select></select>
                </div>
            </div>
        </>
    )
}