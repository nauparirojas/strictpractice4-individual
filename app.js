/**
 * UNCP - Facultad de Ingeniería de Sistemas
 * Asignatura: Desarrollo de Aplicaciones Web (IS093A)
 * 
 * NOTA DE AUTORÍA Y REGLA DE LABORATORIO:
 * - >70% de la lógica (IIFE, Closures, Canvas Loop, Manejo DOM) fue escrita manualmente.
 * - Los bloques con asistencia de IA/Optimización están indicados explícitamente en comentarios.
 */

// PARTE 1 - PASO 2: Patrón IIFE para aislamiento del Scope global
(() => {
  'use strict';

  // Referencias a elementos del DOM
  const canvas = document.getElementById('animationCanvas');
  const ctx = canvas.getContext('2d');
  const fpsHistogram = document.getElementById('fpsHistogram');
  const memoryBarFill = document.getElementById('memoryBarFill');
  const memoryValueText = document.getElementById('memoryValueText');
  const consoleLog = document.getElementById('consoleLog');

  const perfBtn = document.getElementById('perfBtn');
  const leakBtn = document.getElementById('leakBtn');
  const cleanBtn = document.getElementById('cleanBtn');

  /**
   * MANIPULACIÓN DEL DOM: Salida de consola personalizada en pantalla con timestamps
   */
  const logToScreen = (message, type = 'info') => {
    const now = new Date();
    const timeStr = `[${now.toTimeString().split(' ')[0]}]`;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'log-time';
    timeSpan.textContent = timeStr;
    
    const textSpan = document.createElement('span');
    textSpan.className = `log-${type}`;
    textSpan.textContent = message;

    entry.appendChild(timeSpan);
    entry.appendChild(textSpan);
    consoleLog.appendChild(entry);
    consoleLog.scrollTop = consoleLog.scrollHeight;
  };

  /**
   * PARTE 1 - PASO 2: CLOSURE PARA GESTIÓN DE ESTADO DE LA ANIMACIÓN Y RENDIMIENTO
   * Mantiene aisladas las variables privadas entre frames continuos.
   */
  const createMonitoringController = (canvasContext, width, height) => {
    // Estado privado retenido mediante Closure
    let xPos = 20;
    let direction = 1;
    let speed = 180; // px/s
    let lastTimeStamp = 0;
    let isLeaking = false;

    // IA-ASSISTED NOTE: Estructuras auxiliares para simulación de fugas de memoria
    let leakedArray = [];
    let orphanedListeners = [];
    let heapPercent = 35;

    // DIBUJO EN CANVAS API
    const draw = () => {
      canvasContext.clearRect(0, 0, width, height);

      canvasContext.beginPath();
      canvasContext.arc(xPos, height / 2, 12, 0, Math.PI * 2);
      canvasContext.fillStyle = isLeaking ? '#ef4444' : '#3b82f6';
      canvasContext.fill();
      canvasContext.closePath();
    };

    // PARTE 1 - PASO 4: Actualización con Delta Time (dt) en lugar de setInterval
    const update = (dt) => {
      xPos += direction * speed * dt;
      if (xPos >= width - 12 || xPos <= 12) {
        direction *= -1;
      }

      // SIMULACIÓN DE MEMORY LEAK (Nodos huérfanos y objetos retenidos)
      if (isLeaking) {
        for (let i = 0; i < 600; i++) {
          leakedArray.push({
            data: new Array(1000).fill('fuga_memoria_activa'),
            node: document.createElement('div') // Detached DOM Node
          });
        }

        const tempBtn = document.createElement('button');
        const handler = () => {};
        tempBtn.addEventListener('click', handler);
        orphanedListeners.push({ element: tempBtn, handler });

        if (heapPercent < 98) heapPercent += 0.4;
      }
    };

    // Actualizador visual del histograma de FPS
    const addHistogramBar = (fps) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      if (fps < 45) bar.classList.add('low-fps');
      
      const barHeight = Math.min(100, Math.max(10, (fps / 60) * 100));
      bar.style.height = `${barHeight}%`;

      fpsHistogram.appendChild(bar);
      if (fpsHistogram.children.length > 70) {
        fpsHistogram.removeChild(fpsHistogram.firstChild);
      }
    };

    const updateMemoryUI = () => {
      memoryBarFill.style.width = `${heapPercent.toFixed(0)}%`;
      memoryValueText.textContent = `${heapPercent.toFixed(0)}%`;
    };

    // PARTE 1 - PASO 4: Render Loop utilizando requestAnimationFrame
    const loop = (currentTimeStamp) => {
      if (!lastTimeStamp) lastTimeStamp = currentTimeStamp;
      const dt = (currentTimeStamp - lastTimeStamp) / 1000;
      lastTimeStamp = currentTimeStamp;

      if (dt > 0) {
        const fps = Math.min(60, Math.round(1 / dt));
        addHistogramBar(fps);
      }

      update(dt);
      draw();
      updateMemoryUI();

      requestAnimationFrame(loop);
    };

    return {
      start: () => {
        logToScreen('Carga e inicio de renderizado activo.', 'info');
        requestAnimationFrame(loop);
      },
      triggerLeak: () => {
        if (!isLeaking) {
          isLeaking = true;
          logToScreen('LEAK simulado: generando nodos y listeners huérfanos.', 'warn');
          logToScreen('Rendimiento degradándose...', 'error');
        }
      },
      // PARTE 1 - PASO 5: Estrategias de desvinculación y limpieza de memoria
      cleanMemory: () => {
        isLeaking = false;

        // Desvinculación de listeners huérfanos
        orphanedListeners.forEach(item => item.element.removeEventListener('click', item.handler));
        orphanedListeners = [];

        // Vaciamiento de arreglos y dereferenciación para el Garbage Collector
        leakedArray.length = 0;
        leakedArray = [];

        heapPercent = 30;
        updateMemoryUI();
        
        logToScreen('Limpieza y dereferenciación realizada.', 'success');
        logToScreen('Memoria liberada y rendimiento restaurado.', 'success');
      },
      analyzePerf: () => {
        logToScreen(`Diagnóstico de Rendimiento: FPS ~60 | Heap ~${heapPercent.toFixed(0)}%`, 'info');
      }
    };
  };

  // Instanciación del controlador
  const controller = createMonitoringController(ctx, canvas.width, canvas.height);
  controller.start();

  // PARTE 1 - PASO 3: Asignación de Event Handlers con Arrow Functions
  perfBtn.addEventListener('click', () => controller.analyzePerf());
  leakBtn.addEventListener('click', () => controller.triggerLeak());
  cleanBtn.addEventListener('click', () => controller.cleanMemory());

})();