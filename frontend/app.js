window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error("Contratos360 Error:", msg, "at", url, ":", lineNo);
    const statusText = document.getElementById('data-status');
    if (statusText) {
        statusText.textContent = "ERROR INTERNO";
        statusText.parentElement.style.background = "rgba(239, 68, 68, 0.1)";
        statusText.parentElement.style.borderColor = "rgba(239, 68, 68, 0.3)";
        statusText.style.color = "var(--color-danger)";
    }
    const indicator = document.getElementById('upload-indicator');
    if (indicator) {
        indicator.textContent = String(msg).substring(0, 40);
        indicator.className = "value font-mono text-danger";
    }
    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("APP INIT v20");
    // ----------------------------------------------------
    // Autenticación Backend Segura
    // ----------------------------------------------------
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    // Verificar si ya hay sesión activa
    fetch('/api/check-session')
        .then(res => res.json())
        .then(data => {
            console.log("=== TRACE: check-session finished. logged_in:", data.logged_in, "===");
            if (data.logged_in) {
                if(loginModal) {
                    loginModal.style.display = 'none';
                    loginModal.classList.remove('active');
                }
                loadFromAPI();
            } else {
                if(loginModal) {
                    loginModal.style.display = 'flex';
                    loginModal.style.opacity = '1';
                    loginModal.style.pointerEvents = 'auto';
                    loginModal.classList.add('active');
                }
                console.log("=== TRACE: Modal set to flex and active ===");
            }
        })
        .catch(err => {
            console.warn("No se pudo conectar con el servidor backend. Ejecutando en modo local/demo.", err);
            if(loginModal) {
                loginModal.style.display = 'none';
                loginModal.classList.remove('active');
            }
            loadFromAPI(); // Intentar API o fallback a Demo
        });

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            loginError.textContent = "Verificando...";

            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Credenciales inválidas");
                }
                return res.json();
            })
            .then(data => {
                if(loginModal) {
                    loginModal.style.display = 'none';
                    loginModal.classList.remove('active');
                }
                loadFromAPI(); // Cargar datos reales
            })
            .catch(err => {
                loginError.textContent = err.message;
            });
        });
    }

    // ----------------------------------------------------
    // Datos de Demostración por Defecto (Mock Data)
    // ----------------------------------------------------
    const DEFAULT_CONTRATOS = [        { id: "CO-2026-001", contratista: "Consorcio Vial Andino", objeto: "Pavimentación y mantenimiento corridor vial sector norte", valor: 4500000000, cupoUsuarioBolsaGral: 5000000, bolsaComplementaria: 25000000, estado: "En Ejecución", tipo: "Obra", contratante: "Colsánitas", colectivo: "Corporativo A", colectivoBeneficiado: "Corporativo A", plan: "Platino", tipoContratacion: "Colectiva", fechaInicio: new Date("2025-01-15"), fechaFin: new Date("2026-08-30"), coberturas: [{ tipo: "Vademecum Cerrado", descripcion: "Medicamentos y fitoterapéuticos autorizados" }, { tipo: "Fuera de Vademecum", descripcion: "Fórmulas magistrales asociadas" }] },
        { id: "CO-2026-002", contratista: "Soluciones Digitales S.A.S.", objeto: "Desarrollo e implementación del núcleo transaccional ERP", valor: 1200000000, cupoUsuarioBolsaGral: 0, bolsaComplementaria: 0, estado: "En Ejecución", tipo: "Servicios", contratante: "Colmédica", colectivo: "Pyme B", colectivoBeneficiado: "Pyme B", plan: "Gold", tipoContratacion: "Directa", fechaInicio: new Date("2025-06-10"), fechaFin: new Date("2026-06-30"), coberturas: [{ tipo: "Vademecum Abierto", descripcion: "Medicamentos comerciales vigentes" }] },
        { id: "CO-2026-003", contratista: "Concreto & Estructuras Ltda", objeto: "Cimentación y pilotaje de la nueva torre administrativa", valor: 2800000000, cupoUsuarioBolsaGral: 10000000, bolsaComplementaria: 50000000, estado: "Liquidado", tipo: "Obra", contratante: "Coomeva", colectivo: "Corporativo A", colectivoBeneficiado: "Corporativo A", plan: "Premium", tipoContratacion: "Colectiva", fechaInicio: new Date("2024-03-20"), fechaFin: new Date("2025-12-15"), coberturas: [{ tipo: "Vademecum Cerrado", descripcion: "Medicamentos preventivos y de urgencias" }] },
        { id: "CO-2026-004", contratista: "Consultoría Ambiental Verde", objeto: "Estudios de impacto ambiental fase III cuenca central", valor: 350000000, cupoUsuarioBolsaGral: 2000000, bolsaComplementaria: 5000000, estado: "En Ejecución", tipo: "Consultoría", contratante: "Colsánitas", colectivo: "Individual C", colectivoBeneficiado: "Individual C", plan: "Estándar", tipoContratacion: "Familiar", fechaInicio: new Date("2026-02-01"), fechaFin: new Date("2026-11-30"), coberturas: [{ tipo: "Vademecum Abierto", descripcion: "Atención domiciliaria y fitoterapéuticos" }] },
        { id: "CO-2026-005", contratista: "Suministros Médicos del País", objeto: "Dotación de equipos de alta complejidad hospitalaria", valor: 1950000000, cupoUsuarioBolsaGral: 3000000, bolsaComplementaria: 12000000, estado: "Suspendido", tipo: "Suministro", contratante: "Medplus", colectivo: "Corporativo A", colectivoBeneficiado: "Corporativo A", plan: "Gold", tipoContratacion: "Colectiva", fechaInicio: new Date("2025-09-01"), fechaFin: new Date("2026-05-15"), coberturas: [{ tipo: "Cobertura Triple A", descripcion: "Medicamentos oncológicos y especiales" }] },
        { id: "CO-2026-006", contratista: "Logística y Transporte Central", objeto: "Distribución de insumos operativos regionales", valor: 880000000, cupoUsuarioBolsaGral: 0, bolsaComplementaria: 0, estado: "En Ejecución", tipo: "Servicios", contratante: "Colmédica", colectivo: "Pyme B", colectivoBeneficiado: "Pyme B", plan: "Estándar", tipoContratacion: "Directa", fechaInicio: new Date("2025-10-01"), fechaFin: new Date("2026-09-30"), coberturas: [{ tipo: "Vademecum Abierto", descripcion: "Medicamentos básicos genéricos" }] },
        { id: "CO-2026-007", contratista: "Seguridad Privada Centinela", objeto: "Vigilancia física de sedes operacionales", valor: 540000000, cupoUsuarioBolsaGral: 0, bolsaComplementaria: 0, estado: "Liquidado", tipo: "Servicios", contratante: "Coomeva", colectivo: "Individual C", colectivoBeneficiado: "Individual C", plan: "Premium", tipoContratacion: "Familiar", fechaInicio: new Date("2024-12-01"), fechaFin: new Date("2025-11-30"), coberturas: [{ tipo: "Vademecum Cerrado", descripcion: "Límite mensual por grupo familiar" }] },
        { id: "CO-2026-008", contratista: "Aceros e Insumos Industriales", objeto: "Provisión de perfiles metálicos y varillas corrugadas", valor: 260000000, cupoUsuarioBolsaGral: 1000000, bolsaComplementaria: 3000000, estado: "En Ejecución", tipo: "Suministro", contratante: "Colsánitas", colectivo: "Corporativo A", colectivoBeneficiado: "Corporativo A", plan: "Estándar", tipoContratacion: "Colectiva", fechaInicio: new Date("2026-03-01"), fechaFin: new Date("2026-07-15"), coberturas: [{ tipo: "Cobertura Triple A", descripcion: "Medicamentos vitales no disponibles" }] }
    ];

    // Variables de control de Mapa y Marcadores
    let leafletMap = null;
    let mapMarkers = [];
    let leafletModalMap = null;
    let modalMapMarkers = [];

    // ----------------------------------------------------
    // Estado de la Aplicación
    // ----------------------------------------------------
    const state = {
        contratosBase: [...DEFAULT_CONTRATOS], // Base de datos activa
        contratosFiltrados: [...DEFAULT_CONTRATOS], // Filtrados
        isDemo: true,
        today: new Date("2026-06-24"),
        
        selectedContractId: null,
        
        nodes: {},
        particles: [],
        
        detectedHeaders: [],
        
        mappings: {
            id: "",
            contratista: "",
            objeto: "",
            valor: "",
            estado: "",
            tipo: "",
            contratante: "",
            colectivo: "",
            colectivoBeneficiado: "",
            plan: "",
            tipoContratacion: "",
            fechaInicio: "",
            fechaFin: ""
        },

        totals: {
            count: 0,
            value: 0,
            criticalCount: 0,
            statusBreakdown: {},
            topContractors: []
        }
    };

    // Matriz de Sinónimos Ampliada para Detección Silenciosa e Inteligente
    const SYNONYMS = {
        id: ['contrato', 'numero', 'codigo', 'id', 'no.', 'nro', 'consecutivo', 'identificacion', 'referencia', 'n°', 'num', 'numero de contrato', 'numero_de_contrato', 'no. contrato', 'numero de contrato'],
        contratista: ['contratista', 'proveedor', 'empresa', 'tercero', 'adjudicatario', 'nombre contratista', 'razon social', 'nombre_contratista', 'proveedor/contratista'],
        objeto: ['objeto', 'descripcion', 'detalle', 'nombre', 'asunto', 'finalidad', 'objeto_del_contrato', 'objeto del contrato', 'descripcion del objeto', 'objeto contractual', 'alcance'],
        valor: ['valor', 'monto', 'presupuesto', 'costo', 'precio', 'total', 'cuantia', 'valor contrato', 'importe', 'valor_contrato', 'valor_total', 'valor total', 'valor inicial', 'valor_inicial', 'bolsa', 'bolsa contratada', 'valor bolsa', 'bolsa_contratada', 'valor bolsa contratada', 'valor bolsa gral', 'valor_bolsa_gral'],
        estado: ['estado', 'situacion', 'fase', 'etapa', 'estado_actual', 'estado actual', 'estado de contrato', 'estado del contrato', 'activo/inactivo', 'estado actualizacion', 'estado_actualizacion'],
        tipo: ['tipo', 'modalidad', 'clase', 'tipo contrato', 'regimen', 'tipo_contrato', 'clase de contrato', 'clase_de_contrato'],
        contratante: ['contratante', 'compania', 'compania medicina prepagada', 'compania_medicina_prepagada', 'prepagada', 'eps', 'aseguradora', 'cliente', 'compañia medicina prepagada', 'compañía medicina prepagada'],
        colectivo: ['colectivo', 'grupo', 'unidad', 'centro de costo', 'area', 'categoria', 'colectivos', 'centro_costo', 'centro de costos', 'colectivo contratante', 'colectivo_contratante'],
        colectivoBeneficiado: ['colectivo beneficiado', 'colectivo_beneficiado', 'beneficiado', 'colectivo de beneficiarios', 'beneficiados', 'colectivo beneficiado', 'colectivo_beneficiado'],
        plan: ['plan', 'planes', 'tipo de plan', 'tipo_de_plan', 'cobertura'],
        tipoContratacion: ['tipo de contratacion', 'tipo_de_contratacion', 'tipo contratacion', 'tipo_contratacion', 'modalidad contratacion', 'modalidad de contratación', 'tipo de contratación', 'tipo_de_contratación'],
        fechaInicio: ['fecha inicio', 'inicio', 'fecha_inicio', 'desde', 'fecha suscripcion', 'fecha firma', 'fecha_de_inicio', 'fecha de inicio', 'fecha_suscripcion', 'inicio vigencia', 'inicio_vigencia'],
        fechaFin: ['fecha fin', 'fecha de fin', 'vencimiento', 'fecha vencimiento', 'hasta', 'fecha_fin', 'fecha terminacion', 'fecha_de_vencimiento', 'fecha de vencimiento', 'plazo fin', 'plazo_fin', 'terminacion', 'fecha de terminacion', 'fin vigencia', 'fin_vigencia']
    };

    // DOM Elements
    const elements = {
        time: document.getElementById('time-display'),
        date: document.getElementById('date-display'),
        dataStatus: document.getElementById('data-status'),
        statusDot: document.getElementById('status-dot-indicator'),
        uploadIndicator: document.getElementById('upload-indicator'),
        xlsxLoadStatus: document.getElementById('xlsx-load-status'),
        
        // Buscador
        searchInput: document.getElementById('contract-search-input'),
        searchDropdown: document.getElementById('search-results-dropdown'),
        
        // Filtros
        filterContratante: document.getElementById('filter-contratante'),
        filterColectivo: document.getElementById('filter-colectivo'),
        displayPlan: document.getElementById('display-plan'),
        filterTipoContratacion: document.getElementById('filter-tipo-contratacion'),
        filterRegional: document.getElementById('filter-regional'),
        resetFiltersBtn: document.getElementById('reset-filters-btn'),
        
        // Métricas
        metricTotalContracts: document.getElementById('metric-total-contracts'),
        metricTotalValue: document.getElementById('metric-total-value'),
        metricCupoBolsa: document.getElementById('metric-cupo-bolsa'),
        metricBolsaComplementaria: document.getElementById('metric-bolsa-complementaria'),
        metricPoblacionTotal: document.getElementById('metric-poblacion-total'),
        metricPoblacionMP: document.getElementById('metric-poblacion-mp'),
        metricPoblacionCompartida: document.getElementById('metric-poblacion-compartida'),
        metricCriticalContracts: document.getElementById('metric-critical-contracts'),
        
        // Fichas
        aggregatedCard: document.getElementById('aggregated-summary-card'),
        detailCard: document.getElementById('contract-detail-card'),
        detailColectivo: document.getElementById('detail-card-colectivo'),
        detailId: document.getElementById('detail-card-id'),
        detailStatus: document.getElementById('detail-card-status'),
        detailContratista: document.getElementById('detail-card-contratista'),
        detailBolsa: document.getElementById('detail-card-bolsa'),
        detailObjeto: document.getElementById('detail-card-objeto'),
        detailDateStart: document.getElementById('detail-card-date-start'),
        detailDateEnd: document.getElementById('detail-card-date-end'),
        detailTimelineFill: document.getElementById('detail-card-timeline-fill'),
        detailDaysLeft: document.getElementById('detail-card-days-left'),
        detailPoblacionTotal: document.getElementById('detail-poblacion-total'),
        detailPoblacionMP: document.getElementById('detail-poblacion-mp'),
        detailPoblacionCompartida: document.getElementById('detail-poblacion-compartida'),
        clearFilterBtn: document.getElementById('clear-filter-btn'),
        
        // Paneles laterales
        statusBarStack: document.getElementById('status-bar-stack'),
        statusLegendList: document.getElementById('status-legend-list'),
        contractorLeaderboard: document.getElementById('contractor-leaderboard'),
        ledger: document.getElementById('ledger-list'),
        
        // Canvases
        flowCanvas: document.getElementById('flow-canvas'),
        trendCanvas: document.getElementById('trend-canvas')
    };

    // Logger simple para Consola de Desarrollo
    function addLog(message, type = 'info') {
        console.log(`[Contratos360][${type.toUpperCase()}] ${message}`);
    }

    // Formateador de Moneda Colombiana (COP)
    function formatCOP(val) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);
    }
    
    function formatCOPShort(val) {
        if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B COP`;
        if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M COP`;
        return `$${val.toLocaleString('es-CO')} COP`;
    }

    // ----------------------------------------------------
    // Carga de Excel Directo y Fallback
    // ----------------------------------------------------
    function loadExcelDirectly() {
        return fetch('CARACTERIZACIÓN CONTRATOS.xlsx')
            .then(response => {
                if (!response.ok) throw new Error("Archivo de Excel directo no disponible vía HTTP/CORS.");
                return response.arrayBuffer();
            })
            .then(buffer => {
                const data = new Uint8Array(buffer);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Intentar abrir la hoja CONTRATOS, de lo contrario la primera disponible
                let sheetName = "CONTRATOS";
                if (!workbook.SheetNames.includes(sheetName)) {
                    sheetName = workbook.SheetNames[0];
                }
                
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                
                if (!jsonData || jsonData.length === 0) {
                    throw new Error("La hoja de Excel está vacía.");
                }

                window.CONTRATOS_DATA = jsonData;
                if (elements.dataStatus) {
                    elements.dataStatus.textContent = "DATOS: EXCEL DIRECTO";
                    if (elements.dataStatus.parentElement) {
                        elements.dataStatus.parentElement.style.background = "rgba(16, 185, 129, 0.08)";
                        elements.dataStatus.parentElement.style.borderColor = "rgba(16, 185, 129, 0.2)";
                    }
                    elements.dataStatus.style.color = "var(--color-primary)";
                }
                if (elements.statusDot) elements.statusDot.className = "status-dot pulsing text-primary";
                if (elements.uploadIndicator) {
                    elements.uploadIndicator.textContent = "CONECTADO (DIRECTO)";
                    elements.uploadIndicator.className = "value font-mono text-primary";
                }
                if (elements.xlsxLoadStatus) elements.xlsxLoadStatus.textContent = "DIRECTO (XLSX)";

                state.detectedHeaders = Object.keys(window.CONTRATOS_DATA[0]);
                populateMappingSelectors();
                autoApplyMappingAndClose();

                addLog(`Excel cargado directamente. ${window.CONTRATOS_DATA.length} registros cargados de la hoja "${sheetName}".`, 'success');
                return true;
            });
    }

    function loadFromAPI() {
        console.log("=== TRACE: loadFromAPI called! Fetching /api/contratos ===");
        fetch('/api/contratos')
            .then(response => {
                console.log("=== TRACE: /api/contratos responded. ok:", response.ok, "===");
                if (!response.ok) throw new Error("API No autorizada o no disponible");
                return response.json();
            })
            .then(data => {
                console.log("=== TRACE: /api/contratos parsed JSON. length:", data?.contratos?.length, "===");
                if (data && data.contratos && Array.isArray(data.contratos) && data.contratos.length > 0) {
                    window.CONTRATOS_DATA = data.contratos;
                    if (data.droguerias) {
                        window.DROGUERIAS_DATA = data.droguerias;
                    }
                    if (data.daneToRegional) {
                        window.DANE_TO_REGIONAL = data.daneToRegional;
                    }
                    if (elements.dataStatus) {
                        elements.dataStatus.textContent = "DATOS: API SEGURA";
                        if (elements.dataStatus.parentElement) {
                            elements.dataStatus.parentElement.style.background = "rgba(16, 185, 129, 0.08)";
                            elements.dataStatus.parentElement.style.borderColor = "rgba(16, 185, 129, 0.2)";
                        }
                        elements.dataStatus.style.color = "var(--color-primary)";
                    }
                    if (elements.statusDot) elements.statusDot.className = "status-dot pulsing text-primary";
                    if (elements.uploadIndicator) {
                        elements.uploadIndicator.textContent = "CONECTADO (API)";
                        elements.uploadIndicator.className = "value font-mono text-primary";
                    }
                    if (elements.xlsxLoadStatus) elements.xlsxLoadStatus.textContent = "SERVIDOR";

                    state.detectedHeaders = Object.keys(window.CONTRATOS_DATA[0]);
                    populateMappingSelectors();
                    autoApplyMappingAndClose();

                    addLog(`Datos cargados desde API Segura. ${window.CONTRATOS_DATA.length} registros conectados.`, 'success');
                    
                    // Ahora procesamos los datos
                    initDataLoader();
                } else {
                    throw new Error("Datos vacíos en API");
                }
            })
            .catch(err => {
                console.error("Error fatal en loadFromAPI o initDataLoader:", err);
                // Fallback a Demo si la API falla o está vacía
                if (elements.dataStatus) {
                    elements.dataStatus.textContent = "DATOS: DEMO";
                    if (elements.dataStatus.parentElement) {
                        elements.dataStatus.parentElement.style.background = "rgba(245, 158, 11, 0.06)";
                        elements.dataStatus.parentElement.style.borderColor = "rgba(245, 158, 11, 0.15)";
                    }
                    elements.dataStatus.style.color = "var(--color-warn)";
                }
                if (elements.statusDot) elements.statusDot.className = "status-dot pulsing text-warn";
                if (elements.uploadIndicator) {
                    elements.uploadIndicator.textContent = "MOCK ACTIVO";
                    elements.uploadIndicator.className = "value font-mono text-warn";
                }
                if (elements.xlsxLoadStatus) elements.xlsxLoadStatus.textContent = "DEMOSTRACIÓN";
                
                state.contratosBase = [...DEFAULT_CONTRATOS];
                state.contratosFiltrados = [...DEFAULT_CONTRATOS];
                state.isDemo = true;
                
                populateFilterDropdowns();
                recalculateAnalytics();
                initCanvasNodes();

                addLog("No se pudo cargar desde API Segura. Cargando datos de demostración en español.", "warning");
            });
    }

    function initDataLoader() {
        if (window.CONTRATOS_DATA && Array.isArray(window.CONTRATOS_DATA) && window.CONTRATOS_DATA.length > 0) {
            const jsonData = window.CONTRATOS_DATA;
            state.contratosBase = jsonData.map(c => {
                let cob = c.coberturas || [];
                return {
                    ...c,
                    coberturas: cob,
                    fechaInicio: parseDate(c.fechaInicio),
                    fechaFin: parseDate(c.fechaFin)
                };
            });
            state.contratosFiltrados = [...state.contratosBase];
            state.isDemo = false;
            state.selectedContractId = null;

            if (elements.dataStatus) {
                elements.dataStatus.textContent = "DATOS: BIGQUERY (PYTHON)";
                if (elements.dataStatus.parentElement) {
                    elements.dataStatus.parentElement.style.background = "rgba(16, 185, 129, 0.08)";
                    elements.dataStatus.parentElement.style.borderColor = "rgba(16, 185, 129, 0.2)";
                }
                elements.dataStatus.style.color = "var(--color-primary)";
            }

            populateFilterDropdowns();
            clearIndividualFilter();
            recalculateAnalytics();
            initCanvasNodes();

            addLog(`Datos cargados desde BigQuery (Python). ${jsonData.length} registros conectados.`, 'success');
        } else {
            addLog(`No se pudo cargar la data de Python. Ejecuta main.py primero.`, 'error');
        }
    }

    // ----------------------------------------------------
    // Mapeo Dinámico Silencioso
    // ----------------------------------------------------
    function populateMappingSelectors() {
        const props = Object.keys(state.mappings);
        
        props.forEach(targetProp => {
            // Auto-detectar basándose en sinónimos y cabeceras limpias
            let autoMatched = "";
            for (let i = 0; i < state.detectedHeaders.length; i++) {
                const hdr = state.detectedHeaders[i];
                // Limpieza agresiva de caracteres especiales, guiones y múltiples espacios
                const cleanHdr = hdr.toLowerCase().trim().replace(/[\s_-]+/g, ' ').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                
                if (SYNONYMS[targetProp].includes(cleanHdr)) {
                    autoMatched = hdr;
                    break;
                }
            }
            
            // Búsqueda parcial de respaldo si no hay coincidencia exacta
            if (!autoMatched) {
                for (let i = 0; i < state.detectedHeaders.length; i++) {
                    const hdr = state.detectedHeaders[i];
                    const cleanHdr = hdr.toLowerCase().trim().replace(/[\s_-]+/g, ' ').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const partialMatch = SYNONYMS[targetProp].some(keyword => cleanHdr.includes(keyword));
                    if (partialMatch) {
                        autoMatched = hdr;
                        break;
                    }
                }
            }
            
            state.mappings[targetProp] = autoMatched;
        });
    }

    function autoApplyMappingAndClose() {
        // Garantizar mapeos de contratista y valor si falló el escaneo por sinónimos
        if (!state.mappings.contratista) {
            state.mappings.contratista = state.detectedHeaders.find(h => {
                const clean = h.toLowerCase().trim();
                return clean.includes('proveedor') || clean.includes('contratista') || clean.includes('empresa') || clean.includes('nombre');
            }) || state.detectedHeaders[1] || "";
        }
        if (!state.mappings.valor) {
            state.mappings.valor = state.detectedHeaders.find(h => {
                const clean = h.toLowerCase().trim();
                return clean.includes('valor') || clean.includes('monto') || clean.includes('bolsa') || clean.includes('presupuesto') || clean.includes('total');
            }) || state.detectedHeaders[3] || "";
        }

        applyMappingLogic();
    }

    function applyMappingLogic() {
        const processedContracts = window.CONTRATOS_DATA.map((row, index) => {
            const idVal = row[state.mappings.id];
            const contratistaVal = row[state.mappings.contratista];
            const objetoVal = row[state.mappings.objeto];
            const valorVal = row[state.mappings.valor];
            const estadoVal = row[state.mappings.estado];
            const tipoVal = row[state.mappings.tipo];
            const contratanteVal = row[state.mappings.contratante];
            const colectivoVal = row[state.mappings.colectivo];
            const colectivoBenefVal = row[state.mappings.colectivoBeneficiado];
            const planVal = row[state.mappings.plan];
            const tipoContrVal = row[state.mappings.tipoContratacion];
            const fFinVal = row[state.mappings.fechaFin];
            const fInicioVal = row[state.mappings.fechaInicio];

            const valor = parseNumericValue(valorVal);
            const cupoVal = row["CUPO USUARIO BOLSA GRAL"];
            const bolsaCompVal = row["BOLSA COMPLEMENTARIA"];
            const cupoUsuarioBolsaGral = parseNumericValue(cupoVal);
            const bolsaComplementaria = parseNumericValue(bolsaCompVal);
            
            let estado = estadoVal ? String(estadoVal).trim() : "En Ejecución";
            const cleanEst = estado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (cleanEst.includes("ejecucion") || cleanEst.includes("activo") || cleanEst.includes("active") || cleanEst === "si" || cleanEst.includes("vigent")) {
                estado = "En Ejecución";
            } else if (cleanEst.includes("liquid") || cleanEst.includes("termin") || cleanEst.includes("finaliz") || cleanEst.includes("complet") || cleanEst.includes("cercan") || cleanEst.includes("no")) {
                estado = "Liquidado";
            } else if (cleanEst.includes("suspend") || cleanEst.includes("pausa") || cleanEst.includes("prorrog")) {
                estado = "Suspendido";
            } else {
                estado = estado.charAt(0).toUpperCase() + estado.slice(1);
            }

            let tipo = tipoVal ? String(tipoVal).trim() : "Servicios";
            tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1);

            return {
                id: idVal ? String(idVal).trim() : `C-${index + 1}`,
                contratista: contratistaVal ? String(contratistaVal).trim() : "Sin Contratista",
                objeto: objetoVal ? String(objetoVal).trim() : "Sin Objeto Especificado",
                valor: valor,
                cupoUsuarioBolsaGral: cupoUsuarioBolsaGral,
                bolsaComplementaria: bolsaComplementaria,
                estado: estado,
                tipo: tipo,
                contratante: contratanteVal ? String(contratanteVal).trim() : "Sin Contratante",
                colectivo: colectivoVal ? String(colectivoVal).trim() : "General",
                colectivoBeneficiado: colectivoBenefVal ? String(colectivoBenefVal).trim() : (colectivoVal ? String(colectivoVal).trim() : "General"),
                plan: planVal ? String(planVal).trim() : "General",
                tipoContratacion: tipoContrVal ? String(tipoContrVal).trim() : "Directa",
                fechaInicio: parseDate(fInicioVal),
                fechaFin: parseDate(fFinVal),
                tipoCobertura: row["TIPO DE COBERTURA"] ? String(row["TIPO DE COBERTURA"]).trim() : "",
                descripcionCobertura: row["DESCRIPCIÓN COBERTURA"] ? String(row["DESCRIPCIÓN COBERTURA"]).trim() : "",
                vihHeader: row["MEDICAMENTOS TTO  VIH"] ? String(row["MEDICAMENTOS TTO  VIH"]).trim() : "N/A",
                vihSub: row["TOPE COLECTIVO ANEXO VIH"] ? String(row["TOPE COLECTIVO ANEXO VIH"]).trim() : "N/A",
                oncoHeader: row["ANEXO ONCOLÓGICO Y COADYUVANTES"] ? String(row["ANEXO ONCOLÓGICO Y COADYUVANTES"]).trim() : "N/A",
                oncoSub: row["TOPE COLECTIVO ANEXO ONCOLÓGICO"] ? String(row["TOPE COLECTIVO ANEXO ONCOLÓGICO"]).trim() : "N/A",
                prePostHeader: row["PRE Y POST HOSPITALARIO"] ? String(row["PRE Y POST HOSPITALARIO"]).trim() : "N/A",
                prePostSub: row["TOPE POST EGRESO SMMLV\n*AÑO CALENDARIO"] ? String(row["TOPE POST EGRESO SMMLV\n*AÑO CALENDARIO"]).trim() : "N/A",
                ortesisHeader: row["ÓRTESIS"] ? String(row["ÓRTESIS"]).trim() : "N/A",
                ortesisSub: row["REQUISITO COBERTURA"] ? String(row["REQUISITO COBERTURA"]).trim() : "N/A",
                coberturas: row["coberturas"] || [],
                poblacion: row["poblacion"] || 0,
                poblacionCompartida: row["poblacionCompartida"] || 0,
                poblacionSoloMP: row["poblacionSoloMP"] || 0,
                poblacionDane: row["poblacionDane"] || {}
            };
        });

        // Agrupar por Número de Contrato (id) para evitar duplicados en el tablero
        const contractMap = new Map();
        processedContracts.forEach(c => {
            if (!c.id) return;
            
            if (!contractMap.has(c.id)) {
                contractMap.set(c.id, { 
                    ...c,
                    coberturas: c.coberturas.length > 0 ? [...c.coberturas] : ((c.tipoCobertura || c.descripcionCobertura) ? [{ tipo: c.tipoCobertura, descripcion: c.descripcionCobertura }] : [])
                });
            } else {
                const existing = contractMap.get(c.id);
                // Consolidar: tomar el mayor valor o sumar
                existing.valor = Math.max(existing.valor, c.valor);
                existing.cupoUsuarioBolsaGral = Math.max(existing.cupoUsuarioBolsaGral, c.cupoUsuarioBolsaGral);
                existing.bolsaComplementaria = Math.max(existing.bolsaComplementaria, c.bolsaComplementaria);
                
                // Consolidar Población: usar Math.max para evitar duplicar si la fila se repite en Excel
                existing.poblacion = Math.max(existing.poblacion || 0, c.poblacion || 0);
                existing.poblacionCompartida = Math.max(existing.poblacionCompartida || 0, c.poblacionCompartida || 0);
                existing.poblacionSoloMP = Math.max(existing.poblacionSoloMP || 0, c.poblacionSoloMP || 0);
                
                // Consolidar DANEs
                if (c.poblacionDane) {
                    for (const [dane, stats] of Object.entries(c.poblacionDane)) {
                        if (!existing.poblacionDane[dane]) {
                            existing.poblacionDane[dane] = { total: 0, compartida: 0, solo_mp: 0 };
                        }
                        // Usar Math.max en lugar de sumar para evitar inflación por filas duplicadas
                        existing.poblacionDane[dane].total = Math.max(existing.poblacionDane[dane].total || 0, stats.total || 0);
                        existing.poblacionDane[dane].compartida = Math.max(existing.poblacionDane[dane].compartida || 0, stats.compartida || 0);
                        existing.poblacionDane[dane].solo_mp = Math.max(existing.poblacionDane[dane].solo_mp || 0, stats.solo_mp || 0);
                    }
                }
                
                // Agregar detalles de coberturas dinámicas únicas del contrato
                if (c.coberturas && c.coberturas.length > 0) {
                    c.coberturas.forEach(newCov => {
                        const isDup = existing.coberturas.some(cov => cov.tipo === newCov.tipo && cov.descripcion === newCov.descripcion);
                        if (!isDup) {
                            existing.coberturas.push({ tipo: newCov.tipo, descripcion: newCov.descripcion });
                        }
                    });
                } else if (c.tipoCobertura || c.descripcionCobertura) {
                    const isDup = existing.coberturas.some(cov => cov.tipo === c.tipoCobertura && cov.descripcion === c.descripcionCobertura);
                    if (!isDup) {
                        existing.coberturas.push({ tipo: c.tipoCobertura, descripcion: c.descripcionCobertura });
                    }
                }
                
                // Consolidar otros campos si están vacíos en el registro existente
                if ((!existing.objeto || existing.objeto === "Sin Objeto Especificado") && c.objeto && c.objeto !== "Sin Objeto Especificado") {
                    existing.objeto = c.objeto;
                }
                if ((!existing.colectivoBeneficiado || existing.colectivoBeneficiado === "General") && c.colectivoBeneficiado && c.colectivoBeneficiado !== "General") {
                    existing.colectivoBeneficiado = c.colectivoBeneficiado;
                }
                if ((!existing.plan || existing.plan === "General") && c.plan && c.plan !== "General") {
                    existing.plan = c.plan;
                }
                if (!existing.fechaFin && c.fechaFin) {
                    existing.fechaFin = c.fechaFin;
                }
                if (!existing.fechaInicio && c.fechaInicio) {
                    existing.fechaInicio = c.fechaInicio;
                }
            }
        });
        
        const uniqueContracts = Array.from(contractMap.values());

        state.contratosBase = uniqueContracts;
        state.contratosFiltrados = [...uniqueContracts];
        state.isDemo = false;
        state.selectedContractId = null;

        populateFilterDropdowns();
        clearIndividualFilter();
        recalculateAnalytics();
        initCanvasNodes();
    }

    // ----------------------------------------------------
    // Buscador y Filtros Dinámicos
    // ----------------------------------------------------
    elements.filterContratante.addEventListener('change', applyExecutiveFilters);
    elements.filterColectivo.addEventListener('change', applyExecutiveFilters);
    elements.filterTipoContratacion.addEventListener('change', applyExecutiveFilters);
    if (elements.filterRegional) elements.filterRegional.addEventListener('change', applyExecutiveFilters);

    elements.resetFiltersBtn.addEventListener('click', () => {
        elements.filterContratante.value = "";
        elements.filterColectivo.value = "";
        elements.filterTipoContratacion.value = "";
        if (elements.filterRegional) elements.filterRegional.value = "";
        
        clearIndividualFilter();
        applyExecutiveFilters();
    });

    function applyExecutiveFilters() {
        const valContratante = elements.filterContratante.value;
        const valColectivo = elements.filterColectivo.value;
        const valTipoContr = elements.filterTipoContratacion.value;
        const valRegional = elements.filterRegional ? elements.filterRegional.value : "";

        state.contratosFiltrados = state.contratosBase.filter(c => {
            const matchContratante = !valContratante || c.contratante === valContratante;
            const matchColectivo = !valColectivo || c.colectivo === valColectivo;
            const matchTipo = !valTipoContr || c.tipoContratacion === valTipoContr;
            
            let matchRegional = true;
            if (valRegional && window.DANE_TO_REGIONAL && c.poblacionDane) {
                // Verificar si alguno de los DANEs del contrato pertenece a la regional seleccionada
                const danes = Object.keys(c.poblacionDane);
                matchRegional = danes.some(d => window.DANE_TO_REGIONAL[d] === valRegional);
            }
            
            return matchContratante && matchColectivo && matchTipo && matchRegional;
        });

        // Actualizar la tarjeta de PLAN dinámicamente
        if (elements.displayPlan) {
            const currentPlans = [...new Set(state.contratosFiltrados.map(c => c.plan).filter(Boolean))];
            if (currentPlans.length === 1) {
                elements.displayPlan.textContent = currentPlans[0].toUpperCase();
            } else if (currentPlans.length > 1) {
                elements.displayPlan.textContent = "MÚLTIPLE";
            } else {
                elements.displayPlan.textContent = "N/A";
            }
        }

        if (state.selectedContractId) {
            const exists = state.contratosFiltrados.some(c => c.id === state.selectedContractId);
            if (!exists) clearIndividualFilter();
        }

        recalculateAnalytics();
        initCanvasNodes();
        updatePharmaciesMapAndList();
    }

    function populateFilterDropdowns() {
        const contratantes = [...new Set(state.contratosBase.map(c => c.contratante).filter(Boolean))].sort();
        const colectivos = [...new Set(state.contratosBase.map(c => c.colectivo).filter(Boolean))].sort();
        const tiposContr = [...new Set(state.contratosBase.map(c => c.tipoContratacion).filter(Boolean))].sort();
        const regionales = window.DANE_TO_REGIONAL ? [...new Set(Object.values(window.DANE_TO_REGIONAL))].filter(Boolean).sort() : [];

        updateDropdown(elements.filterContratante, contratantes);
        updateDropdown(elements.filterColectivo, colectivos);
        updateDropdown(elements.filterTipoContratacion, tiposContr);
        if (elements.filterRegional) updateDropdown(elements.filterRegional, regionales);
    }

    function updateDropdown(selectElement, valuesList) {
        const prev = selectElement.value;
        let placeholder = "-- Todos --";
        if (selectElement.id === 'filter-contratante') placeholder = "-- Compañía --";
        else if (selectElement.id === 'filter-colectivo') placeholder = "-- Contratante --";
        else if (selectElement.id === 'filter-plan') placeholder = "-- Plan --";
        else if (selectElement.id === 'filter-tipo-contratacion') placeholder = "-- Tipo --";

        selectElement.innerHTML = `<option value="" style="color: #000;">${placeholder}</option>`;
        valuesList.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v;
            opt.textContent = v;
            opt.style.color = "#000"; // Asegurar que el texto sea visible
            selectElement.appendChild(opt);
        });
        if (valuesList.includes(prev)) selectElement.value = prev;
    }

    // Buscador en Cabecera
    // Buscador en Cabecera (Removido físicamente, lógica inactiva)
    if (elements.searchInput && elements.searchDropdown) {
        elements.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                elements.searchDropdown.style.display = 'none';
                return;
            }

            const matches = state.contratosFiltrados.filter(c => 
                c.id.toLowerCase().includes(query) || 
                c.contratista.toLowerCase().includes(query) ||
                c.objeto.toLowerCase().includes(query)
            ).slice(0, 5);

            if (matches.length > 0) {
                elements.searchDropdown.innerHTML = '';
                matches.forEach(c => {
                    const item = document.createElement('div');
                    item.className = 'search-result-item';
                    item.innerHTML = `
                        <div class="match-info">
                            <span class="match-id font-mono text-primary">${c.id}</span>
                            <span class="match-contratista">${c.contratista}</span>
                        </div>
                        <div class="match-subinfo font-mono text-secondary">${formatCOPShort(c.valor)}</div>
                    `;
                    item.addEventListener('click', () => {
                        showContractDetail(c.id);
                        elements.searchDropdown.style.display = 'none';
                        elements.searchInput.value = c.id;
                    });
                    elements.searchDropdown.appendChild(item);
                });
                elements.searchDropdown.style.display = 'block';
            } else {
                elements.searchDropdown.innerHTML = '<div class="no-results font-mono">Sin coincidencias</div>';
                elements.searchDropdown.style.display = 'block';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (elements.searchInput && elements.searchDropdown) {
            if (!elements.searchInput.contains(e.target) && !elements.searchDropdown.contains(e.target)) {
                elements.searchDropdown.style.display = 'none';
            }
        }
    });

    // ----------------------------------------------------
    // Actualizar la Barra Horizontal de Vigencia
    // ----------------------------------------------------
    function updateValidityBar(contracts, selectedContract = null) {
        const startVal = document.getElementById('validity-start-val');
        const endVal = document.getElementById('validity-end-val');
        const remainingVal = document.getElementById('validity-remaining-val');
        const alertCard = document.getElementById('validity-alert-card');
        
        if (!startVal || !endVal || !remainingVal || !alertCard) return;
        
        const formatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (selectedContract) {
            // Caso: Contrato individual seleccionado
            const c = selectedContract;
            startVal.textContent = c.fechaInicio ? c.fechaInicio.toLocaleDateString('es-CO', formatOptions) : 'N/A';
            endVal.textContent = c.fechaFin ? c.fechaFin.toLocaleDateString('es-CO', formatOptions) : 'N/A';
            
            if (c.fechaFin) {
                const diffTime = c.fechaFin - state.today;
                const diffDays = Math.ceil(diffTime / oneDay);
                
                alertCard.className = 'validity-card alert-card';
                if (diffDays < 0) {
                    remainingVal.textContent = `VENCIDO hace ${Math.abs(diffDays)} días`;
                    alertCard.classList.add('danger');
                } else if (diffDays === 0) {
                    remainingVal.textContent = 'VENCE HOY';
                    alertCard.classList.add('danger');
                } else if (diffDays <= 30) {
                    remainingVal.textContent = `QUEDAN ${diffDays} DÍAS (CRÍTICO)`;
                    alertCard.classList.add('warning');
                } else {
                    remainingVal.textContent = `QUEDAN ${diffDays} DÍAS`;
                }
            } else {
                remainingVal.textContent = 'FECHAS NO DEFINIDAS';
                alertCard.className = 'validity-card alert-card';
            }
        } else {
            // Caso: Vista general de portafolio filtrado
            const startDates = contracts.map(c => c.fechaInicio).filter(Boolean);
            const minStart = startDates.length > 0 ? new Date(Math.min(...startDates)) : null;
            
            // Encontrar el vencimiento en ejecución más cercano
            const activeEndDates = contracts
                .filter(c => c.fechaFin && c.estado === 'En Ejecución')
                .map(c => c.fechaFin);
                
            const nextEnd = activeEndDates.length > 0 ? new Date(Math.min(...activeEndDates)) : null;
            
            startVal.textContent = minStart ? minStart.toLocaleDateString('es-CO', formatOptions) : 'N/A';
            endVal.textContent = nextEnd ? nextEnd.toLocaleDateString('es-CO', formatOptions) : 'N/A';
            
            if (nextEnd) {
                const diffTime = nextEnd - state.today;
                const diffDays = Math.ceil(diffTime / oneDay);
                
                alertCard.className = 'validity-card alert-card';
                if (diffDays < 0) {
                    remainingVal.textContent = `PRÓXIMO VENCIDO (${Math.abs(diffDays)} d)`;
                    alertCard.classList.add('danger');
                } else if (diffDays === 0) {
                    remainingVal.textContent = 'PRÓXIMO VENCE HOY';
                    alertCard.classList.add('danger');
                } else if (diffDays <= 30) {
                    remainingVal.textContent = `PRÓXIMO EN ${diffDays} DÍAS (CRÍTICO)`;
                    alertCard.classList.add('warning');
                } else {
                    remainingVal.textContent = `PRÓXIMO EN ${diffDays} DÍAS`;
                }
            } else {
                remainingVal.textContent = 'SIN VENCIMIENTOS PRÓXIMOS';
                alertCard.className = 'validity-card alert-card';
            }
        }
    }

    // ----------------------------------------------------
    // Recalcular Analíticas e Indicadores Gerenciales
    // ----------------------------------------------------
    function recalculateAnalytics() {
        const contracts = state.contratosFiltrados;
        
        // 1. Total contratos
        state.totals.count = contracts.length;
        elements.metricTotalContracts.textContent = state.totals.count;
        
        // 2. Presupuesto acumulado (VALOR BOLSA GRAL)
        state.totals.value = contracts.reduce((sum, c) => sum + (c.valor || 0), 0);
        if (elements.metricTotalValue) {
            elements.metricTotalValue.textContent = formatCOP(state.totals.value);
        }
        
        // 2b. Cupo Usuario Bolsa Gral & Bolsa Complementaria
        const totalCupo = contracts.reduce((sum, c) => sum + (c.cupoUsuarioBolsaGral || 0), 0);
        if (elements.metricCupoBolsa) {
            elements.metricCupoBolsa.textContent = formatCOP(totalCupo);
        }
        
        const totalBolsaComp = contracts.reduce((sum, c) => sum + (c.bolsaComplementaria || 0), 0);
        if (elements.metricBolsaComplementaria) {
            elements.metricBolsaComplementaria.textContent = formatCOP(totalBolsaComp);
        }
        
        // 2c. Población (Total, MP, Compartidos) - Suma directa de contratos filtrados
        const valRegional = elements.filterRegional ? elements.filterRegional.value : "";
        
        let totalPoblacion = 0;
        let totalPoblacionMP = 0;
        let totalPoblacionComp = 0;
        
        contracts.forEach(c => {
            let pob = 0;
            let mp = 0;
            let comp = 0;
            
            if (valRegional && window.DANE_TO_REGIONAL && c.poblacionDane) {
                // Filtrar la población exacta que pertenece a la regional seleccionada
                for (const [dane, stats] of Object.entries(c.poblacionDane)) {
                    if (window.DANE_TO_REGIONAL[dane] === valRegional) {
                        pob += (stats.total || 0);
                        mp += (stats.solo_mp || 0);
                        comp += (stats.compartida || 0);
                    }
                }
            } else {
                // Población nacional del contrato
                pob = c.poblacion || 0;
                mp = c.poblacionSoloMP || 0;
                comp = c.poblacionCompartida || 0;
            }
            
            totalPoblacion += pob;
            totalPoblacionMP += mp;
            totalPoblacionComp += comp;
        });

        if (elements.metricPoblacionTotal) elements.metricPoblacionTotal.textContent = totalPoblacion.toLocaleString('es-CO');
        if (elements.metricPoblacionMP) elements.metricPoblacionMP.textContent = totalPoblacionMP.toLocaleString('es-CO');
        if (elements.metricPoblacionCompartida) elements.metricPoblacionCompartida.textContent = totalPoblacionComp.toLocaleString('es-CO');
        
        // 3. Alertas de vencimiento (< 30 días) (REMOVIDO POR USUARIO)
        // 4. Distribución de Estados (Barra apilada y leyenda) (REMOVIDO POR USUARIO)
        // 5. Mayores Contratistas (Leaderboard por Monto) (REMOVIDO POR USUARIO)
        // 6. Cronograma de Vencimientos (Ledger List) (REMOVIDO POR USUARIO)

        // 7. Renderizar Tabla Detallada de Contratos Filtrados
        const tableBody = document.getElementById('contracts-table-body');
        const tableCount = document.getElementById('table-contracts-count');
        if (tableCount) {
            tableCount.textContent = `${contracts.length} registro(s)`;
        }
        if (tableBody) {
            tableBody.innerHTML = '';
            contracts.forEach(c => {
                const row = document.createElement('tr');
                row.addEventListener('click', () => {
                    showContractDetail(c.id);
                });
                row.innerHTML = `
                    <td>${c.colectivoBeneficiado}</td>
                    <td class="font-mono text-primary">${c.id}</td>
                    <td class="font-mono text-success">${(c.poblacionSoloMP || 0).toLocaleString('es-CO')}</td>
                    <td class="font-mono text-secondary">${(c.poblacionCompartida || 0).toLocaleString('es-CO')}</td>
                    <td class="font-mono text-primary" style="font-weight:600;">${(c.poblacion || 0).toLocaleString('es-CO')}</td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        // 8. Actualizar barra horizontal de vigencia
        const selectedContract = state.selectedContractId ? state.contratosBase.find(c => c.id === state.selectedContractId) : null;
        updateValidityBar(contracts, selectedContract);

        // 9. Actualizar mapa y listado de droguerías
        updatePharmaciesMapAndList();
    }

    // ----------------------------------------------------
    // Detalle de Contrato Individual
    // ----------------------------------------------------
    function showContractDetail(id) {
        state.selectedContractId = id;
        const c = state.contratosBase.find(item => item.id === id);
        if (!c) return;

        elements.detailColectivo.textContent = `COLECTIVO: ${c.colectivo.toUpperCase()}`;
        
        const b = c.colectivoBeneficiado ? c.colectivoBeneficiado.toUpperCase() : c.colectivo.toUpperCase();
        const detailBeneficiado = document.getElementById('detail-card-colectivo-beneficiado');
        if (detailBeneficiado) detailBeneficiado.textContent = `COLECTIVO BENEFICIADO: ${b}`;

        if (elements.detailId) elements.detailId.textContent = `CONTRATO N° ${c.id}`;
        if (elements.detailContratista) elements.detailContratista.textContent = c.contratista.toUpperCase();
        if (elements.detailBolsa) elements.detailBolsa.textContent = formatCOP(c.valor) + " COP";
        if (elements.detailObjeto) elements.detailObjeto.textContent = c.objeto;
        
        // Populate detail population metrics
        if (elements.detailPoblacionTotal) elements.detailPoblacionTotal.textContent = (c.poblacion || 0).toLocaleString('es-CO');
        if (elements.detailPoblacionMP) elements.detailPoblacionMP.textContent = (c.poblacionSoloMP || 0).toLocaleString('es-CO');
        if (elements.detailPoblacionCompartida) elements.detailPoblacionCompartida.textContent = (c.poblacionCompartida || 0).toLocaleString('es-CO');

        if (elements.detailStatus) {
            elements.detailStatus.textContent = c.estado.toUpperCase();
            elements.detailStatus.className = 'status-badge';
            if (c.estado === 'En Ejecución') elements.detailStatus.classList.add('status-ejecucion');
            else if (c.estado === 'Liquidado') elements.detailStatus.classList.add('status-liquidado');
            else if (c.estado === 'Suspendido') elements.detailStatus.classList.add('status-suspendido');
        }

        if (elements.detailBolsa) elements.detailBolsa.textContent = formatCOP(c.valor);
        
        const detailPoblacion = document.getElementById('detail-card-poblacion');
        const detailPobCompartida = document.getElementById('detail-pob-compartida');
        const detailPobSoloMp = document.getElementById('detail-pob-solomp');
        
        if (detailPoblacion) {
            if (c.poblacion && c.poblacion > 0) {
                detailPoblacion.textContent = `${c.poblacion.toLocaleString('es-CO')} USUARIOS`;
                if (detailPobCompartida) detailPobCompartida.textContent = (c.poblacionCompartida || 0).toLocaleString('es-CO');
                if (detailPobSoloMp) detailPobSoloMp.textContent = (c.poblacionSoloMP || 0).toLocaleString('es-CO');
            } else {
                detailPoblacion.textContent = "N/A";
                if (detailPobCompartida) detailPobCompartida.textContent = "0";
                if (detailPobSoloMp) detailPobSoloMp.textContent = "0";
            }
        }
        
        // Mapeo dinámico de Anexos
        const anxVihVal1 = document.getElementById('anx-vih-val1');
        const anxVihVal2 = document.getElementById('anx-vih-val2');
        if (anxVihVal1) anxVihVal1.textContent = c.vihHeader || "N/A";
        if (anxVihVal2) anxVihVal2.textContent = c.vihSub || "N/A";

        const anxOncoVal1 = document.getElementById('anx-onco-val1');
        const anxOncoVal2 = document.getElementById('anx-onco-val2');
        if (anxOncoVal1) anxOncoVal1.textContent = c.oncoHeader || "N/A";
        if (anxOncoVal2) anxOncoVal2.textContent = c.oncoSub || "N/A";

        const anxPostVal1 = document.getElementById('anx-post-val1');
        const anxPostVal2 = document.getElementById('anx-post-val2');
        if (anxPostVal1) anxPostVal1.textContent = c.prePostHeader || "N/A";
        if (anxPostVal2) anxPostVal2.textContent = c.prePostSub || "N/A";

        const anxOrtesisVal1 = document.getElementById('anx-ortesis-val1');
        const anxOrtesisVal2 = document.getElementById('anx-ortesis-val2');
        if (anxOrtesisVal1) anxOrtesisVal1.textContent = c.ortesisHeader || "N/A";
        if (anxOrtesisVal2) anxOrtesisVal2.textContent = c.ortesisSub || "N/A";

        // Mapeo de Fechas de Vigencia
        const detailDateStart = document.getElementById('detail-card-date-start');
        const detailDateEnd = document.getElementById('detail-card-date-end');
        const formatOpts = { year: 'numeric', month: 'short', day: 'numeric' };
        
        if (detailDateStart) {
            detailDateStart.textContent = c.fechaInicio ? c.fechaInicio.toLocaleDateString('es-CO', formatOpts) : "N/A";
        }
        if (detailDateEnd) {
            detailDateEnd.textContent = c.fechaFin ? c.fechaFin.toLocaleDateString('es-CO', formatOpts) : "N/A";
        }

        // Llenar tabla de coberturas dinámicas (múltiples registros del mismo contrato)
        const coveragesBody = document.getElementById('detail-card-coverages-body');
        if (coveragesBody) {
            coveragesBody.innerHTML = '';
            if (c.coberturas && c.coberturas.length > 0) {
                c.coberturas.forEach(cov => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,0.03); color: var(--color-text-main); font-weight: 500;">${cov.tipo || 'N/A'}</td>
                        <td style="padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,0.03); color: var(--color-text-muted);">${cov.descripcion || 'N/A'}</td>
                    `;
                    coveragesBody.appendChild(row);
                });
            } else {
                coveragesBody.innerHTML = `
                    <tr>
                        <td colspan="2" style="padding: 10px; text-align: center; color: var(--color-text-muted); font-style: italic;">Sin coberturas especificadas</td>
                    </tr>
                `;
            }
        }

        if (elements.aggregatedCard) {
            elements.aggregatedCard.style.display = 'none';
        }
        if (elements.detailCard) {
            elements.detailCard.style.display = 'flex';
        }

        initCanvasNodes();
        drawTrendChart();
        
        // Actualizar barra de vigencia con el contrato seleccionado
        updateValidityBar(state.contratosFiltrados, c);

        // Actualizar mapa y listado de droguerías para el contrato seleccionado
        updatePharmaciesMapAndList();
    }

    function clearIndividualFilter() {
        state.selectedContractId = null;
        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.detailCard) {
            elements.detailCard.style.display = 'none';
        }
        if (elements.aggregatedCard) {
            elements.aggregatedCard.style.display = 'flex';
        }
        initCanvasNodes();
        drawTrendChart();

        // Restaurar mapa y listado de droguerías a la vista general filtrada
        updatePharmaciesMapAndList();
    }

    elements.clearFilterBtn.addEventListener('click', clearIndividualFilter);

    // ----------------------------------------------------
    // Relación de Canvas y Lógica de Flujo (Removido por el usuario)
    // ----------------------------------------------------
    function initCanvasNodes() {
        // Red de flujo de valor removida
    }

    // ----------------------------------------------------
    // Canvas Inferior - Tendencia Presupuestaria (REMOVIDO POR USUARIO)
    // ----------------------------------------------------
    function resizeTrendCanvas() {
        // Reducido
    }
    
    function drawTrendChart() {
        // Reducido
    }

    // ----------------------------------------------------
    // Utilidades de Conversión y Reloj
    // ----------------------------------------------------
    function parseNumericValue(val) {
        if (val === null || val === undefined) return 0;
        if (typeof val === 'number') return val;
        // Quitar símbolos de moneda, comas y espacios, y convertir a número flotante
        const clean = String(val).replace(/[^0-9.-]/g, '');
        const num = parseFloat(clean);
        return isNaN(num) ? 0 : num;
    }

    function parseDate(dateVal) {
        if (!dateVal) return null;
        if (dateVal instanceof Date) return dateVal;
        if (typeof dateVal === 'number') {
            // Manejar formato de fecha serializado por Excel (días desde 1900)
            return new Date((dateVal - 25569) * 86400 * 1000);
        }
        
        const str = String(dateVal).trim();
        let match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
        if (match) return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        match = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
        if (match) return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
        
        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
    }

    function updateClock() {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString('es-CO', { hour12: true });
        if (elements.date) elements.date.textContent = dateStr;
        if (elements.time) elements.time.textContent = timeStr;
    }

    // ----------------------------------------------------
    // LÓGICA DE DROGUERÍAS, MAPA Y MODALES
    // ----------------------------------------------------
    const DEFAULT_DROGUERIAS = [
        { "COD. SUC": "SUC-001", "DEPARTAMENTO": "CUNDINAMARCA", "MUNICIPIO": "BOGOTÁ", "NOMBRE DROGUERIA": "Cruz Verde Calle 93", "HORARIOS DE ATENCION": "24 Horas", "LATITUD": "4.6767", "LONGITUD": "-74.0483", "BANCO DE LA REPUBLICA": "X", "1055 - 1056": "x", "COLSANITAS (10)": "X" },
        { "COD. SUC": "SUC-002", "DEPARTAMENTO": "ANTIOQUIA", "MUNICIPIO": "MEDELLÍN", "NOMBRE DROGUERIA": "Cruz Verde El Poblado", "HORARIOS DE ATENCION": "7:00 AM - 10:00 PM", "LATITUD": "6.2089", "LONGITUD": "-75.5678", "BANCO DE LA REPUBLICA": "X", "ESENTTIA": "x", "1010349029": "X", "1010349050": "x" },
        { "COD. SUC": "SUC-003", "DEPARTAMENTO": "VALLE DEL CAUCA", "MUNICIPIO": "CALI", "NOMBRE DROGUERIA": "Cruz Verde Chipichape", "HORARIOS DE ATENCION": "8:00 AM - 9:00 PM", "LATITUD": "3.4722", "LONGITUD": "-76.5292", "ESENTTIA": "X", "1010349132": "x", "1010349043": "X" },
        { "COD. SUC": "SUC-004", "DEPARTAMENTO": "ATLÁNTICO", "MUNICIPIO": "BARRANQUILLA", "NOMBRE DROGUERIA": "Cruz Verde Prado", "HORARIOS DE ATENCION": "7:00 AM - 9:00 PM", "LATITUD": "10.9922", "LONGITUD": "-74.8011", "ESENTTIA": "X", "CENIT": "x", "1027": "X" },
        { "COD. SUC": "SUC-005", "DEPARTAMENTO": "BOLÍVAR", "MUNICIPIO": "CARTAGENA", "NOMBRE DROGUERIA": "Cruz Verde Bocagrande", "HORARIOS DE ATENCION": "24 Horas", "LATITUD": "10.4014", "LONGITUD": "-75.5539", "CENIT": "X", "1027": "X", "THE NATURAL CONSERVANCY": "x", "10108010876": "X" },
        { "COD. SUC": "SUC-006", "DEPARTAMENTO": "SANTANDER", "MUNICIPIO": "BUCARAMANGA", "NOMBRE DROGUERIA": "Cruz Verde Cabecera", "HORARIOS DE ATENCION": "7:00 AM - 10:00 PM", "LATITUD": "7.1189", "LONGITUD": "-73.1094", "THE NATURAL CONSERVANCY": "x", "WAYIU": "X", "10108097821": "x" },
        { "COD. SUC": "SUC-007", "DEPARTAMENTO": "RISARALDA", "MUNICIPIO": "PEREIRA", "NOMBRE DROGUERIA": "Cruz Verde Circunvalar", "HORARIOS DE ATENCION": "8:00 AM - 9:00 PM", "LATITUD": "4.8094", "LONGITUD": "-75.6903", "WAYIU": "X", "ASP COLOMBIA": "x", "10108068788": "x" },
        { "COD. SUC": "SUC-008", "DEPARTAMENTO": "CUNDINAMARCA", "MUNICIPIO": "CHÍA", "NOMBRE DROGUERIA": "Cruz Verde Fontanar", "HORARIOS DE ATENCION": "9:00 AM - 10:00 PM", "LATITUD": "4.8622", "LONGITUD": "-74.0322", "COLSANITAS (10)": "X", "1055 - 1056": "x" },
        { "COD. SUC": "SUC-009", "DEPARTAMENTO": "CALDAS", "MUNICIPIO": "MANIZALES", "NOMBRE DROGUERIA": "Cruz Verde Cable Plaza", "HORARIOS DE ATENCION": "7:00 AM - 9:00 PM", "LATITUD": "5.0583", "LONGITUD": "-75.4872", "GECELCA": "X", "1026": "x" },
        { "COD. SUC": "SUC-010", "DEPARTAMENTO": "TOLIMA", "MUNICIPIO": "IBAGUÉ", "NOMBRE DROGUERIA": "Cruz Verde Centro", "HORARIOS DE ATENCION": "8:00 AM - 8:00 PM", "LATITUD": "4.4378", "LONGITUD": "-75.2012", "BANCO DE LA REPUBLICA": "X", "1055 - 1056": "x" }
    ];

    function normalizeString(str) {
        if (!str) return "";
        return String(str)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "");
    }

    function initMap() {
        const mapEl = document.getElementById('pharmacies-map');
        if (!mapEl) return;
        
        try {
            leafletMap = L.map('pharmacies-map', {
                zoomControl: true,
                attributionControl: false
            }).setView([4.5709, -74.2973], 5);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(leafletMap);

            // Cargar GeoJSON de Colombia (Se corrigió URL rota que generaba 404)
            fetch('https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/be6a6e239cd5b5b803c6e7c2ec405b793a9064dd/Colombia.geo.json')
                .then(res => res.json())
                .then(data => {
                    window.colombiaGeoJsonData = data;
                    if (window.colombiaGeoJsonLayer) leafletMap.removeLayer(window.colombiaGeoJsonLayer);
                    window.colombiaGeoJsonLayer = L.geoJSON(data, {
                        style: {
                            color: '#10b981',
                            weight: 1,
                            fillOpacity: 0.1
                        }
                    }).addTo(leafletMap);
                    
                    updatePharmaciesMapAndList();
                })
                .catch(err => console.error('Error al cargar GeoJSON de Colombia:', err));

        } catch (e) {
            console.error("No se pudo iniciar el mapa de Leaflet:", e);
        }
    }

    function getFilteredPharmacies() {
        const rawDroguerias = (window.DROGUERIAS_DATA && Array.isArray(window.DROGUERIAS_DATA) && window.DROGUERIAS_DATA.length > 0) 
            ? window.DROGUERIAS_DATA 
            : DEFAULT_DROGUERIAS;
            
        // El mapa y la lista ahora responden a los filtros globales superiores, ignorando la selección de un contrato en la tabla.
        return filterPharmaciesForContracts(state.contratosFiltrados, rawDroguerias);
    }

    function filterPharmaciesForContracts(contracts, rawDroguerias) {
        if (!contracts || contracts.length === 0) return [];
        
        const contractIdentifiers = [];
        contracts.forEach(c => {
            if (c.id) contractIdentifiers.push(normalizeString(c.id));
            if (c.colectivo) contractIdentifiers.push(normalizeString(c.colectivo));
            if (c.colectivoBeneficiado) contractIdentifiers.push(normalizeString(c.colectivoBeneficiado));
            if (c.contratante) contractIdentifiers.push(normalizeString(c.contratante));
        });
        
        const uniqueIdentifiers = [...new Set(contractIdentifiers)].filter(Boolean);
        const activePharmacies = [];
        
        rawDroguerias.forEach(drog => {
            let isActive = false;
            
            for (const key in drog) {
                // Separar "1055 - 1056" o "COLSANITAS (10)" en partes individuales
                const keyParts = String(key).split(/[-\/\s_()]+/).map(k => normalizeString(k)).filter(Boolean);
                
                // Buscar si la columna completa o alguna de sus partes coincide con los datos del contrato
                const normKey = normalizeString(key);
                
                let isMatch = uniqueIdentifiers.includes(normKey) || keyParts.some(part => uniqueIdentifiers.includes(part));
                
                // Super rescate para Droguerías: Si el nombre del colectivo (CENIT) está escondido en el nombre de la columna (ej: "MallaCenit")
                if (!isMatch) {
                    isMatch = uniqueIdentifiers.some(uid => uid.length > 3 && normKey.includes(uid));
                }

                if (isMatch) {
                    // Limpieza agresiva del valor de la celda (por si dice "Sí", "Ok", "Aplica", etc.)
                    const val = String(drog[key]).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const validValues = ['x', 'si', '1', 'active', 'true', 'ok', 'aplica', 'cubre', 'vigente', 'activo', 'v', 'y', 'yes'];
                    
                    if (validValues.includes(val) || val.includes("si") || val.includes("ok")) {
                        isActive = true;
                        break;
                    }
                }
            }
            
            if (isActive) {
                // Buscamos dinámicamente las columnas sin importar espacios o variaciones
                let codSucursal = "N/A";
                let nombreFarm = "Droguería";
                let depto = "N/A";
                let muni = "N/A";
                let horario = "No especificado";
                let latVal = undefined;
                let lngVal = undefined;

                for (const key in drog) {
                    const normK = normalizeString(key);
                    const val = drog[key];
                    
                    if (normK.includes("cod") && normK.includes("suc") && codSucursal === "N/A") codSucursal = val;
                    if (normK.includes("nom") && (normK.includes("far") || normK.includes("drog")) && nombreFarm === "Droguería") nombreFarm = val;
                    if (normK.includes("dep") && depto === "N/A") depto = val;
                    if ((normK.includes("mun") || normK.includes("ciu")) && muni === "N/A") muni = val;
                    if (normK.includes("hor") && horario === "No especificado") horario = val;
                    
                    // Usar startsWith o coincidencias exactas y asegurar que el valor NO esté vacío
                    if ((normK.startsWith("lat") || normK === "lat") && !latVal) latVal = val;
                    if ((normK.startsWith("lon") || normK === "lng" || normK === "lon") && !lngVal) lngVal = val;
                }
                
                // Fallbacks estrictos por si la búsqueda dinámica falló o encontró una columna vacía
                if (codSucursal === "N/A" || !codSucursal) codSucursal = drog["COD. SUC"] || drog["CODIGO"] || "N/A";
                if (nombreFarm === "Droguería" || !nombreFarm) nombreFarm = drog["NOMBRE DE LA FARMACIA"] || drog["NOMBRE"] || "Droguería";

                // Parsear coordenadas asegurando que las comas decimales se conviertan a puntos
                let latStr = String(latVal || "").trim().replace(',', '.');
                let lngStr = String(lngVal || "").trim().replace(',', '.');
                
                let parsedLat = parseFloat(latStr);
                let parsedLng = parseFloat(lngStr);
                
                // Super Rescate de Coordenadas: Si la búsqueda dinámica atrapó basura (ej: "No aplica") y dio NaN
                if (isNaN(parsedLat) || isNaN(parsedLng)) {
                    const fbLat = drog["Latitud"] || drog["LATITUD"] || drog["LAT_SUC"];
                    const fbLng = drog["Longitud"] || drog["LONGITUD"] || drog["LON_SUC"];
                    parsedLat = parseFloat(String(fbLat || "").trim().replace(',', '.'));
                    parsedLng = parseFloat(String(fbLng || "").trim().replace(',', '.'));
                }

                // VALIDACIÓN GEOGRÁFICA ESTRICTA (Previene que el mapa intente dibujar o hacer zoom a números astronómicos)
                if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180 || (Math.abs(parsedLat) < 1 && Math.abs(parsedLng) < 1)) {
                    parsedLat = NaN;
                    parsedLng = NaN;
                }

                activePharmacies.push({
                    codigo: codSucursal,
                    nombre: nombreFarm,
                    departamento: depto,
                    municipio: muni,
                    horario: horario,
                    lat: parsedLat,
                    lng: parsedLng
                });
            }
        });
        
        const seen = new Set();
        return activePharmacies.filter(p => {
            const key = p.codigo + "_" + p.nombre;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function updatePharmaciesMapAndList() {
        // Re-calcular agregaciones basadas en contratos filtrados
        const daneAggregation = {};
        const regionalAggregation = {};
        const valRegional = elements.filterRegional ? elements.filterRegional.value : "";
        
        // CONGELAR LA VERDAD ABSOLUTA
        const colectivoTruth = new Map();
        state.contratosBase.forEach(c => {
            const key = (c.colectivo || c.colectivoBeneficiado || c.id).trim().toLowerCase();
            if (key && !colectivoTruth.has(key)) {
                colectivoTruth.set(key, c);
            }
        });

        if (state.contratosFiltrados && state.contratosFiltrados.length > 0) {
            const procesados = new Set();
            state.contratosFiltrados.forEach(c => {
                const key = (c.colectivo || c.colectivoBeneficiado || c.id).trim().toLowerCase();
                if (key && !procesados.has(key)) {
                    procesados.add(key);
                    const trueContract = colectivoTruth.get(key) || c;

                    if (trueContract.poblacionDane) {
                        for (const [daneCode, stats] of Object.entries(trueContract.poblacionDane)) {
                            // Si hay filtro regional, omitir DANEs que no pertenecen
                            if (valRegional && window.DANE_TO_REGIONAL && window.DANE_TO_REGIONAL[daneCode] !== valRegional) {
                                continue;
                            }
                            if (!daneAggregation[daneCode]) {
                                daneAggregation[daneCode] = { total: 0, compartida: 0, solo_mp: 0 };
                            }
                            daneAggregation[daneCode].total += stats.total || 0;
                            daneAggregation[daneCode].compartida += stats.compartida || 0;
                            daneAggregation[daneCode].solo_mp += stats.solo_mp || 0;
                            
                            const regional = window.DANE_TO_REGIONAL ? window.DANE_TO_REGIONAL[daneCode] : null;
                            if (regional) {
                                if (!regionalAggregation[regional]) {
                                    regionalAggregation[regional] = 0;
                                }
                                regionalAggregation[regional] += (stats.total || 0);
                            }
                        }
                    }
                }
            });
        }
        
        const activeDanes = Object.keys(daneAggregation);
        
        // Calcular la población total para el encabezado
        let totalMapPopulation = 0;
        let maxTotal = 0;
        for (const code of activeDanes) {
            const tot = daneAggregation[code].total;
            totalMapPopulation += tot;
            if (tot > maxTotal) maxTotal = tot;
        }
        
        const phCounter = document.getElementById('pharmacies-counter');
        const validityPhVal = document.getElementById('validity-pharmacies-val');
        
        if (phCounter) phCounter.innerHTML = `<span style="color: var(--color-text-main); font-weight: 600;">${totalMapPopulation.toLocaleString('es-CO')}</span> Usuarios en <span style="color: var(--color-primary);">${activeDanes.length}</span> Municipios`;
        if (validityPhVal) validityPhVal.textContent = activeDanes.length;

        if (leafletMap) {
            mapMarkers.forEach(m => leafletMap.removeLayer(m));
            mapMarkers = [];
            
            const pointsForBounds = [];
            
            const showPins = !!valRegional || !window.colombiaGeoJsonLayer;

            // Update GeoJSON layer if it exists
            if (window.colombiaGeoJsonLayer) {
                // Generar paleta de colores para regionales dinámicamente
                const palette = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4', '#eab308'];
                const regColorMap = {};
                let cIndex = 0;
                
                // Mapear Departamentos a Regional (usando la regional que más población tenga en ese departamento)
                const deptoRegPop = {};
                if (window.DANE_TO_REGIONAL) {
                    for (const code of activeDanes) {
                        const deptoStr = String(code).padStart(5, '0').substring(0, 2);
                        const reg = window.DANE_TO_REGIONAL[code];
                        if (reg) {
                            if (!deptoRegPop[deptoStr]) deptoRegPop[deptoStr] = {};
                            if (!deptoRegPop[deptoStr][reg]) deptoRegPop[deptoStr][reg] = 0;
                            deptoRegPop[deptoStr][reg] += daneAggregation[code].total;
                            
                            if (!regColorMap[reg]) {
                                regColorMap[reg] = palette[cIndex % palette.length];
                                cIndex++;
                            }
                        }
                    }
                }
                
                // Asignar cada departamento a su regional dominante
                const dominantRegByDepto = {};
                for (const depto in deptoRegPop) {
                    let maxPob = -1;
                    let domReg = "";
                    for (const reg in deptoRegPop[depto]) {
                        if (deptoRegPop[depto][reg] > maxPob) {
                            maxPob = deptoRegPop[depto][reg];
                            domReg = reg;
                        }
                    }
                    dominantRegByDepto[depto] = domReg;
                }

                // Fallback de nombres a códigos DANE de departamento por si el GeoJSON no trae ID
                const nameToDeptoCode = {
                    "antioquia": "05", "atlantico": "08", "bogota": "11", "bogota dc": "11", "bolivar": "13", "boyaca": "15",
                    "caldas": "17", "caqueta": "18", "cauca": "19", "cesar": "20", "cordoba": "23",
                    "cundinamarca": "25", "choco": "27", "huila": "41", "la guajira": "44", "magdalena": "47",
                    "meta": "50", "narino": "52", "norte de santander": "54", "quindio": "63", "risaralda": "66",
                    "santander": "68", "sucre": "70", "tolima": "73", "valle del cauca": "76", "arauca": "81",
                    "casanare": "85", "putumayo": "86", "archipielago de san andres providencia y santa catalina": "88",
                    "san andres": "88", "amazonas": "91", "guainia": "94", "guaviare": "95", "vaupes": "97", "vichada": "99"
                };

                window.colombiaGeoJsonLayer.eachLayer(layer => {
                    const props = layer.feature.properties;
                    const depName = normalizeString(props.DPTO_CNMBR || props.NOMBRE_DPT || props.name || "");
                    const dptoCode = props.DPTO_CCDGO || props.codigo_dane || nameToDeptoCode[depName] || "";
                    
                    let dominantReg = dominantRegByDepto[dptoCode];
                    
                    // Fallback si no funcionó el mapeo por código
                    if (!dominantReg) {
                        for (const reg in regionalAggregation) {
                            if (normalizeString(reg).includes(depName) || depName.includes(normalizeString(reg))) {
                                dominantReg = reg;
                            }
                        }
                    }

                    if (!valRegional) {
                        // Vista global: coloreado por REGIONAL
                        if (dominantReg && regionalAggregation[dominantReg] > 0) {
                            const color = regColorMap[dominantReg] || '#10b981';
                            layer.setStyle({
                                fillColor: color,
                                fillOpacity: 0.45,
                                weight: 1,
                                color: '#ffffff',
                                opacity: 0.6
                            });
                            
                            let totalDepto = 0;
                            if (deptoRegPop[dptoCode]) {
                                for(let r in deptoRegPop[dptoCode]) totalDepto += deptoRegPop[dptoCode][r];
                            }
                            
                            layer.bindTooltip(`<b>${props.DPTO_CNMBR || depName.toUpperCase()}</b><br>Regional: ${dominantReg}<br>Población: ${totalDepto.toLocaleString('es-CO')}`, { sticky: true });
                        } else {
                            layer.setStyle({ fillColor: '#070b17', fillOpacity: 0.7, weight: 1, color: '#333', opacity: 0.5 });
                            layer.unbindTooltip();
                        }
                    } else {
                        // Si hay filtro de regional, quitar todos los colores y dejar el mapa oscuro
                        // para que resalten únicamente las tachuelas (droguerías)
                        layer.setStyle({ fillColor: '#070b17', fillOpacity: 0.7, weight: 1, color: '#333', opacity: 0.5 });
                        layer.unbindTooltip();
                    }
                });
            }
            
            activeDanes.forEach(code => {
                const stats = daneAggregation[code];
                const loc = window.daneCoords && window.daneCoords[code];
                
                if (loc && !isNaN(loc.lat) && !isNaN(loc.lng)) {
                    if (showPins) {
                        const color = stats.solo_mp >= stats.compartida ? '#10b981' : '#3b82f6';
                        const radius = maxTotal > 0 ? 4 + (16 * Math.sqrt(stats.total / maxTotal)) : 4;
                        
                        const marker = L.circleMarker([loc.lat, loc.lng], {
                            radius: radius,
                            fillColor: color,
                            color: '#ffffff',
                            weight: 1.5,
                            opacity: 1,
                            fillOpacity: 0.8
                        }).addTo(leafletMap);
                        
                        marker.bindPopup(`
                            <div style="font-family: var(--font-body); font-size: 0.75rem; color: #fff; padding: 4px; line-height: 1.4;">
                                <strong style="color: ${color}; display:block; margin-bottom: 6px; font-family: var(--font-display); font-size: 0.9rem;">${loc.municipio || code}</strong>
                                <div><strong>Código DANE:</strong> ${code}</div>
                                <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.1);">
                                    <strong>Total Pacientes:</strong> ${stats.total.toLocaleString('es-CO')}
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                                    <span style="color: #3b82f6;">Compartidos: ${stats.compartida.toLocaleString('es-CO')}</span>
                                    <span style="color: #10b981;">Solo MP: ${stats.solo_mp.toLocaleString('es-CO')}</span>
                                </div>
                            </div>
                        `);
                        mapMarkers.push(marker);
                        pointsForBounds.push([loc.lat, loc.lng]);
                    }
                }
            });

            // Leyenda
            const mapEl = document.getElementById('pharmacies-map');
            if (mapEl && !document.getElementById('map-legend') && showPins) {
                const legendEl = document.createElement('div');
                legendEl.id = 'map-legend';
                legendEl.style.position = 'absolute';
                legendEl.style.bottom = '15px';
                legendEl.style.left = '15px';
                legendEl.style.zIndex = '1000';
                legendEl.style.background = 'rgba(7, 11, 23, 0.9)';
                legendEl.style.border = '1px solid var(--color-border)';
                legendEl.style.padding = '8px 12px';
                legendEl.style.borderRadius = 'var(--radius-sm)';
                legendEl.style.display = 'flex';
                legendEl.style.flexDirection = 'column';
                legendEl.style.gap = '6px';
                legendEl.style.fontSize = '0.65rem';
                legendEl.style.color = '#fff';
                legendEl.style.pointerEvents = 'none';
                legendEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
                
                legendEl.innerHTML = `
                    <div style="font-weight: 600; margin-bottom: 2px; color: var(--color-text-main);">Tipos de Población</div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%;"></span>
                        Mayoría Solo MP
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="display: inline-block; width: 10px; height: 10px; background: #3b82f6; border-radius: 50%;"></span>
                        Mayoría Compartidos
                    </div>
                `;
                mapEl.appendChild(legendEl);
            } else if (!showPins && document.getElementById('map-legend')) {
                document.getElementById('map-legend').remove();
            }

            // Total Population Overlay (Siempre visible dentro del mapa)
            let totalPopEl = document.getElementById('map-total-pop');
            if (!totalPopEl) {
                totalPopEl = document.createElement('div');
                totalPopEl.id = 'map-total-pop';
                totalPopEl.style.position = 'absolute';
                totalPopEl.style.top = '10px';
                totalPopEl.style.right = '10px';
                totalPopEl.style.zIndex = '1000';
                totalPopEl.style.background = 'rgba(7, 11, 23, 0.9)';
                totalPopEl.style.border = '1px solid var(--color-primary)';
                totalPopEl.style.borderRadius = '8px';
                totalPopEl.style.padding = '8px 15px';
                totalPopEl.style.color = '#fff';
                totalPopEl.style.textAlign = 'right';
                totalPopEl.style.boxShadow = '0 6px 12px rgba(0,0,0,0.5)';
                totalPopEl.style.pointerEvents = 'none';
                mapEl.appendChild(totalPopEl);
            }
            
            totalPopEl.innerHTML = `
                <div style="font-size: 0.55rem; color: var(--color-text-muted); margin-bottom: 2px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">Población Filtrada</div>
                <div style="font-size: 0.95rem; font-weight: bold; color: var(--color-text-main); font-family: monospace;">${totalMapPopulation.toLocaleString('es-CO')}</div>
            `;

            if (showPins && pointsForBounds.length > 0) {
                leafletMap.fitBounds(pointsForBounds, { padding: [30, 30] });
            } else if (!showPins && window.colombiaGeoJsonLayer) {
                // If global view, zoom to Colombia
                leafletMap.setView([4.5709, -74.2973], 5);
            } else if (pointsForBounds.length > 0) {
                leafletMap.fitBounds(pointsForBounds, { padding: [30, 30] });
            } else {
                leafletMap.setView([4.5709, -74.2973], 5);
            }
            
            setTimeout(() => {
                leafletMap.invalidateSize();
            }, 100);
        }
    }

    function initModalEvents() {
        const pharmacyCard = document.getElementById('validity-pharmacy-card');
        const modal = document.getElementById('pharmacies-modal');
        const closeBtn = document.getElementById('close-pharmacies-modal');
        const modalBody = document.getElementById('modal-pharmacies-body');
        const modalMapEl = document.getElementById('modal-pharmacies-map');
        
        // Modal Filters
        const nameFilter = document.getElementById('modal-filter-name');
        const deptoFilter = document.getElementById('modal-filter-depto');
        const muniFilter = document.getElementById('modal-filter-muni');
        
        let currentPharmacies = [];
        
        if (!pharmacyCard || !modal || !closeBtn || !modalBody) return;
        
        function renderModalPharmacies() {
            const nameVal = (nameFilter.value || '').toLowerCase();
            const deptoVal = deptoFilter.value;
            const muniVal = muniFilter.value;
            
            const filtered = currentPharmacies.filter(p => {
                const matchName = !nameVal || (p.nombre && p.nombre.toLowerCase().includes(nameVal));
                const matchDepto = !deptoVal || p.departamento === deptoVal;
                const matchMuni = !muniVal || p.municipio === muniVal;
                return matchName && matchDepto && matchMuni;
            });
            
            modalBody.innerHTML = '';
            
            // Limpiar marcadores anteriores
            if (leafletModalMap) {
                modalMapMarkers.forEach(m => leafletModalMap.removeLayer(m));
                modalMapMarkers = [];
            }
            
            const pointsForBounds = [];
            
            if (filtered.length === 0) {
                modalBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="padding: 20px; text-align: center; color: var(--color-text-muted); font-style: italic;">
                            Sin droguerías disponibles para esta selección
                        </td>
                    </tr>`;
            } else {
                filtered.forEach((p, idx) => {
                    const row = document.createElement('tr');
                    row.style.cursor = 'pointer';
                    row.classList.add('pharmacy-modal-row');
                    row.innerHTML = `
                        <td class="font-mono text-primary" style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.03);">${p.codigo}</td>
                        <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.03); font-weight: 600;">${p.nombre}</td>
                        <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.03);">${p.departamento}</td>
                        <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.03);">${p.municipio}</td>
                        <td class="font-mono text-secondary" style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.03);">${p.horario}</td>
                    `;
                    
                    let marker = null;
                    if (leafletModalMap && !isNaN(p.lat) && !isNaN(p.lng)) {
                        const markerIcon = L.divIcon({
                            className: 'custom-map-marker',
                            html: `<div style="
                                width: 12px;
                                height: 12px;
                                background-color: var(--color-primary);
                                border: 2px solid #ffffff;
                                border-radius: 50%;
                                box-shadow: 0 0 8px var(--color-primary);
                            "></div>`,
                            iconSize: [12, 12],
                            iconAnchor: [6, 6]
                        });
                        
                        marker = L.marker([p.lat, p.lng], { icon: markerIcon }).addTo(leafletModalMap);
                        marker.bindPopup(`
                            <div style="font-family: var(--font-body); font-size: 0.72rem; color: #fff; padding: 2px; line-height: 1.4;">
                                <strong style="color: var(--color-primary); display:block; margin-bottom: 4px; font-family: var(--font-display);">${p.nombre}</strong>
                                <div><strong>Código:</strong> ${p.codigo}</div>
                                <div><strong>Ubicación:</strong> ${p.municipio}, ${p.departamento}</div>
                                <div><strong>Horario:</strong> ${p.horario}</div>
                            </div>
                        `);
                        modalMapMarkers.push(marker);
                        pointsForBounds.push([p.lat, p.lng]);
                    }
                    
                    row.addEventListener('click', () => {
                        document.querySelectorAll('.pharmacy-modal-row').forEach(r => r.style.background = 'transparent');
                        row.style.background = 'rgba(16, 185, 129, 0.1)';
                        
                        if (leafletModalMap && marker) {
                            leafletModalMap.setView([p.lat, p.lng], 16);
                            marker.openPopup();
                        }
                    });
                    
                    modalBody.appendChild(row);
                });
            }
            
            if (leafletModalMap) {
                if (pointsForBounds.length > 0) {
                    leafletModalMap.fitBounds(pointsForBounds, { padding: [30, 30], maxZoom: 14 });
                } else {
                    leafletModalMap.setView([4.5709, -74.2973], 5);
                }
            }
        }
        
        pharmacyCard.addEventListener('click', () => {
            currentPharmacies = getFilteredPharmacies();
            
            // Populate Dropdowns
            if (deptoFilter) {
                const deptos = [...new Set(currentPharmacies.map(p => p.departamento).filter(Boolean))].sort();
                deptoFilter.innerHTML = '<option value="">Todos los Departamentos</option>';
                deptos.forEach(d => {
                    const opt = document.createElement('option');
                    opt.value = d;
                    opt.textContent = d;
                    deptoFilter.appendChild(opt);
                });
            }
            if (muniFilter) {
                const munis = [...new Set(currentPharmacies.map(p => p.municipio).filter(Boolean))].sort();
                muniFilter.innerHTML = '<option value="">Todos los Municipios</option>';
                munis.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    muniFilter.appendChild(opt);
                });
            }
            
            // Reset filter inputs
            if (nameFilter) nameFilter.value = '';
            if (deptoFilter) deptoFilter.value = '';
            if (muniFilter) muniFilter.value = '';
            
            modal.classList.add('active');
            modal.style.display = 'flex';
            
            // Inicializar mapa del modal si no existe
            if (!leafletModalMap && modalMapEl) {
                try {
                    leafletModalMap = L.map('modal-pharmacies-map', {
                        zoomControl: true,
                        attributionControl: false
                    }).setView([4.5709, -74.2973], 5);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 18
                    }).addTo(leafletModalMap);
                } catch (e) {
                    console.error("No se pudo iniciar el mapa del modal:", e);
                }
            }
            
            renderModalPharmacies();
            
            setTimeout(() => {
                if (leafletModalMap) {
                    leafletModalMap.invalidateSize();
                }
            }, 150);
        });
        
        // Add event listeners to local filters
        if (nameFilter) nameFilter.addEventListener('input', renderModalPharmacies);
        if (deptoFilter) deptoFilter.addEventListener('change', renderModalPharmacies);
        if (muniFilter) muniFilter.addEventListener('change', renderModalPharmacies);
        
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                modal.style.display = 'none';
            }
        });
    }

    // ----------------------------------------------------
    // Inicialización del Sistema
    // ----------------------------------------------------
    updateClock();
    setInterval(updateClock, 1000);

    resizeTrendCanvas();

    // Iniciar Mapa y Eventos de Modal
    initMap();
    initModalEvents();
    
    // Inicializar cargador de datos
    initDataLoader();
});
