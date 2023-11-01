# see https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=node:18-alpine3.17
ARG ENV=production

# Set build stage
FROM $NODE_VERSION AS builder

# Set work directory
WORKDIR /app

# Copy All
COPY . .

# Install project dependencies and build the project
RUN npm ci && \
    npm run build && \
    ls

# Stage 2: Create a minimal production image
FROM $NODE_VERSION AS deploy

# Set the working directory
WORKDIR /app

# Set environment variable for production
ENV NODE_ENV=${ENV}

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy only the build artifacts from the previous stage
COPY --from=builder /app/dist ./dist

RUN ls
# Expose the port your application listens on (if needed)
EXPOSE 3000

# Start your application
CMD ["npm","run", "start"]
