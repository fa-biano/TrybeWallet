import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateExpenses, editExpenses } from '../redux/actions';
import '../styles/Table.css';
import deleteBtnImg from '../images/delete-btn.png';
import editBtnImg from '../images/editar-btn.png';

class Table extends Component {
  removeExpense = (arrayIndex) => {
    const { dispatch, expenses } = this.props;
    const index = arrayIndex;
    const newExpenses = expenses.map((element) => element);
    newExpenses.splice(index, 1);
    dispatch(updateExpenses(newExpenses));
  };

  sendExpenseToEdit = (id) => {
    const { dispatch } = this.props;
    dispatch(editExpenses(id));
  };

  render() {
    const { expenses } = this.props;
    return (
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Tag</th>
            <th>Método de pagamento</th>
            <th>Valor</th>
            <th>Moeda</th>
            <th>Câmbio utilizado</th>
            <th>Valor convertido</th>
            <th>Moeda de conversão</th>
            <th>Editar/Excluir</th>
          </tr>
        </thead>
        <tbody>
          {
            expenses.length > 0 && expenses.map((expense, index) => {
              const exchangeCurrency = expense.exchangeRates[expense.currency];
              return (
                <tr key={ expense.id }>
                  <td>{expense.description}</td>
                  <td>{expense.tag}</td>
                  <td>{expense.method}</td>
                  <td>{Number(expense.value).toFixed(2)}</td>
                  <td>{expense.currency}</td>
                  <td>{Number(exchangeCurrency.ask).toFixed(2)}</td>
                  <td>{(exchangeCurrency.ask * expense.value).toFixed(2)}</td>
                  <td>{exchangeCurrency.name}</td>
                  <td>
                    <button
                      type="button"
                      data-testid="edit-btn"
                      onClick={ () => this.sendExpenseToEdit(expense.id) }
                    >
                      <img src={ editBtnImg } alt="edit-img" />
                      {/* Editar */}
                    </button>
                    <button
                      type="button"
                      data-testid="delete-btn"
                      onClick={ () => this.removeExpense(index) }
                    >
                      <img src={ deleteBtnImg } alt="delete-img" />
                      {/* Excluir */}
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  dispatch: PropTypes.func.isRequired,
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

const mapStateToProps = (state) => ({ expenses: [...state.wallet.expenses] });

export default connect(mapStateToProps)(Table);
