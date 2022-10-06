import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { requestCurrencyApi, saveExpenses, updateExpenses } from '../redux/actions';
import '../styles/WalletForm.css';

class WalletForm extends Component {
  state = {
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(requestCurrencyApi());
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.editor) {
      this.setEditExpense();
    }
  }

  setEditExpense = () => {
    const { editor, expenses, idToEdit } = this.props;
    const newExpense = expenses.filter((element) => element.id === idToEdit);
    if (editor) {
      this.setState({
        value: newExpense[0].value,
        description: newExpense[0].description,
        currency: newExpense[0].currency,
        method: newExpense[0].method,
        tag: newExpense[0].tag,
      });
    }
  };

  saveEditedExpense = () => {
    const { expenses, idToEdit, dispatch } = this.props;
    const { value, description, currency, method, tag } = this.state;
    const newExpenses = expenses.map((element) => element);
    const index = expenses.findIndex((element) => element.id === idToEdit);
    newExpenses[index] = {
      ...newExpenses[index],
      value,
      description,
      currency,
      method,
      tag,
    };
    dispatch(updateExpenses(newExpenses));
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  handleClick = async () => {
    const { dispatch, editor } = this.props;
    if (!editor) {
      await dispatch(requestCurrencyApi());
      dispatch(saveExpenses(this.state));
    } else {
      this.saveEditedExpense();
    }
    this.setState({
      value: '',
      description: '',
    });
  };

  render() {
    const { currencies, editor, error } = this.props;
    const { currency, value, description, method, tag } = this.state;
    return (
      <form className="expenses-form">
        { error === 'Deu ruim na Api...' && <p>Falha na Api das Cotações...</p> }
        <input
          data-testid="description-input"
          type="text"
          placeholder="Descrição da despesa"
          name="description"
          value={ description }
          onChange={ this.handleChange }
        />
        <input
          data-testid="value-input"
          type="number"
          placeholder="Valor"
          name="value"
          value={ value }
          onChange={ this.handleChange }
        />
        <select
          data-testid="currency-input"
          name="currency"
          value={ currency }
          onChange={ this.handleChange }
        >
          {
            currencies.length === 0
              ? <option>{ currency }</option>
              : currencies
                .map((element) => <option key={ element }>{element}</option>)
          }
        </select>
        <select
          data-testid="method-input"
          name="method"
          value={ method }
          onChange={ this.handleChange }
        >
          <option>Dinheiro</option>
          <option>Cartão de crédito</option>
          <option>Cartão de débito</option>
        </select>
        <select
          data-testid="tag-input"
          name="tag"
          value={ tag }
          onChange={ this.handleChange }
        >
          <option>Alimentação</option>
          <option>Lazer</option>
          <option>Trabalho</option>
          <option>Transporte</option>
          <option>Saúde</option>
        </select>
        <button
          type="button"
          onClick={ this.handleClick }
        >
          {
            editor ? 'Editar despesa' : 'Adicionar despesa'
          }
        </button>
      </form>
    );
  }
}

WalletForm.propTypes = {
  error: PropTypes.string.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired,
  editor: PropTypes.bool.isRequired,
  idToEdit: PropTypes.number.isRequired,
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      currency: PropTypes.string,
      description: PropTypes.string,
      id: PropTypes.number,
      method: PropTypes.string,
      tag: PropTypes.string,
      value: PropTypes.string,
      exchangeRates: PropTypes.objectOf(
        PropTypes.objectOf(
          PropTypes.string,
        ),
      ),
    }),
  ).isRequired,
};

const mapStateToProps = (state) => ({ ...state.wallet });

export default connect(mapStateToProps)(WalletForm);
