import React from 'react';
import configureMockStore from 'redux-mock-store';
import { fireEvent, waitFor, screen, act } from '@testing-library/react';
import thunk from 'redux-thunk';
import { renderWithProvider } from '../../../../test/lib/render-helpers';
import CustodyPage from '.';

const mockedReturnedValue = jest.fn().mockReturnValue({ type: 'TYPE' });
const mockedGetCustodianJWTList = jest.fn().mockReturnValue({ type: 'TYPE' });

const mockedGetCustodianAccounts = jest.fn().mockReturnValue(async () => null);
const mockedGetCustodianToken = jest.fn().mockReturnValue('testJWT');

const mockedGetCustodianConnectRequest = jest.fn().mockReturnValue({
  type: 'TYPE',
  custodian: 'saturn',
  token: 'token',
  apiUrl: 'url',
  custodianType: undefined,
  custodianName: 'saturn',
});

jest.mock('../../../store/institutional/institution-background', () => ({
  mmiActionsFactory: () => ({
    getCustodianConnectRequest: mockedGetCustodianConnectRequest,
    getCustodianToken: mockedGetCustodianToken,
    getCustodianAccounts: mockedGetCustodianAccounts,
    getCustodianAccountsByAddress: mockedReturnedValue,
    getCustodianJWTList: mockedGetCustodianJWTList,
    connectCustodyAddresses: mockedReturnedValue,
  }),
}));

describe('CustodyPage', function () {
  const mockStore = {
    metamask: {
      providerConfig: { caipChainId: 'eip155:1', type: 'test' },
      mmiConfiguration: {
        portfolio: {
          enabled: true,
          url: 'https://portfolio.io',
        },
        custodians: [
          {
            type: 'Saturn',
            name: 'saturn',
            apiUrl: 'https://saturn-custody.dev.metamask-institutional.io',
            iconUrl:
              'https://saturn-custody-ui.dev.metamask-institutional.io/saturn.svg',
            displayName: 'Saturn Custody',
            production: true,
            refreshTokenUrl: null,
            isNoteToTraderSupported: false,
            version: 1,
          },
        ],
      },
      preferences: {
        useNativeCurrencyAsPrimaryCurrency: true,
      },
      appState: {
        isLoading: false,
      },
      history: {
        mostRecentOverviewPage: '/',
      },
    },
  };

  const store = configureMockStore([thunk])(mockStore);

  it('renders CustodyPage', async () => {
    const { container } = renderWithProvider(<CustodyPage />, store);

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('opens connect custody without any custody selected', async () => {
    const { getByTestId } = renderWithProvider(<CustodyPage />, store);

    await waitFor(() => {
      expect(getByTestId('custody-connect-button')).toBeDefined();
    });
  });

  it('calls getCustodianJwtList on custody select when connect btn is click and clicks connect button and shows the jwt form', async () => {
    act(() => {
      renderWithProvider(<CustodyPage />, store);
    });

    await waitFor(() => {
      const custodyBtn = screen.getByTestId('custody-connect-button');
      fireEvent.click(custodyBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('jwt-form-connect-button')).toBeInTheDocument();
      expect(mockedGetCustodianJWTList).toHaveBeenCalled();
    });
  });
});
