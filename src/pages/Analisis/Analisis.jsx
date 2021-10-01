import React, {useEffect,useState} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {TextField, Button,Grid,FormControlLabel,Checkbox} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { format } from 'date-fns';
import swal from 'sweetalert';
import Contenedor from '../Contenedor.jsx';

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
      width:'100%',
      fontSize: 12
  },
  ocultar:{
    display:'none'
  }
  }));
  
  const Analisis=(props)=>{  
    const styles=useStyles();
    const url="https://giddingsfruit.mx/ApiIndicadores/api/analisis";
    //const url="https://localhost:44344/api/analisis";
    const cookies = new Cookies(); 
    const [data, setData]= useState([]); 
    const [loading,setLoading]=useState(false); 

    const [campos, setcampos] = useState([]);//lista campos
    const [zonas, setzonas] = useState([]);

    const [nom_p, setnom_p] = useState(null);    
    const [campo, setcampo] = useState(null);//nombre del campo
    const [tipo, settipo] = useState(null);
    const [producto, setproducto] = useState(null);
    var [num_analisis, setNum_analisis] = useState(null);

    const [c_campo, setc_campo] = useState(null);//cod de campo 
    const [codZona, setcodZona] = useState([null]);//cod de zonas

    var [estatus, setEstatus] = useState(null); 
  
    const [f_envio, setf_envio] = useState(format(new Date(), "yyyy-MM-dd"));  
    const [f_entrega, setf_entrega] = useState(format(new Date(), "yyyy-MM-dd"));  
    
    const [liberacionUSA, setLiberacionUSA] = useState(0);
    const [liberacionEU, setLiberacionEU] = useState(0);
    const [sector, setSector] = useState(null);

    var opcion_campo;
   
    const [nuevoanalisis,setnuevoanalisis]=useState({  
      cod_Prod: "",
      cod_Campo: parseInt(),
      codZona:"",
      fecha_envio:f_envio,
      fecha_entrega:f_entrega,
      estatus:"",
      laboratorio:"",
      comentarios:"",
      idAgen:parseInt(cookies.get('IdAgen')),    
      folio:"",
      traza:""
    })

    const handleChangeEstatus=e=>{    
      setEstatus(e.target.value);        
    
      const {name, value}=e.target;    
      setnuevoanalisis(prevState=>({
        ...prevState,
        [name]: value
      })); 
    }

    const handleChange=e=>{         
      setf_envio(e.target.value);
      setf_entrega(e.target.value);            
    
      const {name, value}=e.target;    
      setnuevoanalisis(prevState=>({
        ...prevState,
        [name]: value
      }));
      console.log(nuevoanalisis);
    }
  
    const enviarSolicitud = (e) => {
      e.preventDefault();
      if(!nuevoanalisis.cod_Prod.trim()){
        swal({
          title: "Debe ingresar información válida",
          icon: "warning",
          button: "Cerrar",
        }).then((value) => {
          if(value){         
          peticionPost();
          }
        }); 
      }
      else{
      swal({
        title: "¿Desea guardar esta información?",
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
      await axios.post(url+`/${0}/${0}/${liberacionUSA}/${liberacionEU}/${sector}`,nuevoanalisis)
      .then(response=>{
        setData(data.concat(response.data));
        swal({
          title: "Datos guardados correctamente!",
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
      setLoading(false);
    }
  
    //cargar campos
    const handlerCargarCampos= function(e){
      axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${nuevoanalisis.cod_Prod}/${0}`)
      .then(res=>{ 
        setcampos(res.data); 
       })      
       opcion_campo=e.target.value;
       handlerCargarinfo(opcion_campo);
    }

    //info por campo
    const handlerCargarinfo= function(opcion_campo){     
      axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${nuevoanalisis.cod_Prod}/${opcion_campo}`)
      .then(res=>{   
        for(const dataObj of res.data)
        {
          setnom_p(dataObj.productor);
          setc_campo(dataObj.cod_Campo);
          setcampo(dataObj.campo);
          settipo(dataObj.tipo);
          setproducto(dataObj.producto);
        }
       })   
       Cargarnum_analisis();
    }

    const Cargarnum_analisis= function(){     
      axios.get("https://giddingsfruit.mx/ApiIndicadores/api/analisis"+`/${0}/${0}/${nuevoanalisis.cod_Prod}/${opcion_campo}`)
      .then(res=>{   
        console.log(res.data)      
          setNum_analisis(res.data);        
       })             
    }
    
    const CargarZonas=async()=>{   
      axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json")
       .then(res=>{    
        setzonas(res.data); 
        for(const dataObj of res.data)
        {
          setcodZona(dataObj.codigo);
        }
      })      
    }
  
    useEffect(()=>{
      CargarZonas();
    },[])

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
            <h7 className="font-weight-bold text-secondary">Agregar nuevo análisis de Residuos de Plaguicidas</h7>      
          </div>         
          <div style={{fontSize: 12,}} className="card-body">
            
          <div className="row">
	      <div className="col-md-4">
        <div className="form-group-sm">
        <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
        Codigo:   
        <input 
          type="text" required
          className="form-control" name="cod_Prod" maxLength={5} minLength={5} variant="outlined"
          onChange={handleChange} autoComplete="off"
        />       
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        Productor:   
        <input 
          type="text" disabled
          className="form-control" name="productor" value={nom_p} 
        />       
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        Campos:   
        <select required name="cod_Campo" id="cod_Campo" className="form-control" onChange={handleChange} onClick={handlerCargarCampos}>
          <option value={0} >Seleccione un campo</option>
          {
            campos.map(item=>(
            <option key={item.cod_Campo} value={item.cod_Campo}>{item.cod_Campo}</option>
          )
        )}
        </select>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        Campo:   
        <input 
          type="text" disabled
          className="form-control" name="campo" value={campo}
        />       
        </Grid>
        
        <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
        <Grid item xs={6} md={6} lg={6}>
        Sector:   
        <input required
          type="text" onChange={e => setSector(e.target.value)}
          className="form-control" name="sector" value={sector}
        />       
        </Grid>

        <Grid item xs={6} md={6} lg={6}>
        <input type="checkbox" name="traza"
        defaultChecked={false} className="mt-4"
        onChange={handleChange}
        /> Traza        
        </Grid>   
        </Grid>  
        </Grid>
        </Grid>
        </div> 
        </div> 

        <div className="col-md-4">
        <div className="form-group-sm">
        <Grid container spacing={3}>

        <Grid item xs={12} md={12} lg={12}>
        Cultivo:   
        <input 
          type="text" disabled
          className="form-control" name="tipo" value={tipo}
        />       
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        Variedad:   
        <input 
          type="text" disabled
          className="form-control" name="producto" value={producto}
        />         
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        Folio:   
        <input 
          type="text" 
          className="form-control" name="folio" 
          onChange={handleChange} autoComplete="off"
        />        
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        Zona:
        <select required name="codZona" id="codZona" className="form-control" onChange={handleChange}>
          <option value={0} >Seleccione una zona</option>
          {
          zonas.map(item=>(
          <option key={item.codigo} value={item.codigo}>{item.descZona}</option>
          )
          )}  
        </select>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        Fecha de envio:
        <input required type="date" 
          className="form-control" name="fecha_envio" onChange={handleChange}
        />                 
        </Grid>
        </Grid>
        </div> 
        </div>    

        <div className="col-md-4">
        <div className="form-group-sm">
        <Grid container spacing={3}>

        <Grid item xs={12} md={12} lg={12}>
        Fecha de entrega:   
        <input required type="date" 
          className="form-control" name="fecha_entrega" onChange={handleChange}
        />   
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
        Estatus:   
        <select className="form-control" name="estatus" onChange={handleChangeEstatus}>
            <option value={0}> --Seleccione una opción-- </option>
            <option value={'R'}>
            CON RESIDUOS
            </option>
            <option value={'P'}>
            EN PROCESO
            </option>
            <option value={'F'}>
            FUERA DE LIMITE
            </option>
            <option value={'L'}>
           LIBERADO
            </option>
            </select>          
        </Grid>

        {estatus==="F"&&             
        <>   
        <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
        <Grid item xs={6} md={6} lg={6}>
        Liberación USA (dias):
          <input type="text" autoComplete="off"
            className="form-control" name="liberacionUSA" value={liberacionUSA} onChange={e => setLiberacionUSA(e.target.value)}  
          />  
        </Grid>

        <Grid item xs={6} md={6} lg={6}>
        Liberación EU (dias):
          <input type="text" autoComplete="off"
            className="form-control" name="liberacionEU" value={liberacionEU} onChange={e => setLiberacionEU(e.target.value)}  
          />          
        </Grid>   
        </Grid>  
        </Grid>       
        </> 
        }

        <Grid item xs={12} md={12} lg={12}>
        <Grid container spacing={3}>
        <Grid item xs={6} md={6} lg={6}>
        Número de análisis:   
        <input disabled type="number" 
          className="form-control" name="num_analisis" value={num_analisis} 
        />        
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
        Laboratorio:
        <select required className="form-control" id="laboratorio" name="laboratorio" onChange={handleChange} >
            <option value={0}> --Seleccione una opción-- </option>
            <option value={'AGQ'}>
            AGQ
            </option>
            <option value={'AGROLAB'}>
            AGROLAB
            </option>
            </select>    
        </Grid>
        </Grid> 
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        Comentarios:
        <textarea 
          type="text" 
          className="form-control" name="comentarios" onChange={handleChange}
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
  )
  }
  export default Analisis;