import axios from 'axios'
import {UserModel} from '../models/UserModel'
const API_URL = process.env.REACT_APP_API_URL
export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/users/verify_token`
export const LOGIN_URL = `${API_URL}/Token`
export const REGISTER_URL = `${API_URL}/users/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/Api/Inner/RecoverPassword`
export const UPDATE_PASSWORD_URL = `${API_URL}/users/update_password`

// Server should return AuthModel
export function login(email: string, password: string) {

const params = new URLSearchParams()
params.append('username', '212097091^13')
params.append('password', '7n0869')
params.append('grant_type', 'password')



  return axios.post(LOGIN_URL,params, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
}

// Server should return AuthModel
export function register(email: string, firstname: string, lastname: string, password: string, parsed: string) {
  console.log('paaa', parsed);
  return axios.post(`${REGISTER_URL}${parsed}`, {
    email,
    first_name: firstname,
    last_name: lastname,
    password
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(contanctInfo: string,userName:string) {
  return axios.post(REQUEST_PASSWORD_URL, {
    contactInfo: contanctInfo,
    userName: userName,
  })
}
export function updatePassword(password: string, token: string) {
  return axios.post(`${UPDATE_PASSWORD_URL}?token=${token}`, {
    password
  })
}

export function getUserByToken(token:string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token:token
  })
}
