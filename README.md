## Die2Nite Enhancer

[![Build Status](https://travis-ci.org/aymericbeaumet/die2nite-enhancer.png?branch=Readme.md)](https://travis-ci.org/aymericbeaumet/die2nite-enhancer) [![Coverage Status](https://coveralls.io/repos/aymericbeaumet/die2nite_enhancer/badge.png?branch=master)](https://coveralls.io/r/aymericbeaumet/die2nite_enhancer?branch=Readme.md) [![Dependency Status](https://david-dm.org/aymericbeaumet/die2nite_enhancer.png?theme=shields.io)](https://david-dm.org/aymericbeaumet/die2nite_enhancer) [![devDependency Status](https://david-dm.org/aymericbeaumet/die2nite_enhancer/dev-status.png?theme=shields.io)](https://david-dm.org/aymericbeaumet/die2nite_enhancer#info=devDependencies)

Die2Nite Enhancer is an extension allowing you to improve your game experience on the browser game [Die2Nite](http://www.die2nite.com/).

The French ([Hordes](http://www.hordes.fr/)), Spanish ([Zombinoia](http://www.zombinoia.com/)) and Dutch ([Die Verdammten](http://www.dieverdammten.de/)) versions are supported.

### Install as an extension (recommended)

You can directly install this plugin as an extension for the following browsers:
- [Google Chrome](https://chrome.google.com/webstore/detail/die2nite-enhancer/imkkdabijgkodinlhgncdfmghdcdacmg)
- [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/die2nite_enhancer/)
- [Opera](https://addons.opera.com/en/extensions/details/die2nite-enhancer/)
- [Safari](http://safariaddons.com/en-US/safari/addon/227)

### Install as a script

It is also possible to install this plugin as a script. Natively supported in Google Chrome, or with the GreaseMonkey extension under Mozilla Firefox. If you want to do it like so, I consider you know what you are doing: the script can be found [here](http://userscripts.org/scripts/show/242398).

### Feedback

If you find any problem or have a suggestion, please give me a feedback [here](https://github.com/aymericbeaumet/die2nite_enhancer/issues).

In case of a problem, please be sure all your softwares (browser and extensions) are up to date. Then post a new issue using the header below:

```
- **Operating System:** OS + version
- **Browser:** Browser + version (indicate GreaseMonkey version if relevant)

Explain here how to reproduce the problem...
```

### Contribute

If you would like to contribute, you should :

1. Install NodeJS 9.x
2. Make sure the "zip" command is available (i.e. in the PATH)
3. Make sure the "make" command is available (i.e. in the PATH)

If you're building on Windows, make sure that "bash" is available (Windows 10 has it natively, otherwise you should install it)

Then, clone this repo, run "npm install" in the folder and enjoy :)

To build the extention for all browsers, just run "npm run package:all". For a specific brower, it's "npm run package:<BROWER>". Available browers are :
	* firefox
	* chrome
	* chrome_zip (to have a zip instead of a crx file)
	* opera
	* usersript (to use it with Tampermonkey or GreaseMonkey)

### License

zlib/libpng © [Aymeric Beaumet](http://beaumet.me)
