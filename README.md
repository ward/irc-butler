# Installation

* Install nvm: `brew nvm` (or whatever fits your system).
* Install node: `nvm install 5.7.0` (or whichever version is mentioned in `.nvmrc`)
* Install dependencies: `npm install` (npm was installed together with node)

Error when installing the `irc` dependency can be fixed by doing

    brew install icu4c
    brew link icu4c --force

Or on Debian/Ubuntu

    apt-get install libicu-dev

After upgrading from Debian 7 wheezy to Debian 8 jessie, I was getting errors
involving this libicu. To be precise, it was still looking for the `.48`
versions of all the parts while Debian was now on `.52`.  Reinstalling the node
bindings forces it to recompile and take into account the changing of the
libicu versions. This is done with

    npm install node-icu-charset-detector

That package is a dependency of the `irc` library we use.

Note: This irc library is apparently pretty shit and lacks dcc. It is also somewhat
unmaintained. Should probably look into another library or extend this one with
what I require.

# Running

Edit `main.js` with your IRC information.

# Testing

No proper test unit yet, so will have to make do with jshint and jscs to check
your code out a bit. Currently run with

    nvm test

# Documentation

Documentation is done with JSDoc. To generate the documentation, use

    npm run-script doc

which will create a documentation directory.
