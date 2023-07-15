# Install Node.js image
FROM node:16.13.1-alpine3.14

# Set the working dir for any RUN, CMD, COPY command
WORKDIR /usr/src/app

# Copy package.json, package-lock.json, .env, tsconfig.json
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]

# Copy everything in the src dir ro WORKDIR/src
COPY ./src ./src

# Install all packages
RUN npm install

# Run the dev npm script to build and start the server
CMD npm run dev