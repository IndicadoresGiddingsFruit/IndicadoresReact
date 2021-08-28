import React, {useState,useEffect} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {useParams} from 'react-router-dom';
import {makeStyles, Hidden} from '@material-ui/core'
import Contenedor from '../Contenedor.jsx';
   
const useStyles=makeStyles(theme=>({
  root:{
    display:'flex'
  },
   toolbar: theme.mixins.toolbar,
   content: {
      flexGrow: 1,       
      padding: theme.spacing(3),
    },
}))

const Respuestas=(props)=>{  
  const styles=useStyles();
    const cookies = new Cookies();
    const {id}=useParams();
    const {idUsuario}=useParams();      
    const url="https://giddingsfruit.mx/ApiIndicadores/api/encuestas";   
    const [respuestas, setRespuestas]=useState([]);
    const [nombrEncuesta,setNombrencuesta]=useState('');  
    const [nomUsuario,setNomUsuario]=useState('');

    useEffect(() => {
        getDatos();
    }, [])

    const[abrir,setAbrir]=React.useState(false)

    const abrirMenu=()=>{
        setAbrir(!abrir)
    }

    const getDatos=async()=>{       
      await axios.get(url+"/"+id+"/"+idUsuario)
        .then(res=>{    
            setRespuestas(res.data.item3);

            for(const dataObj of res.data.item3)
            {
              setNombrencuesta(dataObj.encuesta);
              if(cookies.get('Tipo')==='R'){
                setNomUsuario(dataObj.usuario);
              }              
            }    
        })          
    }

    return (
      <div className={styles.root}>
      <Contenedor />
     
    <div className={styles.content}>
    <div className={styles.toolbar}> </div>  
    <section className="content">
    <br/> 
    <h6>{nombrEncuesta}</h6>   
    <br/>

      <React.Fragment>
      <h6>Respuestas: {nomUsuario}</h6>   
      <hr/>
      <div className="row">
      <div className="col-12">     
      <ul>
      {
      respuestas.map(item=>(
        <React.Fragment key={item.idPregunta}>    
        <li>{item.pregunta} 
          <br />{item.respuesta}
        </li> 
        </React.Fragment>
      ))
      }
      </ul>
      </div>
      </div>
      </React.Fragment>    
    </section>
    </div>   
    </div>  
   
    )
    }
export default Respuestas