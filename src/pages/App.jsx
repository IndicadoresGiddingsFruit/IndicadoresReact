import React, {useState,useEffect}  from 'react';
import Encuestas from '../pages/Encuestas/Encuestas.jsx'
import Cookies from 'universal-cookie';
import Muestreos from './muestreos/Muestreos.jsx';
import Financiamiento from './indicadores/Financiamiento.jsx';

function App(props) {  
  const cookies = new Cookies();
  const [financiamientos, setFinanciamientos] = useState(false);
  const [encuestas, setEncuestas] = useState(false);
  const [agente, setAgente] = useState(false);

useEffect(() => {
  if(cookies.get('Tipo')==='null'){
    setEncuestas(true);
    setAgente(false);
  }
  else if(cookies.get('Tipo')==='A'){
    setFinanciamientos(true);
    setAgente(false);
  }
  else
  {     
    setEncuestas(false);
    setAgente(true);
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
    <Financiamiento />            
    </>  
     }             
             
    </>  
     }       
    </> 
  );    
}

export default App;
