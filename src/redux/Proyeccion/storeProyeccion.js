import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import proyeccionReducer from './ProyeccionD' 
import asesoresReducer from '../Catalogos/AgentesD'
import zonasReducer from '../Catalogos/ZonasD'
import regionesReducer from '../Catalogos/RegionesD'
import variedadesReducer from '../Catalogos/VariedadesD'
import semanasReducer from '../Catalogos/SemanasD';
 
const rootReducer = combineReducers({
    proyeccion: proyeccionReducer,
    zonas: zonasReducer,
    regiones: regionesReducer,
    variedades: variedadesReducer,
    asesores: asesoresReducer,
    semanas:semanasReducer
})
 
export default function generateStore() {
    const proyeccion = createStore( rootReducer, composeWithDevTools( applyMiddleware(thunk) ) )
    return proyeccion
}