FROM node:alpine

WORKDIR /app


 
COPY package.json .
COPY package-lock.json .
RUN npm install

RUN npm ci
RUN npm install -g typescript
RUN rm -f .npmrc

 
COPY . .
CMD npm run start

 EXPOSE 3000