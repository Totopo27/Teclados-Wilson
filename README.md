# Hexgrid Keyboard Workspace

Este proyecto contiene una serie de interfaces interactivas basadas en grillas hexagonales para explorar y tocar en temperamentos microtonales, sistemas de escalas generados (MOS) y disposiciones isotópicas como las de Erv Wilson o D'Alessandro.

Las aplicaciones corren directamente en el navegador, pero dado que utilizan módulos de JavaScript (ES Modules), **es necesario servirlas a través de un servidor HTTP local** para que el navegador no bloquee los scripts por políticas de seguridad (CORS).

---

## 🚀 Instrucciones para abrir el proyecto en tu computadora

El proyecto consta de dos partes:
1. La interfaz web (los teclados hexagonales).
2. El puente OSC (opcional), que traduce las notas de la web a tu sintetizador (ej. SuperCollider).

### Paso 1: Abrir la interfaz web (Teclados)
No puedes simplemente hacer doble clic en `index.html`. Debes levantar un servidor.

**Método recomendado (Todos los sistemas: Mac, Windows, Linux)**
Si usas **Visual Studio Code (VSCode)**, que es el estándar de la industria:
1. Abre esta carpeta (`hexgrid-workspace`) en VSCode.
2. Ve a las extensiones (icono de cuadrados a la izquierda) y busca e instala **"Live Server"** (de Ritwick Dey).
3. Una vez instalada, haz clic derecho sobre el archivo `index.html` y selecciona **"Open with Live Server"**.
4. ¡Listo! Se abrirá una pestaña en tu navegador en `http://127.0.0.1:5500`.

**Alternativa rápida usando Terminal (Si tienes Python instalado)**
1. Abre la **Terminal** (Mac/Linux) o **Símbolo del Sistema / PowerShell** (Windows).
2. Navega a esta carpeta (`cd ruta/a/hexgrid-workspace`).
3. Escribe **python3 -m http.server** y presiona Enter.
   *(En algunas versiones de Windows o instalaciones antiguas puede que solo sea **python -m http.server**).*
4. Abre tu navegador y ve a `http://localhost:8000`.

---

### Paso 2: Conexiones OSC (Cómo enviar notas a SuperCollider)

Para que los teclados puedan enviar mensajes OSC a otras aplicaciones (como SuperCollider o Max/MSP), usamos un pequeño puente (Bridge) hecho en Node.js.

1. **Abre el puente OSC en tu Computadora (Host):**
   - **En Mac:** Abre la Terminal, navega hasta esta carpeta y arrastra el archivo `run_bridge_mac.sh` a la terminal, o corre `./run_bridge_mac.sh`.
   - **En Windows:** Simplemente haz doble clic en el archivo `RUN_BRIDGE.bat`.
   *(La primera vez que lo corras, tardará un ratito porque instalará las dependencias necesarias. Después verás que dice "Levantando el puente...").*

2. **Conecta la web (2 Opciones para Tablet/iPad):**
   Para tocar desde un iPad o tablet, tienes dos opciones de conexión hacia tu computadora host:
   
   - **OPCIÓN A (Red Wi-Fi):**
     1. Asegúrate de que el iPad y la computadora estén en la misma red Wi-Fi.
     2. En tu computadora, averigua tu IP Local de Wi-Fi (ej. `192.168.1.5`).
     3. Abre Safari en el iPad y entra a `http://192.168.1.5:8000` (o el puerto de Live Server: `5500`).
   
   - **OPCIÓN B (Cable USB - ¡Ultra-baja latencia para tocar en vivo!):**
     1. Conecta el iPad a la Mac con un cable USB.
     2. En tu Mac, ve a **Configuración del Sistema > Red**. Verás una interfaz llamada **"iPad USB"**.
     3. Selecciona "iPad USB" y anota la **Dirección IP** que te indica ahí (suele ser `169.254.x.x`).
     4. En Safari del iPad, entra a esa dirección exacta (ej. `http://169.254.85.12:8000`).
     Al usar el cable, eliminas la latencia e inestabilidad del Wi-Fi. Los datos OSC viajan directo por el cable físico.

3. **Habilita el OSC en el Teclado:**
   - En tu navegador, dentro del módulo que abriste, ve al panel **OSC Connection**.
   - En **Target IP**, puedes dejar `127.0.0.1` (ya que el puente de Node corre en la computadora y le reenvía a SuperCollider internamente).
   - En **Target UDP Port**, pon el puerto que escucha tu programa de audio (ej. `57120` para SuperCollider).
   - Marca la casilla **Enable OSC**. Verás que los indicadores dicen "WS Local Conectado" y la luz roja se volverá verde.

---

*Nota: Las versiones actuales han sido fuertemente optimizadas para uso profesional multitáctil en iPad. Aprovechan la Unified Pointer API nativa para garantizar zoom fluido, paneo y envíos inmediatos de señales de nota, aislando el comportamiento para evitar latencia.*
