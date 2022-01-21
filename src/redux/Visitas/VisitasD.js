import axios from "axios";

//constants
const dataInicial = {
  arrayVisitas: [],
  arrayBitacoraVisitas: []
};

const GET_ListVisitas_Success = "GET_ListVisitas_Success";
const GET_BitacoraVisitas_Success = "GET_BitacoraVisitas_Success";

//reducer
export default function visitasReducer(state = dataInicial, action) {
  switch (action.type) {
    case GET_ListVisitas_Success:
      return { ...state, arrayVisitas: action.payload };

    case GET_BitacoraVisitas_Success:
      return { ...state, arrayBitacoraVisitas: action.payload };

    default:
      return state;
  }
}

//actions
export const getListVisitasAction =
  (idAgen) => async (dispatch, getState) => {
    try {
      const res = await axios.get(
        "https://giddingsfruit.mx/ApiIndicadores/api/visitas" +
          `/${idAgen}`
      );  
      console.log(res.data)
      dispatch({
        type: GET_ListVisitas_Success,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const getBitacoraVisitasAction =
  (idAgen, fecha) => async (dispatch, getState) => {
    if (localStorage.getItem("BitacoraVisitas/" + idAgen + "/" + fecha)) {
      dispatch({
        type: GET_BitacoraVisitas_Success,
        payload: JSON.parse(
          localStorage.getItem("BitacoraVisitas/" + idAgen + "/" + fecha)
        ),
      });
      return;
    }
    try {
      const res = await axios.get(
        "https://giddingsfruit.mx/ApiIndicadores/api/visitas" +
          `/${idAgen}/${fecha}`
      );
      dispatch({
        type: GET_BitacoraVisitas_Success,
        payload: res.data,
      });
      localStorage.setItem(
        "BitacoraVisitas/" + idAgen + "/" + fecha,
        JSON.stringify(res.data)
      );
    } catch (error) {
      console.log(error);
    }
  };
