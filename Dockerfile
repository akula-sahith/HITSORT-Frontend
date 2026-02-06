# 1. Base image
FROM node:20-alpine

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package.json & package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy rest of the project files
COPY . .

# 6. React runs on port 3000
EXPOSE 5173

# 7. Start React app
CMD ["npm", "run", "dev", "--", "--host"]