import axios from "axios";
import { showAlert } from './alert'

const stripe = Stripe('pk_test_51MWCJaSDc4MNMBEjEjXr7T2n2JjsLI7KZc7sQsdfSpL5OxZdZzP6O0mk6tmIv51hs784MagTEII2dEYZNepXfcuH00tUOWdesf')

export const bookTour = async tourId => {
    try {
        // 1> get checkout sesssion from api
        const session = await axios(
            `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
        )
        console.log(session);

        // create checkout form and charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch(err) {
        console.log(err)
        showAlert('error',err)
    }
}
