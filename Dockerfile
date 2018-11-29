FROM node:10

ADD ./backend/build /home/backend/
RUN npm install -g forever --y

ENV PATH /home/frontend/node_modules/.bin:$PATH
COPY frontend/package.json /home/frontend/package.json
WORKDIR /home/frontend
RUN npm install
RUN npm install -g @angular/cli@1.7.1

ADD ./frontend /home/frontend/


ENTRYPOINT ["ng", "serve"]

