/**
 * BRIDGE OSC (WebSocket a UDP)
 * 
 * ¿Por qué existe este archivo?
 * Los navegadores de internet (como Chrome o Firefox) tienen bloqueado por seguridad
 * el envío de paquetes UDP (que es el protocolo que usa OSC). 
 * 
 * Solución:
 * 1. El navegador envía las notas usando WebSocket (TCP) hacia este script.
 * 2. Este script actúa como traductor: recibe el JSON, lo empaqueta en formato binario
 *    (OSC 1.0 estándar) y se lo dispara por UDP (dgram) a SuperCollider u otro software.
 */
const WebSocket = require('ws');
const dgram = require('dgram');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// --- Configuración ---
const HTTP_PORT = 3000;
const WS_PORT = 8081;

// --- Utilidad para obtener la IP local ---
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const LOCAL_IP = getLocalIP();

// --- Servidor HTTP (Para que el iPad pueda cargar el teclado) ---
const ROOT_DIR = path.resolve(__dirname);

const server = http.createServer((req, res) => {
    // Sanitizar y prevenir Path Traversal
    const safeUrlPath = path.normalize(decodeURIComponent(req.url.split('?')[0]));
    let relativePath = safeUrlPath === '/' ? 'index.html' : safeUrlPath.replace(/^(\.\.[\/\\])+/, '');
    if (relativePath.startsWith('/') || relativePath.startsWith('\\')) {
        relativePath = relativePath.slice(1);
    }
    if (!relativePath) relativePath = 'index.html';

    const resolvedPath = path.resolve(ROOT_DIR, relativePath);

    // Verificar contención estricta dentro del directorio raíz del proyecto
    if (!resolvedPath.startsWith(ROOT_DIR + path.sep) && resolvedPath !== ROOT_DIR) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    const extname = String(path.extname(resolvedPath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(resolvedPath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT' || error.code === 'EISDIR') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log('=========================================');
    console.log('   WILSON T41 - MASTER BRIDGE - v1.1    ');
    console.log('=========================================');
    console.log(`[HTTP] Interfaz: http://${LOCAL_IP}:${HTTP_PORT}`);
    console.log(`[WS]   Puente:   ws://${LOCAL_IP}:${WS_PORT}`);
    console.log('-----------------------------------------');
    console.log('Instrucciones para iPad:');
    console.log(`1. Conectá el iPad a la misma red Wi-Fi.`);
    console.log(`2. Abrí Safari e ingresá: http://${LOCAL_IP}:${HTTP_PORT}`);
    console.log('=========================================');
});

// --- Cliente UDP para enviar paquetes a SuperCollider / Max / Surge ---
const udpClient = dgram.createSocket('udp4');

// Validación estricta de destinos UDP permitidos (localhost, loopback y subredes privadas locales)
function isAllowedUdpHost(ip) {
    if (!ip || typeof ip !== 'string') return false;
    const cleanIp = ip.trim().toLowerCase();
    if (cleanIp === 'localhost' || cleanIp === '127.0.0.1' || cleanIp === '::1') return true;
    
    // IPv4 private ranges (RFC 1918)
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = cleanIp.match(ipv4Regex);
    if (match) {
        const octets = match.slice(1).map(Number);
        if (octets.some(o => o < 0 || o > 255)) return false;
        // 127.0.0.0/8
        if (octets[0] === 127) return true;
        // 10.0.0.0/8
        if (octets[0] === 10) return true;
        // 172.16.0.0/12
        if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
        // 192.168.0.0/16
        if (octets[0] === 192 && octets[1] === 168) return true;
    }
    return false;
}

// --- Servidor WebSocket (El teclado se conecta aquí) ---
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
    console.log('[BRIDGE] Teclado vinculado.');

    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data);
            
            if (msg.type === 'osc') {
                const targetPort = parseInt(msg.port, 10);
                const targetHost = (msg.ip || '127.0.0.1').trim();

                if (!targetPort || targetPort < 1 || targetPort > 65535) {
                    console.warn(`[SECURITY] Descartado paquete OSC con puerto inválido: ${msg.port}`);
                    return;
                }

                if (!isAllowedUdpHost(targetHost)) {
                    console.warn(`[SECURITY BLOCKED] Intento de reenvío UDP no autorizado hacia: ${targetHost}:${targetPort}`);
                    return;
                }

                if (!Array.isArray(msg.message) && !Buffer.isBuffer(msg.message)) {
                    console.warn('[SECURITY] Mensaje OSC con formato de payload inválido.');
                    return;
                }

                const buffer = Buffer.from(msg.message);
                if (buffer.length > 65507) { // Límite máximo de payload UDP
                    console.warn('[SECURITY] Paquete OSC excede el tamaño máximo UDP permitido.');
                    return;
                }
                
                // Enviamos el buffer binario puro por UDP al destino final validado
                udpClient.send(buffer, 0, buffer.length, targetPort, targetHost === 'localhost' ? '127.0.0.1' : targetHost, (err) => {
                    if (err) {
                        console.error('[UDP ERROR]', err);
                    }
                });
            } else if (msg.type === 'midi') {
                // Reenviar evento MIDI en formato estructurado a cualquier listener o servicio midiControl
                console.log(`[MIDI EVENT] ${String(msg.event).toUpperCase()} -> Ch: ${parseInt(msg.channel, 10) || 1}, Nota: ${parseInt(msg.note, 10) || 0}, Vel: ${msg.velocity !== undefined ? parseInt(msg.velocity, 10) : 127}`);
            }
        } catch (e) {
            console.error('[PROCESS ERROR]', e.message);
        }
    });

    ws.on('close', () => {
        console.log('[BRIDGE] Teclado desvinculado.');
    });
});

udpClient.on('error', (err) => {
    console.log(`[UDP SERVER ERROR]:\n${err.stack}`);
    udpClient.close();
});

