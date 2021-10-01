import React from 'react';
import {HashRouter as Router,Switch,Route} from 'react-router-dom';
import Login from '../pages/Login.jsx';
import App from '../pages/App.jsx';
import Registro from '../pages/Registro.jsx';
 
/* muestreos */
import Nuevo from '../pages/Muestreos/Nuevo.jsx';
import Muestreos from '../pages/Muestreos/Muestreos.jsx';
import Evaluacion from '../pages/Muestreos/Evaluacion.jsx';

/* analisis */
import Analisis from '../pages/Analisis/Analisis.jsx';
import Resultados from '../pages/Analisis/Resultados.jsx';

/* indicadores */
import Visitas from '../pages/Indicadores/Visitas.jsx';
import ReporteVisitas from '../pages/Indicadores/ReporteVisitas.jsx'
import Financiamiento from '../pages/Indicadores/Financiamiento.jsx';

/* encuestas */
import Encuestas from '../pages/Encuestas/Encuestas.jsx'
import Editar from '../pages/Encuestas/Editar.jsx'
import Responder from '../pages/Encuestas/Responder.jsx'
import Respuestas from '../pages/Encuestas/Respuestas.jsx'
import RespuestasTotal from '../pages/Encuestas/RespuestasTotal.jsx' 
import LiberarAnalisis from '../pages/Analisis/LiberarAnalisis.jsx';
import Bloqueo from '../pages/Muestreos/Bloqueo.jsx';

function Routes() {
 const rutaServer="/Indicadores"; 

  return (
    <Router>  
      <Switch>
        <Route exact path="/evaluacion">
           <Evaluacion />
         </Route>
          <Route exact path="/nuevo">
           <Nuevo />
         </Route>
         <Route exact path="/bloqueo">
           <Bloqueo />
         </Route>
         <Route exact path="/muestreos">
           <Muestreos />
         </Route>
         <Route exact path="/visitas">
           <Visitas />
         </Route>
         <Route exact path="/reporteVisitas">
           <ReporteVisitas />
         </Route>
         <Route exact path="/financiamiento">
           <Financiamiento />
         </Route>
         <Route exact path="/analisis">
           <Analisis />
         </Route>
         <Route exact path="/liberar">
           <LiberarAnalisis />
         </Route>
         <Route exact path="/resultados">
           <Resultados />
         </Route>
         <Route exact path="/encuestas">
           <Encuestas />
         </Route>
         <Route exact path="/responder/:id">
           <Responder />
         </Route>
         <Route exact path="/editar/:id">
           <Editar />
         </Route>
         <Route exact path="/respuestas/:id/:idUsuario">
           <Respuestas />
         </Route>
         <Route exact path="/respuestastotal/:id">
           <RespuestasTotal />
         </Route>
         <Route exact path="/registro">
           <Registro />
         </Route> 
         
         <Route exact path="/index">
           <App />
         </Route>  
         <Route exact path="/">
           <Login />
         </Route> 
            
     </Switch>
    </Router>
  );   
  }

export default Routes;
