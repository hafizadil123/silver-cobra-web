import React from 'react'
import { useLocation  } from 'react-router-dom'
import {useDispatch} from 'react-redux'
import * as auth from '../redux/AuthRedux'
export function Success() {
    const location = useLocation()
    const dispatch = useDispatch()
    const api_token = location.search.split('?')[1].split('=')[1].split('&')[0];
    setTimeout(() => {
        dispatch(auth.actions.login(api_token));
    }, 2000)
  return (
    <>
      <h4>please wait we will redirect you soon.....</h4>
    </>
  )
}
