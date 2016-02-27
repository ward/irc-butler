* Install nvm (`brew nvm`).
* Install node (`nvm install 5.7.0`).

Error when installing the `irc` dependency can be fixed by doing

    brew install icu4c
    brew link icu4c --force

This irc library is apparently pretty shit and lacks dcc. It is also pretty
unmaintained.
