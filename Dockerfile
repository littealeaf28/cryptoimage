FROM nikolaik/python-nodejs:latest

COPY . .

# npm run build
RUN npm run build

# npm run start
#RUN npm run start
