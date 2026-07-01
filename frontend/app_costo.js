// app_costo.js
// Lógica para renderizar el Módulo de Costo Evitado

document.addEventListener("DOMContentLoaded", () => {
    initCostoEvitado();
});

let patientMinDateMap = new Map();
let filtroChartGenero = null;
let filtroChartEdad = null;

function initCostoEvitado() {
    const data = window.COSTO_DATA;
    if (!data) {
        console.error("No se encontraron los datos de COSTO_DATA.");
        return;
    }

    // Calcular la fecha mínima (primera consulta) de cada paciente en el histórico completo
    if (data.raw) {
        data.raw.forEach(row => {
            let dateStr = row.fecha;
            let isoDate = dateStr;
            if (dateStr && dateStr.includes("/")) {
                let p = dateStr.split("/");
                if (p.length === 3) isoDate = `${p[2]}-${p[1]}-${p[0]}`;
            }
            let currentMin = patientMinDateMap.get(row.paciente_id);
            if (!currentMin || isoDate < currentMin) {
                patientMinDateMap.set(row.paciente_id, isoDate);
            }
        });
    }

    // Poblar el filtro dinámico de Clientes (Actividad Validada)
    const filterActividad = document.getElementById('filter-actividad');
    if (filterActividad && data.raw) {
        const actividadesUnicas = new Set();
        data.raw.forEach(row => {
            if (row.actividad && row.actividad !== "NO ESPECIFICADO") {
                actividadesUnicas.add(row.actividad);
            }
        });
        
        // Agregar las opciones dinámicamente ordenadas alfabéticamente
        Array.from(actividadesUnicas).sort().forEach(act => {
            const option = document.createElement('option');
            option.value = act;
            option.textContent = act;
            filterActividad.appendChild(option);
        });
        
        // Listeners para los filtros
        filterActividad.addEventListener('change', aplicarFiltrosYRenderizar);
    }
    
    // Listeners para fechas
    const filterFechaInicio = document.getElementById('filter-fecha-inicio');
    if (filterFechaInicio) filterFechaInicio.addEventListener('change', aplicarFiltrosYRenderizar);
    
    const filterFechaFin = document.getElementById('filter-fecha-fin');
    if (filterFechaFin) filterFechaFin.addEventListener('change', aplicarFiltrosYRenderizar);

    // Render inicial
    aplicarFiltrosYRenderizar();

    // El resto de la interactividad
    if (typeof setupEventListeners === 'function') {
        setupEventListeners();
    }
}

function aplicarFiltrosYRenderizar() {
    const data = window.COSTO_DATA;
    let filteredRaw = data.raw || [];
    
    // Obtener valores de fecha y actividad
    const fInicio = document.getElementById('filter-fecha-inicio').value;
    const fFin = document.getElementById('filter-fecha-fin').value;
    const fActividad = document.getElementById('filter-actividad').value;
    
    // Filtrar la data raw
    if (fInicio || fFin || fActividad || filtroChartGenero || filtroChartEdad) {
        filteredRaw = filteredRaw.filter(row => {
            const rowDate = row.fecha; 
            if (fInicio && rowDate < fInicio) return false;
            if (fFin && rowDate > fFin) return false;
            
            // Filtro Actividad
            const rowActividad = row.actividad || 'D2'; 
            if (fActividad && rowActividad !== fActividad) return false;
            
            // Filtro Género
            const rowGen = row.genero || 'Otro';
            if (filtroChartGenero && (rowGen.toLowerCase() !== filtroChartGenero.toLowerCase())) {
                // Map the labels
                let standardized = "Otro";
                if (rowGen.toUpperCase() === "F" || rowGen.toUpperCase() === "FEMENINO") standardized = "Femenino";
                if (rowGen.toUpperCase() === "M" || rowGen.toUpperCase() === "MASCULINO") standardized = "Masculino";
                if (standardized !== filtroChartGenero) return false;
            }
            
            // Filtro Edad
            if (filtroChartEdad && row.grupo_etareo !== filtroChartEdad) return false;
            
            return true;
        });
    }

    // Calcular KPIs Dinámicos usando data agregada
    let sumaVentas = 0;
    let numPacientes = 0;
    let prevalentes = 0;
    let incidentes = 0;
    
    // Contadores para Demografía
    let genCounts = { "Femenino": 0, "Masculino": 0, "Otro": 0 };
    let edadCounts = { "0-18": 0, "19-30": 0, "31-45": 0, "46-60": 0, "60+": 0 };
    
    filteredRaw.forEach(row => {
        sumaVentas += row.valor_ahorro || 0;
        
        let qty = row.cantidad_pacientes || 0;
        numPacientes += qty;
        
        if (row.tipo_paciente === 'Prevalencia (Antiguo)') {
            prevalentes += qty;
        } else if (row.tipo_paciente === 'Incidencia (Nuevo)') {
            incidentes += qty;
        }
        
        // Sumar género
        if (row.genero && genCounts[row.genero] !== undefined) {
            genCounts[row.genero] += qty;
        } else {
            genCounts["Otro"] += qty;
        }
        
        // Sumar edad
        if (row.grupo_etareo && edadCounts[row.grupo_etareo] !== undefined) {
            edadCounts[row.grupo_etareo] += qty;
        } else if (row.grupo_etareo && row.grupo_etareo !== "Desconocido") {
            // Si llega un grupo nuevo dinámico
            edadCounts[row.grupo_etareo] = (edadCounts[row.grupo_etareo] || 0) + qty;
        }
    });

    const ahorroId = sumaVentas;
    const ahorroGest = sumaVentas * 0.85; // Simulación de gestión sobre el total

    // Actualizar Tarjetas KPI
    const elId = document.getElementById('kpi-identificado');
    if(elId) elId.innerText = '$ ' + ahorroId.toLocaleString('es-CO', {maximumFractionDigits: 0});
    
    const elGest = document.getElementById('kpi-gestionado');
    if(elGest) elGest.innerText = '$ ' + ahorroGest.toLocaleString('es-CO', {maximumFractionDigits: 0});
    
    const elPac = document.getElementById('kpi-pacientes');
    if(elPac) elPac.innerText = numPacientes.toLocaleString('es-CO');
    
    // Actualizar KPIs de Prevalencia e Incidencia
    const kpiPrev = document.getElementById('kpi-con-int');
    if(kpiPrev) kpiPrev.innerText = prevalentes.toLocaleString('es-CO');
    
    const kpiInc = document.getElementById('kpi-sin-int');
    if(kpiInc) kpiInc.innerText = incidentes.toLocaleString('es-CO');
    
    const kpiTotal = document.getElementById('kpi-total-pac');
    if(kpiTotal) kpiTotal.innerText = numPacientes.toLocaleString('es-CO');
    
    // Actualizar Demografía Dinámicamente con los datos reales agrupados
    if (typeof renderDemografia === 'function') {
        renderDemografia({
            genero: {
                labels: Object.keys(genCounts),
                data: Object.values(genCounts)
            },
            grupoEtareo: {
                labels: Object.keys(edadCounts),
                data: Object.values(edadCounts)
            }
        });
    }

    // Renderizar tendencia (los demás componentes fueron removidos de la vista)
    if (typeof renderTendenciaUsuarios === 'function') {
        renderTendenciaUsuarios(data.tendenciaUsuarios || {meses:[], prevalentes:[], incidentes:[]});
    }
    // renderTendenciaChart(data.tendenciaMensual || {meses:[], identificado:[], evitado:[]}); // Removido
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Función renderKPIs removida porque se hace directo en aplicarFiltrosYRenderizar

function renderTopInteracciones(interacciones) {
    const tbody = document.getElementById('interacciones-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    interacciones.forEach(item => {
        const tr = document.createElement('tr');
        
        let badgeColor = 'var(--color-success)';
        if (item.gravedad === 'ALTA' || item.gravedad === 'CRÍTICO') badgeColor = 'var(--color-danger)';
        if (item.gravedad === 'MODERADA') badgeColor = 'var(--color-warn)';

        tr.innerHTML = `
            <td style="font-weight: 600; color: var(--color-text-main); font-size: 0.85rem;">
                ${item.interaccion}
            </td>
            <td>
                <span class="badge" style="background: ${badgeColor}20; color: ${badgeColor}; border: 1px solid ${badgeColor}40;">
                    ${item.gravedad}
                </span>
            </td>
            <td class="font-mono text-center">${item.casos}</td>
            <td class="font-mono text-right text-success">${formatCurrency(item.ahorro)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderTopPacientes(pacientes) {
    const container = document.getElementById('top-pacientes-container');
    if (!container) return;

    container.innerHTML = '';

    pacientes.forEach(p => {
        let borderColor = p.riesgo === 'CRÍTICO' ? 'var(--color-danger)' : 'var(--color-warn)';
        
        const card = document.createElement('div');
        card.className = 'glass-panel highlight';
        card.style.borderLeft = `4px solid ${borderColor}`;
        card.style.padding = '15px';
        card.style.display = 'flex';
        card.style.justifyContent = 'space-between';
        card.style.alignItems = 'center';
        
        card.innerHTML = `
            <div>
                <div style="font-weight: 700; color: var(--color-text-main); font-size: 1.05rem; margin-bottom: 5px;">
                    <i class="fas fa-user-circle text-muted" style="margin-right: 5px;"></i> ${p.id}
                </div>
                <div style="font-size: 0.8rem; color: var(--color-text-muted);">
                    <i class="fas fa-map-marker-alt"></i> ${p.regional} | ${p.motivo}
                </div>
            </div>
            <div style="text-align: right;">
                <div class="badge" style="background: ${borderColor}20; color: ${borderColor}; margin-bottom: 5px; font-size: 0.7rem;">
                    RIESGO ${p.riesgo}
                </div>
                <div class="font-mono text-danger" style="font-weight: 700; font-size: 1.1rem;">
                    ${formatCurrency(p.costoProyectado)}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Variables globales para guardar las instancias de los gráficos
let tendenciaChartInstance = null;
let generoChartInstance = null;
let edadChartInstance = null;
let tipoUsuarioChartInstance = null;

function renderTendenciaChart(tendencia) {
    const ctx = document.getElementById('tendenciaChart');
    if (!ctx) return;

    if (tendenciaChartInstance) {
        tendenciaChartInstance.destroy();
    }

    tendenciaChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tendencia.meses,
            datasets: [
                {
                    label: 'Costo Evitado (Millones)',
                    data: tendencia.evitado,
                    borderColor: '#10b981', // var(--color-success)
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointRadius: 4
                },
                {
                    label: 'Costo Potencial Identificado (Millones)',
                    data: tendencia.identificado,
                    borderColor: '#3b82f6', // var(--color-blue)
                    borderDash: [5, 5],
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) {
                                label += '$' + context.parsed.y + ' MM';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) { return '$' + value + 'M'; }
                    }
                },
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

// NUEVAS FUNCIONES PARA DEMOGRAFÍA Y TENDENCIA DE USUARIOS

function renderDemografia(demo) {
    const ctxGen = document.getElementById('generoChart');
    const ctxEdad = document.getElementById('edadChart');

    if (ctxGen && demo && demo.genero) {
        if (generoChartInstance) {
            generoChartInstance.destroy();
        }
        generoChartInstance = new Chart(ctxGen, {
            type: 'doughnut',
            data: {
                labels: demo.genero.labels,
                datasets: [{
                    data: demo.genero.data,
                    backgroundColor: ['#e879f9', '#38bdf8', '#94a3b8'],
                    borderWidth: filtroChartGenero ? 2 : 0, // Resaltar si hay filtro
                    borderColor: '#ffffff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 11 } } },
                    tooltip: { 
                        callbacks: { 
                            label: function(c) { 
                                const total = c.dataset.data.reduce((a, b) => a + b, 0);
                                const val = c.raw;
                                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                return c.label + ': ' + val.toLocaleString('es-CO') + ' pac (' + pct + '%)'; 
                            } 
                        } 
                    },
                    title: {
                        display: !!filtroChartGenero,
                        text: filtroChartGenero ? 'Filtro: ' + filtroChartGenero + ' (Click para quitar)' : '',
                        color: '#f87171'
                    }
                },
                onClick: (e, activeEls) => {
                    if (activeEls.length > 0) {
                        const index = activeEls[0].index;
                        const labelClicked = demo.genero.labels[index];
                        if (filtroChartGenero === labelClicked) {
                            filtroChartGenero = null; // Quitar filtro
                        } else {
                            filtroChartGenero = labelClicked; // Aplicar filtro
                        }
                        aplicarFiltrosYRenderizar();
                    } else if (filtroChartGenero) {
                        filtroChartGenero = null; // Quitar filtro si da click afuera
                        aplicarFiltrosYRenderizar();
                    }
                }
            }
        });
    }

    if (ctxEdad && demo && demo.grupoEtareo) {
        if (edadChartInstance) {
            edadChartInstance.destroy();
        }
        edadChartInstance = new Chart(ctxEdad, {
            type: 'bar',
            data: {
                labels: demo.grupoEtareo.labels,
                datasets: [{
                    label: 'Pacientes',
                    data: demo.grupoEtareo.data,
                    backgroundColor: demo.grupoEtareo.labels.map(l => l === filtroChartEdad ? 'rgba(245, 158, 11, 0.9)' : 'rgba(16, 185, 129, 0.8)'), // Resaltar si hay filtro
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: { 
                        callbacks: { 
                            label: function(c) { 
                                const total = c.dataset.data.reduce((a, b) => a + b, 0);
                                const val = c.raw;
                                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                return val.toLocaleString('es-CO') + ' pac (' + pct + '%)'; 
                            } 
                        } 
                    },
                    title: {
                        display: !!filtroChartEdad,
                        text: filtroChartEdad ? 'Filtro: ' + filtroChartEdad + ' (Click para quitar)' : '',
                        color: '#f87171'
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#cbd5e1' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#cbd5e1', callback: v => v.toLocaleString('es-CO') } }
                },
                onClick: (e, activeEls) => {
                    if (activeEls.length > 0) {
                        const index = activeEls[0].index;
                        const labelClicked = demo.grupoEtareo.labels[index];
                        if (filtroChartEdad === labelClicked) {
                            filtroChartEdad = null; // Quitar filtro
                        } else {
                            filtroChartEdad = labelClicked; // Aplicar filtro
                        }
                        aplicarFiltrosYRenderizar();
                    } else if (filtroChartEdad) {
                        filtroChartEdad = null; // Quitar filtro si da click afuera
                        aplicarFiltrosYRenderizar();
                    }
                }
            }
        });
    }
}

function renderTendenciaUsuarios(tendencia) {
    const ctx = document.getElementById('tipoUsuarioChart');
    if (!ctx || !tendencia) return;

    if (tipoUsuarioChartInstance) {
        tipoUsuarioChartInstance.destroy();
    }

    tipoUsuarioChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tendencia.meses,
            datasets: [
                {
                    label: 'Usuarios Prevalentes',
                    data: tendencia.prevalentes,
                    borderColor: '#3b82f6', // Azul
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#3b82f6'
                },
                {
                    label: 'Usuarios Incidentes',
                    data: tendencia.incidentes,
                    borderColor: '#f59e0b', // Naranja/Ambar
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3,
                    pointBackgroundColor: '#f59e0b'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top', labels: { color: '#cbd5e1', font: { size: 11 } } }
            },
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#cbd5e1' } },
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#cbd5e1' } }
            }
        }
    });
}
