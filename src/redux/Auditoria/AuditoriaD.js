import axios from "axios";

//constants
const dataInicial = {
    arrayAuditorias: [], 
    objPunto: [],
    arrayLogNO: [],
    objLog: [],
};

const GET_ListAuditorias_Success = "GET_ListAuditorias_Success"; 
const GET_Punto_Success = "GET_Punto_Success";
const GET_LogPuntos_SuccessNO = "GET_LogPuntos_SuccessNO";
const GET_LogPunto_Success = "GET_LogPunto_Success";

//reducer
export default function auditoriaReducer(state = dataInicial, action) {
    switch (action.type) {
        case GET_ListAuditorias_Success:
            return { ...state, arrayAuditorias: action.payload };

        case GET_Punto_Success:
            return { ...state, objPunto: action.payload };

        case GET_LogPuntos_SuccessNO:
            return { ...state, arrayLogNO: action.payload };

        case GET_LogPunto_Success:
            return { ...state, objLog: action.payload };     
    
        default:
            return state;
    }
}

//AUDITORIA
export const getListAuditoriasAction = (idAgen, IdProdAuditoria) => async (dispatch, getState) => {
    try {
        const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/auditoria' + `/${idAgen}/${IdProdAuditoria}`)

        dispatch({
            type: GET_ListAuditorias_Success,
            payload: res.data
        })
    } catch (error) {
        console.log(error)
    }
}

//PUNTOS DE ACCION
export const getPuntoAction = (idPunto) => async (dispatch, getState) => {
    try {
        const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/puntoscontrol' + `/${idPunto}`)
        dispatch({
            type: GET_Punto_Success,
            payload: res.data
        })       
    } catch (error) {
        console.log(error)
    }
}

//Puntos de control respondidos con NO por IdProdAuditoria
export const getLogPuntosNOAction = (IdProdAuditoria) => async (dispatch, getState) => { 
    try {
        const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/prodLogAuditoria' + `/${IdProdAuditoria}`)
        dispatch({
            type: GET_LogPuntos_SuccessNO,
            payload: res.data
        })
      
    } catch (error) {
        console.log(error)
    }
}

//Puntos de control respondidos 
export const getLogPuntoAction = (IdCatAuditoria, IdProdAuditoria) => async (dispatch, getState) => {
    try {
        const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/prodLogAuditoria' + `/${IdCatAuditoria}/${IdProdAuditoria}`)
        dispatch({
            type: GET_LogPunto_Success,
            payload: res.data
        })
    } catch (error) {
        console.log(error)
    }
}

 