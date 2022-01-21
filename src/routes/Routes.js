import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Login from "../pages/Login.jsx";
import App from "../pages/App.jsx";
import Registro from "../pages/Registro.jsx";

/* muestreos */
import Nuevo from "../pages/Muestreos/Nuevo.jsx";
import Muestreos from "../pages/Muestreos/Muestreos.jsx";
import Evaluacion from "../pages/Muestreos/Evaluacion.jsx";
import Bloqueo from "../pages/Muestreos/Bloqueo.jsx";
import generateStoreMuestreo from "../redux/Muestreos/storeMuestreos";

/* analisis */
import Resultados from "../pages/Analisis/Resultados.jsx";
import LiberarAnalisis from "../pages/Analisis/LiberarAnalisis.jsx";
import generateStoreAnalisis from "../redux/Analisis/storeAnalisis";

/* Visitas */
import Visitas from "../pages/Indicadores/Visitas.jsx";
import ReporteVisitas from "../pages/Indicadores/ReporteVisitas.jsx";
import generateStoreVisitas from "../redux/Visitas/storeVsitas";

/* indicadores */
import Financiamiento from "../pages/Indicadores/Financiamiento.jsx";
import Recepcion from "../pages/Indicadores/Recepcion.jsx";
import Proyeccion from "../pages/Indicadores/Proyeccion.jsx";
import Expediente from "../pages/Indicadores/Expediente.jsx";

import generateStoreRecepcion from "../redux/Recepcion/storeRecepcion";
import generateStoreProyeccion from "../redux/Proyeccion/storeProyeccion";
import generateStoreExpediente from "../redux/Expediente/storeExpediente";

/* encuestas */
import Encuestas from "../pages/Encuestas/Encuestas.jsx";
import Editar from "../pages/Encuestas/Editar.jsx";
import Responder from "../pages/Encuestas/Responder.jsx";
import Respuestas from "../pages/Encuestas/Respuestas.jsx";
import RespuestasTotal from "../pages/Encuestas/RespuestasTotal.jsx";

/* inventario */
import Inventario from "../pages/Inventario/Inventario.jsx";

import generateStoreInventario from "../redux/Inventario/storeInventario";

/* auditoria */
import Auditorias from "../pages/Auditorias/Nueva.jsx";
import Auditoria from "../pages/Auditorias/Auditoria.jsx";
import PreLLenado from "../pages/Auditorias/PreLLenado.jsx";
import AccionCorrectiva from "../pages/Auditorias/AccionCorrectiva.jsx";

import generateStoreAuditorias from "../redux/Auditoria/storeAuditoria";

function Routes() {
  const inventario = generateStoreInventario();
  const visitas = generateStoreVisitas();
  const muestreos = generateStoreMuestreo();
  const recepcion = generateStoreRecepcion();
  const proyeccion = generateStoreProyeccion();

  const auditoria = generateStoreAuditorias();
  const analisis = generateStoreAnalisis();

  const expediente=generateStoreExpediente();

  return (
    <Router>
      <Switch>

        {/* Auditoria */}
        <Route exact path="/auditorias">
          <Provider store={auditoria}>
            <Auditorias />
          </Provider>
        </Route>

        <Route exact path="/auditoria/:idAuditoria">
          <Provider store={auditoria}>
            <Auditoria />
          </Provider>
        </Route>

        <Route exact path="/prellenado/:idAuditoria/:idPunto">
          <Provider store={auditoria}>
            <PreLLenado />
          </Provider>
        </Route>

        <Route exact path="/accionCorrectiva/:idAuditoria/:idPunto">
          <Provider store={auditoria}>
            <AccionCorrectiva />
          </Provider>
        </Route>


        {/* inventario */}
        <Route exact path="/inventario">
          <Provider store={inventario}>
            <Inventario />
          </Provider>
        </Route>

        {/* muestreos */}
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
          <Provider store={muestreos}>
            <Muestreos />
          </Provider>
        </Route>

        {/* indicadores */}
        <Route exact path="/expediente">
          <Provider store={expediente}>
            <Expediente />
          </Provider>
        </Route>

        <Route exact path="/visitas">
          <Provider store={visitas}>
            <Visitas />
          </Provider>
        </Route>

        <Route exact path="/reporteVisitas">
          <Provider store={visitas}>
            <ReporteVisitas />
          </Provider>
        </Route>

        <Route exact path="/financiamiento">
          <Financiamiento />
        </Route>

        <Route exact path="/productividad">
          <Provider store={recepcion}>
            <Recepcion />
          </Provider>
        </Route>

        <Route exact path="/proyeccion">
          <Provider store={proyeccion}>
            <Proyeccion />
          </Provider>
        </Route>

        {/* analisis */}
        <Route exact path="/liberar">
          <Provider store={analisis}>
            <LiberarAnalisis />
          </Provider>
        </Route>

        <Route exact path="/resultados">
          <Provider store={analisis}>
            <Resultados />
          </Provider>
        </Route>

        {/* encuestas */}
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
          <Provider store={visitas}>
          <Registro />
          </Provider>
        </Route>

        <Route exact path="/index">
          <App />
        </Route>

        {/* login */}
        <Route exact path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default Routes;
