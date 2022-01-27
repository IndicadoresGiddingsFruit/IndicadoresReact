import React, {useState,useEffect } from 'react';
import axios from 'axios'; 
import {useParams} from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {makeStyles} from '@material-ui/core' 
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
 
const RespuestasTotal=(props)=>{  
  const styles=useStyles(); 
    const {id}=useParams();     
    const url="https://giddingsfruit.mx/ApiIndicadores/api/encuestas";      
    const [tabledata,setTableData]=useState([]);     
    const [nombrEncuesta,setNombrencuesta]=useState('');  
   
    useEffect(() => {
        getDatos();
    }, [])

    const getDatos=async()=>{       
      await axios.get(url+"/"+id)
        .then(res=>{     
            setTableData(res.data);    
            console.log(res.data)           
            for(const dataObj of res.data)
            {
              setNombrencuesta(dataObj.nombre)                       
            }    
        })          
    }

    return (
    <div className={styles.root}>
    <Contenedor />
     
    <div className={styles.content}>
    <div className={styles.toolbar}> </div>   
    <section className="content">  
    <div align="right" className="mb-2">
     <ReactHTMLTableToExcel id="botonExportar" 
      className="btn btn-success" 
      table="tblRespuestas" 
      filename="Resultados" 
      sheet="Resultados"       
      buttonText="Descargar"/>
      </div>

    <div className="table-responsive table-condensed table-sm tabla">
    <table className="table table-hover" style={{fontSize: 11, textAlign: 'center'}} id="tblRespuestas">
    <thead className="thead-light">
      <tr>
        <th colSpan={5}>{nombrEncuesta}</th>
      </tr>
      <tr> 
        <th>Zona</th>
        <th>Departamento</th>
        <th>Usuario</th>
        <th>Pregunta</th> 
        <th>Respuesta</th>        
      </tr>
    </thead>
    <tbody style={{backgroundColor: 'white'}}>  
    {
    tabledata.map(item=>(
      <React.Fragment key={item.idPregunta}>      
      <tr>
      <td>{item.zona}</td>
      <td>{item.departamento}</td>
      <td>{item.usuario}</td>
      <td>{item.pregunta}</td> 
      <td>{item.respuesta}</td> 
      </tr> 
      </React.Fragment>
    ))
    }  
   </tbody>
   </table>
   </div>
   
    </section>
    </div>  
    </div>
    )
    }

 export default RespuestasTotal
