# Footle

[![Backlog](https://badge.waffle.io/alexjoverm/Footle.svg?label=backlog&title=Backlog)](http://waffle.io/alexjoverm/Footle)
[![Stories in Ready](https://badge.waffle.io/alexjoverm/Footle.svg?label=ready&title=Ready)](http://waffle.io/alexjoverm/Footle)
[![Stories Done](https://badge.waffle.io/alexjoverm/Footle.svg?label=done&title=Done)](http://waffle.io/alexjoverm/Footle)

Footle is the app that let's you organize the best way. Set your appointments with your resources, doctors by instance, and enjoy the power of the insights that the Footle statistics will give you!

### Installation

In your terminal
```
git clone https://github.com/alexjoverm/Footle.git
cd Footle
npm install
```

### Running

In your terminal (linux or osx):

 1. Open `mongodb` in one terminal tab, by running:
```
mongod
```
 2. In another tab:
```
npm run debug:start
```
 3. Finally, in another tab, run the app in debugging mode:
```
npm run dev
```

Then you can open these url on your Chrome/Chromium/Opera browser:
* **http://localhost:3000/**: The app itself
* **http://127.0.0.1:8080/?port=5858**: The [node-inspector](https://github.com/node-inspector/node-inspector) debugger, ChromeDevTools-like
