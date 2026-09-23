# Guía Práctica Semana 04 - Desarrollo de Aplicaciones Web

**Universidad Nacional del Centro del Perú**  
**Facultad de Ingeniería de Sistemas**  
**Asignatura:** Desarrollo de Aplicaciones Web (IS093A)  
**Estudiante:** nauparirojas  
**Repositorio:** [strictpractice4-individual](https://github.com/nauparirojas/strictpractice4-individual)

---

## Descripción del Proyecto
Aplicación web interactiva desarrollada con **Vanilla JS (ES6+)**, **Canvas API** y **CSS3** para el monitoreo de rendimiento en tiempo real, análisis de FPS mediante histograma visual, simulación de fugas de memoria (*Memory Leaks*) y su posterior liberación mediante técnicas de dereferenciación y Garbage Collection.

---

## Conceptos Clave Implementados

1. **Patrón IIFE:** Todo el código se encapsula en una función autoinvocada `(() => { ... })()` para evitar la contaminación del ámbito global.
2. **Closures:** Encapsulamiento del estado de animación (posiciones, velocidad, arreglos de fugas) mediante variables retenidas dentro de `createMonitoringController`.
3. **Canvas & requestAnimationFrame:** Animación fluida con tiempo delta ($dt$) omitiendo el uso de `setInterval`.
4. **Manejo de Fugas de Memoria:**
   - **Simulación:** Generación intencional de *Detached DOM Nodes* y listeners sin dereferenciar.
   - **Limpieza:** Vaciado de arreglos (`array.length = 0`), remoción explícita de *listeners* con `removeEventListener` e invocación implícita del *Garbage Collector*.

---

## Métricas de Performance y Depuración (DevTools)

| Métrica | Estado Normal | Durante Memory Leak | Tras Limpiar Memoria |
| :--- | :--- | :--- | :--- |
| **FPS Promedio** | ~60 FPS | Drops a < 40 FPS | ~60 FPS |
| **Perfil JS Heap** | Diente de sierra (Estable) | Crecimiento diagonal | Retorno a ~30% |
| **Detached DOM Nodes** | 0 nodos | Acumulación continua | 0 nodos retenidos |
