FROM unnotechlottery/hedwig:latest as hedwig

FROM node:9.1

WORKDIR /usr/src/app

# using multiple copies to continously keep the environment and avoid the maximum image layer error
COPY --from=hedwig /usr/src/app/. .

# To include everything
COPY . .

RUN npm install
RUN npm run build
EXPOSE 8888
CMD npm run dev