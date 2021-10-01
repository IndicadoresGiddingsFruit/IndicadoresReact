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
  const url="https://giddingsfruit.mx/ApiIndicadores/api/muestreo";
  //const url="https://localhost:44344/api/muestreo";
  const cookies = new Cookies(); 
  const [data, setData]= useState([]);
  const [campos, setcampos] = useState([]);
  const [nom_p, setnom_p] = useState(null);
  const [c_campo, setc_campo] = useState(null);
  const [campo, setcampo] = useState(null);
  const [loc, setloc] = useState(null);
  const [tipo, settipo] = useState(null);
  const [producto, setproducto] = useState(null);
  const [loading,setLoading]=useState(false); 
  var opcion_campo;
  var idMuestreo;

  const [nuevo,setnuevo]=useState({  
    cod_Prod: "",
    cod_Campo: parseInt(),  
    liberar_Tarjeta:""  
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
          buscarSolicitud();
        }
      });
      setLoading(false);  
  }

  const buscarSolicitud=async(e)=>{   
    await axios.get(url+`/${cookies.get('IdAgen')}/${null}/${cookies.get('Depto')}/${nuevo.cod_Prod}/${nuevo.cod_Campo}`)
    .then(res=>{   
      idMuestreo=res.data.id;  
      peticionPatch();
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
setLoading(false);   
}
 
  const peticionPatch=async(e)=>{ 
        await axios.patch(url+`/${idMuestreo}/${cookies.get('IdAgen')}/${"bloqueo"}`,nuevo)
        .then(response=>{ 
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

  //cargar campos
  const handlerCargarCampos= function(e){
    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${nuevo.cod_Prod}/${0}`)
    .then(res=>{ 
      setcampos(res.data);         
      opcion_campo=e.target.value;
      handlerCargarinfo(opcion_campo);
     })
  }

  //info por campo
  const handlerCargarinfo= function(opcion_campo){     
        axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${nuevo.cod_Prod}/${opcion_campo}`)
        .then(res=>{   
        for(const dataObj of res.data)
        {        
        setc_campo(dataObj.cod_Campo);
        setcampo(dataObj.campo);
        setloc(dataObj.ubicacion);
        settipo(dataObj.tipo);
        setproducto(dataObj.producto);       
      }
    })   
  }

   //info por campo
  const handlerCargarNomProd= function(){     
    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${nuevo.cod_Prod}/${0}`)
    .then(res=>{   
    for(const dataObj of res.data)
    {
    setnom_p(dataObj.productor);
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
      <h7 className="font-weight-bold text-secondary">Bloqueo para no entregar tarjeta</h7>      
    </div>         
    <div className="card-body font-weight-bold text-secondary">
      <div className="row">

      <div className="col-md-12">
        <div className="form-group-sm">
        <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={6}>
        Codigo:   
        <input 
          type="text" required onBlur={handlerCargarNomProd}
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
        <Grid item xs={12} md={12} lg={6}>
        Campo: 
        <select name="cod_Campo" id="cod_Campo" className="form-control" 
        onChange={handleChange} onClick={handlerCargarCampos}>
          <option value={0} >Seleccione un campo</option>
          {
            campos.map(item=>(
            <option key={item.cod_Campo} value={item.cod_Campo} >{item.cod_Campo}</option>
          )
          )}
        </select>     
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Nombre:  
        <input 
          type="text" disabled
          className="form-control"
          id="campo" name="campo"
          value={campo}
        />         
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Cultivo:  
        <input 
          type="text" disabled
          className="form-control"
          id="tipo" name="tipo"
          value={tipo}
        />          
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
        Producto:  
        <input 
          type="text" disabled
          className="form-control"
          id="producto" name="producto"
          value={producto}
        />       
        </Grid>
 
      </Grid>
      </div>
    </div>

    <div className="col-md-12">
        <div className="form-group-sm">
        <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={6}>
        Ubicacion:   
        <input 
          type="text" disabled
          className="form-control"
          id="productor" name="productor"
          value={loc}
        />              
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Justificación:
            <textarea 
            type="text" required
            className="form-control" name="liberar_Tarjeta" variant="outlined"
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