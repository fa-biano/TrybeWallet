import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Wallet from '../pages/Wallet';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import mockData from './helpers/mockData';

const alimentacao = 'Alimentação';
const expensesArray = [
  {
    value: '30',
    description: 'teste',
    currency: 'USD',
    method: 'Dinheiro',
    tag: alimentacao,
    id: 0,
    exchangeRates: { ...mockData },
  },
  {
    value: '30',
    description: 'test2',
    currency: 'USD',
    method: 'Dinheiro',
    tag: alimentacao,
    id: 1,
    exchangeRates: { ...mockData },
  },
];

const currenciesArray = Object.keys(mockData);

const mockedInitialState = {
  wallet: {
    expenses: expensesArray,
    currencies: currenciesArray,
    editor: false,
    idToEdit: 0,
    error: '',
  },
};

const valueDataTest = 'value-input';
const descriptionDataTest = 'description-input';

describe('Testa a pagina Wallet', () => {
  it('Verifica renderizacao inicial do Header', () => {
    const userEmail = 'teste@teste.com';
    renderWithRouterAndRedux(<Wallet />, {
      initialState: { user: { email: userEmail } },
    });

    const emailField = screen.getByTestId('email-field');
    expect(emailField).toBeInTheDocument(emailField);
    expect(emailField).toHaveTextContent(`Email: ${userEmail}`);

    const currencyField = screen.getByTestId('header-currency-field');
    expect(currencyField).toBeInTheDocument();
    expect(currencyField).toHaveTextContent('BRL');

    const sumValues = screen.getByTestId('total-field');
    expect(sumValues).toBeInTheDocument();
    expect(sumValues).toHaveTextContent('0.00');
  });

  it('Verifica exibicao da somatoria das despesas no Header', () => {
    renderWithRouterAndRedux(<Wallet />, { initialState: mockedInitialState });

    const sumValues = screen.getByTestId('total-field');
    expect(sumValues).toBeInTheDocument();
    expect(sumValues).toHaveTextContent('285.19');
  });

  it('Verifica renderizacao inicial do formulario de inserir despesas', () => {
    renderWithRouterAndRedux(<Wallet />);

    const valueInput = screen.getByTestId(valueDataTest);
    expect(valueInput).toBeInTheDocument();

    const descriptionInput = screen.getByTestId(descriptionDataTest);
    expect(descriptionInput).toBeInTheDocument();

    const currencyInput = screen.getByTestId('currency-input');
    expect(currencyInput).toBeInTheDocument();

    const methodInput = screen.getByTestId('method-input');
    expect(methodInput).toBeInTheDocument();

    const tagInput = screen.getByTestId('tag-input');
    expect(tagInput).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /adicionar despesa/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('Verifica funcionalidades do formulario de inserir despesas na tabela', async () => {
    renderWithRouterAndRedux(<Wallet />);

    const valueInput = screen.getByTestId(valueDataTest);
    userEvent.type(valueInput, '30');
    expect(valueInput).toHaveValue(30);

    const descriptionInput = screen.getByTestId(descriptionDataTest);
    userEvent.type(descriptionInput, 'teste');
    expect(descriptionInput).toHaveValue('teste');

    const currencyInput = screen.getByTestId('currency-input');
    userEvent.selectOptions(currencyInput, 'USD');
    expect(currencyInput).toHaveValue('USD');

    const methodInput = screen.getByTestId('method-input');
    userEvent.selectOptions(methodInput, 'Dinheiro');
    expect(methodInput).toHaveValue('Dinheiro');

    const tagInput = screen.getByTestId('tag-input');
    userEvent.selectOptions(tagInput, alimentacao);
    expect(tagInput).toHaveValue(alimentacao);

    const submitBtn = screen.getByRole('button', { name: /adicionar despesa/i });
    userEvent.click(submitBtn);

    const tableDescription = await waitFor(() => screen.getByRole('cell', { name: /teste/i }));
    expect(tableDescription).toBeInTheDocument();

    const tableValue = await waitFor(() => screen.getByRole('cell', { name: /30\.00/i }));
    expect(tableValue).toBeInTheDocument();

    const tableTag = await waitFor(() => screen.getByRole('cell', { name: /alimentação/i }));
    expect(tableTag).toBeInTheDocument();

    const tableMethod = await waitFor(() => screen.getByRole('cell', { name: /dinheiro/i }));
    expect(tableMethod).toBeInTheDocument();

    const tableCurrency = await waitFor(() => screen.getByRole('cell', { name: /usd/i }));
    expect(tableCurrency).toBeInTheDocument();
  });

  it('Testa botao de excluir despesas', () => {
    renderWithRouterAndRedux(<Wallet />, { initialState: mockedInitialState });

    const deleteBtn = screen.getAllByRole('button', { name: /excluir/i });
    expect(deleteBtn).toHaveLength(2);

    const tableDescription = screen.getByRole('cell', { name: /teste/i });
    expect(tableDescription).toBeInTheDocument();

    userEvent.click(deleteBtn[0]);
    expect(tableDescription).not.toBeInTheDocument();
  });

  it('Testa botao de editar despesas', async () => {
    renderWithRouterAndRedux(<Wallet />, { initialState: mockedInitialState });

    const editBtn = screen.getAllByRole('button', { name: /editar/i });
    expect(editBtn).toHaveLength(2);

    userEvent.click(editBtn[0]);

    const confirmEditBtn = await screen.findByRole('button', { name: /editar despesa/i });
    expect(confirmEditBtn).toBeInTheDocument();

    const inputValue = await screen.findByTestId(valueDataTest);
    expect(inputValue).toHaveValue(30);

    const inputDescription = await screen.findByTestId(descriptionDataTest);
    expect(inputDescription).toHaveValue('teste');

    userEvent.clear(inputValue);
    userEvent.type(inputValue, '35');
    expect(inputValue).toHaveValue(35);

    userEvent.clear(inputDescription);
    userEvent.type(inputDescription, 'outro teste');
    expect(inputDescription).toHaveValue('outro teste');

    userEvent.click(confirmEditBtn);

    const tableValue = await screen.findByRole('cell', { name: /35\.00/i });
    expect(tableValue).toBeInTheDocument();

    const tableDescription = await screen.findByRole('cell', { name: /outro teste/i });
    expect(tableDescription).toBeInTheDocument();
  });

  it('Testa erro no retorno da Api das cotacoes', async () => {
    const initialStateErrorApi = {
      wallet: {
        expenses: expensesArray,
        currencies: currenciesArray,
        editor: false,
        idToEdit: 0,
        error: 'Deu ruim na Api...',
      },
    };

    renderWithRouterAndRedux(<Wallet />, { initialState: initialStateErrorApi });
    const errorMsg = await screen.findByText('Falha na Api das Cotações...');
    expect(errorMsg).toBeInTheDocument();
  });
});
