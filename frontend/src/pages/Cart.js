import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userRequest } from '../requestMethod';
import StripeCheckout from 'react-stripe-checkout';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const cart = useSelector((state) => state.cart);
  const history = useHistory();
  const [stripeToken, setStripeToken] = useState(null);

  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res =
          stripeToken &&
          (await axios.post(
            'http://localhost:5000/api/checkout/payment',
            {
              tokenId: stripeToken.id,
              amount: cart.total,
            },
            {
              headers: {
                token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZmU4NzFlZTQwNmRhMjEyZGE1NDYzYyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0NDMxNDM5MCwiZXhwIjoxNjQ0MzM1OTkwfQ.bp6W41ft3gd8zbfeGnp3eTTs1crzwZAmIVi_FM4MJsQ`,
              },
            }
          ));
        history.push('/success', { data: res.data });
      } catch (error) {
        console.log(error);
      }
    };
    stripeToken && cart.total >= 1 && makeRequest();
  }, [stripeToken, cart.total, history]);

  return (
    <div>
      <h1>Your bag</h1>
      <button>Continue shopping</button>
      <button>Checkout now</button>
      <div className='flex justify-between'>
        {cart.products?.map((product) => {
          return (
            <div className='flex'>
              <img
                src={product.img}
                alt={product.title}
                className='h-[100px] w-[100px] object-cover'
              />
              <div>
                <h1>Product:{product.title}</h1>
                <p>ID:{product._id}</p>
                <p>Color:{product.color}</p>
                <p>Size:{product.size}</p>
              </div>
              <div>
                <div>
                  <p>Amount</p>
                  <p>{product.quantity}</p>
                </div>
                <div>
                  <p>Price:{product.price * product.quantity}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className='border-2'>
          <h1>Order summary</h1>
          <p>Subtotal:{cart.total}</p>
          <p>Estimated shipping cost</p>
          <p>Shipping Discount</p>
          <p>total:{cart.total} </p>
          <StripeCheckout
            name='Corona Shop'
            image=''
            billingAddress
            shippingAddress
            description={`Your total is ${cart.total}`}
            amount={cart.total * 100}
            token={onToken}
            stripeKey={process.env.REACT_APP_STRIPE}
          >
            <button>Checkout now</button>
          </StripeCheckout>
        </div>
      </div>
    </div>
  );
}

export default Cart;
