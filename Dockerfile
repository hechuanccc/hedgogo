FROM unnotechlottery/hedwig:latest as hedwig  # Take note that the image itself is already logged-in in the cloud CLI

FROM node:9.1

WORKDIR /usr/src/app

# using multiple copies to continously keep the environment and avoid the maximum image layer error
COPY --from=hedwig / /

# To include everything
COPY . .

ARG AZURE_STORAGE_ACCOUNT
ARG AZURE_STORAGE_ACCESS_KEY
ARG CDN_PROFILE
ARG CDN_ENDPOINT
# ARG BACKEND  # Currently not used yet, as properly defining it in the webpack config is still unknown and will currently throw an error in the browser

# Cannot be made into one line as it has a possibility that it will return a 'text file busy' making the shell script unexecutable
RUN chmod u+x deploy.sh
RUN ./deploy.sh  # scripts for building and sending it in cloud

EXPOSE 8888
CMD npm run dev