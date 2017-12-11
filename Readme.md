### Node Starter Project ###

Includes a basic Node setup with Express which transpiles to ES5 using Babel and automatically refreshes the running dev environment using Nodemon whenever source code files are saved.

```
# Install Node.js (Debian)
curl -sL https://deb.nodesource.com/setup_{major_version}.x | sudo -E bash -
sudo apt-get install -y nodejs
```

```
# Download Node dependencies
npm install
```

```
#Launch webserver
npm start
# Aliased to "nodemon lib/index.js --exec babel-node --presets es2015,stage-2"
```

```
# Build release version and output to dist directory
npm build
# Aliased to "babel lib -d dist --presets es2015,stage-2"
```

#### Test endpoints are at localhost:3000/ and localhost:3000/test by default 
