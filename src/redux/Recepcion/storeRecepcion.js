import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import recepcionReducer from './RecepcionD' 
import zonasReducer from '../Catalogos/ZonasD'
import regionesReducer from '../Catalogos/RegionesD'
import agentesReducer from '../Catalogos/AgentesD' 
 
const rootReducer = combineReducers({
    recepcion: recepcionReducer,
    zonas: zonasReducer,
    regiones: regionesReducer,
    agentes :agentesReducer
})
 
export default function generateStore() {
    const recepcion = createStore( rootReducer, composeWithDevTools( applyMiddleware(thunk) ) )
    return recepcion
}