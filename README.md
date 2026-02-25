# VITMUN 2026

This is the official repository for the website of VITMUN 2026. It contains the complete source code including delegate registrations, internal & external allotments, delegation management, admin dashboard and MongoDB backend.

### About VIT MUNSOC
The VIT Model United Nations Society (VITMUNSoc) is a model of excellence, teaching argumentation, diplomacy, public speaking and more to its members and the VIT student community. It has become one of India's top MUN societies, winning awards with each effort.

### About VITMUN 2026
Choose VITMUN'26 for immersive simulations, skill refinement and cultural awareness. Elevate your leadership potential amidst a diverse cohort. With extensive exposure and industry engagement, it's more than just a conference. It's a pathway to global impact and personal growth.

---

## Project Setup

Clone the repository
```
cd vitmun26
```

Create .env file in the root directory
```
MONGODB_URI=your_mongodb_connection_string
MONGO_INITDB_ROOT_USERNAME=your_mongo_root_username
MONGO_INITDB_ROOT_PASSWORD=your_mongo_root_password
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
NEXT_SITE_URL=your_next_site_url
JWT_SECRET=your_jwt_secret
```

### Run locally using Node.js
```
npm install
npm run dev
```
Ensure you have Node.js installed
Website will be accessible at `http://localhost:3000`

### Run using Docker containers
```
docker compose down -v
docker compose build --no-cache
docker compose up
```
Ensure you have Docker installed
Website will be accessible at `http://localhost:4001`