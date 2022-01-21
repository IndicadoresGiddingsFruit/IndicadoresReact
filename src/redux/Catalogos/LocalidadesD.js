import axios from "axios";

//constants
const dataInicial = {
  arrayLocalidades: [],
};

const GET_ListLocalidades_Success = "GET_ListLocalidades_Success"; 

//reducer
export default function localidadesReducer(state = dataInicial, action) {
  switch (action.type) {

    case GET_ListLocalidades_Success:
      return { ...state, arrayLocalidades: action.payload }; 

    default:
      return state;
  }
}

//actions 
export const getListLocalidadesAction = () => async (dispatch, getState) => { 
  try {
      const res = await axios.get('https://localhost:44344/api/localidades')  
      console.log(res.data);
      dispatch({
          type: GET_ListLocalidades_Success,
          payload: res.data
      }) 
  } catch (error) {
      console.log(error)
  }
} 
 
 