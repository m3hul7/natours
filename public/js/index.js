import '@babel/polyfill'
import { login, logout } from './login'
import { getMapbox } from './mapbox'
import { updateData } from './updateSettings'
import { bookTour } from './stripe'

const map = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const userUpdateForm = document.querySelector('.form-user-data')
const userPasswordUpdateForm = document.querySelector('.form-user-settings')
const logoutBtn = document.querySelector('.nav__el--logout')
const bookBtn = document.getElementById('book-tour')

if (map) {
    const locations = JSON.parse(map.dataset.locations);
    getMapbox(locations)
}

if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password)
    })
}

if (logoutBtn) logoutBtn.addEventListener("click", logout)

if (userUpdateForm) {
    userUpdateForm.addEventListener("submit", e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0])
        // const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
        // updateData({name, email}, 'data')
        console.log(form)
        updateData(form, 'data')
    })
}

if (userPasswordUpdateForm) {
    userPasswordUpdateForm.addEventListener("submit", async e => {
        e.preventDefault();
        const currentPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateData({ currentPassword, password, passwordConfirm }, 'password')

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    })
}

if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId)
    })
}