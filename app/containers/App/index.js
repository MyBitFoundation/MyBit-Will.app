/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import CreateNewPage from 'containers/CreateNewPage/Loadable';
import ClaimPage from 'containers/ClaimPage/Loadable';
import VerifyPage from 'containers/VerifyPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import AppWrapper from 'components/AppWrapper';
import MyBitWillLogo from 'components/MyBitWillLogo';
import PageWrapper from 'components/PageWrapper';
import Button from 'components/Button';
import Constants from 'components/Constants';
import NavigationBar from 'components/NavigationBar';
import BlockchainInfoContext from 'components/Context/BlockchainInfoContext';
import { Links } from '../../constants';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {mobileMenuOpen: false}
    this.handleClickMobileMenu = this.handleClickMobileMenu.bind(this);
  }

  handleClickMobileMenu(mobileMenuOpen){
    this.setState({mobileMenuOpen});
  }

  render(){
    const { mobileMenuOpen } = this.state;
    return (
      <AppWrapper
        mobileMenuOpen={mobileMenuOpen}
      >
        <Helmet
          defaultTitle="MyBit Will"
        >
          <meta name="description" content="Schedule a transaction in the ethereum network" />
        </Helmet>
        <Header
          logo={MyBitWillLogo}
          links={Links}
          optionalButton
          mobileMenuOpen={mobileMenuOpen}
          handleClickMobileMenu={this.handleClickMobileMenu}
        />
        <PageWrapper>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/verify" component={() =>
              <BlockchainInfoContext.Consumer>
                {({ createTransactions, loading, verify, getTransactions, network }) =>  (
                    <VerifyPage
                      createTransactions={createTransactions}
                      loading={loading.transactionHistory}
                      verify={verify}
                      getTransactions={getTransactions}
                      network={network}
                      loadingNetwork={loading.network}
                    />
                  )
                }
              </BlockchainInfoContext.Consumer>
            }
            />
            <Route path="/create-new" component={() =>
              <BlockchainInfoContext.Consumer>
              {({ 
                createERC20Will,
                createWill,
                currentBlock,
                getTransactions,
                getTokensList,
                tokensList,
                userAllowed,
                requestApproval,
                requestApprovalERC20,
                checkAddressAllowed, 
                user,
                loading,
                network
              }) => (
                    <CreateNewPage
                      createWill={createWill}
                      createERC20Will={createERC20Will}
                      requestApprovalERC20={requestApprovalERC20}
                      getTokensList={getTokensList}
                      tokensList={tokensList}
                      currentBlock={currentBlock}
                      getTransactions={getTransactions}
                      userAllowed={userAllowed}
                      requestApproval={requestApproval}
                      checkAddressAllowed={checkAddressAllowed}
                      user={user}
                      loading={loading.user || loading.tokensList}
                      network={network}
                      loadingNetwork={loading.network}
                    />
                  )
                }
              </BlockchainInfoContext.Consumer>
            }
            />
            <Route path="/claim" component={() =>
              <BlockchainInfoContext.Consumer>
                {({ receivedTransactions, loading, claim, getTransactions, network }) =>  (
                    <ClaimPage
                      receivedTransactions={receivedTransactions}
                      loading={loading.transactionHistory}
                      claim={claim}
                      getTransactions={getTransactions}
                      network={network}
                      loadingNetwork={loading.network}
                    />
                  )
                }
              </BlockchainInfoContext.Consumer>
            }
            />
          </Switch>
        </PageWrapper>
        <Footer />
      </AppWrapper>
    );
  }
}

export default App;
