const { mainnet } = require("bitcore-lib/lib/networks");
const Mnemonic = require("bitcore-mnemonic");
const axios = require('axios')
const { PrivateKey } = require("bitcore-lib");
const bitcore = require("bitcore-lib");
const { Wallet } = require("../models/TablesExchange/tableWallet");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");


const createWallet = (network = mainnet) => {

    var privateKey = new PrivateKey();
    var address = privateKey.toAddress(network);
    return {
      privateKey: privateKey.toString(),
      address: address.toString(),
    };
};
  
  /**
  A Hierarchical Deterministic (HD) wallet is the term used to describe a wallet which uses a seed to derive public and private keys
  **/
  
const createHDWallet = (network = mainnet) => {
    let passPhrase = new Mnemonic(Mnemonic.Words.SPANISH);
    let xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);

    return {
        xpub: xpriv.xpubkey,
        privateKey: xpriv.privateKey.toString(),
        address: xpriv.publicKey.toAddress().toString(),
        mnemonic: passPhrase.toString(),
    };
};

const getBalanceBTC = async(adress)=>{
    try {
        const sochain_network = "BTC";
        const response = await axios.get(
            `https://sochain.com/api/v2/get_address_balance/${sochain_network}/${adress}`
        )
        let balance
        if (response.data.data?.unconfirmed_balance < 0){
            balance = (+response.data.data.confirmed_balance) + (+response.data.data.unconfirmed_balance);
        } else {
            balance = response?.data?.data?.confirmed_balance
        }
        if (balance){
            return balance 
        } else {
            return false
        }
    } catch (error) {
        console.log(error);
    }

}

const updateBalanceBTCByUserId = async(userId)=>{
    const walletId = await Wallet.findOne({where:{name:'BTC'}})
    const walletBTC = await BalanceCrypto.findOne({where:{userId, walletId:walletId.id}})
    if (walletBTC){
        const newBalance = await getBalanceBTC(walletBTC.address)
        if (newBalance){
            let update = {balance: newBalance}
            await BalanceCrypto.update(update, {where:{id:walletBTC.id}})
        }
    }
}

const sendBitcoin = async (sourceAddress, privateKey, recieverAddress, amountToSend) => {
    try {
        const sochain_network = "BTC";
        const satoshiToSend = (+amountToSend) * 100000000;
        let fee = 0.00015008 * 100000000;
        let inputCount = 0;
        const response = await axios.get(
        `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
        );


        const transaction = new bitcore.Transaction();
        let totalAmountAvailable = 0;

        let inputs = [];
        let utxos = response.data.data.txs;

        for (const element of utxos) {
        let utxo = {};
        utxo.satoshis = Math.floor(Number(element.value) * 100000000);
        utxo.script = element.script_hex;
        utxo.address = response.data.data.address;
        utxo.txId = element.txid;
        utxo.outputIndex = element.output_no;
        totalAmountAvailable += utxo.satoshis;
        inputCount += 1;
        inputs.push(utxo);
        }
        // console.log(inputs);

        /**
         * In a bitcoin transaction, the inputs contribute 180 bytes each to the transaction,
         * while the output contributes 34 bytes each to the transaction. Then there is an extra 10 bytes you add or subtract
         * from the transaction as well.
         * */


        // fee = transactionSize * recommendedFee.data.hourFee/3; // satoshi per byte
        if (totalAmountAvailable - satoshiToSend - fee < 0) {
            throw new Error("Balance is too low for this transaction");
        }
        //Set transaction input
        transaction.from(inputs);
        
        // set the recieving address and the amount to send
        transaction.to(recieverAddress, satoshiToSend);
        console.log(satoshiToSend);
        
        // Set change address - Address to receive the left over funds after transfer
        transaction.change(sourceAddress);
        
        //manually set transaction fees: 20 satoshis per byte
        transaction.fee(fee);
        
        // Sign transaction with your private key
        transaction.sign(privateKey);
        
        // serialize Transactions
        const serializedTransaction = transaction.serialize();
        // Send transaction
        const result = await axios({
        method: "POST",
        url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
        data: {
            tx_hex: serializedTransaction,
        },
        });
        return result.data.data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

module.exports = {sendBitcoin, createHDWallet, createWallet, getBalanceBTC, updateBalanceBTCByUserId}  