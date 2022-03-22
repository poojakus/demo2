FOr Production
  "scripts": {
    "build":"babel index.js --out-dir prd",
    "start": "npm run build && nodemon prd/index.js",
    "serve": "node"
  },

for Devlopment
    "scripts": {
   
    "start": "babel index.js -w --out-dir prd",
    "dev-serve": "nodemon prd/index.js"
  },


FOR Devlopment WALA code karne ke bad hume 1 or terminal open karna hai or wha 
hume "npm start"
ushke bad dushre terminal me likhna hai "npm run dev-serve" ushke bad hum jo bhi change karenge wo haota jayega a
automiati dono index file me