import axios from "axios";

//constants
const dataInicial = {
  arrayAnalisis: []
};

const GET_ListAnalisis_Success = "GET_ListAnalisis_Success"; 

//reducer
export default function analisisReducer(state = dataInicial, action) {
  switch (action.type) {

    case GET_ListAnalisis_Success:
      return { ...state, arrayAnalisis: action.payload }; 

    default:
      return state;
  }
}

//actions  
export const getListAnalisisAction = (id,tipo,depto,idMuestreo,estatus) => async (dispatch, getState) => {
  try {
      const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/analisis'+ `/${id}/${tipo}/${depto}/${idMuestreo}/${estatus}`)  
      dispatch({
          type: GET_ListAnalisis_Success,
          payload: res.data
      })
  } catch (error) {
      console.log(error)
  }
} 

 