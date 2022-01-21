import React, {useState} from 'react';
import Contenedor from '../Contenedor.jsx';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import swal from 'sweetalert';

const useStyles = makeStyles((theme) => ({
  root:{
    display:'flex'
  },
   toolbar: theme.mixins.toolbar,
   content: {
      flexGrow: 1,         
      padding: theme.spacing(3),
    },
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  modal:{
    position:'absolute',
    width:400,
    backgroundColor:theme.palette.background.paper,
    border:'2px solid #000',
    boxShadow:theme.shadows[5],
    padding:theme.spacing(2,4,3),
    top:'50%',
    left:'50%',
    transform:'translate(-50%-50%)'
},
icons:{
    cursor:'pointer'
},
inputMaterial:{
    width:'100%'
},
ocultar:{
  display:'none'
}
}));

const Bloqueo=()=>{  
  const styles=useStyles();
  const url="https://giddingsfruit.mx/ApiIndicadores/api/bloqueotarjeta";
  //const url="https://localhost:44344/api/bloqueotarjeta";
  const url_campos = "https://giddingsfruit.mx/ApiIndicadores/api/campos";
  //const url_campos="https://localhost:44344/api/campos";

  const cookies = new Cookies(); 
  const [campos, setcampos] = useState([]);
  const [nom_p, setnom_p] = useState(null);
  const [loading,setLoading]=useState(false); 

  const [nuevo,setnuevo]=useState({  
    cod_Prod: "",
    cod_Campo: parseInt(),  
    idAgen:parseInt(cookies.get('IdAgen')),
    justificacion:"",      
  })

  const handleChange=e=>{       
    const {name, value}=e.target;    
    setnuevo(prevState=>({
      ...prevState,
      [name]: value
    }));
  }

  const enviarSolicitud = async (e) => {
   e.preventDefault();
   setLoading(true);  
      swal({
        title: "¿Está seguro de guardar esta información?",
        icon: "info",
        buttons: ["No","Si"],
      }).then((value) => {
        if(value){
          enviar();
        }
      });
      setLoading(false);  
  }

  const enviar=async(e)=>{   
    await axios.post(url,nuevo)
    .then(res=>{   
      swal({
        title: "Datos enviados correctamente!",
        icon: "success",
        button: "ok",
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

  const handlerCargarInfo= function(){     
    axios.get(url_campos+`/${nuevo.cod_Prod}/${0}`)
    .then(res=>{   
    for(const dataObj of res.data)
    {
    setnom_p(dataObj.productor);
    setcampos(res.data);     
   }
 })   
  }

return(
<div className={styles.root}>
  <Contenedor />     
    <div className={styles.content}>
    <div className={styles.toolbar}> </div>   
    <section className="content">  
    <div className="container-fluid">
    <div className="card card-default">
    <form onSubmit={enviarSolicitud}>
    <div className="card-header">     
      <h5 className="font-weight-bold text-secondary">BLOQUEO PARA NO ENTREGAR TARJETA</h5>      
    </div>         
    <div className="card-body font-weight-bold text-secondary">
      <div className="row">
      <div className="col-md-12">
        <div className="form-group-sm">
        <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={6}>
        Codigo:   
        <input 
          type="text" required onBlur={handlerCargarInfo}
          className="form-control" name="cod_Prod" maxLength={5} minLength={5} variant="outlined"
          onChange={handleChange} autoComplete="off"
        />       
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Nombre:  
        <input 
          type="text" disabled
          className="form-control"
          id="productor" name="productor"
          value={nom_p}
        />                
        </Grid>  
      </Grid>
      </div>
    </div>

    <div className="col-md-12">
        <div className="form-group-sm">
        <Grid container spacing={3}>     
        <Grid item xs={12} md={12} lg={6}>
        Campo: 
        <select name="cod_Campo" id="cod_Campo" className="form-control" 
        onChange={handleChange}>
          <option value={0} >Seleccione un campo</option>
          {
            campos.map(item=>(
            <option key={item.cod_Campo} value={item.cod_Campo} >{item.info}</option>
          )
          )}
        </select>     
        </Grid>          

        <Grid item xs={12} md={12} lg={6}>
        Justificación:
            <textarea 
            type="text" required
            className="form-control" name="justificacion" variant="outlined"
            onChange={handleChange} autoComplete="off"
          />     
        </Grid> 
      </Grid>
      </div>
    </div>
  </div>           
    </div> 
    <div className="card-footer">
    <button disabled={loading ? true: false}
      className="btn btn-primary active float-right" type="submit">
      {loading ? "Espere..." : "Enviar"}</button>
    </div>
</form>
</div>
</div>
</section>
</div>
</div>
);
}

export default Bloqueo;