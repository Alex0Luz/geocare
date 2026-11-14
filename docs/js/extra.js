// GeoCare extras: personal health profile and traffic light, region health indicators, playbook for
// cities/industry/farms, "where is it changing" grid, CSV export. Loaded before app.js; everything runs at render time.
// Code written with AI assistance; scoring rule and health content defined and reviewed by the team.
I18N.add("en", {
  "tab.region": "Region's health", "tab.act": "Cities & companies",
  "cap.title": "Ten capitals at a glance", "cap.intro": "Capitals of the ten most populous countries selected by the team, analysed with the same method (change per decade, 1981–2025). The colour is the verdict. Tap a row to open that city.", "cap.city": "Capital", "cap.na": "Panel not available yet.",
  "tools.grid": "Where is it changing?", "tools.csv": "Export CSV", "tools.gridvar.temp": "Temperature", "tools.gridvar.rain": "Rainfall",
  "grid.loading": "Loading 25 points around this place…", "grid.legend": "Each circle is one NASA POWER grid point (0.5° apart). Red: rising, blue: falling, grey: no significant trend. Stronger colour means a faster change.",
  "quant.total": "Total change over the record: <b>{v}</b>.", "quant.periods": "Average of 2006–2025 compared with 1981–2000: <b>{d}</b> ({pct}%).",
  "me.edit": "Edit my profile", "me.done": "Done", "me.start": "Answer a few questions to make this personal. Your answers stay on this device.", "place.hero": "climate signals here have changed, with two independent datasets in agreement.", "place.tap": "Tap a signal to see the evidence.", "place.evidence": "Evidence", "place.how": "How we calculate and where the data come from", "me.title": "My health profile", "me.privacy": "Your answers stay on this device only. No name, ID or e-mail is collected.",
  "me.age": "Age", "me.cond": "Health conditions", "me.work": "Work", "me.meds": "Medicines I take (by class)", "me.home": "My home",
  "f.u5": "under 5", "f.5-17": "5–17", "f.18-59": "18–59", "f.60-74": "60–74", "f.75+": "75 or older",
  "f.hta": "High blood pressure", "f.heart": "Heart disease", "f.kidney": "Kidney disease", "f.diabetes": "Diabetes", "f.lung": "Asthma / COPD", "f.bed": "Bedridden or reduced mobility", "f.mental": "Mental health condition", "f.pregnant": "Pregnant",
  "f.outdoor": "I work outdoors",
  "f.diuretic": "Diuretics (hydrochlorothiazide, furosemide)", "f.acei": "ACE inhibitors / ARBs (enalapril, losartan)", "f.beta": "Beta-blockers", "f.antichol": "Anticholinergic antihistamines (promethazine, dexchlorpheniramine)", "f.psych": "Antipsychotics or tricyclic antidepressants", "f.lithium": "Lithium", "f.nsaid": "Anti-inflammatories (NSAIDs)", "f.alcohol": "Alcohol or stimulants",
  "f.noceiling": "Roof without ceiling lining", "f.noventil": "Little ventilation", "f.nofan": "No fan", "f.alone": "Lives alone",
  "light.title": "GeoCare traffic light: heat", "light.low": "Low", "light.mid": "Moderate", "light.high": "High",
  "light.rule": "Transparent rule: +1 for each factor you ticked, +2 if the local heat trend is statistically significant, +2 if today's heat index reaches 41 °C. 0–2 low, 3–4 moderate, 5 or more high.",
  "light.r.factors": "{n} personal factor(s): {list}", "light.r.trend": "the heat trend here is statistically significant (+2)", "light.r.today": "today's heat index reaches {v} °C (+2)", "light.r.none": "no factor ticked yet", "light.need": "Choose a place to add the local trend and today's heat index.",
  "med.title": "Your medicines and the heat", "med.rule": "This medicine can raise your risk in the heat. Talk to your doctor or health unit about hot days. Do not stop or change it on your own.",
  "m.diuretic": "Diuretics: fluid loss, changes in body salts, less thirst.", "m.acei": "ACE inhibitors / ARBs: low blood pressure and less thirst; the risk rises together with a diuretic.", "m.beta": "Beta-blockers: less sweating and less widening of skin blood vessels.", "m.antichol": "Anticholinergic antihistamines: less sweating and poorer control of body temperature.", "m.psych": "Antipsychotics and tricyclics: less sweating and poorer control of body temperature.", "m.lithium": "Lithium: can become toxic with dehydration.", "m.nsaid": "NSAIDs: kidney injury when dehydrated.", "m.alcohol": "Alcohol and stimulants: you notice the heat less and lose more fluid.",
  "med.src": "Source: CDC, Heat and Medications: Guidance for Clinicians.",
  "sos.title": "Is it serious?", "sos.signs": "Confusion, disorientation, seizure, fainting or very hot skin in the heat is heat stroke until proven otherwise.", "sos.call": "Call now:", "sos.local": "your local emergency number", "sos.first": "While help is on the way: move the person to shade, wet the whole body and fan. Do not give fever medicine.",
  "care2.title": "Caring for someone bedridden, very old or very young", "care2.tips": "Offer fluids little by little, often.|Ventilate the room and use light clothes.|Do not leave the person alone during the hottest hours.|Warning signs: drowsiness, confusion, little urine, very hot skin.",
  "region.title": "Health in {c}", "region.intro": "National indicators over time, tested with the same trend method. They describe the whole country, not your neighbourhood.", "region.none": "No health indicators found for this country.", "region.need": "Choose a place first.",
  "region.src": "Source: World Bank Open Data, compiled from WHO, UNICEF, UN agencies and national statistics. Latest available year shown.",
  "g.life": "Life and death by age", "g.causes": "Causes and diseases", "g.vaccines": "Vaccination", "g.system": "Health system", "g.wash": "Water and sanitation", "g.food": "Food",
  "tr.better": "improving", "tr.worse": "worsening", "tr.flat": "no clear trend", "tr.up": "rising", "tr.down": "falling",
  "region.vax": "Ask your health unit which vaccines are in the national schedule for your age. After floods, being up to date with tetanus matters for clean-up work. Hepatitis A and rotavirus vaccines protect against water-borne disease. Yellow fever and dengue vaccines depend on the country and area. Draft text pending physician review.",
  "act.title": "What cities, companies and farms can do", "act.intro": "Actions with evidence, ordered by what the data show for this place, and real cases from around the world.", "act.city": "City government", "act.industry": "Industry", "act.farm": "Farms",
  "act.note": "Compiled from public sources during the hackathon. Check the linked source before quoting a number.", "act.here": "For this place", "act.other": "Other actions", "act.all": "Actions", "th.all": "All", "th.air": "Air", "th.water": "Water", "th.heat": "Heat", "th.vector": "Mosquitoes", "th.flood": "Floods", "th.farm": "Farms", "th.industry": "Industry", "act.match": "matches this place", "act.cases": "Cases from around the world", "act.loading": "Playbook not available yet.", "act.source": "source",
  "st.recovering": "recovering", "st.still_critical": "still critical", "st.warning": "warning",
  "sigk.heat": "heat", "sigk.rain_extreme": "extreme rain", "sigk.drying": "drying", "sigk.vector": "mosquitoes", "sigk.air": "air", "sigk.flood": "flood", "sigk.general": "general",
});
I18N.add("es", {
  "tab.region": "Salud de la región", "tab.act": "Municipios y empresas",
  "cap.title": "Diez capitales de un vistazo", "cap.intro": "Capitales de los diez países más poblados elegidos por el equipo, analizadas con el mismo método (cambio por década, 1981–2025). El color es el veredicto. Toque una fila para abrir esa ciudad.", "cap.city": "Capital", "cap.na": "El panel todavía no está disponible.",
  "tools.grid": "¿Dónde está cambiando?", "tools.csv": "Exportar CSV", "tools.gridvar.temp": "Temperatura", "tools.gridvar.rain": "Lluvia",
  "grid.loading": "Cargando 25 puntos alrededor de este lugar…", "grid.legend": "Cada círculo es un punto de la grilla de NASA POWER (cada 0,5°). Rojo: sube, azul: baja, gris: sin tendencia significativa. Color más fuerte indica cambio más rápido.",
  "quant.total": "Cambio total en el registro: <b>{v}</b>.", "quant.periods": "Promedio de 2006–2025 comparado con 1981–2000: <b>{d}</b> ({pct}%).",
  "me.edit": "Editar mi perfil", "me.done": "Listo", "me.start": "Responda unas preguntas para personalizar esto. Sus respuestas quedan en este dispositivo.", "place.hero": "señales del clima cambiaron aquí, con dos bases de datos independientes de acuerdo.", "place.tap": "Toque una señal para ver la evidencia.", "place.evidence": "Evidencia", "place.how": "Cómo calculamos y de dónde vienen los datos", "me.title": "Mi perfil de salud", "me.privacy": "Sus respuestas quedan solo en este dispositivo. No se pide nombre, documento ni correo.",
  "me.age": "Edad", "me.cond": "Condiciones de salud", "me.work": "Trabajo", "me.meds": "Medicamentos que tomo (por clase)", "me.home": "Mi casa",
  "f.u5": "menos de 5", "f.5-17": "5–17", "f.18-59": "18–59", "f.60-74": "60–74", "f.75+": "75 o más",
  "f.hta": "Hipertensión", "f.heart": "Enfermedad cardíaca", "f.kidney": "Enfermedad renal", "f.diabetes": "Diabetes", "f.lung": "Asma / EPOC", "f.bed": "Postrado o movilidad reducida", "f.mental": "Condición de salud mental", "f.pregnant": "Embarazada",
  "f.outdoor": "Trabajo al aire libre",
  "f.diuretic": "Diuréticos (hidroclorotiazida, furosemida)", "f.acei": "IECA / ARA II (enalapril, losartán)", "f.beta": "Betabloqueantes", "f.antichol": "Antihistamínicos anticolinérgicos (prometazina, dexclorfeniramina)", "f.psych": "Antipsicóticos o antidepresivos tricíclicos", "f.lithium": "Litio", "f.nsaid": "Antiinflamatorios (AINE)", "f.alcohol": "Alcohol o estimulantes",
  "f.noceiling": "Techo sin cielorraso", "f.noventil": "Poca ventilación", "f.nofan": "Sin ventilador", "f.alone": "Vive solo/a",
  "light.title": "Semáforo GeoCare: calor", "light.low": "Bajo", "light.mid": "Moderado", "light.high": "Alto",
  "light.rule": "Regla transparente: +1 por cada factor marcado, +2 si la tendencia local de calor es estadísticamente significativa, +2 si el índice de calor de hoy llega a 41 °C. 0–2 bajo, 3–4 moderado, 5 o más alto.",
  "light.r.factors": "{n} factor(es) personal(es): {list}", "light.r.trend": "la tendencia de calor aquí es estadísticamente significativa (+2)", "light.r.today": "el índice de calor de hoy llega a {v} °C (+2)", "light.r.none": "todavía no marcó ningún factor", "light.need": "Elija un lugar para sumar la tendencia local y el índice de calor de hoy.",
  "med.title": "Sus medicamentos y el calor", "med.rule": "Este medicamento puede aumentar su riesgo con el calor. Hable con su médico o con la unidad de salud sobre los días calurosos. No lo suspenda ni lo cambie por su cuenta.",
  "m.diuretic": "Diuréticos: pérdida de líquido, alteración de sales minerales, menos sed.", "m.acei": "IECA / ARA II: presión baja y menos sed; el riesgo aumenta junto con un diurético.", "m.beta": "Betabloqueantes: menos sudor y menos dilatación de los vasos de la piel.", "m.antichol": "Antihistamínicos anticolinérgicos: menos sudor y peor control de la temperatura corporal.", "m.psych": "Antipsicóticos y tricíclicos: menos sudor y peor control de la temperatura corporal.", "m.lithium": "Litio: puede volverse tóxico con la deshidratación.", "m.nsaid": "AINE: daño renal cuando hay deshidratación.", "m.alcohol": "Alcohol y estimulantes: se percibe menos el calor y se pierde más líquido.",
  "med.src": "Fuente: CDC, Heat and Medications: Guidance for Clinicians.",
  "sos.title": "¿Es grave?", "sos.signs": "Confusión, desorientación, convulsión, desmayo o piel muy caliente con el calor es golpe de calor hasta que se demuestre lo contrario.", "sos.call": "Llame ahora:", "sos.local": "su número local de emergencias", "sos.first": "Mientras llega la ayuda: lleve a la persona a la sombra, moje todo el cuerpo y abanique. No dé antitérmico.",
  "care2.title": "Si cuida a alguien postrado, muy mayor o muy pequeño", "care2.tips": "Ofrezca líquidos de a poco, seguido.|Ventile el cuarto y use ropa liviana.|No deje sola a la persona en las horas de más calor.|Signos de alerta: somnolencia, confusión, poca orina, piel muy caliente.",
  "region.title": "Salud en {c}", "region.intro": "Indicadores nacionales a lo largo del tiempo, evaluados con el mismo método de tendencia. Describen todo el país, no su barrio.", "region.none": "No se encontraron indicadores de salud para este país.", "region.need": "Primero elija un lugar.",
  "region.src": "Fuente: World Bank Open Data, con datos de OMS, UNICEF, agencias de la ONU y estadísticas nacionales. Se muestra el último año disponible.",
  "g.life": "Vida y muerte por edad", "g.causes": "Causas y enfermedades", "g.vaccines": "Vacunación", "g.system": "Sistema de salud", "g.wash": "Agua y saneamiento", "g.food": "Alimentación",
  "tr.better": "mejorando", "tr.worse": "empeorando", "tr.flat": "sin tendencia clara", "tr.up": "en aumento", "tr.down": "en descenso",
  "region.vax": "Pregunte en su unidad de salud qué vacunas corresponden a su edad según el calendario nacional. Después de inundaciones, tener al día la antitetánica importa para la limpieza. Las vacunas contra hepatitis A y rotavirus protegen de enfermedades transmitidas por el agua. Las de fiebre amarilla y dengue dependen del país y la zona. Texto en borrador, pendiente de revisión médica.",
  "act.title": "Qué pueden hacer municipios, empresas y productores", "act.intro": "Acciones con evidencia, ordenadas según lo que muestran los datos de este lugar, y casos reales del mundo.", "act.city": "Municipio", "act.industry": "Industria", "act.farm": "Campo",
  "act.note": "Recopilado de fuentes públicas durante el hackathon. Revise la fuente enlazada antes de citar un número.", "act.here": "Para este lugar", "act.other": "Otras acciones", "act.all": "Acciones", "th.all": "Todos", "th.air": "Aire", "th.water": "Agua", "th.heat": "Calor", "th.vector": "Mosquitos", "th.flood": "Inundaciones", "th.farm": "Campo", "th.industry": "Industria", "act.match": "coincide con este lugar", "act.cases": "Casos del mundo", "act.loading": "La guía todavía no está disponible.", "act.source": "fuente",
  "st.recovering": "en recuperación", "st.still_critical": "sigue crítico", "st.warning": "alerta",
  "sigk.heat": "calor", "sigk.rain_extreme": "lluvia extrema", "sigk.drying": "sequía", "sigk.vector": "mosquitos", "sigk.air": "aire", "sigk.flood": "inundación", "sigk.general": "general",
});
I18N.add("pt", {
  "tab.region": "Saúde da região", "tab.act": "Prefeituras e empresas",
  "cap.title": "Dez capitais em um olhar", "cap.intro": "Capitais dos dez países mais populosos escolhidos pela equipe, analisadas com o mesmo método (mudança por década, 1981–2025). A cor é o veredito. Toque numa linha para abrir a cidade.", "cap.city": "Capital", "cap.na": "O painel ainda não está disponível.",
  "tools.grid": "Onde está mudando?", "tools.csv": "Exportar CSV", "tools.gridvar.temp": "Temperatura", "tools.gridvar.rain": "Chuva",
  "grid.loading": "Carregando 25 pontos ao redor deste lugar…", "grid.legend": "Cada círculo é um ponto da grade do NASA POWER (a cada 0,5°). Vermelho: subindo, azul: caindo, cinza: sem tendência significativa. Cor mais forte indica mudança mais rápida.",
  "quant.total": "Mudança total no registro: <b>{v}</b>.", "quant.periods": "Média de 2006–2025 comparada com 1981–2000: <b>{d}</b> ({pct}%).",
  "me.edit": "Editar meu perfil", "me.done": "Pronto", "me.start": "Responda algumas perguntas para personalizar. Suas respostas ficam neste aparelho.", "place.hero": "sinais do clima mudaram aqui, com duas bases de dados independentes de acordo.", "place.tap": "Toque num sinal para ver a evidência.", "place.evidence": "Evidência", "place.how": "Como calculamos e de onde vêm os dados", "me.title": "Meu perfil de saúde", "me.privacy": "Suas respostas ficam só neste aparelho. Não pedimos nome, documento nem e-mail.",
  "me.age": "Idade", "me.cond": "Condições de saúde", "me.work": "Trabalho", "me.meds": "Remédios que uso (por classe)", "me.home": "Minha casa",
  "f.u5": "menos de 5", "f.5-17": "5–17", "f.18-59": "18–59", "f.60-74": "60–74", "f.75+": "75 ou mais",
  "f.hta": "Hipertensão", "f.heart": "Doença cardíaca", "f.kidney": "Doença renal", "f.diabetes": "Diabetes", "f.lung": "Asma / DPOC", "f.bed": "Acamado ou mobilidade reduzida", "f.mental": "Sofrimento psíquico", "f.pregnant": "Gestante",
  "f.outdoor": "Trabalho ao ar livre",
  "f.diuretic": "Diuréticos (hidroclorotiazida, furosemida)", "f.acei": "IECA / BRA (enalapril, losartana)", "f.beta": "Betabloqueadores", "f.antichol": "Anti-histamínicos anticolinérgicos (prometazina, dexclorfeniramina)", "f.psych": "Antipsicóticos ou antidepressivos tricíclicos", "f.lithium": "Lítio", "f.nsaid": "Anti-inflamatórios (AINE)", "f.alcohol": "Álcool ou estimulantes",
  "f.noceiling": "Telhado sem forro", "f.noventil": "Pouca ventilação", "f.nofan": "Sem ventilador", "f.alone": "Mora sozinho(a)",
  "light.title": "Semáforo GeoCare: calor", "light.low": "Baixo", "light.mid": "Moderado", "light.high": "Alto",
  "light.rule": "Regra transparente: +1 para cada fator marcado, +2 se a tendência local de calor for estatisticamente significativa, +2 se o índice de calor de hoje chegar a 41 °C. 0–2 baixo, 3–4 moderado, 5 ou mais alto.",
  "light.r.factors": "{n} fator(es) pessoal(is): {list}", "light.r.trend": "a tendência de calor aqui é estatisticamente significativa (+2)", "light.r.today": "o índice de calor de hoje chega a {v} °C (+2)", "light.r.none": "nenhum fator marcado ainda", "light.need": "Escolha um lugar para somar a tendência local e o índice de calor de hoje.",
  "med.title": "Seus remédios e o calor", "med.rule": "Este medicamento pode aumentar seu risco no calor. Converse com seu médico ou procure a unidade de saúde para avaliar os dias quentes. Não interrompa nem mude por conta própria.",
  "m.diuretic": "Diuréticos: perda de líquido, alteração de sais minerais, menos sede.", "m.acei": "IECA / BRA: pressão baixa e menos sede; o risco aumenta junto com diurético.", "m.beta": "Betabloqueadores: menos suor e menos dilatação dos vasos da pele.", "m.antichol": "Anti-histamínicos anticolinérgicos: menos suor e pior controle da temperatura do corpo.", "m.psych": "Antipsicóticos e tricíclicos: menos suor e pior controle da temperatura do corpo.", "m.lithium": "Lítio: pode ficar tóxico com a desidratação.", "m.nsaid": "AINE: lesão nos rins quando há desidratação.", "m.alcohol": "Álcool e estimulantes: a pessoa percebe menos o calor e perde mais líquido.",
  "med.src": "Fonte: CDC, Heat and Medications: Guidance for Clinicians.",
  "sos.title": "É grave?", "sos.signs": "Confusão, desorientação, convulsão, desmaio ou pele muito quente no calor é golpe de calor até prova em contrário.", "sos.call": "Ligue agora:", "sos.local": "o número de emergência local", "sos.first": "Enquanto o socorro não chega: leve a pessoa para a sombra, molhe o corpo inteiro e abane. Não dê antitérmico.",
  "care2.title": "Se você cuida de alguém acamado, muito idoso ou muito pequeno", "care2.tips": "Ofereça líquidos aos poucos, com frequência.|Ventile o cômodo e use roupas leves.|Não deixe a pessoa sozinha nas horas mais quentes.|Sinais de alerta: sonolência, confusão, pouca urina, pele muito quente.",
  "region.title": "Saúde em {c}", "region.intro": "Indicadores nacionais ao longo do tempo, testados com o mesmo método de tendência. Descrevem o país inteiro, não o seu bairro.", "region.none": "Nenhum indicador de saúde encontrado para este país.", "region.need": "Escolha um lugar primeiro.",
  "region.src": "Fonte: World Bank Open Data, com dados da OMS, UNICEF, agências da ONU e estatísticas nacionais. Mostra o último ano disponível.",
  "g.life": "Vida e morte por idade", "g.causes": "Causas e doenças", "g.vaccines": "Vacinação", "g.system": "Sistema de saúde", "g.wash": "Água e saneamento", "g.food": "Alimentação",
  "tr.better": "melhorando", "tr.worse": "piorando", "tr.flat": "sem tendência clara", "tr.up": "subindo", "tr.down": "caindo",
  "region.vax": "Pergunte na unidade de saúde quais vacinas do calendário nacional valem para a sua idade. Depois de enchentes, estar em dia com a antitetânica importa para a limpeza. As vacinas de hepatite A e rotavírus protegem de doenças transmitidas pela água. As de febre amarela e dengue dependem do país e da região. Texto em rascunho, aguardando revisão médica.",
  "act.title": "O que prefeituras, empresas e produtores podem fazer", "act.intro": "Ações com evidência, ordenadas pelo que os dados mostram neste lugar, e casos reais do mundo.", "act.city": "Prefeitura", "act.industry": "Indústria", "act.farm": "Campo",
  "act.note": "Reunido de fontes públicas durante o hackathon. Confira a fonte indicada antes de citar um número.", "act.here": "Para este lugar", "act.other": "Outras ações", "act.all": "Ações", "th.all": "Todos", "th.air": "Ar", "th.water": "Água", "th.heat": "Calor", "th.vector": "Mosquitos", "th.flood": "Enchentes", "th.farm": "Campo", "th.industry": "Indústria", "act.match": "combina com este lugar", "act.cases": "Casos do mundo", "act.loading": "O guia ainda não está disponível.", "act.source": "fonte",
  "st.recovering": "em recuperação", "st.still_critical": "ainda crítico", "st.warning": "alerta",
  "sigk.heat": "calor", "sigk.rain_extreme": "chuva extrema", "sigk.drying": "seca", "sigk.vector": "mosquitos", "sigk.air": "ar", "sigk.flood": "enchente", "sigk.general": "geral",
});

// Short labels for the national health indicators: [en, es, pt, unit, lowerIsBetter]
const IND_LABEL = {
  "SP.DYN.LE00.IN": ["Life expectancy at birth", "Esperanza de vida al nacer", "Expectativa de vida ao nascer", "years", false],
  "SH.DYN.NMRT": ["Newborn deaths (first 28 days)", "Muertes de recién nacidos (28 días)", "Mortes de recém-nascidos (28 dias)", "per 1,000 births", true],
  "SP.DYN.IMRT.IN": ["Infant deaths (first year)", "Muertes infantiles (primer año)", "Mortes infantis (primeiro ano)", "per 1,000 births", true],
  "SH.DYN.MORT": ["Deaths before age 5", "Muertes antes de los 5 años", "Mortes antes dos 5 anos", "per 1,000 births", true],
  "SH.DYN.0509": ["Deaths at ages 5–9", "Muertes entre 5 y 9 años", "Mortes de 5 a 9 anos", "per 1,000", true],
  "SH.DYN.1014": ["Deaths at ages 10–14", "Muertes entre 10 y 14 años", "Mortes de 10 a 14 anos", "per 1,000", true],
  "SH.DYN.1519": ["Deaths at ages 15–19", "Muertes entre 15 y 19 años", "Mortes de 15 a 19 anos", "per 1,000", true],
  "SH.DYN.2024": ["Deaths at ages 20–24", "Muertes entre 20 y 24 años", "Mortes de 20 a 24 anos", "per 1,000", true],
  "SP.DYN.AMRT.MA": ["Adult men dying between 15 and 60", "Hombres que mueren entre 15 y 60", "Homens que morrem entre 15 e 60", "per 1,000", true],
  "SP.DYN.AMRT.FE": ["Adult women dying between 15 and 60", "Mujeres que mueren entre 15 y 60", "Mulheres que morrem entre 15 e 60", "per 1,000", true],
  "SH.STA.MMRT": ["Mothers dying from pregnancy or birth", "Muertes maternas", "Mortes maternas", "per 100,000 births", true],
  "SH.DTH.COMM.ZS": ["Deaths from infections, maternal and nutrition causes", "Muertes por infecciones, causas maternas y nutrición", "Mortes por infecções, causas maternas e nutrição", "% of deaths", true],
  "SH.DTH.NCOM.ZS": ["Deaths from non-communicable diseases", "Muertes por enfermedades no transmisibles", "Mortes por doenças não transmissíveis", "% of deaths", null],
  "SH.DTH.INJR.ZS": ["Deaths from injuries", "Muertes por lesiones", "Mortes por lesões", "% of deaths", true],
  "SH.DYN.NCOM.ZS": ["Dying at 30–70 from heart disease, cancer, diabetes or lung disease", "Morir entre 30 y 70 por corazón, cáncer, diabetes o pulmón", "Morrer entre 30 e 70 por coração, câncer, diabetes ou pulmão", "%", true],
  "SH.STA.AIRP.P5": ["Deaths attributed to air pollution", "Muertes atribuidas a la contaminación del aire", "Mortes atribuídas à poluição do ar", "per 100,000", true],
  "SH.STA.WASH.P5": ["Deaths attributed to unsafe water and sanitation", "Muertes atribuidas a agua y saneamiento inseguros", "Mortes atribuídas a água e saneamento inseguros", "per 100,000", true],
  "SH.TBS.INCD": ["Tuberculosis cases", "Casos de tuberculosis", "Casos de tuberculose", "per 100,000", true],
  "SH.MLR.INCD.P3": ["Malaria cases", "Casos de malaria", "Casos de malária", "per 1,000 at risk", true],
  "SH.IMM.IDPT": ["Children vaccinated: DTP (3 doses)", "Niños vacunados: DTP (3 dosis)", "Crianças vacinadas: DTP (3 doses)", "%", false],
  "SH.IMM.MEAS": ["Children vaccinated: measles", "Niños vacunados: sarampión", "Crianças vacinadas: sarampo", "%", false],
  "SH.IMM.HEPB": ["Children vaccinated: hepatitis B (3 doses)", "Niños vacunados: hepatitis B (3 dosis)", "Crianças vacinadas: hepatite B (3 doses)", "%", false],
  "SH.MED.BEDS.ZS": ["Hospital beds", "Camas hospitalarias", "Leitos hospitalares", "per 1,000 people", false],
  "SH.MED.PHYS.ZS": ["Physicians", "Médicos", "Médicos", "per 1,000 people", false],
  "SH.MED.NUMW.P3": ["Nurses and midwives", "Enfermeras y parteras", "Enfermeiras e parteiras", "per 1,000 people", false],
  "SH.UHC.SRVS.CV.XD": ["Coverage of essential health services (index)", "Cobertura de servicios esenciales de salud (índice)", "Cobertura de serviços essenciais de saúde (índice)", "0–100", false],
  "SH.XPD.CHEX.PC.CD": ["Health spending per person", "Gasto en salud por persona", "Gasto em saúde por pessoa", "US$", false],
  "SH.H2O.SMDW.ZS": ["People with safely managed drinking water", "Personas con agua potable gestionada de forma segura", "Pessoas com água potável gerida com segurança", "%", false],
  "SH.H2O.BASW.ZS": ["People with at least basic drinking water", "Personas con al menos agua potable básica", "Pessoas com ao menos água potável básica", "%", false],
  "SH.STA.SMSS.ZS": ["People with safely managed sanitation", "Personas con saneamiento gestionado de forma segura", "Pessoas com saneamento gerido com segurança", "%", false],
  "SH.STA.BASS.ZS": ["People with at least basic sanitation", "Personas con al menos saneamiento básico", "Pessoas com ao menos saneamento básico", "%", false],
  "SN.ITK.DEFC.ZS": ["People undernourished", "Personas subalimentadas", "Pessoas subalimentadas", "%", true],
  "SN.ITK.MSFI.ZS": ["People with moderate or severe food insecurity", "Personas con inseguridad alimentaria moderada o grave", "Pessoas com insegurança alimentar moderada ou grave", "%", true],
};

// Reverse geocoding with country code (used to load the country's health indicators).
async function geoInfo(lat, lon) {
  const j = await getJSON(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&zoom=14&accept-language=${I18N.lang}`);
  const a = j.address || {};
  return {
    cc: (a.country_code || "").toUpperCase(), country: a.country || "",
    label: [a.suburb || a.neighbourhood || a.village, a.city || a.town || a.municipality || a.county, a.country].filter(Boolean).join(", ") || j.display_name,
  };
}

// "How much": total change over the record and comparison between two 20-year periods.
function quantLine(s) {
  const tr = s.era5 || s.nasa; if (!tr || s.waiting) return "";
  const u = t("unit." + s.unit).replace("/yr", "").replace("/año", "").replace("/ano", "");
  let h = `<p class="quant">${t("quant.total", { v: `${signed(tr.total, s.d)} ${u}` })}`;
  if (Number.isFinite(tr.pA) && Number.isFinite(tr.pB)) {
    const d = tr.pB - tr.pA, pct = tr.pA !== 0 ? (d / Math.abs(tr.pA)) * 100 : NaN;
    const line = t("quant.periods", { d: `${signed(d, s.d)} ${u}`, pct: signed(pct, 0) });
    h += " " + (s.unit === "°C" || !Number.isFinite(pct) ? line.replace(/\s*\([^)]*%\)/, "") : line); // a percentage of degrees Celsius has no meaning
  }
  return h + "</p>";
}

const Extras = (() => {
  const GROUPS = { age: ["u5", "5-17", "18-59", "60-74", "75+"], cond: ["hta", "heart", "kidney", "diabetes", "lung", "bed", "mental", "pregnant"], work: ["outdoor"], meds: ["diuretic", "acei", "beta", "antichol", "psych", "lithium", "nsaid", "alcohol"], home: ["noceiling", "noventil", "nofan", "alone"] };
  const SOS = { PY: [["911", ""], ["141", "SEME"]], BR: [["192", "SAMU"], ["193", ""]], AR: [["107", "SAME"], ["911", ""]] };
  const ui = { aud: "city", gridVar: "temp", health: {}, meta: null, playbook: undefined, layers: {} };
  let profile = { age: "", on: [] };
  try { profile = JSON.parse(localStorage.getItem("geocare.profile")) || profile; } catch (_) { /* storage unavailable */ }
  const saveProfile = () => { try { localStorage.setItem("geocare.profile", JSON.stringify(profile)); } catch (_) { /* ignore */ } };
  const layer = (name) => (ui.layers[name] ||= L.layerGroup().addTo(map));

  /* ---------- profile + traffic light ---------- */
  function light(r) {
    const personal = [...profile.on];
    if (["u5", "60-74", "75+"].includes(profile.age)) personal.unshift(profile.age);
    let score = personal.length; const why = [];
    why.push(personal.length ? t("light.r.factors", { n: personal.length, list: personal.map((k) => t("f." + k).split(" (")[0]).join(", ") }) : t("light.r.none"));
    if (r) {
      if (rising(sig(r, "temp")) || rising(sig(r, "hotdays"))) { score += 2; why.push(t("light.r.trend")); }
      const hi = r.now?.days?.[0]?.feels;
      if (hi >= 41) { score += 2; why.push(t("light.r.today", { v: fmt(hi, 0) })); }
    }
    return { score, level: score >= 5 ? "high" : score >= 3 ? "mid" : "low", why };
  }
  function renderMe() {
    const box = document.querySelector("#me-box"); if (!box) return;
    const r = state.main, L1 = light(r), filled = !!(profile.age || profile.on.length);
    const chip = (group, k) => { const on = group === "age" ? profile.age === k : profile.on.includes(k); return `<label class="pchip ${on ? "on" : ""}"><input type="${group === "age" ? "radio" : "checkbox"}" name="p-${group}" data-g="${group}" value="${k}" ${on ? "checked" : ""}>${t("f." + k)}</label>`; };
    const meds = GROUPS.meds.filter((k) => profile.on.includes(k));
    if (ui.editing === undefined) ui.editing = !filled;
    let h = `<section class="lighthero light-${L1.level}"><div class="lh-top"><span class="lamp"><span></span></span><div class="lh-t"><p class="eyebrow">${t("light.title")}</p><p class="lh-level">${t("light." + L1.level)} <small>${L1.score}</small></p></div><button class="btn small ghost" id="me-edit">${t(ui.editing ? "me.done" : "me.edit")}</button></div>
      <ul class="lh-why">${L1.why.map((w) => `<li>${w}</li>`).join("")}</ul>${r ? "" : `<p class="muted small">${t("light.need")}</p>`}${filled ? "" : `<p class="lh-cta">${t("me.start")}</p>`}</section>`;
    if (ui.editing) {
      h += `<section class="card plain me"><p class="eyebrow">${t("me.title")}</p><p class="muted small">🔒 ${t("me.privacy")}</p>`;
      for (const g of ["age", "cond", "work", "meds", "home"]) h += `<p class="plabel">${t("me." + g)}</p><div class="pchips">${GROUPS[g].map((k) => chip(g, k)).join("")}</div>`;
      h += `<p class="muted small rule">${t("light.rule")}</p></section>`;
    }
    if (meds.length) h += `<section class="notice"><p class="eyebrow">${t("med.title")}</p><ul>${meds.map((k) => `<li>${t("m." + k)}</li>`).join("")}</ul><p class="strong">${t("med.rule")}</p><p class="muted small">${t("med.src")}</p></section>`;
    if (profile.on.includes("bed") || ["u5", "75+"].includes(profile.age)) h += `<section class="notice calm"><p class="eyebrow">${t("care2.title")}</p><ol class="steps">${t("care2.tips").split("|").map((x) => `<li>${x}</li>`).join("")}</ol></section>`;
    box.innerHTML = h;
    box.querySelector("#me-edit").onclick = () => { ui.editing = !ui.editing; renderMe(); };
    box.querySelectorAll("input").forEach((inp) => (inp.onchange = () => {
      if (inp.dataset.g === "age") profile.age = inp.value;
      else profile.on = inp.checked ? [...new Set([...profile.on, inp.value])] : profile.on.filter((k) => k !== inp.value);
      saveProfile(); renderMe();
    }));
    const sos = document.querySelector("#sos-box");
    if (sos) {
      const nums = SOS[r?.cc];
      sos.innerHTML = `<section class="sosband"><p class="eyebrow">${t("sos.title")}</p><p>${t("sos.signs")}</p><p class="call">${t("sos.call")} ${nums ? nums.map(([n, l]) => `<a class="tel" href="tel:${n}">${n}${l ? ` <small>${l}</small>` : ""}</a>`).join(" ") : `<b>${t("sos.local")}</b>`}</p><p class="muted small">${t("sos.first")}</p></section>`;
    }
  }

  /* ---------- region health (country indicators) ---------- */
  function loadHealth(cc) {
    if (ui.health[cc] !== undefined) return;
    ui.health[cc] = null;
    Promise.all([fetch(`data/health/${cc}.json`).then((x) => (x.ok ? x.json() : false)), ui.meta || fetch("data/health/_indicators.json").then((x) => (x.ok ? x.json() : {}))])
      .then(([d, m]) => { ui.health[cc] = d; ui.meta = m; }).catch(() => { ui.health[cc] = false; }).finally(() => renderRegion());
  }
  function renderRegion() {
    const box = document.querySelector("#p-region"), r = state.main; if (!box) return;
    if (!r) { box.innerHTML = `<p class="muted">${t("region.need")}</p>`; return; }
    if (!r.cc) { box.innerHTML = `<p class="loading">…</p>`; return; }
    loadHealth(r.cc);
    const d = ui.health[r.cc];
    if (d === null) { box.innerHTML = `<p class="loading">…</p>`; return; }
    if (!d) { box.innerHTML = `<h2>${t("region.title", { c: r.cc })}</h2><p class="muted">${t("region.none")}</p>`; return; }
    const li = { en: 0, es: 1, pt: 2 }[I18N.lang];
    const series = (c) => { const ys = Object.keys(d.ind[c] || {}).map(Number).sort((a, b) => a - b); return { ys, vs: ys.map((y) => d.ind[c][y]) }; };
    const stat = (c) => { const { ys, vs } = series(c); if (!ys.length) return ""; return `<div><b>${fmt(vs[vs.length - 1], ui.meta[c].digits)}</b><span>${IND_LABEL[c][li]} · ${ys[ys.length - 1]}</span></div>`; };
    let h = `<h2>${t("region.title", { c: esc(d.name) })}</h2><p class="muted small">${t("region.intro")}</p><div class="stats3">${stat("SP.DYN.LE00.IN")}${stat("SP.DYN.IMRT.IN")}${stat("SH.IMM.MEAS")}</div>`;
    for (const g of ["life", "causes", "vaccines", "system", "wash", "food"]) {
      const codes = Object.keys(IND_LABEL).filter((c) => ui.meta?.[c]?.group === g && d.ind[c]);
      if (!codes.length) continue;
      h += `<h3>${t("g." + g)}</h3><div class="irows">`;
      for (const c of codes) {
        const { ys, vs } = series(c), tr = Stats.trend(ys, vs), lab = IND_LABEL[c], dg = ui.meta[c].digits;
        let badge = `<span class="badge">${t("tr.flat")}</span>`;
        if (tr?.significant) {
          const good = lab[4] === null ? null : (tr.direction < 0) === lab[4];
          badge = good === null ? `<span class="badge">${t(tr.direction > 0 ? "tr.up" : "tr.down")}</span>` : `<span class="badge ${good ? "b-good" : "v-confirmed"}">${t(good ? "tr.better" : "tr.worse")}</span>`;
        }
        h += `<details class="irow" data-ind="${c}"><summary><span class="in">${lab[li]}</span><span class="iv">${fmt(vs[vs.length - 1], dg)}<small>${lab[3]}</small></span>${badge}</summary>
          <div class="ibody"><div class="chart-wrap"><canvas></canvas></div><p class="muted small">${ys[0]}: ${fmt(vs[0], dg)} → ${ys[ys.length - 1]}: ${fmt(vs[vs.length - 1], dg)}${tr ? ` · ${signed(tr.slopeDecade, dg + 1)} ${t("per.decade")} · Mann-Kendall p = ${tr.p < 0.001 ? "&lt;0.001" : tr.p.toFixed(3)}` : ""}</p></div></details>`;
      }
      h += `</div>`;
      if (g === "vaccines") h += `<p class="why">${t("region.vax")}</p>`;
    }
    h += `<p class="muted small foot">${t("region.src")}</p>`;
    box.innerHTML = h;
    box.querySelectorAll("details.irow").forEach((el2) => el2.addEventListener("toggle", () => {
      if (!el2.open || el2.dataset.drawn) return; el2.dataset.drawn = 1;
      const c = el2.dataset.ind, { ys, vs } = series(c);
      state.charts.push(new Chart(el2.querySelector("canvas"), { type: "line", data: { labels: ys, datasets: [{ label: IND_LABEL[c][li], data: vs, borderColor: "#1f7f5f", backgroundColor: "#1f7f5f", pointRadius: 1.5, borderWidth: 2, tension: 0.2 }] }, options: { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxTicksLimit: 8 }, grid: { display: false } }, y: { grid: { color: "#e6ebe8" } } } } }));
    }));
  }

  /* ---------- playbook: cities, industry, farms ---------- */
  function placeSignals(r) {
    const s = new Set(["general"]); if (!r) return s;
    if (rising(sig(r, "temp")) || rising(sig(r, "hotdays"))) s.add("heat");
    if (rising(sig(r, "rain"), -1) || rising(sig(r, "drydays"))) s.add("drying");
    if (rising(sig(r, "heavyrain"))) s.add("rain_extreme");
    if (rising(sig(r, "aedes"))) s.add("vector");
    if (r.now?.pm25 > 15) s.add("air");
    if (r.terrain?.low || riverLevel(r.river)) s.add("flood");
    return s;
  }
  function renderAct() {
    const box = document.querySelector("#p-act"); if (!box) return;
    if (ui.playbook === undefined) { ui.playbook = null; fetch("data/playbook.json").then((x) => (x.ok ? x.json() : false)).then((j) => { ui.playbook = j; }).catch(() => { ui.playbook = false; }).finally(() => renderAct()); }
    let h = `<h2>${t("act.title")}</h2><p class="muted small">${t("act.intro")} ${t("act.note")}</p>`;
    const pb = ui.playbook, L2 = I18N.lang, tx = (o) => esc(o?.[L2] || o?.en || "");
    if (!pb) { box.innerHTML = h + `<p class="muted">${pb === null ? "…" : t("act.loading")}</p>`; return; }
    const sigs = placeSignals(state.main);
    h += `<div class="seg">${["city", "industry", "farm"].map((a) => `<button class="${ui.aud === a ? "on" : ""}" data-aud="${a}">${t("act." + a)}</button>`).join("")}</div>`;
    const acts = pb.actions.filter((a) => a.audience === ui.aud).map((a) => ({ ...a, match: !!state.main && a.signal !== "general" && sigs.has(a.signal) }));
    const block = (title, list, hot) => (list.length ? `<p class="plabel">${title}</p><ol class="acts ${hot ? "hot" : ""}">` + list.map((a) => `<li><div><p class="at">${tx(a.action)}</p><p class="muted small">${tx(a.evidence)} <a href="${esc(a.source)}" target="_blank" rel="noopener">${t("act.source")}</a></p></div><span class="badge ${hot ? "v-likely" : ""}">${t("sigk." + a.signal)}</span></li>`).join("") + `</ol>` : "");
    h += block(t("act.here"), acts.filter((a) => a.match), true) + block(t(acts.some((a) => a.match) ? "act.other" : "act.all"), acts.filter((a) => !a.match), false);
    const themes = ["all", ...new Set(pb.cases.map((c) => c.theme))];
    if (!themes.includes(ui.theme)) ui.theme = "all";
    h += `<h3>${t("act.cases")}</h3><div class="fchips">${themes.map((k) => `<button class="chip ${ui.theme === k ? "on" : ""}" data-th="${k}">${t("th." + k)}</button>`).join("")}</div><div class="topics">`;
    const lay = layer("cases"); lay.clearLayers();
    for (const c of pb.cases.filter((x) => ui.theme === "all" || x.theme === ui.theme)) {
      const col = c.status === "recovering" ? "#1f7f5f" : c.status === "warning" ? "#c08a2e" : "#b2592a";
      h += `<details class="topic case" data-lat="${c.lat}" data-lon="${c.lon}"><summary><span class="sdot" style="background:${col}"></span><span class="tt">${tx(c.title)}<small>${esc(c.place)}</small></span><span class="badge st-${c.status}">${t("st." + c.status)}</span></summary><div class="tbody"><p>${tx(c.what_happened)}</p><p>${tx(c.what_changed)}</p><p class="muted small"><a href="${esc(c.source)}" target="_blank" rel="noopener">${t("act.source")}</a></p></div></details>`;
      if (Number.isFinite(c.lat)) L.circleMarker([c.lat, c.lon], { radius: 8, color: col, fillOpacity: 0.7 }).bindPopup(`<b>${tx(c.title)}</b><br>${esc(c.place)}`).addTo(lay);
    }
    box.innerHTML = h + `</div>`;
    box.querySelectorAll(".seg button").forEach((b) => (b.onclick = () => { ui.aud = b.dataset.aud; renderAct(); }));
    box.querySelectorAll(".fchips .chip").forEach((b) => (b.onclick = () => { ui.theme = b.dataset.th; renderAct(); }));
    box.querySelectorAll("details.case").forEach((d2) => d2.addEventListener("toggle", () => { if (d2.open && d2.dataset.lat) map.setView([+d2.dataset.lat, +d2.dataset.lon], 6); }));
  }

  /* ---------- where is it changing: 5 x 5 grid of NASA POWER points ---------- */
  async function loadGrid(r) {
    r.grid = "loading"; renderTools();
    const pts = []; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) pts.push([r.lat + i * 0.5, r.lon + j * 0.5]);
    const res = await Promise.all(pts.map(([la, lo]) => fetchNasa(la, lo).then((n) => ({ la, lo, temp: Stats.trend(YEARS, n.temp), rain: Stats.trend(YEARS, n.rain) })).catch(() => null)));
    r.grid = res.filter(Boolean); if (state.main === r) { renderTools(); drawGrid(r); map.fitBounds(L.latLngBounds(pts), { padding: [20, 20] }); }
  }
  function drawGrid(r) {
    const lay = layer("grid"); lay.clearLayers();
    if (!Array.isArray(r?.grid)) return;
    const v = ui.gridVar, max = Math.max(...r.grid.map((g) => Math.abs(g[v]?.slopeDecade || 0)), 1e-9);
    for (const g of r.grid) {
      const tr = g[v]; if (!tr) continue;
      const col = !tr.significant ? "#8b9692" : tr.direction > 0 ? "#b2592a" : "#3d6f8e";
      L.circleMarker([g.la, g.lo], { radius: 13, color: col, weight: 1, fillColor: col, fillOpacity: tr.significant ? 0.25 + 0.6 * (Math.abs(tr.slopeDecade) / max) : 0.25 })
        .bindPopup(`${t("tools.gridvar." + v)}: ${signed(tr.slopeDecade, v === "temp" ? 2 : 0)} ${v === "temp" ? "°C" : "mm"} ${t("per.decade")}<br>p = ${tr.p < 0.001 ? "&lt;0.001" : tr.p.toFixed(3)}`).addTo(lay);
    }
  }
  function exportCSV(r) {
    const rows = [["year", ...r.signals.flatMap((s) => s.src.map((src) => `${s.key}_${src}`))]];
    YEARS.forEach((y, i) => rows.push([y, ...r.signals.flatMap((s) => s.src.map((src) => { const v = (src === "nasa" ? nasaOf(r, s.key) : r[src])?.[s.key]?.[i]; return Number.isFinite(v) ? +v.toFixed(3) : ""; }))]));
    rows.push([], ["signal", "source", "slope_per_decade", "ci95_low", "ci95_high", "mann_kendall_p", "significant", "verdict"]);
    for (const s of r.signals) for (const src of s.src) { const tr = s[src]; if (tr) rows.push([s.key, src === "nasa" ? "NASA POWER (MERRA-2)" : "ERA5", tr.slopeDecade.toFixed(4), tr.loDecade.toFixed(4), tr.hiDecade.toFixed(4), tr.p.toExponential(3), tr.significant, s.verdict]); }
    rows.push([], ["place", r.label.replace(/,/g, " ")], ["lat", r.lat], ["lon", r.lon], ["method", "Mann-Kendall + Theil-Sen on yearly values 1981-2025"]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.map((x) => x.join(",")).join("\n")], { type: "text/csv" }));
    a.download = `geocare_${r.lat.toFixed(2)}_${r.lon.toFixed(2)}.csv`; a.click(); URL.revokeObjectURL(a.href);
  }
  function renderTools() {
    const box = document.querySelector("#place-tools"), r = state.main; if (!box || !r) return;
    let h = `<button class="btn small ghost" id="t-grid">◱ ${t("tools.grid")}</button><button class="btn small ghost" id="t-csv">⇩ ${t("tools.csv")}</button>`;
    if (r.grid === "loading") h += `<p class="loading small">${t("grid.loading")}</p>`;
    else if (Array.isArray(r.grid)) h += `<div class="seg small">${["temp", "rain"].map((v) => `<button class="${ui.gridVar === v ? "on" : ""}" data-v="${v}">${t("tools.gridvar." + v)}</button>`).join("")}</div><p class="muted small">${t("grid.legend")}</p>`;
    box.innerHTML = h;
    box.querySelector("#t-grid").onclick = () => { if (!r.grid) loadGrid(r); else if (Array.isArray(r.grid)) { drawGrid(r); } };
    box.querySelector("#t-csv").onclick = () => exportCSV(r);
    box.querySelectorAll(".seg button").forEach((b) => (b.onclick = () => { ui.gridVar = b.dataset.v; renderTools(); drawGrid(r); }));
  }

  /* ---------- ten capitals panel (precomputed with the same method) ---------- */
  function renderCapitals() {
    const boxes = document.querySelectorAll(".capitals-box"); if (!boxes.length) return;
    if (ui.capitals === undefined) { ui.capitals = null; fetch("data/capitals.json").then((x) => (x.ok ? x.json() : false)).then((j) => { ui.capitals = j; }).catch(() => { ui.capitals = false; }).finally(() => renderCapitals()); }
    const c = ui.capitals;
    let h = `<h3>${t("cap.title")}</h3>`;
    if (!c) h += `<p class="muted small">${c === null ? "…" : t("cap.na")}</p>`;
    else {
      const cols = [["temp", 2], ["hotdays", 1], ["rain", 0], ["aedes", 2]];
      const cell = (s, d) => { const tr = s.era5 || s.nasa; return `<td><span class="vdot v-${s.verdict}"></span>${tr ? signed(tr.slope, d) : "–"}</td>`; };
      h += `<p class="muted small">${t("cap.intro")}</p><div class="tblwrap"><table class="cmp caps"><thead><tr><th>${t("cap.city")}</th>${cols.map(([k]) => `<th>${t("sig." + k)}<br><small>${t("unit." + SIGNALS.find((x) => x.key === k).unit)}</small></th>`).join("")}</tr></thead><tbody>`;
      c.capitals.forEach((p, i) => { h += `<tr data-i="${i}"><td><b>${esc(p.name)}</b><br><small class="muted">${esc(p.country)}</small></td>${cols.map(([k, d]) => cell(p.signals[k], d)).join("")}</tr>`; });
      h += `</tbody></table></div><p class="muted small"><span class="vdot v-confirmed"></span>${t("verdict.confirmed")} <span class="vdot v-likely"></span>${t("verdict.likely")} <span class="vdot v-single"></span>${t("verdict.single")} <span class="vdot v-conflict"></span>${t("verdict.conflict")} <span class="vdot v-none"></span>${t("verdict.none")}</p>`;
    }
    boxes.forEach((b) => { b.innerHTML = h; b.querySelectorAll("tr[data-i]").forEach((tr) => (tr.onclick = () => { const p = c.capitals[+tr.dataset.i]; document.querySelector("#q").value = p.name; analyzeAt(p.lat, p.lon, `${p.name}, ${p.country}`); })); });
  }

  function render() {
    renderMe(); renderTools(); renderRegion(); renderAct(); renderCapitals();
    if (!Array.isArray(state.main?.grid) && ui.layers.grid) ui.layers.grid.clearLayers();
  }
  return { render };
})();
