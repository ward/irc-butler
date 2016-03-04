# Installation

* Install nvm: `brew nvm` (or whatever fits your system).
* Install node: `nvm install 5.7.0` (or whichever version is mentioned in `.nvmrc`)
* Install dependencies: `npm install` (npm was installed together with node)

Error when installing the `irc` dependency can be fixed by doing

    brew install icu4c
    brew link icu4c --force

Or on Debian/Ubuntu

    apt-get install libicu-dev

Note: This irc library is apparently pretty shit and lacks dcc. It is also somewhat
unmaintained. Should probably look into another library or extend this one with
what I require.

# Running

Edit `main.js` (TODO: proper configuration file, TODO: Default to some random
names) with your IRC information.

# Testing

No proper test unit yet, so will have to make do with jshint and jscs to check
your code out a bit. Currently run with

    nvm test

# Documentation

Documentation is done with JSDoc. To generate the documentation, use

    npm run-script doc

which will create a documentation directory.
