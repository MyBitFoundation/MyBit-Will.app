/*
 * Create New Will Page
 *
 * Page to create will contracts
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import ContainerCreate from 'components/ContainerCreate';
import Image from '../../images/secure.svg';
import Input from 'components/Input';
import Web3 from '../../utils/core';
import Constants from 'components/Constants';
import Checkbox from 'antd/lib/checkbox';
import LoadingIndicator from 'components/LoadingIndicator';
import ConnectionStatus from 'components/ConnectionStatus';
import Select from 'antd/lib/select';
import 'antd/dist/antd.css';
const Option = Select.Option;

const blocksPerSecond = 14;

const StyledTermsAndConditions = styled.s`
  font-size: 12px;
  font-family: 'Roboto';
  margin-bottom: 10px;
  text-decoration: none;

  a{
    color: #1890ff;
  }
`;

const StyledClickHere = styled.s`
  color: #1890ff;
  text-decoration: underline;
`;

const StyledTermsAndConditionsWrapper = styled.div`
  margin-bottom: 10px;
`;

const StyledInputWrapper = styled.div`
  display: flex;
  color: #1890ff;
`;

const StyledLargeInput = styled.div`
  width: 60%
`
const StyledSmallInput = styled.div`
  width: 40%
`

const HiddenInput = styled.div`
  .ant-input {
    display: none
  }
`

export default class CreateNewPage extends React.Component {
  constructor(props){
    super(props);
    this.props.getTokensList();
    this.state = {
      shouldConfirm: false,
      isLoading: false,
      acceptedToS: false,
      metamaskInstalled: false,
      metamaskUnlocked: false,
      tokenSymbol: 'ETH'
    };
    this.details = [];
    this.handleMetamask = this.handleMetamask.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAlertClosed = this.handleAlertClosed.bind(this);
    this.handleTermsAndConditionsClicked = this.handleTermsAndConditionsClicked.bind(this);
  }

  async componentDidMount() {
    this.handleMetamask();
  }

  handleMetamask() {
    if (!Web3.currentProvider.isMetaMask) {
      this.setState({
        metamaskInstalled: false,
        alertType: "error",
        alertMessage: "Please install Metamask!"
      });
    } else {
      this.setState({ metamaskInstalled: true });
      setTimeout(() => {
        Web3.eth.getAccounts((err, accounts) => {
          if (err || accounts.length == 0) {
            this.setState({
              metamaskUnlocked: false,
              alertType: "error",
              alertMessage: "Please unlock Metamask!"
            });
          } else {
            this.setState({ metamaskUnlocked: true });
          }
        });
      }, 1000);
    }

    window.web3.currentProvider.publicConfigStore.on("update", data => {
      console.log(data);
      if (
        (!data["selectedAddress"] && this.state.metamaskUnlocked) ||  // user locked Metamask
        (data["selectedAddress"] &&
          data["selectedAddress"].toUpperCase() !==
            this.props.user.userName.toUpperCase())  // user changed account
      )
        window.location.reload();
    });
  }

  handleClose(){
    this.setState({
      shouldConfirm: false,
      recepient: '',
      amount: '',
      verifyPeriod: '',
      tokenSymbol: 'ETH'
    })
  }

  handleBack(){
    this.setState({shouldConfirm: false})
  }

  async handleConfirm(){
    const { recepient, verifyPeriod, amount, tokenSymbol } = this.state;
    const token = this.props.tokensList.find(e => e.symbol === tokenSymbol)

    let alertType = undefined;
    let alertMessage = undefined;
    this.setState({alertType})

    if(this.props.user.myBitBalance < 250){
      alertMessage = <span>Your MYB balance is below 250, click <StyledClickHere onClick={() => BancorConvertWidget.showConvertPopup('buy')}>here</StyledClickHere> to buy more.</span>
    }
    else if(!Web3.utils.isAddress(recepient)){
      alertMessage = "Please enter a valid Ethereum address.";
    }
    else if(!amount || parseFloat(amount) == 0){
      alertMessage = "Amount of ETH/Token needs to be higher than zero.";
    }

    if(alertMessage){
      alertType = 'error';
      this.setState({
        alertType,
        alertMessage
      })
      return;
    }

    //generate details
    this.details = [];
    this.details.push({
      title: 'Recipient',
      content: [Constants.functions.shortenAddress(recepient) + "."]
    }, {
      title: 'Amount',
      content: [`${amount} ${token.symbol}`]
    }, {
      title: 'Verify Period',
      content: [`${verifyPeriod} days`]
    })

    this.setState({shouldConfirm: true})
    this.setState({ alertType: 'info', alertMessage: "Waiting for confirmations." });

    try {
      let result = true;
      if (!this.props.userAllowed) {
        result = await this.props.requestApproval();
      }

      console.log(result)

      if (result && tokenSymbol !== 'ETH') {
        console.log('here')
        result = await this.props.requestApprovalERC20(
          token.address,
          amount,
          token.decimals
        ).catch(console.log)
        if (result) {
          result = await this.props.createERC20Will(
            recepient,
            amount,
            false,
            verifyPeriod,
            token.address,
            token.decimals
          ).catch(console.log)
        }
      } else if (result && tokenSymbol === 'ETH') {
        result = await this.props.createWill(
          recepient,
          amount,
          false,
          verifyPeriod
        );
      }
      if (result) {
        this.setState({ alertType: 'success', alertMessage: "Transaction confirmed." });
      } else {
        this.setState({ alertType: 'error',  alertMessage: "Transaction failed. Please try again with more gas." });
      }
      this.props.checkAddressAllowed();
      this.props.getTransactions();
    } catch (err) {
      this.setState({ alertType: 'error', alertMessage: err.message });
    }
  }

  handleTermsAndConditionsClicked(e){
    this.setState({acceptedToS: e.target.checked});
  }

  handleAlertClosed(){
    this.setState({alertType: undefined})
  }

  handleInputChange(text, id){
    this.setState({
      [id]: text,
    })
  }

  render() {
    let toRender = [];

    if (this.state.metamaskInstalled && this.state.metamaskUnlocked) {
		if(this.props.loading){
		  return <LoadingIndicator />
		}

		toRender.push(
		  <ConnectionStatus
			network={this.props.network}
			constants={Constants}
			key={"connection status"}
			loading={this.props.loadingNetwork}
		  />
		)
	}

    const content = (
      <div key="content">
        <Input
          placeholder="Recipient"
          value={this.state.recepient}
          onChange={(e) => this.handleInputChange(e.target.value, 'recepient')}
          tooltipTitle="Who will recieve your funds on execution?"
          hasTooltip
        />
        <StyledInputWrapper>
          <StyledLargeInput>
            <Input
              placeholder="Amount"
              value={this.state.amount}
              onChange={(e) => this.handleInputChange(e.target.value, 'amount')}
              min={0}
            />
          </StyledLargeInput>
          <StyledSmallInput>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="ETH"
              optionFilterProp="children"
              onChange={v => this.handleInputChange(v, 'tokenSymbol')}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {this.props.tokensList.map(token => (<Option value={token.symbol}>{token.symbol}</Option>))}
            </Select>
          </StyledSmallInput>
          <HiddenInput>
            <Input
              placeholder=""
              value={null}
              onChange={() => {}}
              tooltipTitle="What is the amount and token of the funds?"
              hasTooltip
            />
          </HiddenInput>
        </StyledInputWrapper>
        <Input
          placeholder="Verify period"
          type="number"
          value={this.state.verifyPeriod}
          onChange={(number) => this.handleInputChange(number, 'verifyPeriod')}
          tooltipTitle="How often do you want to check in and delay the transaction in days?"
          hasTooltip
          min={1}
        />
        <StyledTermsAndConditionsWrapper>
          <Checkbox
            onChange={this.handleTermsAndConditionsClicked}
          >
          <StyledTermsAndConditions>
            I agree to the <a href="#">Terms and Conditions</a>.
          </StyledTermsAndConditions>
          </Checkbox>
        </StyledTermsAndConditionsWrapper>
      </div>
    )

    if(this.state.shouldConfirm){
      toRender.push(
        <ContainerCreate
          key="containerConfirm"
          type="confirm"
          handleClose={this.handleClose}
          handleBack={this.handleBack}
          alertType={this.state.alertType}
          alertMessage={this.state.alertMessage}
          handleAlertClosed={this.handleAlertClosed}
          details={this.details}
        />
      )
    }
    else{
      toRender.push(
        <ContainerCreate
          key="containerCreate"
          type="input"
          image={Image}
          alt="Placeholder image"
          content={content}
          handleConfirm={this.handleConfirm}
          alertType={this.state.alertType}
          alertMessage={this.state.alertMessage}
          handleAlertClosed={this.handleAlertClosed}
          acceptedToS={this.state.acceptedToS}
        />
      )
    }

    return (
      <article>
        <Helmet>
          <title>Create - MyBit Will</title>
          <meta
            name="Create"
            content="Create a transaction to take place on a given block on the MyBit Will dApp"
          />
        </Helmet>
        {toRender}
      </article>
    );
  }
}

CreateNewPage.defaultProps = {
  userAllowed: false,
};

CreateNewPage.propTypes = {
  userAllowed: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    myBitBalance: PropTypes.number.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  network: PropTypes.string.isRequired,
  loadingNetwork: PropTypes.bool.isRequired,
};
