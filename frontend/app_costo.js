// app_costo.js
// Lógica para renderizar el Módulo de Costo Evitado

document.addEventListener("DOMContentLoaded", () => {
    initCostoEvitado();
});

let patientMinDateMap = new Map();

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

    // Render inicial
    aplicarFiltrosYRenderizar();

    // Listeners para los filtros
    document.getElementById('filter-fecha-inicio').addEventListener('change', aplicarFiltrosYRenderizar);
    document.getElementById('filter-fecha-fin').addEventListener('change', aplicarFiltrosYRenderizar);
    
    // El resto de la interactividad
    setupEventListeners();
}

function aplicarFiltrosYRenderizar() {
    const data = window.COSTO_DATA;
    let filteredRaw = data.raw || [];
    
    // Obtener valores de fecha
    const fInicio = document.getElementById('filter-fecha-inicio').value;
    const fFin = document.getElementById('filter-fecha-fin').value;
    
    // Filtrar la data raw
    if (fInicio || fFin) {
        filteredRaw = filteredRaw.filter(row => {
            const rowDateStr = row.fecha; // Ej: "14/08/2025"
            let rowDate = rowDateStr;
            // Convertir formato DD/MM/YYYY a YYYY-MM-DD para poder comparar > y <
            if (rowDateStr && rowDateStr.includes("/")) {
                const p = rowDateStr.split("/");
                if (p.length === 3) {
                    rowDate = `${p[2]}-${p[1]}-${p[0]}`;
                }
            }

            if (fInicio && rowDate < fInicio) return false;
            if (fFin && rowDate > fFin) return false;
            return true;
        });
    }

    // Calcular KPIs Dinámicos
    let sumaVentas = 0;
    const pacientesSet = new Set();
    const generoCount = { "Femenino": 0, "Masculino": 0, "Otro": 0 };
    
    filteredRaw.forEach(row => {
        sumaVentas += row.valor_venta || 0;
        if (row.paciente_id) pacientesSet.add(row.paciente_id);
        
        let gen = row.genero;
        if (gen === 'F') generoCount["Femenino"]++;
        else if (gen === 'M') generoCount["Masculino"]++;
        else generoCount["Otro"]++;
    });

    const numPacientes = pacientesSet.size;
    const ahorroId = sumaVentas * 0.15;
    const ahorroGest = sumaVentas * 0.10;

    let prevalentes = 0;
    let incidentes = 0;

    pacientesSet.forEach(pid => {
        const firstEver = patientMinDateMap.get(pid);
        // Si hay una fecha de inicio seleccionada y la primera consulta fue antes de esa fecha = PREVALENTE
        if (fInicio && firstEver < fInicio) {
            prevalentes++;
        } else {
            // Si su primera consulta es dentro del rango (o no hay filtro) = INCIDENTE
            incidentes++;
        }
    });

    // Actualizar Tarjetas KPI
    const elId = document.getElementById('kpi-identificado');
    if(elId) elId.innerText = '$ ' + ahorroId.toLocaleString('es-CO', {maximumFractionDigits: 0});
    
    const elGest = document.getElementById('kpi-gestionado');
    if(elGest) elGest.innerText = '$ ' + ahorroGest.toLocaleString('es-CO', {maximumFractionDigits: 0});
    
    const elPac = document.getElementById('kpi-pacientes');
    if(elPac) elPac.innerText = numPacientes.toLocaleString('es-CO');
    
    // Actualizar KPIs de Prevalencia e Incidencia (se usan los IDs existentes del HTML temporalmente)
    const kpiPrev = document.getElementById('kpi-con-int');
    if(kpiPrev) kpiPrev.innerText = prevalentes.toLocaleString('es-CO');
    
    const kpiInc = document.getElementById('kpi-sin-int');
    if(kpiInc) kpiInc.innerText = incidentes.toLocaleString('es-CO');
    
    // Actualizar Demografía Dinámicamente
    renderDemografia({
        labels: ["Femenino", "Masculino", "Otro"],
        data: [generoCount["Femenino"], generoCount["Masculino"], Math.max(1, generoCount["Otro"])]
    });

    // Renderizar los demás gráficos y tablas con los datos estáticos/simulados
    renderTendenciaUsuarios(data.tendenciaUsuarios || {meses:[], prevalentes:[], incidentes:[]});
    renderTendenciaChart(data.tendenciaMensual || {meses:[], identificado:[], evitado:[]});
    renderTopInteracciones(data.topInteracciones);
    renderTopPacientes(data.topPacientes);
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

function renderTendenciaChart(tendencia) {
    const ctx = document.getElementById('tendenciaChart');
    if (!ctx) return;

    new Chart(ctx, {
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
        new Chart(ctxGen, {
            type: 'doughnut',
            data: {
                labels: demo.genero.labels,
                datasets: [{
                    data: demo.genero.data,
                    backgroundColor: ['#e879f9', '#38bdf8', '#94a3b8'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 11 } } },
                    tooltip: { callbacks: { label: function(c) { return c.label + ': ' + c.raw + '%'; } } }
                }
            }
        });
    }

    if (ctxEdad && demo && demo.grupoEtareo) {
        new Chart(ctxEdad, {
            type: 'bar',
            data: {
                labels: demo.grupoEtareo.labels,
                datasets: [{
                    label: '% Población',
                    data: demo.grupoEtareo.data,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#cbd5e1' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#cbd5e1', callback: v => v + '%' } }
                }
            }
        });
    }
}

function renderTendenciaUsuarios(tendencia) {
    const ctx = document.getElementById('tipoUsuarioChart');
    if (!ctx || !tendencia) return;

    new Chart(ctx, {
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
