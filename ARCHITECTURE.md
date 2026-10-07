# Arquitectura del Sistema (Hexgrid Workspace)

Bienvenido al código fuente. Este documento fue generado para explicar los fundamentos matemáticos y la arquitectura de software del sistema, de modo que cualquier desarrollador pueda entender cómo funcionan los módulos.

## 1. El Sistema de Coordenadas (Wilson Flat-Top)

Todos los teclados renderizados en esta aplicación utilizan una cuadrícula hexagonal plana en su parte superior ("flat-top"). 
El sistema de coordenadas que gobierna los hexágonos **no es un sistema cartesiano convencional**, sino que está basado en la red de panal de abejas.

Cada hexágono en `hexgrid.js` se identifica por un ID de la forma `hex-C-R` (donde `C` es la Columna y `R` es la Fila).
Para encontrar hexágonos adyacentes de forma isomórfica (es decir, para mantener la geometría musical consistente), usamos vectores de Wilson.

### Vectores de Desplazamiento Musical
En los temperamentos EDO (Ej. 53 EDO, 31 EDO, 41 EDO), cada grado de la escala se ubica utilizando desplazamientos fijos de `dCol` y `dRow`.
Por ejemplo, en la función `getHexByExactOffset` (ver `edo53.js` o `edo31.js`), la geometría de la octava (`+1 octava`) no es un salto aleatorio, sino un vector fijo.

## 2. Estructura de Módulos

El proyecto está diseñado de forma modular. El motor de renderizado (`hexgrid.js`) es completamente agnóstico respecto a la música. No sabe de notas ni de temperamentos, solo de SVG, hexágonos, polígonos y eventos de mouse/touch.

La lógica musical se inyecta desde los archivos de temperamento:
- `edo53.js`
- `edo31.js`
- `edo41.js`
- `partch.js`

Estos archivos toman el motor gráfico y le ordenan qué hexágonos encender, qué texto ponerles, y cómo reaccionar al coloreo (ej. Círculo de quintas mesotónico o pitagórico).

## 3. Lógica de Temperamentos Bidireccionales

Para analizar sistemas temperados sin depender de una nota "lobo" fija, implementamos una lógica bidireccional en el Círculo de Quintas.
- En **`edo53.js`**, la función `getDirectionsFromDegree` traza la cadena ascendente de quintas pitagóricas (`+31 mod 53`) y la descendente (`+22 mod 53`) hasta topar con sus límites teóricos.
- En **`edo31.js`**, se aplica la misma lógica para el temperamento mesotónico (1/4 comma), trazando la cadena con `+18 mod 31` (ascendente) y `+13 mod 31` (descendente).

Esto permite al músico seleccionar cualquier tecla como *Reference Degree* y visualizar el mapa armónico entero reordenarse a su alrededor.

## 4. El Puente OSC (`bridge.js`)

Los navegadores web **no pueden enviar mensajes UDP** por motivos de seguridad. Para comunicarse con sintetizadores como SuperCollider, utilizamos un servidor intermedio en Node.js.

**El flujo es:**
1. Navegador (Click en hexágono) -> `window.dispatchOSC`
2. WebSocket (`ws://localhost:8080`)
3. `bridge.js` recibe el JSON por WebSocket.
4. `bridge.js` empaqueta el mensaje en formato binario OSC 1.0 estándar.
5. `bridge.js` envía el buffer binario por UDP (`dgram`) al puerto de SuperCollider (por defecto 57120).

## 5. Próximos Pasos (Tablets / Móviles)

El motor `hexgrid.js` ya cuenta con el esqueleto para eventos táctiles (`touchstart`, `touchend`), lo que sentará las bases para transformar esta aplicación web en un instrumento ejecutable en un iPad o tablet Android en las siguientes iteraciones.
