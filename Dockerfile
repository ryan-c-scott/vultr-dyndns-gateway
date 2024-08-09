from node:19
workdir /app

copy node.js /app/node.js
copy package-lock.json /app/
copy package.json /app/

run npm install
run npm prune --production

cmd ["node", "node.js"]
expose 8080
