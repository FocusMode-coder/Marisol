/**
 * MARISOL WEBSITE - KEEP ALIVE SYSTEM
 * 
 * This script maintains site activity by:
 * - Periodic health checks
 * - Page preloading
 * - Connection persistence
 * - Activity tracking
 */

class KeepAliveSystem {
    constructor(config = {}) {
        this.config = {
            pingInterval: config.pingInterval || 60000, // 1 minute
            healthCheckInterval: config.healthCheckInterval || 300000, // 5 minutes
            pagesToPing: config.pagesToPing || [
                '/index.html',
                '/about.html',
                '/blogs.html',
                '/contact.html',
                '/products.html'
            ],
            storageKey: 'marisol_keepalive',
            debug: config.debug || false
        };
        
        this.stats = {
            startTime: Date.now(),
            pingCount: 0,
            lastPing: null,
            errors: 0,
            successRate: 100
        };
        
        this.isActive = false;
        this.intervals = [];
    }
    
    /**
     * Initialize and start the keep-alive system
     */
    init() {
        if (this.isActive) {
            this.log('Keep-alive system already running');
            return;
        }
        
        this.log('Initializing keep-alive system...');
        this.loadStats();
        this.start();
        this.setupVisibilityHandler();
        this.setupBeforeUnload();
        this.isActive = true;
        this.log('Keep-alive system started successfully');
    }
    
    /**
     * Start all monitoring intervals
     */
    start() {
        // Immediate ping on start
        this.ping();
        
        // Regular ping interval
        const pingTimer = setInterval(() => this.ping(), this.config.pingInterval);
        this.intervals.push(pingTimer);
        
        // Health check interval
        const healthTimer = setInterval(() => this.healthCheck(), this.config.healthCheckInterval);
        this.intervals.push(healthTimer);
        
        // Stats save interval (every 30 seconds)
        const saveTimer = setInterval(() => this.saveStats(), 30000);
        this.intervals.push(saveTimer);
    }
    
    /**
     * Stop all monitoring
     */
    stop() {
        this.intervals.forEach(timer => clearInterval(timer));
        this.intervals = [];
        this.isActive = false;
        this.saveStats();
        this.log('Keep-alive system stopped');
    }
    
    /**
     * Ping all configured pages
     */
    async ping() {
        this.stats.pingCount++;
        this.stats.lastPing = Date.now();
        
        const results = await Promise.allSettled(
            this.config.pagesToPing.map(page => this.pingPage(page))
        );
        
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const total = results.length;
        this.stats.successRate = Math.round((successful / total) * 100);
        
        if (successful < total) {
            this.stats.errors += (total - successful);
        }
        
        this.log(`Ping completed: ${successful}/${total} successful`);
        this.saveStats();
    }
    
    /**
     * Ping individual page
     */
    async pingPage(page) {
        try {
            const response = await fetch(page, {
                method: 'HEAD',
                cache: 'no-cache'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return { page, status: 'success' };
        } catch (error) {
            this.log(`Error ping ${page}: ${error.message}`, 'error');
            return { page, status: 'error', error: error.message };
        }
    }
    
    /**
     * Comprehensive health check
     */
    async healthCheck() {
        this.log('Running health check...');
        
        const checks = {
            timestamp: new Date().toISOString(),
            uptime: Date.now() - this.stats.startTime,
            pingCount: this.stats.pingCount,
            successRate: this.stats.successRate,
            errors: this.stats.errors,
            memory: this.getMemoryUsage(),
            online: navigator.onLine
        };
        
        this.log('Health check completed', checks);
        
        // Dispatch custom event for external monitoring
        window.dispatchEvent(new CustomEvent('keepalive:healthcheck', {
            detail: checks
        }));
        
        return checks;
    }
    
    /**
     * Get memory usage if available
     */
    getMemoryUsage() {
        if (performance && performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }
    
    /**
     * Handle page visibility changes
     */
    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.log('Page became visible - running immediate ping');
                this.ping();
            }
        });
    }
    
    /**
     * Save stats before page unload
     */
    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            this.saveStats();
        });
    }
    
    /**
     * Save stats to localStorage
     */
    saveStats() {
        try {
            const data = {
                ...this.stats,
                savedAt: Date.now()
            };
            localStorage.setItem(this.config.storageKey, JSON.stringify(data));
        } catch (error) {
            this.log('Error saving stats', 'error');
        }
    }
    
    /**
     * Load stats from localStorage
     */
    loadStats() {
        try {
            const saved = localStorage.getItem(this.config.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                // Only restore cumulative stats, not timing-related ones
                this.stats.pingCount = data.pingCount || 0;
                this.stats.errors = data.errors || 0;
                this.log('Stats loaded from storage');
            }
        } catch (error) {
            this.log('Error loading stats', 'error');
        }
    }
    
    /**
     * Get current statistics
     */
    getStats() {
        return {
            ...this.stats,
            uptime: Date.now() - this.stats.startTime,
            uptimeFormatted: this.formatUptime(Date.now() - this.stats.startTime)
        };
    }
    
    /**
     * Format uptime duration
     */
    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
    
    /**
     * Debug logging
     */
    log(message, type = 'info') {
        if (!this.config.debug && type !== 'error') return;
        
        const prefix = '[KeepAlive]';
        const timestamp = new Date().toLocaleTimeString();
        
        if (type === 'error') {
            console.error(`${prefix} ${timestamp}:`, message);
        } else if (typeof message === 'object') {
            console.log(`${prefix} ${timestamp}:`, message);
        } else {
            console.log(`${prefix} ${timestamp}: ${message}`);
        }
    }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    window.KeepAliveSystem = KeepAliveSystem;
    
    // Auto-start on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.keepAlive = new KeepAliveSystem({ debug: false });
            window.keepAlive.init();
        });
    } else {
        window.keepAlive = new KeepAliveSystem({ debug: false });
        window.keepAlive.init();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeepAliveSystem;
}