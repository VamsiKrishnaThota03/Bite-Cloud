import React,{useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';

function Login() {
  const [credentials,setcredentials] = useState({email:"",password:""});
let navigate = useNavigate();
    let name,value;

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const {email,password} = credentials;
        const response = await fetch('http://localhost:5000/api/loginuser',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password})
        })
        const json = await response.json();
        console.log(json);

        if(!json.success){
          alert("Enter valid credentials")
        }else{
          localStorage.setItem("authToken",json.authToken);
          console.log(localStorage.getItem("authToken"));
          navigate('/');
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
        
        <input type="submit" className="m-3 btn btn-primary" value='Login' onClick={handleSubmit} />
        <Link to='/createuser' className='m-3 btn btn-danger'>I'm a new user</Link>

      </form>

    </div>
    </>
  )
}

export default Login
