// demo_data_costo.js
// Datos simulados estructurados que imitan la salida del pipeline de BigQuery / Python.

window.COSTO_DATA = {
    // KPIs Generales
    resumenImpacto: {
        ahorroIdentificado: 2456000000,   
        ahorroGestionado: 1850500000,     
        pacientesRiesgo: 1240,            
        interaccionesMitigadas: 850,
        usuariosConInteraccion: 3450,
        usuariosSinInteraccion: 12050
    },
    
    // Demografía
    demografia: {
        genero: {
            labels: ["Femenino", "Masculino", "Otro"],
            data: [65, 34, 1] // Porcentajes
        },
        grupoEtareo: {
            labels: ["18-30", "31-50", "51-70", ">70"],
            data: [15, 30, 40, 15] // Porcentajes
        }
    },

    // Usuarios Prevalentes vs Incidentes
    tendenciaUsuarios: {
        meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        prevalentes: [1200, 1250, 1280, 1310, 1350, 1400],
        incidentes: [150, 180, 140, 210, 190, 230]
    },
    
    // Top Interacciones Detectadas (Cruce Maestra ATC)
    topInteracciones: [
        { interaccion: "SILDENAFIL + ISOSORBIDA", gravedad: "ALTA", casos: 145, ahorro: 12050000 },
        { interaccion: "WARFARINA + AMIODARONA", gravedad: "ALTA", casos: 98, ahorro: 8500000 },
        { interaccion: "CLOPIDOGREL + OMEPRAZOL", gravedad: "MODERADA", casos: 210, ahorro: 15400000 },
        { interaccion: "IBUPROFENO + ASPIRINA", gravedad: "BAJA", casos: 450, ahorro: 5200000 },
        { interaccion: "METOTREXATO + TRIMETOPRIMA", gravedad: "ALTA", casos: 42, ahorro: 21000000 }
    ],

    // Top Pacientes Mayor Riesgo
    topPacientes: [
        { 
            id: "CC-894***", 
            riesgo: "CRÍTICO", 
            costoProyectado: 4500000, 
            motivo: "Duplicidad Terapéutica + Interacción Mayor", 
            regional: "BOGOTA" 
        },
        { 
            id: "CC-102***", 
            riesgo: "ALTO", 
            costoProyectado: 3800000, 
            motivo: "Polifarmacia Extrema (>15 Meds)", 
            regional: "ANTIOQUIA" 
        },
        { 
            id: "CE-992***", 
            riesgo: "ALTO", 
            costoProyectado: 3200000, 
            motivo: "Interacción Fármaco-Enfermedad", 
            regional: "CALI" 
        }
    ],

    // Datos para la Gráfica de Tendencia (Mes a Mes)
    tendenciaMensual: {
        meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        identificado: [350, 420, 380, 510, 480, 540], // En Millones
        evitado: [280, 310, 300, 420, 380, 460]       // En Millones
    }
};
