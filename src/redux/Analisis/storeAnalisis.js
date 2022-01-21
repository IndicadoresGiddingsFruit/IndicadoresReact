import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import analisisReducer from './AnalisisD'
import analisisFLReducer from './FueraLimiteD'
import zonasReducer from '../Catalogos/ZonasD' 
 
const rootReducer = combineReducers({
    analisis: analisisReducer,
    analisisFL: analisisFLReducer,
    zonas: zonasReducer
})
 
export default function generateStore() {
    const analisis = createStore( rootReducer, composeWithDevTools( applyMiddleware(thunk) ) )
    return analisis
}