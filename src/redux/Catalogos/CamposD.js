import axios from "axios";

//constants
const dataInicial = {
  arrayCampos: [],
};

const GET_ListCampos_Success = "GET_ListCampos_Success"; 

//reducer
export default function camposReducer(state = dataInicial, action) {
  switch (action.type) {

    case GET_ListCampos_Success:
      return { ...state, arrayCampos: action.payload }; 

    default:
      return state;
  }
}

//actions 
export const getListCamposAction = (Cod_Prod,Cod_Campo) => async (dispatch, getState) => {
 /*  if(localStorage.getItem('campos/'+Cod_Prod)){
      dispatch({
          type: GET_ListCampos_Success,
          payload: JSON.parse(localStorage.getItem('campos/'+Cod_Prod))
      })
      return
  }    */
  try {
      const res = await axios.get('https://giddingsfruit.mx/ApiIndicadores/api/campos' + `/${Cod_Prod}/${Cod_Campo}`)  
      console.log(res.data)
      dispatch({
          type: GET_ListCampos_Success,
          payload: res.data
      })
      //localStorage.setItem('campos/'+Cod_Prod+'', JSON.stringify(res.data)) 
  } catch (error) {
      console.log(error)
  }
} 
 
 