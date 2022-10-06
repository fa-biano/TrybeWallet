import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { getUserLogin } from '../redux/actions';
import '../styles/Login.css';
import moneyWings from '../images/money_wings.png';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    isDisable: true,
    hasLogin: false,
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, () => this.validateLogin());
  };

  validateLogin = () => {
    const { email, password } = this.state;
    const emailPattern = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    const minPasswordLength = 6;
    this.setState({ isDisable: true });
    if (emailPattern.test(email) && password.length >= minPasswordLength) {
      this.setState({ isDisable: false });
    }
  };

  setLogin = () => {
    const { dispatch } = this.props;
    const { email } = this.state;
    dispatch(getUserLogin(email));
    this.setState({ hasLogin: true });
  };

  render() {
    const { isDisable, hasLogin } = this.state;
    return (
      <div className="login-container">
        <div className="login-title">
          <img src={ moneyWings } alt="logo" />
          <span className="trybe">Trybe</span>
          <span className="wallet">Wallet</span>
        </div>
        <div className="input-container">
          <input
            type="email"
            placeholder="E-mail"
            data-testid="email-input"
            name="email"
            onChange={ this.handleChange }
          />
          <input
            type="password"
            placeholder="Senha"
            data-testid="password-input"
            name="password"
            onChange={ this.handleChange }
          />
          <button
            type="button"
            disabled={ isDisable }
            onClick={ this.setLogin }
          >
            Entrar
          </button>
        </div>
        {
          hasLogin && <Redirect to="/carteira" />
        }
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: propTypes.func.isRequired,
};

export default connect()(Login);
