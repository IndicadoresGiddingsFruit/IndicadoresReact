import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import expedienteReducer from './ExpedienteD'
import agentesReducer from '../Catalogos/AgentesD'
import zonasReducer from '../Catalogos/ZonasD'
import regionesReducer from '../Catalogos/RegionesD'

const rootReducer = combineReducers({
    expediente: expedienteReducer,
    zonas: zonasReducer,
    regiones: regionesReducer,
    agentes :agentesReducer
})
 
export default function generateStore() {
    const expediente = createStore( rootReducer, composeWithDevTools( applyMiddleware(thunk) ) )
    return expediente
}