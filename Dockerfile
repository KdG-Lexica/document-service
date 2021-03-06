FROM node:16-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
COPY tslint.json ./
# copy source code to /app/src folder
COPY src /app/src

# check files list
RUN ls -a

RUN npm install
RUN npm run build

EXPOSE 8080

CMD exec node --max_old_space_size=16192 "./dist/index.js" 