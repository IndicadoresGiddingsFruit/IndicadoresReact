import axios from "axios";

//constants
const dataInicial = {
  arraySemanas: []
};

const GET_ListSemanas_Success = "GET_ListSemanas_Success";

//reducer
export default function semanasReducer(state = dataInicial, action) {
  switch (action.type) 
  {
    case GET_ListSemanas_Success:
      return { ...state, arraySemanas: action.payload };

    default:
      return state;
  }
}

//actions
export const getListSemanasAction = (temporada) => async (dispatch, getState) => {
  if (localStorage.getItem("semanas"+`/${temporada}`)) {
    dispatch({
      type: GET_ListSemanas_Success,
      payload: JSON.parse(localStorage.getItem("semanas"+`/${temporada}`)),
    });
    return;
  }
  try {
    const res = await axios.get(
      "ttps://giddingsfruit.mx/ApiIndicadores/api/catsemanas"
    );
    dispatch({
      type: GET_ListSemanas_Success,
      payload: res.data,
    });
    localStorage.setItem("semanas"+`/${temporada}`, JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};
