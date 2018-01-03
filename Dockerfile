# Take note that the image itself is already logged-in in the cloud CLI
FROM unnotechlottery/hedwig:latest as hedwig

FROM node:9.1

WORKDIR /usr/src/app

# using multiple copies to continously keep the environment and avoid the maximum image layer error
COPY --from=hedwig /root /root
COPY --from=hedwig /usr/src/app/. .

# To include everything
COPY . .

ARG AZURE_STORAGE_ACCOUNT
ARG AZURE_STORAGE_ACCESS_KEY
ARG CDN_PROFILE
ARG CDN_ENDPOINT
ARG HOST
ARG MAX_AGE

# Cannot be made into one line as it has a possibility that it will return a 'text file busy' making the shell script unexecutable
RUN chmod u+x cloud_deploy.sh
RUN ./cloud_deploy.sh || exit 2

EXPOSE 8888
CMD npm run dev