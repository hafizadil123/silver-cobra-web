/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Route, Routes } from 'react-router-dom'
import { UserDetails } from './components/user-details';
const UserDetailsPage = () => (
  // <Routes>
  //   <Route>
  //     <Route path='all' element={<div><h1>HAHHAHAHAHAHAHAHH</h1></div>} />
  //   </Route>
  // </Routes>
  <div><UserDetails /></div>
)

export { UserDetailsPage }
