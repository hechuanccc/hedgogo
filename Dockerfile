FROM unnotechlottery/hedwig:latest as hedwig

FROM node:9.1

WORKDIR /usr/src/app

# using multiple copies to continously keep the environment and avoid the maximum image layer error
COPY --from=hedwig / /

# To include everything
COPY . .

# ARG AZURE_STORAGE_ACCOUNT
# ARG AZURE_STORAGE_ACCESS_KEY
# ARG CDN_PROFILE
# ARG CDN_ENDPOINT
# ARG BACKEND
RUN printenv
# RUN chmod u+x deploy.sh && ./deploy.sh
EXPOSE 8888
CMD npm run dev