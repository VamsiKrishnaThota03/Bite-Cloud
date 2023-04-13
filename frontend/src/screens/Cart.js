import React from 'react';
// import trash from '../trash.svg';
import {useCart,useDispatchCart} from '../components/ContextReducer';
// import trash from '../trash.svg'

export default function Cart() {
    let data = useCart();
    let dispatch = useDispatchCart();
    if(data.length===0){
        return(
            <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
        )
    }
    let totalPrice = data.reduce((total,food)=>total+food.price,0);
  return (
    <div>
      <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
        <table className='table table-hover'>
            {/* <thead className='text-success fs-4'>
                <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Quantity</th>
                    <th scope='col'>Option</th>
                    <th scope='col'>Amount</th>
                    <th scope='col'>#</th>
                </tr>
            </thead> */}
            <tbody>
                {data.map((food,index)=>{
                    <tr>
                        <th scope='row'>{index +1}</th>
                        <td>{food.name}</td>
                        <td>{food.qty}</td>
                        <td>{food.size}</td>
                        <td>{food.price}</td>
                        <td><button type='button' className='btn p-0' ><img src="data:image/jpeg;base64,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" alt="delete" onClick={()=>{dispatch({type:"Remove",index:index})}} ></img></button></td>
                    </tr>
                })}
            </tbody>
        </table>
        <div><h1 className='fs-2'>Total Price: {totalPrice}/-</h1></div>
        <div>
            <button className='btn bg-success mt-5'>Check Out</button>
        </div>
      </div>
    </div>
  )
}