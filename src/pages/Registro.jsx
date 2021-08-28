import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../css/login.css';
import {TextField,Button,makeStyles} from '@material-ui/core'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import swal from 'sweetalert'
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
  inputs: {
    width:'100%'  
  },  
}));

const Registro=(props) =>{
  const styles=useStyles();
  const url="https://giddingsfruit.mx/ApiIndicadores/api/usuarios"
  const [error,setError]=useState(false)
  const [data, setData]= useState([])
  const [pwd, setPwd ] =useState({
    input:{}
  }); 

  const [form,setForm]=useState({
      nombre:'',
      clave:'',
      tipo:null
  });

  const handleChange=e=>{
    const {name,value}=e.target;
      setForm({
          ...form,
          [name]:value
      });     
  }

  const handleChangePwd = e => {
    let input =pwd.input;
    input[e.target.name] = e.target.value;
     
    setPwd({
      input
    });

    setForm((prevState) => ({
      ...prevState,
      clave: e.target.value
    }));
  }
     
  const onKeyPress= (e) => {
    if (e.key === 'Enter') {
      registrar();
    }
  }

  const registrar=e=>{
    e.preventDefault()
     
     if(form.length===0){
          setError('Datos incompletos')
        return
      }  
    
     if(validate()){
      post() 
      let input = {};
      setError('')
      input["clave"] = "";
      input["claveConfirm"] = "";
      setPwd({input:input});                
  }
  }

  const validate=e=>{
    let input = pwd.input;
    let isValid = true;
   
    /* if (!input["email"]) {
      isValid = false;
      errors["email"] = "Please enter your email Address.";
    }

    if (typeof input["email"] !== "undefined") {
        
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(input["email"])) {
        isValid = false;
        errors["email"] = "Please enter valid email address.";
      }
    }
 */
  /*   if (!input["clave"]) {
      isValid = false;
      errors["clave"] = "Please enter your password.";
    }

    if (!input["claveConfirm"]) {
      isValid = false;
      errors["claveConfirm"] = "Please enter your confirm password.";
    } */

    if (input["clave"] != input["claveConfirm"]) {
      isValid = false;
      setError('Las contraseñas no coinciden')       
    } 
    else{
      isValid = true;     
    }
    return isValid;
  }

  const post=async()=>{
      await axios.post(url,form)        
      .then(response=>{
        setData(data.concat(response.data));
        swal({
          title: "¡Registro correcto!",
          icon: "success",
          button: "ok",
        }).then(function() {
          props.history.push('/');
      });
      }).catch(error=>{
        swal({
          title: error.response.data,
          text: "Favor de verificar la información",
          icon: "error",
          button: "Cerrar",
        });
        console.log(error.response.data);
        console.log(error.request);
        console.log(error.message); 
      })
  }
  
return (
<div className="containerRegistro">
  <div>
    <img src="/Indicadores/dist/img/logo_horizontal.png" alt="" style={{width: '100px'},{height: '60px'}}/>
  </div>
<div>
   <form onSubmit={registrar}>
   <span className="font-weight-bold text-secondary">Indicadores GiddingsFruit</span>     
    <br />
    {     
        error ? <span className="font-weight-bold text-danger mt-3">{error}</span> : null
    }
   
    <div className="form-group mt-3">    
        <TextField InputProps={{endAdornment: (<AccountCircleIcon />)}} type="text" name="nombre" className={styles.inputs}
        onChange={handleChange} label="Usuario de SEASON" variant="outlined" autoComplete="off"/> 
    </div>   

    <div className="form-group">     
        <TextField InputProps={{endAdornment: (<EmailIcon />)}} type="email" name="correo" className={styles.inputs}
        onChange={handleChange} label="Correo" variant="outlined" autoComplete="off"/>
    </div>   

    <div className="form-group">
        <TextField InputProps={{endAdornment: (<VisibilityOffIcon />)}} type="password" name="clave" className={styles.inputs}
        onChange={handleChangePwd} value={pwd.input.clave} label="Contraseña" variant="outlined" autoComplete="off"/>
    </div>
     
    <div className="form-group">
        <TextField InputProps={{endAdornment: (<VisibilityOffIcon />)}} type="password" name="claveConfirm" className={styles.inputs}
         onChange={handleChangePwd} value={pwd.input.claveConfirm}
         onKeyPress={onKeyPress} label="Confirma la ontraseña" variant="outlined" autoComplete="off"/>
    </div>   

     <Button variant="contained" color="secondary" fullWidth endIcon={<SaveIcon />} type="submit">Guardar</Button>
    
    </form>
     
    </div>    
    </div>
    )
  }
  export default withRouter(Registro);