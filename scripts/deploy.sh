#!/usr/bin/env bash
set -euo pipefail

# ── Essential Hustle Deploy Script ──
# Deploys to Ubuntu server via rsync + Docker rebuild.
# Usage: ./scripts/deploy.sh [--skip-build]

# ── Config ──
REMOTE_HOST="${DEPLOY_HOST:-ubuntu}"
REMOTE_DIR="${DEPLOY_DIR:-~/projects/essential-hustle}"
APP_PORT="${DEPLOY_PORT:-3002}"
CONTAINER_NAME="essential-hustle"
HEALTH_URL="http://localhost:${APP_PORT}"
HEALTH_TIMEOUT=30
HEALTH_INTERVAL=3

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}[deploy]${NC} $1"; }
ok()   { echo -e "${GREEN}[deploy]${NC} $1"; }
warn() { echo -e "${YELLOW}[deploy]${NC} $1"; }
fail() { echo -e "${RED}[deploy]${NC} $1"; exit 1; }

# ── Pre-flight checks ──
log "Running pre-flight checks..."

command -v rsync >/dev/null 2>&1 || fail "rsync not found"
command -v ssh >/dev/null 2>&1   || fail "ssh not found"

ssh -o ConnectTimeout=5 "${REMOTE_HOST}" "echo ok" >/dev/null 2>&1 \
  || fail "Cannot connect to ${REMOTE_HOST}"

ok "SSH connection to ${REMOTE_HOST} verified"

# ── Local validation (unless --skip-build) ──
if [[ "${1:-}" != "--skip-build" ]]; then
  log "Running lint + typecheck..."
  npm run lint --silent || fail "Lint failed"
  npx tsc --noEmit      || fail "TypeScript check failed"
  ok "Local validation passed"
fi

# ── Sync files ──
log "Syncing source files to ${REMOTE_HOST}:${REMOTE_DIR}..."

rsync -avz --delete \
  --include='*.tsx' --include='*.ts' --include='*.json' --include='*.css' \
  --include='*.mjs' --include='*.js' --include='*/' \
  --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='.env.local' \
  src/ "${REMOTE_HOST}:${REMOTE_DIR}/src/"

rsync -avz messages/ "${REMOTE_HOST}:${REMOTE_DIR}/messages/"
rsync -avz content/  "${REMOTE_HOST}:${REMOTE_DIR}/content/"

scp -q package.json      "${REMOTE_HOST}:${REMOTE_DIR}/package.json"
scp -q package-lock.json "${REMOTE_HOST}:${REMOTE_DIR}/package-lock.json"
scp -q next.config.ts    "${REMOTE_HOST}:${REMOTE_DIR}/next.config.ts"
scp -q Dockerfile         "${REMOTE_HOST}:${REMOTE_DIR}/Dockerfile"
scp -q docker-compose.yml "${REMOTE_HOST}:${REMOTE_DIR}/docker-compose.yml"
scp -q CHANGELOG.md       "${REMOTE_HOST}:${REMOTE_DIR}/CHANGELOG.md"

ok "Files synced"

# ── Save previous image for rollback ──
log "Tagging current image as rollback..."
ssh "${REMOTE_HOST}" "docker tag ${CONTAINER_NAME}-${CONTAINER_NAME}:latest ${CONTAINER_NAME}-${CONTAINER_NAME}:rollback 2>/dev/null || true"

# ── Build + restart ──
log "Building and restarting container..."
ssh "${REMOTE_HOST}" "cd ${REMOTE_DIR} && APP_PORT=${APP_PORT} docker compose up -d --build" \
  || fail "Docker build failed"

ok "Container started"

# ── Health check ──
log "Waiting for health check (max ${HEALTH_TIMEOUT}s)..."
elapsed=0
while [ $elapsed -lt $HEALTH_TIMEOUT ]; do
  status=$(ssh "${REMOTE_HOST}" "docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME} 2>/dev/null" || echo "unknown")
  if [ "$status" = "healthy" ]; then
    ok "Container is healthy after ${elapsed}s"
    break
  fi
  sleep $HEALTH_INTERVAL
  elapsed=$((elapsed + HEALTH_INTERVAL))
done

if [ "$status" != "healthy" ]; then
  warn "Container not healthy after ${HEALTH_TIMEOUT}s (status: ${status})"
  warn "Rolling back to previous image..."
  ssh "${REMOTE_HOST}" "docker tag ${CONTAINER_NAME}-${CONTAINER_NAME}:rollback ${CONTAINER_NAME}-${CONTAINER_NAME}:latest && cd ${REMOTE_DIR} && APP_PORT=${APP_PORT} docker compose up -d" \
    || fail "Rollback failed!"
  fail "Deploy failed — rolled back to previous version"
fi

# ── Done ──
VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"\([0-9.]*\)".*/\1/')
ok "Deploy complete — v${VERSION} running on ${REMOTE_HOST}:${APP_PORT}"
