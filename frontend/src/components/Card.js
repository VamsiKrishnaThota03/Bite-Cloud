import React, { useState,useRef,useEffect } from "react";
import { useDispatchCart,useCart } from "./ContextReducer";

function Card(props) {

  let dispatch = useDispatchCart();
  let options = props.options;
  const priceRef = useRef();

  // let priceOptions = option.keys(option);

  // let foodItem = props.foodItems;
  let data = useCart()
  const [qty,setQty] =useState(1);
  const [size,setSize] = useState("");

  const handleAddToCart = async() =>{
    await dispatch({type:"ADD",id:props.id,name:props.foodName,price:finalPrice,qty:qty,size:size})
    await console.log(data);
  }

  let finalPrice = qty*parseInt(size);
  useEffect(()=>{
    setSize(priceRef.current.value);
  },[])

  return (
    <div>

        <div
          className="card mt-3"
          style={{ width: "16rem", maxHeight: "360px" }}
        >
          <img src={props.imgSrc} className="card-img-top" alt="..." style={{height:"120px", objectFit:"fill"}} />
          <div className="card-body">
            <h5 className="card-title">{props.foodName}</h5>
            <div className="container w-100 rounded">
              <select className="m-2 h-100 bg-success"  onChange={(e)=>{
                setQty(e.target.value)
              }}>
                {Array.from(Array(6), (e, i) => {
                  return (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  );
                })}
              </select>

              <select className="m-2 h-100 bg-success rounded" ref={priceRef} onChange={(e)=>{
                setSize(e.target.value)
              }}>
                {/* option.map((data)=>{
                  return(
                      <option key={data} value={data}>{data}</option>
                  )
                }) */}
                <option key="half" value="150">Half</option>
                <option key="full" value="250">Full</option>
              </select>

              <div className="d-inline h-100 fs-5">{finalPrice}/-</div>
            </div>
          </div>
          <hr></hr>
          <button className="btn btn-success justify-center mx-5" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
  );
}

export default Card;