import axios from "axios";
import { showAlert } from './alert';

export const updateData = async (data, type) => {
    try {
        console.log(data)
        const url = type === 'password' ? 'http://127.0.0.1:2121/api/v1/users/update-password' : 'http://127.0.0.1:2121/api/v1/users/update-me';
        await axios({
            method: 'PATCH',
            url,
            data
        })
        showAlert('success', 'User Data Successfully Updated!')
    } catch(err) {
        console.log(err)
        showAlert('error', err.response.data.message)
    }
}