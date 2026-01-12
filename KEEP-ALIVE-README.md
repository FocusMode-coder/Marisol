# Marisol Website - Keep Alive System

## 📋 Overview

Sistema robusto de keep-alive para mantener el sitio web Marisol siempre activo y disponible.

## 🚀 Componentes

### 1. **keep-alive.html**
Página de monitoreo visual con auto-refresh cada 5 minutos.

**URL:** `https://tu-dominio.com/keep-alive.html`

**Características:**
- ✅ Auto-refresh automático cada 5 minutos
- ✅ Ping periódico cada 60 segundos
- ✅ Visualización de estado en tiempo real
- ✅ Contador de uptime y pings
- ✅ Persistencia de datos en localStorage

### 2. **keep-alive.js**
Script JavaScript avanzado para integración en todas las páginas.

**Características:**
- ✅ Ping automático cada 60 segundos
- ✅ Health checks cada 5 minutos
- ✅ Monitoreo de memoria y conectividad
- ✅ Estadísticas persistentes
- ✅ Eventos personalizados para monitoreo externo

## 📦 Instalación

### Opción 1: Sistema Completo (Recomendado)

Agregar al `<head>` de **todas las páginas principales**:

```html
<!-- Keep Alive System -->
<script src="ASSETS/js/keep-alive.js" defer></script>
```

### Opción 2: Solo Página de Monitoreo

Usar la página `keep-alive.html` con servicios externos como:
- UptimeRobot (https://uptimerobot.com)
- Pingdom (https://www.pingdom.com)
- Better Uptime (https://betteruptime.com)

## 🔧 Configuración

### Personalizar Intervalos

En `keep-alive.js`, puedes ajustar:

```javascript
window.keepAlive = new KeepAliveSystem({
    pingInterval: 60000,        // 60 segundos
    healthCheckInterval: 300000, // 5 minutos
    debug: false                // true para ver logs
});
```

### Páginas Monitoreadas

Por defecto monitorea:
- `/index.html`
- `/about.html`
- `/blogs.html`
- `/contact.html`
- `/products.html`

Para agregar más páginas:

```javascript
window.keepAlive = new KeepAliveSystem({
    pagesToPing: [
        '/index.html',
        '/about.html',
        '/blogs.html',
        '/tu-nueva-pagina.html'
    ]
});
```

## 📊 Monitoreo Externo

### UptimeRobot (Gratis)

1. Crear cuenta en https://uptimerobot.com
2. Agregar monitor:
   - **Monitor Type:** HTTP(s)
   - **URL:** `https://tu-dominio.com/keep-alive.html`
   - **Monitoring Interval:** 5 minutos
3. Configurar alertas por email/SMS

### Better Uptime (Recomendado)

1. Crear cuenta en https://betteruptime.com
2. Agregar monitor con URL: `https://tu-dominio.com/keep-alive.html`
3. Interval: 1-3 minutos
4. Configurar notificaciones

## 🎯 Estrategias de Keep-Alive

### Estrategia 1: Auto-Ping Interno
El script `keep-alive.js` hace ping automático cada minuto.

### Estrategia 2: Monitoreo Externo
Servicios como UptimeRobot visitan tu sitio cada 5 minutos.

### Estrategia 3: Auto-Refresh
La página `keep-alive.html` se recarga sola cada 5 minutos.

### Estrategia 4: Múltiples Endpoints
Monitorea varias páginas simultáneamente para máxima disponibilidad.

## 📈 Ver Estadísticas

### En Consola del Navegador

```javascript
// Ver estadísticas actuales
keepAlive.getStats()

// Ver estado de memoria
keepAlive.getMemoryUsage()

// Forzar ping manual
keepAlive.ping()

// Forzar health check
keepAlive.healthCheck()
```

### Escuchar Eventos

```javascript
window.addEventListener('keepalive:healthcheck', (event) => {
    console.log('Health Check:', event.detail);
});
```

## 🛡️ Seguridad

- ✅ No almacena información sensible
- ✅ Solo usa localStorage para estadísticas
- ✅ Todos los pings son solicitudes HEAD (mínimo tráfico)
- ✅ No interfiere con funcionalidad del sitio

## 🐛 Troubleshooting

### El sistema no funciona

1. **Verificar en consola:**
   ```javascript
   console.log(window.keepAlive)
   ```
   Debe mostrar el objeto KeepAliveSystem.

2. **Activar debug:**
   ```javascript
   window.keepAlive.config.debug = true;
   ```

3. **Verificar localStorage:**
   ```javascript
   localStorage.getItem('marisol_keepalive')
   ```

### Ver logs en tiempo real

Agregar al script:
```javascript
window.keepAlive = new KeepAliveSystem({ debug: true });
```

## 📞 Soporte

Para problemas o preguntas, revisar:
1. Consola del navegador (F12)
2. Estado de conexión a internet
3. Configuración de servicios externos

## 🔄 Actualización

Para actualizar el sistema:
1. Reemplazar archivos `keep-alive.html` y `keep-alive.js`
2. Limpiar caché del navegador (Ctrl+Shift+R)
3. Verificar funcionamiento en consola

## ✅ Checklist de Implementación

- [ ] Subir `keep-alive.html` al servidor
- [ ] Subir `keep-alive.js` a `/ASSETS/js/`
- [ ] Agregar script a páginas principales
- [ ] Configurar servicio de monitoreo externo
- [ ] Verificar funcionamiento visitando `/keep-alive.html`
- [ ] Confirmar pings en consola del navegador
- [ ] Configurar alertas de caída del sitio

## 🎉 Resultado Esperado

Con este sistema implementado:
- ✅ Sitio siempre activo y monitoreado
- ✅ Ping automático cada 60 segundos
- ✅ Alertas inmediatas si el sitio cae
- ✅ Estadísticas de uptime en tiempo real
- ✅ Mínimo consumo de recursos

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2026  
**Desarrollado para:** Marisol Website