# Monitoring and Analytics Guide

## Overview
This guide covers the monitoring and analytics setup for the GECKHONFT platform, including contract event monitoring, user analytics, error tracking, and performance monitoring.

## Contract Event Monitoring

### Etherscan Integration

1. **Event Monitoring Setup**
   ```bash
   # Configure Etherscan API key
   export ETHERSCAN_API_KEY=your_api_key

   # Set up event monitoring
   forge verify-contract <CONTRACT_ADDRESS> src/GECKHONFT.sol:GECKHONFT --chain-id 1
   ```

2. **Key Events to Monitor**
   - `NFTMinted`: Track all minting activities
   - `WhitelistUpdated`: Monitor whitelist changes
   - `PriceUpdated`: Track price modifications
   - `RoyaltyUpdated`: Monitor royalty changes
   - `MintingStatusChanged`: Track minting status

3. **Event Alert Configuration**
   ```javascript
   // Example event monitoring setup
   const contract = new ethers.Contract(address, abi, provider);
   
   contract.on("NFTMinted", (to, tokenId, tokenURI, event) => {
     console.log(`NFT Minted: ${tokenId} to ${to}`);
     // Send alert to monitoring system
   });
   ```

### Custom Monitoring Script

1. **Event Listener Setup**
   ```typescript
   // src/monitoring/eventListener.ts
   import { ethers } from 'ethers';
   import { GECKHONFT__factory } from '../typechain';

   export class EventMonitor {
     private contract: ethers.Contract;
     private provider: ethers.providers.Provider;

     constructor(address: string, provider: ethers.providers.Provider) {
       this.provider = provider;
       this.contract = GECKHONFT__factory.connect(address, provider);
       this.setupEventListeners();
     }

     private setupEventListeners() {
       // Minting events
       this.contract.on("NFTMinted", this.handleMint);
       this.contract.on("WhitelistUpdated", this.handleWhitelistUpdate);
       this.contract.on("PriceUpdated", this.handlePriceUpdate);
       this.contract.on("RoyaltyUpdated", this.handleRoyaltyUpdate);
       this.contract.on("MintingStatusChanged", this.handleMintingStatus);
     }

     private async handleMint(to: string, tokenId: number, tokenURI: string) {
       // Log to monitoring system
       await this.logEvent('NFTMinted', { to, tokenId, tokenURI });
     }

     // ... other event handlers
   }
   ```

## User Analytics

### Google Analytics Integration

1. **Setup**
   ```typescript
   // src/utils/analytics.ts
   import { Analytics } from '@vercel/analytics/react';

   export const trackEvent = (eventName: string, properties: object) => {
     // Track user interactions
     Analytics.track(eventName, properties);
   };
   ```

2. **Key Metrics to Track**
   - Page views and navigation
   - Wallet connections
   - Minting attempts
   - Transaction success/failure
   - User retention
   - Session duration

3. **Custom Events**
   ```typescript
   // Example event tracking
   export const trackMintingAttempt = (tokenId: number, price: string) => {
     trackEvent('minting_attempt', {
       tokenId,
       price,
       timestamp: new Date().toISOString()
     });
   };
   ```

### User Behavior Analytics

1. **Heatmap Integration**
   ```typescript
   // src/components/Heatmap.tsx
   import { Heatmap } from '@hotjar/react';

   export const UserHeatmap = () => {
     return <Heatmap />;
   };
   ```

2. **Session Recording**
   ```typescript
   // src/utils/sessionRecording.ts
   import { SessionRecording } from '@hotjar/react';

   export const setupSessionRecording = () => {
     SessionRecording.start();
   };
   ```

## Error Tracking

### Sentry Integration

1. **Setup**
   ```typescript
   // src/utils/errorTracking.ts
   import * as Sentry from '@sentry/nextjs';

   export const initErrorTracking = () => {
     Sentry.init({
       dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
       environment: process.env.NODE_ENV,
       tracesSampleRate: 1.0,
     });
   };
   ```

2. **Error Categories**
   - Contract interaction errors
   - Wallet connection issues
   - Network errors
   - UI/UX errors
   - Performance errors

3. **Error Handling**
   ```typescript
   // Example error handling
   export const handleContractError = (error: Error) => {
     Sentry.captureException(error, {
       tags: {
         type: 'contract_error',
         component: 'minting'
       }
     });
   };
   ```

### Custom Error Monitoring

1. **Error Logger**
   ```typescript
   // src/utils/errorLogger.ts
   export class ErrorLogger {
     static log(error: Error, context: object) {
       // Log to monitoring system
       console.error({
         message: error.message,
         stack: error.stack,
         context,
         timestamp: new Date().toISOString()
       });
     }
   }
   ```

## Performance Monitoring

### Lighthouse Integration

1. **Setup**
   ```typescript
   // src/utils/performance.ts
   import lighthouse from 'lighthouse';
   import chromeLauncher from 'chrome-launcher';

   export const runPerformanceAudit = async (url: string) => {
     const chrome = await chromeLauncher.launch();
     const results = await lighthouse(url, {
       port: chrome.port,
       output: 'json'
     });
     return results;
   };
   ```

2. **Key Metrics**
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)
   - Total Blocking Time (TBT)
   - Cumulative Layout Shift (CLS)

### Real User Monitoring (RUM)

1. **Setup**
   ```typescript
   // src/utils/rum.ts
   export const initRUM = () => {
     // Initialize RUM tracking
     window.performance.mark('app_start');
   };
   ```

2. **Performance Tracking**
   ```typescript
   // Example performance tracking
   export const trackPageLoad = () => {
     const timing = window.performance.timing;
     const loadTime = timing.loadEventEnd - timing.navigationStart;
     
     // Send to analytics
     trackEvent('page_load', { loadTime });
   };
   ```

## Monitoring Dashboard

### Grafana Setup

1. **Configuration**
   ```yaml
   # grafana/config.yml
   apiVersion: 1
   datasources:
     - name: Prometheus
       type: prometheus
       url: http://prometheus:9090
   ```

2. **Key Dashboards**
   - Contract Events
   - User Analytics
   - Error Rates
   - Performance Metrics

### Alert Configuration

1. **Alert Rules**
   ```yaml
   # prometheus/rules.yml
   groups:
     - name: contract_alerts
       rules:
         - alert: HighErrorRate
           expr: rate(contract_errors_total[5m]) > 0.1
           for: 5m
           labels:
             severity: warning
   ```

2. **Notification Channels**
   - Email alerts
   - Slack notifications
   - Discord webhooks
   - SMS alerts

## Logging

### Centralized Logging

1. **ELK Stack Setup**
   ```yaml
   # elk/docker-compose.yml
   version: '3'
   services:
     elasticsearch:
       image: docker.elastic.co/elasticsearch/elasticsearch:7.9.3
     logstash:
       image: docker.elastic.co/logstash/logstash:7.9.3
     kibana:
       image: docker.elastic.co/kibana/kibana:7.9.3
   ```

2. **Log Categories**
   - Application logs
   - Contract events
   - Error logs
   - Performance logs
   - User activity logs

## Maintenance

### Regular Tasks

1. **Daily**
   - Review error reports
   - Check performance metrics
   - Monitor user analytics
   - Review contract events

2. **Weekly**
   - Analyze trends
   - Generate reports
   - Update dashboards
   - Review alert thresholds

3. **Monthly**
   - Performance optimization
   - System updates
   - Capacity planning
   - Security review

### Backup Procedures

1. **Data Backup**
   ```bash
   # Backup monitoring data
   ./scripts/backup-monitoring.sh
   ```

2. **Configuration Backup**
   ```bash
   # Backup configurations
   ./scripts/backup-config.sh
   ```

## Security Monitoring

### Security Alerts

1. **Contract Security**
   - Unusual transaction patterns
   - Failed transactions
   - Gas price anomalies
   - Contract state changes

2. **Frontend Security**
   - XSS attempts
   - CSRF attempts
   - API abuse
   - Rate limiting

### Compliance Monitoring

1. **Data Privacy**
   - User data access
   - Data retention
   - Privacy policy compliance
   - GDPR compliance

2. **Audit Logging**
   - Admin actions
   - Configuration changes
   - Access attempts
   - Security events 