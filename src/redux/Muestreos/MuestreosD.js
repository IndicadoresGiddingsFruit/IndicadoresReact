import axios from "axios";

//constants
const dataInicial = {
  arrayMuestreos: []
};

const GET_ListMuestreos_Success = "GET_ListMuestreos_Success";

//reducer
export default function muestreosReducer(state = dataInicial, action) {
  switch (action.type) {

    case GET_ListMuestreos_Success:
      return { ...state, arrayMuestreos: action.payload };

    default:
      return state;
  }
}

//actions
export const getListMuestreosAction = (id,tipo,depto) => async (dispatch, getState) => {
 if(localStorage.getItem('offset=0')){
      dispatch({
          type: GET_ListMuestreos_Success,
          payload: JSON.parse(localStorage.getItem('offset=0'))
      })
      return
  } 
  try {
      const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/muestreo'+ `/${id}/${tipo}/${depto}`)    
      dispatch({
          type: GET_ListMuestreos_Success,
          payload: res.data
      })
      localStorage.setItem('offset=0', JSON.stringify(res.data)) 
  } catch (error) {
      console.log(error)
  }
} 