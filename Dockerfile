FROM node:lts-alpine
ENV NODE_ENV=development
ENV MONGOOSE_URI=mongodb+srv://wisadmin:pHYj4wI799Sh1ptc@ubill.cisxv.mongodb.net/wispok
ENV JWT_SECRET=1242#$%$^%!@@$!%*(%^jnadkjcn
ENV PORT=5000
RUN npm install -g ts-node typescript
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install  && mv node_modules ../
COPY . .
EXPOSE 5000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]

