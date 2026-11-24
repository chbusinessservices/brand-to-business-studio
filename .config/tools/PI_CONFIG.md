# 📁 Pi (Mobile) Configuration

## Overview
Native iOS/macOS mobile development integration

## Setup on iOS/Mac

### Prerequisites
- iPhone/iPad/Mac device connected to computer
- or Launch the Pi app from App Store if available

### Installation
```bash
# On Mac device
# Open Terminal and run:
git clone https://github.com/your/pi-dev-setup.git
cd pi-dev-setup
npm install

# On iOS device via XCodeload build pipeline
# Use xcodebuildmcp.mcp for simulator integration
```

## Mobile-Specific Development Commands
```bash
# List available simulators
xcodebuildmcp list_sims

# Boot simulator if needed
xcodebuildmcp boot_sim

# Build and launch app
xcodebuildmcp build_run_sim \
  --bundle-id com.brand-studio.app \
  --configuration Debug

# Start iOS simulator frontend for manual inspection
xcodebuildmcp open_sim
```

## Device-Specific Features Available

| Feature | Usage | Files Modified |
|---|---|---|
| Simulators | Build/Run iOS apps | `src/lib/site.ts` (mobile view) |
| Hardware testing | Test responsive layouts | Tailwind breakpoints |
| UI testing | Automated tests | Vitest integration |
| Device emulation | CPU throttling, network conditions | Performance optimization |

## Brand Studio Mobile Integration Points

### 1. Booking URL Testing
```bash
# Simulate booking flow on different devices
xcodebuildmcp emulate --networkConditions "Slow 3G"
xcodebuildmcp emulate --viewport "375x667,mobile"

# Test mobile responsive layout in simulator
xcodebuildmcp open_sim
```

### 2. Touch Interactions for Mobile Forms
- Inquiry form (inquiry-schema.ts validation)
- Phone number input (tel:+19295155434 format validation)
- Service option selection (SERVICE_OPTIONS array)
- Sticky header/monogram navigation

## Mobile Testing Checklist

| Check | File Location | Priority |
|---|---|---|
| Phone number href validation | `src/lib/site.ts` phoneHref | Critical |
| Email link testing | `src/lib/site.ts` email | High |
| Booking URL preview | `src/lib/site.ts` bookingUrl | Critical |
| Service options selection | SERVICE_OPTIONS array | Medium |
| Footer legal links on mobile | FOOTER_LEGAL_LINKS | Medium |

## Configuration File Structure
```
.config/tools/PI_CONFIG.md
├── installation.sh          # Device setup scripts
├── test-coverage.json       # Mobile-specific test coverage
└── device-emulation.yaml    # Preset configurations
```
