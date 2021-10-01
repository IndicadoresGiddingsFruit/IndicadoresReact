import React, {useState,useEffect}  from 'react';
import Encuestas from '../pages/Encuestas/Encuestas.jsx'
import Cookies from 'universal-cookie';
import Muestreos from './Muestreos/Muestreos.jsx';
import Financiamiento from './Indicadores/Financiamiento.jsx';
import Resultados from './Analisis/Resultados.jsx';

function App(props) {  
  const cookies = new Cookies();
  const [financiamientos, setFinanciamientos] = useState(false);
  const [encuestas, setEncuestas] = useState(false);
  const [agente, setAgente] = useState(false);
  const [otros, setOtros] = useState(false);

useEffect(() => {  
/*   if(cookies.get('Tipo')==='A'){
    setFinanciamientos(true);
    setAgente(false);
    setOtros(true);
  }
  else  */
   
  if(cookies.get('Tipo')!==null)
  {  
    if(cookies.get('Id')==='352'){
      setFinanciamientos(true);
    }  
    setFinanciamientos(false);
    setAgente(false);
    setOtros(true);
  }
  if(cookies.get('Depto')!==null){ 
    setEncuestas(false);
    setAgente(true);    
  }
  else
  {     
    setEncuestas(true);
    setAgente(false);
    /* if(cookies.get('Tipo')==='P'){
      setAgente(true);
    }
    else{
      setAgente(false);
    }     */
  }
}, []);

  return ( 
     <>     
     {encuestas?
     <Encuestas />
     :
     <> 
     {agente?
     <Muestreos />
     :
     <>          
     {otros?
     <Resultados />
     :
     <>          
    <Financiamiento />            
    </>  
     }           
    </>  
     }             
             
    </>  
     }       
    </> 
  );    
}

export default App;
