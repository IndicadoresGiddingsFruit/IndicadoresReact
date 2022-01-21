import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import auditoriaReducer from './AuditoriaD'
import zonasReducer from '../Catalogos/ZonasD'
import camposReducer from '../Catalogos/CamposD'
import agentesReducer from '../Catalogos/AgentesD'
import localidadesReducer from '../Catalogos/LocalidadesD'
 
const rootReducer = combineReducers({
    auditoria: auditoriaReducer,
    zonas: zonasReducer,
    campos: camposReducer,
    agentes :agentesReducer,
    localidades :localidadesReducer
})
 
export default function generateStore() {
    const auditoria = createStore( rootReducer, composeWithDevTools( applyMiddleware(thunk) ) )
    return auditoria
}