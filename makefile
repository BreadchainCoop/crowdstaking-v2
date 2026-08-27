.PHONY: help install env anvil chain-setup clean-contracts deploy-contracts dev build-contracts test-contracts start-local first-time-start-local

ANVIL_HARDFORK 		:= prague
ANVIL_RPC_URL     := https://rpc.gnosis.gateway.fm
ANVIL_CHAIN_ID    := 31337
ANVIL_BLOCK_TIME  := 5
ANVIL_LOCAL_URL   := http://localhost:8545
DEV_PRIVATE_KEY   := 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6

CONTRACTS_DIR     := contracts
BROADCAST_DIR     := $(CONTRACTS_DIR)/broadcast
CACHE_DIR         := $(CONTRACTS_DIR)/cache

# ─── Help ─────────────────────────────────────────────────────────────────────

help: ## Show this help message
	@echo ""
	@echo "  Breadchain Crowdstaking — Local Dev Commands"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""

# ─── Install ──────────────────────────────────────────────────────────────────

install: ## Install all dependencies (pnpm + forge)
	@echo ">>> Installing node modules..."
	pnpm install
	@echo ">>> Installing forge dependencies..."
	cd $(CONTRACTS_DIR) && forge install
	@echo "✓ All dependencies installed."

# ─── Environment ──────────────────────────────────────────────────────────────

env: ## Copy .env.example to .env.local (skips if already exists)
	@if [ -f .env.local ]; then \
		echo "⚠  .env.local already exists — skipping copy."; \
	else \
		cp .env.example .env.local; \
		echo "✓ .env.local created. Fill in your API keys:"; \
		echo "   • NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY"; \
		echo "   • NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID"; \
	fi

# ─── Anvil ────────────────────────────────────────────────────────────────────

anvil: ## Start a local Anvil fork of Gnosis chain (blocks every 5s)
	@echo ">>> Starting Anvil fork from $(ANVIL_RPC_URL)..."
	anvil \
		--fork-url $(ANVIL_RPC_URL) \
		--chain-id $(ANVIL_CHAIN_ID) \
		--block-time $(ANVIL_BLOCK_TIME) \
		--hardfork $(ANVIL_HARDFORK)

# ─── Chain setup (fund dev wallet, mint BREAD, LP tokens) ────────────────────

chain-setup: ## Run pnpm chain:setup to fund the dev wallet
	@echo ">>> Running chain setup (funding dev wallet with BREAD + LP tokens)..."
	pnpm run chain:setup
	@echo "✓ Chain setup complete."

# ─── Clean contracts ──────────────────────────────────────────────────────────

clean-contracts: ## Delete previous broadcast and cache artefacts in contracts/
	@echo ">>> Cleaning broadcast and cache directories..."
	rm -rf $(BROADCAST_DIR) $(CACHE_DIR)
	@echo "✓ Cleaned $(BROADCAST_DIR) and $(CACHE_DIR)."

# ─── Deploy contracts ─────────────────────────────────────────────────────────

deploy-contracts: chain-setup ## Run chain:setup then forge deploy (use via start-local for a clean build)
	@echo ">>> Deploying contracts to local Anvil node..."
	cd $(CONTRACTS_DIR) && forge script script/Deploy.s.sol:Deploy \
		--broadcast \
		--rpc-url $(ANVIL_LOCAL_URL) \
		--private-key $(DEV_PRIVATE_KEY) \
		--legacy
	@echo "✓ Contracts deployed. Addresses written to contracts/out/"

# ─── Dev server ───────────────────────────────────────────────────────────────

dev: ## Start the Next.js development server
	@echo ">>> Starting Next.js dev server..."
	pnpm run dev

# ─── Compile contracts ────────────────────────────────────────────────────────

build-contracts: ## Compile Solidity contracts with forge
	@echo ">>> Compiling contracts..."
	cd $(CONTRACTS_DIR) && forge build
	@echo "✓ Contracts compiled."

# ─── start-local ──────────────────────────────────────────────────────────────
# NOTE: Anvil must already be running in another terminal → make anvil

start-local: clean-contracts deploy-contracts dev ## Clean artefacts → deploy contracts → start dev server (requires Anvil running)

# ─── first-time-start-local ───────────────────────────────────────────────────
# For first-time contributors: installs all dependencies, scaffolds .env.local,
# then runs the full local dev bootstrap.
#
# ⚠  Before running this, start Anvil in a separate terminal:
#      make anvil
#
# ⚠  After env is created, open .env.local and fill in:
#      • NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY
#      • NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

first-time-start-local: install env start-local ## First-time setup: install deps + start local dev (start Anvil in another terminal first)
