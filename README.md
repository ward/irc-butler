# Installation

* Install nvm: `brew nvm` (or whatever fits your system).
* Install node: `nvm install 6.9.2` (or whichever version is mentioned in
  `.nvmrc`)
* Install dependencies: `npm install --no-optional` (npm was installed together
  with node).

The `--no-optional` parameter is because the IRC library has some optional
dependencies on badly working C libraries (`iconv`,
`node-icu-charset-detector`) that just give more errors than they are worth it.
Readding them might be considered if it proves to have some use. Downside is
that you get an error about that module not existing on every incoming message.
Probably want to edit that part of `node_modules/irc/lib/irc.js` so it stops
showing.

Note: This IRC library is apparently pretty shit and lacks DCC. It is also
somewhat unmaintained. Should probably look into another library or extend this
one with what I require.

# Running

Edit existing or make a new `config/` file with your information.

# Testing

Testing and linting with

    npm test

# Documentation

Documentation is done with JSDoc. To generate the documentation, use

    npm run-script doc

which will create a documentation directory.
