import React, { useContext, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const PlaceOrder = () => {

  const {getTotalCartAmmount, token, food_list, cartItems, url} =useContext(StoreContext)

  const [data, setData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:'',
  })

  const onChangeHandler = (event)=>{
    const name= event.target.name
    const value = event.target.value

    setData(data=>({...data,[name]:value}))
  }

  const placeOrder = async(event)=>{
    event.preventDefault()
    let orderItems = []
    food_list.map((item)=>{
      if(cartItems[item._id]){
        let itemInfo = item
        itemInfo['quantity']=cartItems[item._id]
        orderItems.push(itemInfo)
      }
    })

    let orderData = {
      address:data,
      items:orderItems,
      amount:getTotalCartAmmount()+2
    }
    let response = await axios.post(url+'/api/order/place',orderData,{headers:{token}})
    if(response.data.success){
      const {session_url} = response.data
      window.location.replace(session_url)
    }else{
      alert('Error')
    }
  }

  const navigate = useNavigate()

  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }else if(getTotalCartAmmount()===0){
      navigate('/cart')
    }
  },[token])

  return (
   <form onSubmit={placeOrder}  className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' value={data.firstName} onChange={onChangeHandler} type="text" placeholder='First Name' />
          <input required name='lastName' value={data.lastName} onChange={onChangeHandler} type="text" placeholder='Last Name' />
        </div>
        <input required onChange={onChangeHandler} value={data.email} name='email' type="text" placeholder='Email address' />
        <input required onChange={onChangeHandler} value={data.state} name='street' type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required onChange={onChangeHandler} value={data.city} name='city' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} value={data.state} name='state' type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' value={data.zipcode} onChange={onChangeHandler} type="text" placeholder='Zip code' />
          <input required name='country' value={data.country} onChange={onChangeHandler} type="text" placeholder='Country' />
        </div>
        <input required name='phone' value={data.phone} onChange={onChangeHandler} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>${getTotalCartAmmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmmount()===0?0:getTotalCartAmmount()+2}</b>
            </div>
          </div>
          <button type='submit' >PROCEED TO PAYMENT</button>
        </div>
      </div>
   </form>
  )
}

export default PlaceOrder
