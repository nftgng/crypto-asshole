#!/bin/bash

# change to eth-asshole directory
cd ~/crypto-asshole

# install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# install required Node.js packages
npm install ethers
npm install nodemailer
npm install dotenv

# make script executable
chmod +x script.js

# run the script
./script.js
