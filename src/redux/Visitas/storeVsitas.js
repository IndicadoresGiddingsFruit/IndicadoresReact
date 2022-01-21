import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import visitasReducer from './VisitasD'
import agentesReducer from '../Catalogos/AgentesD'
import zonasReducer from '../Catalogos/ZonasD'
import regionesReducer from '../Catalogos/RegionesD'
 
const rootReducer = combineReducers({
    visitas: visitasReducer,
    zonas: zonasReducer,
    regiones: regionesReducer,
    agentes :agentesReducer
})
 
export default function generateStore() {
    const visitas = createStore( rootReducer, composeWithDevTools( applyMiddleware(thunk) ) )
    return visitas
}