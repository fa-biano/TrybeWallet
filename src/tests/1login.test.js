import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWith';

describe('Testa a pagina Login', () => {
  it('Testa renderização inicial da Pagina de Login', () => {
    renderWithRouterAndRedux(<App />);

    const emailInput = screen.getByTestId('email-input');
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByTestId('password-input');
    expect(passwordInput).toBeInTheDocument();

    const loginBtn = screen.getByRole('button', { name: /entrar/i });
    expect(loginBtn).toBeInTheDocument();
  });

  it('Testa execucao do login', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const emailTest = 'teste@teste.com';
    const passwordTest = '123456';

    const emailInput = screen.getByTestId('email-input');
    userEvent.type(emailInput, emailTest);
    expect(emailInput).toHaveValue(emailTest);

    const passwordInput = screen.getByTestId('password-input');
    userEvent.type(passwordInput, passwordTest);
    expect(passwordInput).toHaveValue(passwordTest);

    const loginBtn = screen.getByRole('button', { name: /entrar/i });
    userEvent.click(loginBtn);

    const { location: { pathname } } = history;
    expect(pathname).toBe('/carteira');
  });
});
