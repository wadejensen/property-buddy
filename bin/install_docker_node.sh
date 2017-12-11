#!/bin/bash

# Install Docker
#sudo curl -fsSL https://get.docker.com/ | bash

# Install node.js
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fix line feed when working with Ubuntu for Windows
#git config --global core.autocrlf input
