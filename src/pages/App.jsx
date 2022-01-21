import React, { useState, useEffect } from 'react';
import Encuestas from '../pages/Encuestas/Encuestas.jsx'
import Cookies from 'universal-cookie';
import Muestreos from './Muestreos/Muestreos.jsx';
import Financiamiento from './Indicadores/Financiamiento.jsx';
import Resultados from './Analisis/Resultados.jsx';
import generateStoreAnalisis from "../redux/Analisis/storeAnalisis";

import Movimientos from './Inventario/Movimientos.jsx';
import Auditorias from "../pages/Auditorias/Nueva.jsx";
import { Provider } from "react-redux";
import generateStoreAuditorias from "../redux/Auditoria/storeAuditoria";

function App(props) {
  const cookies = new Cookies();
  const [financiamientos, setFinanciamientos] = useState(false);
  const [inventario, setInventario] = useState(false);
  const [encuestas, setEncuestas] = useState(false);
  const [agente, setAgente] = useState(false);
  const [otros, setOtros] = useState(false);

  const [auditorias, setAuditorias] = useState(false);
  const auditoria = generateStoreAuditorias();

  const analisis = generateStoreAnalisis();

  useEffect(() => {
    if (cookies.get('Tipo') !== 'null' || cookies.get('Depto') !== 'null') {
      if (cookies.get('Tipo') !== null) {
        if (cookies.get('Tipo') === 'A') {
          setInventario(true);
        }
        else {
          if (cookies.get('Id') === '352') {
            setFinanciamientos(true);
          }
          setFinanciamientos(false);
          setAgente(false);
          setOtros(true);
        }
      }

      if (cookies.get('Depto') !== null) {
        //GXICOHTENCATL
        if (cookies.get('IdAgen') === '326') {
          setAuditorias(true);
          setEncuestas(false);
          setAgente(true);
        }
        else {
          setEncuestas(false);
          setAgente(true);
        }
      }
    }
    else {
      setEncuestas(true);
      setInventario(false);
      setFinanciamientos(false);
      setAgente(false);
      setOtros(false);
    }
  }, []);

  return (
    <>
      {encuestas ?
        <Encuestas />
        :
        <>
          {auditorias ?
            <Provider store={auditoria}>
              <Auditorias />
            </Provider>
            :
            <>
              {agente ?
                <Muestreos />
                :
                <>
                  {inventario ?
                    <Movimientos />
                    :
                    <>
                      {otros ?
                        <Provider store={analisis}>
                          <Resultados />
                        </Provider>
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
          }

        </>
      }
    </>
  );
}

export default App;
