# Payload CMS Development Setup with Docker

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- `.env` file configured with your settings

### Run Development Environment

```bash
# Start containers in development mode
docker-compose -f docker-compose.dev.yml up

# Or in detached mode
docker-compose -f docker-compose.dev.yml up -d

# Stop containers
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f payload-dev
```

## What's Included

### Services

#### `payload-dev`
- **Image**: Custom development image based on Node 22.17.0-alpine
- **Port**: 3000 (accessible at http://localhost:3000)
- **Features**:
  - Live reloading with file watching
  - Full source code mounted as volume
  - All dev dependencies installed
  - Environment variables from `.env` file

#### `mongo`
- **Image**: MongoDB latest
- **Port**: 27017 (accessible at localhost:27017)
- **Features**:
  - Authentication enabled (default: admin/password)
  - WiredTiger storage engine
  - Health check included
  - Persistent volume for data

## Environment Variables

Create or update your `.env` file:

```env
DATABASE_URL=mongodb://admin:password@mongo:27017/payload?authSource=admin
PAYLOAD_SECRET=your-secret-key-here
MONGO_USERNAME=admin
MONGO_PASSWORD=password
NODE_OPTIONS="--no-deprecation"
```

## Development Workflow

1. **Start containers**:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

2. **Access the admin panel**: http://localhost:3000/admin

3. **Make code changes** - They'll automatically reload thanks to Next.js HMR

4. **View MongoDB data** (optional):
   ```bash
   docker-compose -f docker-compose.dev.yml exec mongo mongosh -u admin -p password
   ```

## Useful Commands

```bash
# Rebuild container image
docker-compose -f docker-compose.dev.yml build

# Rebuild and start
docker-compose -f docker-compose.dev.yml up --build

# Run custom command
docker-compose -f docker-compose.dev.yml exec payload-dev pnpm run generate:types

# Remove all data and volumes
docker-compose -f docker-compose.dev.yml down -v
```

## Notes

- The `.next` and `node_modules` directories are excluded from the volume mount to prevent conflicts with the host machine
- MongoDB authentication is enabled by default for security
- Check health status with: `docker-compose -f docker-compose.dev.yml ps`
- Logs are disabled for MongoDB to reduce noise; enable in `docker-compose.dev.yml` if needed

## Switching Between Compose Files

- **Development**: `docker-compose -f docker-compose.dev.yml up`
- **Production**: `docker-compose up`
