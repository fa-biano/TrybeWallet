import React, { Component } from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import '../styles/Header.css';
import moneyWings from '../images/money_wings.png';
import coins from '../images/coins.png';
import profileImg from '../images/profile.png';

class Header extends Component {
  render() {
    const { email, expenses } = this.props;
    return (
      <header>
        <div className="title-logo">
          <img src={ moneyWings } alt="logo" />
          <span className="trybe">Trybe</span>
          <span className="wallet">Wallet</span>
        </div>
        <div className="expenses-container">
          <img src={ coins } alt="coin-logo" />
          <p>
            Total de despesas:
            <span data-testid="total-field">
              {
                expenses.length === 0
                  ? '0.00'
                  : expenses.map((element) => {
                    const value = Number(element.value);
                    const rate = Number(element.exchangeRates[element.currency].ask);
                    return value * rate;
                  }).reduce((acc, curr) => acc + curr)
                    // .toFixed(2)
                    .toLocaleString('pr-BR', { style: 'currency', currency: 'BRL' })
              }
            </span>
            <span data-testid="header-currency-field">BRL</span>
          </p>
        </div>
        <div className="user-container">
          <img src={ profileImg } alt="profile-img" />
          <p data-testid="email-field">{`Email: ${email}`}</p>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  email: Proptypes.string.isRequired,
  expenses: Proptypes.arrayOf(
    Proptypes.shape({
      currency: Proptypes.string,
      description: Proptypes.string,
      id: Proptypes.number,
      method: Proptypes.string,
      tag: Proptypes.string,
      value: Proptypes.string,
      exchangeRates: Proptypes.objectOf(
        Proptypes.objectOf(
          Proptypes.string,
        ),
      ),
    }),
  ).isRequired,
};

const mapStateToProps = (state) => ({ ...state.user, ...state.wallet });

export default connect(mapStateToProps)(Header);
