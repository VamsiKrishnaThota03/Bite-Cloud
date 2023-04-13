import React,{useState} from "react";
import {Link} from 'react-router-dom';

const Signup=()=> {
    const [credentials,setcredentials] = useState({name:"",email:"",password:"",location:""});

    let name,value;

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const {name,email,password,location} = credentials;
        const response = await fetch('http://localhost:5000/api/createUser',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({name,email,password,location})
        })
        const json = await response.json();
        console.log(json);

        if(!json.success){
          alert("Enter valid credentials")
        }
    }

    const onChange=(event)=>{
      name = event.target.name;
      value = event.target.value;
        setcredentials({...credentials,[name]:value})
    }

  return (
    <>
    <div className="container">
      <form method="POST">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            autoComplete="off"
            value={credentials.name}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
            autoComplete="off"
            value={credentials.email}
            onChange={onChange}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            autoComplete="off"
            value={credentials.password}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputPassword1"
            name="location"
            autoComplete="off"
            value={credentials.location}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="m-3 btn btn-primary" value='register' onClick={handleSubmit} />
        <Link to='/login' className='m-3 btn btn-danger'>Already a user</Link>
      </form>

    </div>
    </>
  );
}

export default Signup;
