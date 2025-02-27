FROM node:18-alpine

WORKDIR /app

# Copier package.json et package-lock.json pour optimiser la mise en cache
COPY package*.json ./

# Installer les dépendances avec une meilleure gestion de l'espace disque
RUN npm install --legacy-peer-deps --no-cache 

# Copier le reste du code de l'application
COPY . .

# Construire l'application
RUN npm run build --legacy-peer-deps

# Nettoyage pour réduire la taille de l'image
RUN npm prune --production && rm -rf /app/.next/cache

# Exposer le port de l'application
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
