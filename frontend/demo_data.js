window.CONTRATOS_DATA = [
    {
        "id": "DEMO-2026-001",
        "contratista": "PharmaSalud Integral S.A.S.",
        "objeto": "Suministro y dispensación de medicamentos e insumos médicos para afiliados del plan básico.",
        "valor": 4500000000,
        "estado": "En Ejecución",
        "tipo": "Suministro",
        "contratante": "Empresa Nacional de Salud (Ficticia)",
        "colectivo": "Plan Base Corporativo",
        "colectivoBeneficiado": "Empleados Nivel 1",
        "plan": "Plan Básico de Salud",
        "tipoContratacion": "Licitación Pública",
        "fechaInicio": "2026-01-01",
        "fechaFin": "2026-12-31",
        "tipoCobertura": "Nacional",
        "descripcionCobertura": "Medicamentos PBS y No PBS",
        "cupoUsuarioBolsaGral": 15000000,
        "bolsaComplementaria": 500000000,
        "poblacion": 25000,
        "poblacionCompartida": 15000,
        "poblacionSoloMP": 10000,
        "poblacionDane": {
            "11001": { total: 15000, compartida: 10000, solo_mp: 5000 },
            "05001": { total: 10000, compartida: 5000, solo_mp: 5000 }
        },
        "vihHeader": "SI",
        "vihSub": "5 SMMLV",
        "oncoHeader": "NO",
        "oncoSub": "N/A",
        "prePostHeader": "SI",
        "prePostSub": "10 SMMLV",
        "ortesisHeader": "NO",
        "ortesisSub": "N/A",
        "coberturas": [
            {"tipo": "Nacional", "descripcion": "Medicamentos PBS y No PBS"}
        ]
    },
    {
        "id": "DEMO-2026-002",
        "contratista": "Red de Boticas El Sol",
        "objeto": "Dispensación de medicamentos de alto costo para pacientes oncológicos.",
        "valor": 8200000000,
        "estado": "En Ejecución",
        "tipo": "Servicios",
        "contratante": "Fondo de Bienestar Social",
        "colectivo": "Pacientes Crónicos",
        "colectivoBeneficiado": "Pacientes Crónicos",
        "plan": "Plan Especializado",
        "tipoContratacion": "Contratación Directa",
        "fechaInicio": "2025-06-01",
        "fechaFin": "2027-05-31",
        "tipoCobertura": "Regional",
        "descripcionCobertura": "Tratamiento Oncológico Exclusivo",
        "cupoUsuarioBolsaGral": 25000000,
        "bolsaComplementaria": 1200000000,
        "poblacion": 8500,
        "poblacionCompartida": 3000,
        "poblacionSoloMP": 5500,
        "poblacionDane": {
            "76001": { total: 5000, compartida: 1500, solo_mp: 3500 },
            "13001": { total: 3500, compartida: 1500, solo_mp: 2000 }
        },
        "vihHeader": "NO",
        "vihSub": "N/A",
        "oncoHeader": "SI",
        "oncoSub": "SIN LIMITE",
        "prePostHeader": "NO",
        "prePostSub": "N/A",
        "ortesisHeader": "NO",
        "ortesisSub": "N/A",
        "coberturas": [
            {"tipo": "Regional", "descripcion": "Tratamiento Oncológico Exclusivo"}
        ]
    },
    {
        "id": "DEMO-2026-003",
        "contratista": "Distribuidora Médica Andina",
        "objeto": "Suministro de dispositivos médicos y órtesis a nivel nacional.",
        "valor": 1200000000,
        "estado": "Suspendido",
        "tipo": "Suministro",
        "contratante": "Ministerio de Salud Ficticio",
        "colectivo": "Programa de Rehabilitación",
        "colectivoBeneficiado": "Usuarios Generales",
        "plan": "Plan Complementario",
        "tipoContratacion": "Invitación Privada",
        "fechaInicio": "2026-03-01",
        "fechaFin": "2026-09-30",
        "tipoCobertura": "Nacional",
        "descripcionCobertura": "Órtesis y Prótesis",
        "cupoUsuarioBolsaGral": 5000000,
        "bolsaComplementaria": 100000000,
        "poblacion": 45000,
        "poblacionCompartida": 40000,
        "poblacionSoloMP": 5000,
        "poblacionDane": {
            "11001": { total: 20000, compartida: 18000, solo_mp: 2000 },
            "08001": { total: 25000, compartida: 22000, solo_mp: 3000 }
        },
        "vihHeader": "NO",
        "vihSub": "N/A",
        "oncoHeader": "NO",
        "oncoSub": "N/A",
        "prePostHeader": "NO",
        "prePostSub": "N/A",
        "ortesisHeader": "SI",
        "ortesisSub": "AUTORIZACION PREVIA",
        "coberturas": [
            {"tipo": "Nacional", "descripcion": "Órtesis y Prótesis"}
        ]
    }
];

window.DROGUERIAS_DATA = [
    { "COD. SUC": "SUC-001", "DEPARTAMENTO": "BOGOTA D.C.", "MUNICIPIO": "BOGOTA", "NOMBRE DE LA FARMACIA": "Droguería Vida y Salud (Sede Norte)", "HORARIOS DE ATENCION": "24 Horas", "Latitud": 4.6767, "Longitud": -74.0483, "Plan Base Corporativo": "X", "Programa de Rehabilitación": "X" },
    { "COD. SUC": "SUC-002", "DEPARTAMENTO": "ANTIOQUIA", "MUNICIPIO": "MEDELLIN", "NOMBRE DE LA FARMACIA": "FarmaPlus Poblado", "HORARIOS DE ATENCION": "7:00 AM - 10:00 PM", "Latitud": 6.2089, "Longitud": -75.5678, "Plan Base Corporativo": "X", "Pacientes Crónicos": "X" },
    { "COD. SUC": "SUC-003", "DEPARTAMENTO": "VALLE DEL CAUCA", "MUNICIPIO": "CALI", "NOMBRE DE LA FARMACIA": "Botica del Valle", "HORARIOS DE ATENCION": "8:00 AM - 9:00 PM", "Latitud": 3.4722, "Longitud": -76.5292, "Programa de Rehabilitación": "X", "Pacientes Crónicos": "X" },
    { "COD. SUC": "SUC-004", "DEPARTAMENTO": "ATLANTICO", "MUNICIPIO": "BARRANQUILLA", "NOMBRE DE LA FARMACIA": "Droguería Caribe Centro", "HORARIOS DE ATENCION": "7:00 AM - 9:00 PM", "Latitud": 10.9922, "Longitud": -74.8011, "Plan Base Corporativo": "X", "Pacientes Crónicos": "X" },
    { "COD. SUC": "SUC-005", "DEPARTAMENTO": "BOLIVAR", "MUNICIPIO": "CARTAGENA", "NOMBRE DE LA FARMACIA": "FarmaSalud Ciudad Amurallada", "HORARIOS DE ATENCION": "24 Horas", "Latitud": 10.4014, "Longitud": -75.5539, "Plan Base Corporativo": "X", "Programa de Rehabilitación": "X" },
    { "COD. SUC": "SUC-006", "DEPARTAMENTO": "SANTANDER", "MUNICIPIO": "BUCARAMANGA", "NOMBRE DE LA FARMACIA": "Droguería Los Andes", "HORARIOS DE ATENCION": "7:00 AM - 10:00 PM", "Latitud": 7.1189, "Longitud": -73.1094, "Pacientes Crónicos": "X" },
    { "COD. SUC": "SUC-007", "DEPARTAMENTO": "RISARALDA", "MUNICIPIO": "PEREIRA", "NOMBRE DE LA FARMACIA": "FarmaEje Cafetero", "HORARIOS DE ATENCION": "8:00 AM - 9:00 PM", "Latitud": 4.8094, "Longitud": -75.6903, "Plan Base Corporativo": "X" },
    { "COD. SUC": "SUC-008", "DEPARTAMENTO": "CUNDINAMARCA", "MUNICIPIO": "CHIA", "NOMBRE DE LA FARMACIA": "Droguería Sabana", "HORARIOS DE ATENCION": "9:00 AM - 10:00 PM", "Latitud": 4.8622, "Longitud": -74.0322, "Programa de Rehabilitación": "X", "Pacientes Crónicos": "X" },
    { "COD. SUC": "SUC-009", "DEPARTAMENTO": "CALDAS", "MUNICIPIO": "MANIZALES", "NOMBRE DE LA FARMACIA": "Botica Nevado", "HORARIOS DE ATENCION": "7:00 AM - 9:00 PM", "Latitud": 5.0583, "Longitud": -75.4872, "Plan Base Corporativo": "X", "Pacientes Crónicos": "X" },
    { "COD. SUC": "SUC-010", "DEPARTAMENTO": "TOLIMA", "MUNICIPIO": "IBAGUE", "NOMBRE DE LA FARMACIA": "Droguería Tolima", "HORARIOS DE ATENCION": "8:00 AM - 8:00 PM", "Latitud": 4.4378, "Longitud": -75.2012, "Programa de Rehabilitación": "X" }
];
