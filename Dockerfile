FROM unnotechlottery/hedwig:latest as hedwig

FROM node:9.1

WORKDIR /usr/src/app

# using multiple copies to continously keep the environment and avoid the maximum image layer error
COPY --from=hedwig / /

# To include everything
COPY . .

RUN chmod u+x deploy.sh && ./deploy.sh
EXPOSE 8888
CMD npm run dev