import React from 'react';
import PropTypes from 'prop-types';
import BlockchainInfoContext from './BlockchainInfoContext';
import * as Core from '../../utils/core';
import Web3 from '../../utils/core';
import { NULL_ADDRESS } from '../../constants'

class BlockchainInfo extends React.Component {
  constructor(props) {
    super(props);

    this.loadMetamaskUserDetails = this.loadMetamaskUserDetails.bind(this);
    this.createWill = this.createWill.bind(this);
    this.createERC20Will = this.createERC20Will.bind(this);
    this.requestApprovalERC20 = this.requestApprovalERC20.bind(this);
    this.getCurrentBlockNumber = this.getCurrentBlockNumber.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.claim = this.claim.bind(this);
    this.verify = this.verify.bind(this);
    this.requestApproval = this.requestApproval.bind(this);
    this.checkAddressAllowed = this.checkAddressAllowed.bind(this);
    this.getNetwork = this.getNetwork.bind(this);
    this.getTokensList = this.getTokensList.bind(this);

    this.state = {
      loading: {
        user: true,
        transactionHistory: true,
        network: true,
        tokensList: true,
      },
      receivedTransactions: [],
      createTransactions: [],
      tokensList: [],
      user: {
        myBitBalance: 0,
        etherBalance: 0,
        userName: ""
      },
      createWill: this.createWill,
      createERC20Will: this.createERC20Will,
      currentBlock: 0,
      getTransactions: this.getTransactions,
      getTokensList: this.getTokensList,
      claim: this.claim,
      verify: this.verify,
      requestApproval: this.requestApproval,
      requestApprovalERC20: this.requestApprovalERC20,
      checkAddressAllowed: this.checkAddressAllowed,
      //can be ropsten or main - else unknown
      network: ""
    };
  }

  async componentWillMount() {
    this.getTransactionsInterval = setInterval(this.getTransactions, 10000);
    this.getUserDetailsInterval = setInterval(this.loadMetamaskUserDetails, 5000);

    try {
      //we need this to pull the user details
      await this.getNetwork();

      // we need the prices and the user details before doing anything
      await Promise.all([
        this.loadMetamaskUserDetails(this.state.network), 
        this.getCurrentBlockNumber(), 
        this.getTokensList()
      ]);
      do {
        await this.checkAddressAllowed();
      } while (!this.state.user.userName)
      await this.getTransactions();
    } catch (err) {
      console.log(err);
    }
    window.web3.currentProvider.publicConfigStore.on("update", data => {
      if (
        data["selectedAddress"].toUpperCase() !==
        this.state.user.userName.toUpperCase()
      )
        window.location.reload();
    });
  }

  async getNetwork() {
    try {
      new Promise(async (resolve, reject) => {
        let network = await Web3.eth.net.getNetworkType();

        this.setState({
          network, loading: {
            ...this.state.loading,
            network: false,
          }
        }, () => resolve())
      });
    } catch (err) {
      setTimeout(this.getNetwork, 1000);
    }
  }

  async componentWillUnmount() {
    clearInterval(this.getTransactionsInterval);
    clearInterval(this.getUserDetailsInterval);
  }

  async requestApproval() {
    return Core.requestApproval(this.state.user.userName, this.state.network);
  }

  async checkAddressAllowed() {
    try {
      const allowed = await Core.getAllowanceOfAddress(this.state.user.userName, this.state.network);
      this.setState({ userAllowed: allowed });
    } catch (err) {
      console.log(err);
    }
  }

  async getCurrentBlockNumber() {
    try {
      const currentBlock = await Web3.eth.getBlockNumber();
      this.setState({ currentBlock })
    } catch (err) {
      setTimeout(this.getCurrentBlockNumber, 1000);
    }
  }

  createWill(to, amount, revokable, period) {
    return Core.createWill(this.state.user.userName, to, amount, revokable, period, this.state.network);
  }

  async requestApprovalERC20(tokenAddress, amount, decimals) {
    return Core.requestApprovalERC20(
      this.state.user.userName,
      tokenAddress,
      amount,
      decimals,
      this.state.network
    );
  }

  async createERC20Will(to, amount, revokable, period, tokenAddress, decimals) {
    return Core.createERC20Will(
      this.state.user.userName, 
      to, 
      amount, 
      revokable, 
      period, 
      tokenAddress, 
      decimals, 
      this.state.network
    );
  }

  claim(id) {
    return Core.claim(id, this.state.user.userName, this.state.network);
  }

  verify(id) {
    return Core.verify(id, this.state.user.userName, this.state.network);
  }

  async getTokensList() {
    const tokensList = await Core.getTokensList();
    console.log('network', this.state.network)
    const mybAddress = Core.getContract('MyBitToken', 'ropsten').options.address;
    tokensList.unshift({
      address: mybAddress,
      decimals: 18,
      name: "MyBit",
      symbol: "MYB",
    })
    this.setState({
      tokensList,
      loading: {
        ...this.state.loading,
        tokensList: false,
      }
    })
  }

  async getTransactions() {
    await Core.getLogWillCreated(this.state.network)
      .then(async (response) => {
        const userAddress = this.state.user.userName;
        const receivedTransactionsRaw = [];
        const createTransactionsRaw = [];

        try {
          response.forEach(transaction => {
            if (transaction.returnValues._recipient === userAddress) {
              receivedTransactionsRaw.push({
                id: Web3.utils.toAscii(transaction.returnValues._id),
                creator: transaction.returnValues._creator,
                amount: Web3.utils.fromWei(transaction.returnValues._amount.toString(), 'ether'),
                transactionHash: transaction.transactionHash
              })
            }
            if (transaction.returnValues._creator === userAddress) {
              createTransactionsRaw.push({
                id: Web3.utils.toAscii(transaction.returnValues._id),
                recipient: transaction.returnValues._recipient,
                amount: Web3.utils.fromWei(transaction.returnValues._amount.toString(), 'ether'),
                transactionHash: transaction.transactionHash
              })
            }
          })
        } catch (err) {
          console.log(err)
        }

        var createTransactions = [];
        if (createTransactionsRaw.length !== 0) {
          const wills = await Promise.all(createTransactionsRaw.map(async transaction =>
            Core.getWill(transaction.id, this.state.network)));
          createTransactions = await Promise.all(createTransactionsRaw.map(async (transaction, index) => {
            const symbol = wills[index][6] === NULL_ADDRESS ? 
              'ETH' : 
              this.state.tokensList.find(token => token.address.toLowerCase() === wills[index][6].toLowerCase()).symbol
            return {
              ...transaction,
              expiration: parseInt(wills[index][4]),
              symbol
            }
          }))
        }

        let receivedTransactions = [];
        if (receivedTransactionsRaw.length !== 0) {
          const wills = await Promise.all(receivedTransactionsRaw.map(async transaction =>
            Core.getWill(transaction.id, this.state.network)));
          receivedTransactions = await Promise.all(receivedTransactionsRaw.map(async (transaction, index) => {
            const symbol = wills[index][6] === NULL_ADDRESS ? 
            'ETH' : 
            this.state.tokensList.find(token => token.address.toLowerCase() === wills[index][6].toLowerCase()).symbol
            return {
              ...transaction,
              withdrawable: parseInt(wills[index][4]) < Date.now()/1000,
              claimed: wills[index][0] != transaction.creator,
              symbol
            }
          }))
        }

        this.setState({
          receivedTransactions,
          createTransactions,
          loading: {
            ...this.state.loading,
            transactionHistory: false,
          }
        })

      })
      .catch((err) => {
        console.log(err);
      });
  }

  async loadMetamaskUserDetails() {
    await Core.loadMetamaskUserDetails(this.state.network)
      .then((response) => {
        this.setState({
          user: response,
          loading: { ...this.state.loading, user: false },
        });
      })
      .catch((err) => {
        setTimeout(this.loadMetamaskUserDetails, 1000);
      });
  }

  render() {
    return (
      <BlockchainInfoContext.Provider value={this.state}>
        {this.props.children}
      </BlockchainInfoContext.Provider>
    );
  }
}

export default BlockchainInfo;

BlockchainInfo.propTypes = {
  children: PropTypes.node.isRequired,
};
