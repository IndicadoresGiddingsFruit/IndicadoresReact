import React, {useState, useEffect} from 'react';
import {withRouter,Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import '../css/login.css';
import {TextField} from '@material-ui/core'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InputIcon from '@material-ui/icons/Input'; 
import swal from 'sweetalert'

function Login(props) {
 const url="https://giddingsfruit.mx/ApiIndicadores/api/usuarios"; 
 const cookies = new Cookies();
 const [loading,setLoading]=useState(false); 

 const [form,setForm]=useState({
      username:'',
      password:''
 });

 //Cambio de estado de los inputs del formulario
 const handleChange=e=>{
  const {name,value}=e.target;
      setForm({
          ...form,
          [name]:value
      });      
 }
  
 const onKeyPress= (e) => { 
    if (e.key === 'Enter') {
      e.preventDefault();
      setLoading(true);
      login(e); 
      return false;
    }
    else return true;
 }

 const login =(e) => {
  e.preventDefault();
  iniciarSesion();
}

 const iniciarSesion= React.useCallback(async(e) => { 
  setLoading(true);
      await axios.get(url+`/${form.username}/${form.password}`)        
      .then(response=>{
          return response.data;
        }).then(response=>{
          if(response.length>0){
            var respuesta=response[0];
              cookies.set('Id', respuesta.id, {path: '/'});                            
              cookies.set('Nombre',respuesta.nombre,{path:'/'});
              cookies.set('Completo',respuesta.completo,{path:'/'});
              cookies.set('Clave',respuesta.clave,{path:'/'});
              cookies.set('correo',respuesta.correo,{path:'/'});
              cookies.set('IdAgen',respuesta.idAgen,{path:'/'});
              cookies.set('IdRegion',respuesta.idRegion,{path:'/'});
              cookies.set('Tipo',respuesta.tipo,{path:'/'});
              cookies.set('Depto', respuesta.depto, {path: '/'});            
             
              //Ir a la página de inicio
              props.history.push('/index');             
          }
          else{
            swal({
              text:'Datos incorrectos!',
              icon: "error",
              button: "Cerrar"
            });         
          }
      })
      .catch(error=>{
        swal({
          title: "Algo salio mal!",
          text:error.response,
          icon: "error",
          button: "Cerrar",
        });
          console.log(error.response);
          console.log(error.request);
          console.log(error.message);     
      })
      setLoading(false);
 }, [form.username, form.password, props.history])
  
 useEffect(()=>{
  if(cookies.get('Id')){
    props.history.push('/index');
  }
 });
    
return (
<div className="containerPrincipal">
  <div className="login-logo">
    <img src="/Indicadores/dist/img/logo.png" alt="" className="img-circle" 
    style={{width: '100px'},{height: '100px'}}/>
  </div>

<div className="containerLogin">
 <form onSubmit={login}>
   <span className="font-weight-bold text-secondary">Indicadores GiddingsFruit</span> 
    <div className="form-group has-feedback">   
    <TextField InputProps={{endAdornment: (<AccountCircleIcon />)}} required type="text" name="username" onChange={handleChange} label="Usuario" variant="outlined" />
    </div>

    <div className="form-group has-feedback">    
    <TextField InputProps={{endAdornment: (<VisibilityOffIcon />)}} required type="password" name="password" onKeyPress={onKeyPress} onChange={handleChange} label="Contraseña" variant="outlined" />
    </div>
    
    <div className="form-group has-feedback">
    <button disabled={loading ? true: false}
      className="btn btn-primary btn-block" fullWidth type="submit">
      {loading ? "Espere..." : "Acceder"} <InputIcon /></button>    
    </div>
    </form> 
    <hr />
      
    </div>    
    </div>
    );
  }
  
export default withRouter(Login);