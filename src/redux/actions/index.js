// Coloque aqui suas actions
export const USER_LOGIN = 'USER_LOGIN';
export const REQUEST_CURRENCY_INFO = 'REQUEST_CURRENCY_INFO';
export const REQUEST_FAIL = 'REQUEST_FAIL';
export const ADD_EXPENSES = 'ADD_EXPENSES';
export const UPDATE_EXPENSES = 'UPDATE_EXPENSES';
export const EDIT_EXPENSES = 'EDIT_EXPENSES';
export const UPDATE_EXCHANGE = 'UPDATE_EXCHANGE';

export const getUserLogin = (userEmail) => ({ type: USER_LOGIN, payload: userEmail });
export const getCurrencyList = (currencies) => ({
  type: REQUEST_CURRENCY_INFO,
  payload: currencies,
});

export const updateExchangeRate = (exchange) => ({
  type: UPDATE_EXCHANGE,
  payload: exchange,
});

export const requestFail = () => ({ type: REQUEST_FAIL });

const endpoint = 'https://economia.awesomeapi.com.br/json/all';

const fetchApi = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const requestCurrencyApi = () => async (dispatch) => {
  try {
    const data = await fetchApi(endpoint);
    const currencies = Object.keys(data).filter((element) => element !== 'USDT');
    dispatch(getCurrencyList(currencies));
    dispatch(updateExchangeRate(data));
  } catch (err) {
    dispatch(requestFail());
  }
};

export const saveExpenses = (expenses) => ({ type: ADD_EXPENSES, payload: expenses });
export const updateExpenses = (expenses) => ({
  type: UPDATE_EXPENSES,
  payload: expenses,
});
export const editExpenses = (expenses) => ({ type: EDIT_EXPENSES, payload: expenses });
