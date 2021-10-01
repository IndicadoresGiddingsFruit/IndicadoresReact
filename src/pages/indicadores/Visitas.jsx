import React, {useEffect,useState} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {Line} from "react-chartjs-2";
import Contenedor from '../Contenedor.jsx';
import {makeStyles} from '@material-ui/core'

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

const Visitas=(props)=>{  
  const styles=useStyles(); 
  const url="https://giddingsfruit.mx/ApiIndicadores/api/visitas";  
  //const url="https://localhost:44344/api/visitas";
  const cookies = new Cookies();
  let auxtotales=[], auxmeses=[];
  const[dataT,setDataT]=useState([]);
  const [asesores, setasesores] = useState([]);
  const [idagens, setidagens] = useState([null]);
  const [admin, setAdmin] = useState(false);
  const [error,setError]=useState(null);
  var [idAgen, setIdAgen] = useState(null);
 
  const chart_data={    
  labels: auxmeses,
    datasets: [{
    label: "Visitas",
    data: auxtotales,
    lineTension: 0,
    fill: false,
    borderColor: 'rgba(222, 27, 27)',
    backgroundColor: 'rgba(222, 27, 27)',     
    pointBorderColor: 'rgba(222, 27, 27)',
    pointBackgroundColor: "rgba(234, 237, 24)",
    pointRadius: 5,
    pointHoverRadius: 10,
    pointHitRadius: 30,
    pointBorderWidth: 2,
    pointStyle: 'rectRounded'
    }]
  };

  const data=async()=>{
    if(idAgen===null){
      idAgen=cookies.get('IdAgen');
    }   

    await axios.get(url+`/${null}/${idAgen}`).then(res=>{ 
       setDataT(res.data.item1);
      for(const dataObj of res.data.item2)
      {
        auxtotales.push(parseInt(dataObj.total));
        auxmeses.push(dataObj.mes);
      }
    })
    .catch(err=>{
      console.log(err);
    })  
  }

  //cargar asesores
  const handlerCargarAsesores= function(e){
    axios.get("https://giddingsfruit.mx/ApiIndicadores/api/json"+`/${"P"}`)
    .then(res=>{    
      setasesores(res.data); 
        for(const dataObj of res.data)
        {         
          setidagens(dataObj.idAgen);  
        } 
      })      
  }
    
  const handleChange=e=>{      
    setIdAgen(e.target.value);
  }

  const cargarVisitas=e=>{ 
    e.preventDefault();    

    if(idAgen !== null){
      data();   
      setError(null);  
    }
  
    else{
      setError('Seleccione un asesor');
      return
    }
  
  }

  useEffect(()=>{
    if(cookies.get('IdAgen')==='1' || cookies.get('IdAgen')==='5')
    {
      setAdmin(true);
    }
    else{
      data();
      setAdmin(false);
    }
  },[])

return(
<div className={styles.root}>
  <Contenedor />     
    <div className={styles.content}>
    <div className={styles.toolbar}> </div>   
    <section className="content">  
    <h3 className="card-title">REPORTE DE VISITAS A PRODUCTORES</h3>  

    {admin?
      <> 
     <div className="row" style={{width:'100%'}}>      
    <form onSubmit={cargarVisitas} className="mb-2">   
      {
          error ? <span className="text-danger">{error}</span> : null
      }   
    <div className="col-11" style={{paddingRight:0, marginRight: 0,display: 'inline-block'}}>  
      Asesor zonal: 
      <select name="idAgen" className="form-control" onChange={handleChange} onClick={handlerCargarAsesores}>
      <option value={0}>--Seleccione--</option>
      {
        asesores.map(item=>(
        <option key={item.idAgen} value={item.idAgen} >{item.asesor}</option>
      )
      )}
    </select>
    </div>
    <div className="col-1" style={{padding:0, bottom:4,display: 'inline-block'}}>  
      <button className="btn btn-sm btn-light shadow-lg" type="submit"><i className="fas fa-search"></i></button>        
    </div>        
   </form>   
   </div>    
   </>
    :
      null
    }
   
    <div className="card-body">
    <div className="form-group" style={{height: '200px', fontSize: '14px'}}>
    <Line data={chart_data} options={{maintainAspectRatio:false,responsive:true}}/>        
    </div>      
    <div className="form-group">
    <h6 className="font-weight-bold text-secondary">Eficiencia: Dias con visitas/Total dias laborales</h6>
    <h6 className="font-weight-bold text-secondary">Efectividad: Visitas del mes/Total campos</h6>
    </div>  
    <div className="table-responsive table-condensed table-sm tabla">
    <table className="table table-hover" style={{fontSize: 11, textAlign: 'center'}} id="tblRespuestas">
    <thead className="thead-light">     
      <tr> 
        <th>Mes</th>
        <th>Total Campos</th>
        <th>Campos Visitados</th>
        <th>Eficiencia</th> 
        <th>Efectividad</th>
        <th>Promedio</th>
        <th>1</th>
        <th>2</th>
        <th>3</th>        
        <th>4</th>
        <th>5</th>
        <th>6</th>
        <th>7</th>
        <th>8</th>
        <th>9</th>
        <th>10</th>
        <th>11</th>
        <th>12</th>
        <th>13</th>
        <th>14</th>
        <th>15</th>
        <th>16</th>
        <th>17</th>
        <th>18</th>
        <th>19</th>
        <th>20</th>
        <th>21</th>
        <th>22</th>
        <th>23</th>
        <th>24</th>
        <th>25</th>
        <th>26</th>
        <th>27</th>
        <th>28</th>
        <th>29</th>
        <th>30</th>
        <th>31</th>
      </tr>
    </thead>
    <tbody style={{backgroundColor: 'white'}}>  
    {
    dataT.map(item=>(
      <React.Fragment key={item.mes}>      
      <tr>
      <td>{item.mes}</td>
      <td>{item.totalCampos}</td>
      <td>{item.totalCamposVisit}</td>
      <td>{item.eficiencia}</td> 
      <td>{item.efectividad}</td> 
      <td>{item.promedio}</td> 
      <td>{item._1}</td> 
      <td>{item._2}</td> 
      <td>{item._3}</td> 
      <td>{item._4}</td> 
      <td>{item._5}</td> 
      <td>{item._6}</td> 
      <td>{item._7}</td> 
      <td>{item._8}</td> 
      <td>{item._9}</td> 
      <td>{item._10}</td> 
      <td>{item._11}</td> 
      <td>{item._12}</td> 
      <td>{item._13}</td> 
      <td>{item._14}</td> 
      <td>{item._15}</td> 
      <td>{item._16}</td> 
      <td>{item._17}</td> 
      <td>{item._18}</td> 
      <td>{item._19}</td> 
      <td>{item._20}</td> 
      <td>{item._21}</td> 
      <td>{item._22}</td> 
      <td>{item._23}</td> 
      <td>{item._24}</td> 
      <td>{item._25}</td> 
      <td>{item._26}</td> 
      <td>{item._27}</td> 
      <td>{item._28}</td> 
      <td>{item._29}</td> 
      <td>{item._30}</td> 
      <td>{item._31}</td> 
      </tr> 
      </React.Fragment>
    ))
    }  
   </tbody>
   </table>
   </div>
  </div>       
  </section>
  </div>
</div>
)
}
export default Visitas;