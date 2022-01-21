import axios from "axios";

//constants
const dataInicial = {
  arrayMovimientos: [],
  arrayArticulos: [],
  arrayUniMed: [],
  arrayMovtos: [],
  arrayEntradas: [],
};

const GET_ListMovimientos_Success = "GET_ListMovimientos_Success";
const GET_ListArticulos_Success = "GET_ListArticulos_Success";
const GET_ListUniMed_Success = "GET_ListUniMed_Success";
const GET_ListMovtos_Success = "GET_ListMovtos_Success";
const GET_ListEntradas_Success = "GET_ListEntradas_Success";

//reducer
export default function articulosReducer(state = dataInicial, action) {
  switch (action.type) {
    case GET_ListMovimientos_Success:
      return { ...state, arrayMovimientos: action.payload };

    case GET_ListArticulos_Success:
      return { ...state, arrayArticulos: action.payload };

    case GET_ListUniMed_Success:
      return { ...state, arrayUniMed: action.payload };

    case GET_ListMovtos_Success:
      return { ...state, arrayMovtos: action.payload };

    case GET_ListEntradas_Success:
      return { ...state, arrayEntradas: action.payload };

    default:
      return state;
  }
}

//actions
export const getListMovimientos = (fechaInicio,fechaFinal) => async (dispatch, getState) => {
  if (localStorage.getItem("movimientosInventario"+ `/${fechaInicio}/${fechaFinal}`)) {
    dispatch({
      type: GET_ListMovimientos_Success,
      payload: JSON.parse(localStorage.getItem("movimientosInventario"+ `/${fechaInicio}/${fechaFinal}`)),
    });
    return;
  }
  try {
    const res = await axios.get(
      "ttps://localhost:44344/api/movimientosInventario"+ `/${fechaInicio}/${fechaFinal}`
    );
    dispatch({
      type: GET_ListMovimientos_Success,
      payload: res.data,
    });
    localStorage.setItem("movimientosInventario"+ `/${fechaInicio}/${fechaFinal}`, JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const getListArticulosAction = () => async (dispatch, getState) => {
  if (localStorage.getItem("articulos")) {
    dispatch({
      type: GET_ListArticulos_Success,
      payload: JSON.parse(localStorage.getItem("articulos")),
    });
    return;
  }
  try {
    const res = await axios.get(
      "https://giddingsfruit.mx/ApiIndicadores/api/articulos"
    );
    dispatch({
      type: GET_ListArticulos_Success,
      payload: res.data,
    });
    localStorage.setItem("articulos", JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const getListUniMedAction = () => async (dispatch, getState) => {
  if (localStorage.getItem("catUniMed")) {
    dispatch({
      type: GET_ListUniMed_Success,
      payload: JSON.parse(localStorage.getItem("catUniMed")),
    });
    return;
  }
  try {
    const res = await axios.get(
      "https://giddingsfruit.mx/ApiIndicadores/api/catUniMed"
    );
    dispatch({
      type: GET_ListUniMed_Success,
      payload: res.data,
    });
    localStorage.setItem("catUniMed", JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const getListMovtos = (tipo) => async (dispatch, getState) => {
  if (localStorage.getItem("catMovtosAlm")) {
    dispatch({
      type: GET_ListMovtos_Success,
      payload: JSON.parse(localStorage.getItem("catMovtosAlm")),
    });
    return;
  }
  try {
    const res = await axios.get(
      "https://giddingsfruit.mx/ApiIndicadores/api/catMovtosAlm" + `/${tipo}`
    );
    dispatch({
      type: GET_ListMovtos_Success,
      payload: res.data,
    });
    localStorage.setItem("catMovtosAlm", JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const getListEntradas = (tipo) => async (dispatch, getState) => {
  if (localStorage.getItem("entradasAlm")) {
    dispatch({
      type: GET_ListEntradas_Success,
      payload: JSON.parse(localStorage.getItem("entradasAlm")),
    });
    return;
  }
  try {
    const res = await axios.get(
      "https://giddingsfruit.mx/ApiIndicadores/api/entradas"
    );
    dispatch({
      type: GET_ListEntradas_Success,
      payload: res.data,
    });
    localStorage.setItem("entradasAlm", JSON.stringify(res.data));
  } catch (error) {
    console.log(error);
  }
};
