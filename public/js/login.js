import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:7777/api/v1/users/log-in',
            data: {
                email,
                password
            }
        })
        showAlert('success', 'login success')
        if (res.data.status === "success") {
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:7777/api/v1/users/log-out',
        })
        showAlert('success', 'Logged out successful!!')
        console.log(res.data.status)
        if (res.data.status === "success") {
            // location.reload(true)
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (err) {
        showAlert('error', 'Error! while logging in!!')
    }
}
