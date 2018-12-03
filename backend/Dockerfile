##############################################################################
# Step 1: Build
#
FROM node:10-alpine AS builder

WORKDIR /home/backend
COPY . .

RUN npm install && npm run build

###############################################################################
# Step 2: Run
#
FROM node:10-alpine
ENV NODE_ENV=production
WORKDIR /home/backend

COPY ./package* ./
RUN npm install
COPY --from=builder /home/backend/build ./build

CMD node build/server.js