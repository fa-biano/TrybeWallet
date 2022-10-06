// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas
import {
  REQUEST_CURRENCY_INFO,
  REQUEST_FAIL,
  ADD_EXPENSES,
  UPDATE_EXPENSES,
  EDIT_EXPENSES,
  UPDATE_EXCHANGE,
} from '../actions';

const initialState = {
  currencies: [], // array de string
  expenses: [], // array de objetos, com cada objeto tendo as chaves id, value, currency, method, tag, description e exchangeRates
  editor: false, // valor booleano que indica de uma despesa está sendo editada
  idToEdit: 0, // valor numérico que armazena o id da despesa que esta sendo editada
  error: '',
  exchangeRates: {},
};

const wallet = (state = initialState, action) => {
  switch (action.type) {
  case REQUEST_CURRENCY_INFO:
    return {
      ...state,
      currencies: action.payload,
    };
  case REQUEST_FAIL:
    return {
      ...state,
      error: 'Deu ruim na Api...',
    };
  case ADD_EXPENSES:
    return {
      ...state,
      expenses: [
        ...state.expenses,
        { ...action.payload,
          id: state.expenses.length,
          exchangeRates: { ...state.exchangeRates },
        },
      ],
      editor: false,
    };
  case UPDATE_EXPENSES:
    return {
      ...state,
      expenses: [...action.payload],
      editor: false,
    };
  case EDIT_EXPENSES:
    return {
      ...state,
      editor: true,
      idToEdit: action.payload,
    };
  case UPDATE_EXCHANGE:
    return {
      ...state,
      exchangeRates: action.payload,
    };
  default:
    return state;
  }
};

export default wallet;
