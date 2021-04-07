import React from 'react';

import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@reach/accordion';
import { useIconReact } from 'packages/icon-react';
import { Box } from 'rebass/styled-components';
import styled from 'styled-components';

import CurrencyLogo from 'app/components/CurrencyLogo';
import { BoxPanel } from 'app/components/Panel';
import { Typography } from 'app/theme';
import { CURRENCY_LIST } from 'constants/currency';
import '@reach/tabs/styles.css';
import { useRatio } from 'store/ratio/hooks';
import { useWalletBalances } from 'store/wallet/hooks';

import BALNWallet from './wallets/BALNWallet';
import BnUSDWallet from './wallets/BnUSDWallet';
import ICXWallet from './wallets/ICXWallet';
import SICXWallet from './wallets/SICXWallet';

const WalletPanel = () => {
  const walletBalance = useWalletBalances();
  const { account } = useIconReact();
  const ratio = useRatio();

  return (
    <BoxPanel bg="bg2">
      <Typography variant="h2" mb={5}>
        Wallet
      </Typography>

      <Wrapper>
        <DashGrid>
          <HeaderText>Asset</HeaderText>
          <HeaderText>Balance</HeaderText>
          <HeaderText>Value</HeaderText>
        </DashGrid>

        <List>
          <Accordion collapsible>
            {/* icx section */}
            <AccordionItem>
              <StyledAccordionButton>
                <ListItem>
                  <AssetSymbol>
                    <CurrencyLogo currency={CURRENCY_LIST['icx']} />
                    <Typography fontSize={16} fontWeight="bold">
                      {CURRENCY_LIST['icx'].symbol}
                    </Typography>
                  </AssetSymbol>
                  <DataText>{!account ? '-' : walletBalance.ICXbalance.dp(2).toFormat()}</DataText>
                  <DataText>
                    {!account ? '-' : `$${walletBalance.ICXbalance.multipliedBy(ratio.ICXUSDratio).dp(2).toFormat()}`}
                  </DataText>
                </ListItem>
              </StyledAccordionButton>

              <AccordionPanel>
                <ICXWallet />
              </AccordionPanel>
            </AccordionItem>

            {/* sicx section */}
            <AccordionItem>
              <StyledAccordionButton>
                <ListItem>
                  <AssetSymbol>
                    <CurrencyLogo currency={CURRENCY_LIST['sicx']} />
                    <Typography fontSize={16} fontWeight="bold">
                      {CURRENCY_LIST['sicx'].symbol}
                    </Typography>
                  </AssetSymbol>
                  <DataText>{!account ? '-' : walletBalance.sICXbalance.dp(2).toFormat()}</DataText>
                  <DataText>
                    {!account
                      ? '-'
                      : `$${walletBalance.sICXbalance
                          .times(ratio.sICXICXratio)
                          .times(ratio.ICXUSDratio)
                          .dp(2)
                          .toFormat()}`}
                  </DataText>
                </ListItem>
              </StyledAccordionButton>
              <AccordionPanel>
                <SICXWallet />
              </AccordionPanel>
            </AccordionItem>

            {/* bnusd section */}
            <AccordionItem>
              <StyledAccordionButton>
                <ListItem>
                  <AssetSymbol>
                    <CurrencyLogo currency={CURRENCY_LIST['bnusd']} />
                    <Typography fontSize={16} fontWeight="bold">
                      {CURRENCY_LIST['bnusd'].symbol}
                    </Typography>
                  </AssetSymbol>
                  <DataText>{!account ? '-' : walletBalance.bnUSDbalance.dp(2).toFormat()}</DataText>
                  <DataText>{!account ? '-' : `$${walletBalance.bnUSDbalance.dp(2).toFormat()}`}</DataText>
                </ListItem>
              </StyledAccordionButton>

              <AccordionPanel>
                <BnUSDWallet />
              </AccordionPanel>
            </AccordionItem>

            {/* baln section */}
            <AccordionItem>
              <StyledAccordionButton>
                <ListItem border={false}>
                  <AssetSymbol>
                    <CurrencyLogo currency={CURRENCY_LIST['baln']} />
                    <Typography fontSize={16} fontWeight="bold">
                      {CURRENCY_LIST['baln'].symbol}
                    </Typography>
                  </AssetSymbol>
                  <DataText>{!account ? '-' : walletBalance.BALNbalance.dp(2).toFormat()}</DataText>
                  <DataText>
                    {!account ? '-' : `$${walletBalance.BALNbalance.times(ratio.BALNbnUSDratio).dp(2).toFormat()}`}
                  </DataText>
                </ListItem>
              </StyledAccordionButton>

              <AccordionPanel>
                <BALNWallet />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </List>
      </Wrapper>
    </BoxPanel>
  );
};

export default WalletPanel;

const AssetSymbol = styled.div`
  display: grid;
  grid-column-gap: 12px;
  grid-template-columns: auto 1fr;
  align-items: center;
`;

const DashGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: 'asset balance value';
  align-items: center;

  & > * {
    justify-content: flex-end;
    text-align: right;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
    }
  }
`;

const HeaderText = styled(Typography)`
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 3px;
`;

const DataText = styled(Typography)`
  font-size: 16px;
`;

const ListItem = styled(DashGrid)<{ border?: boolean }>`
  padding: 20px 0;
  cursor: pointer;
  color: #ffffff;
  border-bottom: ${({ border = true }) => (border ? '1px solid rgba(255, 255, 255, 0.15)' : 'none')};

  :hover {
    color: #2ca9b7;
    transition: color 0.2s ease;
  }
`;

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`;

const StyledAccordionButton = styled(AccordionButton)`
  width: 100%;
  appearance: none;
  background: 0;
  border: 0;
  box-shadow: none;
  padding: 0;

  &[aria-expanded='true'] {
    & > ${ListItem} {
      color: #2ca9b7;
      border-bottom: none;
    }
  }
`;

const Wrapper = styled.div``;
