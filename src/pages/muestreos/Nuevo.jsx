import React, {useState} from 'react';
import Contenedor from '../Contenedor.jsx';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {Checkbox,FormControlLabel,Grid} from '@material-ui/core';
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

const Index=()=>{  
  const styles=useStyles();
  const url="https://giddingsfruit.mx/ApiIndicadores/api/muestreo";
  //const url="https://localhost:44344/api/muestreo";
  const cookies = new Cookies(); 
  const [data, setData]= useState([]);
  const [campos, setCampos] = useState([]);
  const [nom_p, setNom_p] = useState(null);
  const [c_campo, setC_campo] = useState(null);
  const [campo, setCampo] = useState(null);
  const [localidad, setLocalidad] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [producto, setProducto] = useState(null);
  const [compras_op, setCompras_op] = useState(false); 
  const [loading,setLoading]=useState(false); 
  var opcion_campo;
 
  const [nuevomuestreo,setnuevomuestreo]=useState({
    idAgen:parseInt(cookies.get('IdAgen')),      
    cod_Empresa:parseInt(2),
    cod_Prod: "",
    cod_Campo: parseInt(),
    telefono: "",
    inicio_cosecha:"" ,
    cajasEstimadas: ""
  })

  const handleChange=e=>{       
    const {name, value}=e.target;    
    setnuevomuestreo(prevState=>({
      ...prevState,
      [name]: value
    }));
   /*  console.log(name,value);
   console.log(nuevomuestreo); */
  }

  const enviarSolicitud = async (e) => {
   e.preventDefault();

    if(!nuevomuestreo.cod_Prod.trim() || !nuevomuestreo.telefono.trim() || !nuevomuestreo.inicio_cosecha.trim()  || !nuevomuestreo.cajasEstimadas.trim()){     
      swal({
        title: "¡Complete todos los campos!",
        icon: "error",
        button: "Cerrar",
      });
       return
    }
   else{     
      swal({
        title: "¿Está seguro de enviar esta solicitud?",
        icon: "info",
        buttons: ["No","Si"],
      }).then((value) => {
        if(value){
        peticionPost();
        }
      }); 
    }    
  }

  const peticionPost=async()=>{
    setLoading(true);   
    await axios.post(url,nuevomuestreo)
    .then(response=>{
      setData(data.concat(response.data));
      swal({
        title: "Solicitud enviada correctamente!",
        icon: "success",
        button: "ok",
      });
    /*   nuevomuestreo.trim(); */
      
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

  //cargar info
  const handlerCargarCampos= function(e){
    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${nuevomuestreo.cod_Prod}/${0}`)
    .then(res=>{ 
      setCampos(res.data);         
      opcion_campo=e.target.value;
      handlerCargarinfo(opcion_campo);
     })
  }

  //info por campo
  const handlerCargarinfo= function(opcion_campo){     
        axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${nuevomuestreo.cod_Prod}/${opcion_campo}`)
        .then(res=>{   
        for(const dataObj of res.data)
        {        
        setC_campo(dataObj.cod_Campo);
        setCampo(dataObj.campo);
        setUbicacion(dataObj.ubicacion);
        setLocalidad(dataObj.localidad);
        setTipo(dataObj.tipo);
        setProducto(dataObj.producto);
        if(dataObj.compras_oportunidad==="S"){
          setCompras_op(true);
        }
        else{
          setCompras_op(false);
        }        
      }
    })   
  }

   //info por campo
  const handlerCargarNomProd= function(){     
    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${nuevomuestreo.cod_Prod}/${0}`)
    .then(res=>{   
    for(const dataObj of res.data)
    {
    setNom_p(dataObj.productor);
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
      <h7 className="font-weight-bold text-secondary">Solicitar muestreo</h7>      
    </div>         
    <div className="card-body font-weight-bold text-secondary">
      <div className="row">
          <div className="col-md-6">
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
          className="form-control" name="productor"
          value={nom_p}
        />                
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Campo: 
        <select name="cod_Campo" className="form-control" 
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
          className="form-control" name="campo"
          value={campo}
        />         
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Cultivo:  
        <input 
          type="text" disabled
          className="form-control" name="tipo"
          value={tipo}
        />          
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
        Producto:  
        <input 
          type="text" disabled
          className="form-control" name="producto"
          value={producto}
        />       
        </Grid>
 
      </Grid>
      </div>
    </div>

    <div className="col-md-6">
      <div className="form-group-sm">
        <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={6}>
        Localidad:   
        <input 
          type="text" disabled
          className="form-control"
          name="localidad"
          value={localidad}
        />              
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
        Ubicacion:   
        <input 
          type="text" disabled
          className="form-control"
          name="ubicacion"
          value={ubicacion}
        />              
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Teléfono:
            <input 
            type="text" required
            className="form-control" name="telefono" maxLength={10} minLength={10} variant="outlined"
            onChange={handleChange} autoComplete="off"
          />     
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
        Inicio de cosecha: 
        <input 
          type="date" required
          className="form-control"
          name="inicio_cosecha" variant="outlined"  
          onChange={handleChange}
        />       
        </Grid>
        
        <Grid item xs={12} md={12} lg={6}>
         Cajas estimadas:
            <input 
            type="text" required
            className="form-control" name="cajasEstimadas" variant="outlined"
            onChange={handleChange} autoComplete="off"
          />     
        </Grid>

        <Grid item xs={12} md={12} lg={6}>
        <br />
        <FormControlLabel disabled control={
        <Checkbox disabled name="compras_oportunidad" color="primary" checked={compras_op} />} label="Compras de oportunidad"
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

export default Index;