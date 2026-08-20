# PLAN DE TRANSFORMACIÓN — JOGA INTELLIGENCE
## De 35/100 a 80/100 App Store Readiness

---

## FASE 1: CONTENIDO x10 (esta sesión)

### Estado actual vs objetivo:

| Elemento       | AHORA (por app) | OBJETIVO (por app) |
|----------------|-----------------|---------------------|
| Prácticas      | 3               | 30                  |
| Afirmaciones   | 7               | 30                  |
| Leyes/Principios | 6             | 12                  |
| Todo bilingüe  | ✅              | ✅                  |

### Total de contenido nuevo:
- 7 apps × 27 prácticas nuevas × 2 idiomas = 378 prácticas
- 7 apps × 23 afirmaciones nuevas × 2 idiomas = 322 afirmaciones
- 7 apps × 6 leyes nuevas × 2 idiomas = 84 leyes
- **TOTAL: 784 piezas de contenido nuevo**

### Arquitectura de contenido:
- Contenido movido a archivos JS separados: `content/<app>-content.js`
- Cada HTML carga su archivo de contenido via `<script src="content/<app>-content.js">`
- HTML queda limpio, contenido fácil de actualizar

### Apps y sus temas:

1. **JogaBody** (jogaflow.html) — Cuerpo, energía, respiración, movimiento
2. **JogaMind** (subment.html) — Subconsciente, reprogramación mental, visualización
3. **JogaTime** (jogatime.html) — Tiempo, productividad, enfoque, prioridades
4. **JogaBit** (protoneutron.html) — Hábitos, disciplina, sistemas, consistencia
5. **JogaCapital** (monexium.html) — Dinero, mentalidad financiera, inversión
6. **JogaVenty** (ventmex.html) — Ventas, persuasión, influencia, cierre
7. **JogaPath** (metodoexito.html) — Éxito integral, plan de vida, liderazgo

---

## FASE 2: MEJORAS UX (próxima sesión)
- Onboarding (quiz + personalización)
- Categorías de prácticas (mañana/tarde/noche, nivel)
- Timer flexible (no solo 4-7-8)
- Progresión de dificultad

## FASE 3: ENGAGEMENT (siguiente)
- Badges y logros
- Contenido desbloqueado por racha
- Práctica aleatoria del día mejorada
- Push notifications (si Capacitor)

## FASE 4: APP STORE (futuro)
- Capacitor wrapper
- Splash screen nativo
- Deep links
- Auth real

---

*Creado: agosto 2026*
