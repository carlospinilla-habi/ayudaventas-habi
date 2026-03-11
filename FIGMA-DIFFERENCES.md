# Diferencias: implementación vs diseño Figma

Referencia: [Landing Yo-lo-vendo](https://www.figma.com/design/Kx0BHJHfqPtNYOFF1xRUWg/Landing---Yo-lo-vendo?node-id=232-30560)

## 1. Navbar
| Elemento | Figma | Implementación actual |
|----------|--------|------------------------|
| Marca | "Ayudaventa" (singular) | "Ayudaventas" |
| Botón CTA | "Mi casa" | "Mi Habi" |
| Subtexto | "by habi.co" | "by habi.co" ✓ |

## 2. Hero
| Elemento | Figma | Implementación actual |
|----------|--------|------------------------|
| Pill | "La forma mas facil de vender" | "La forma mas fácil de vender" (con tilde) |
| Título | "¿Listo para vender tu casa?" | ✓ Igual |
| Subtítulo | "Hacerlo es mucho más fácil con la guia de la experiencia a tu lado." (guia sin tilde) | "guía" con tilde |

## 3. Primero lo primero (Features 1)
| Elemento | Figma | Implementación actual |
|----------|--------|------------------------|
| Subtitle | "Dependiendo de qué necesitas te podemos guiar mejor. 👇" | ✓ Igual (algunas versiones Figma usan ✨) |
| Botón card | "Este soy yó" | "¡Esto soy yo!" |

## 4. Servicios de venta (Features 2)
| Elemento | Figma | Implementación actual |
|----------|--------|------------------------|
| Botones cards | "Este soy yó" / "Listo, soy yo!" | "¡Esto soy yo!" en todas |
| Card 1 descripción | "No pedo espera, necesito vender..." (typo en Figma) | "No puedo esperar, necesito vender..." ✓ (corregido) |

## 5. Habímetro
| Elemento | Figma | Implementación actual |
|----------|--------|------------------------|
| Pill | "VAlor comercial" (mayúsculas) | "Valor comercial" |
| Descripción | Placeholder EN en Figma | Texto en español ✓ |

## 6. Crea la ficha
| Elemento | Figma | Implementación actual |
|----------|--------|------------------------|
| Botón | "Crear mi ayudaventa" / "Crear el ayudaventas" | "Crear mi ayudaventa" ✓ |

## 7. CTA + estadísticas
| Elemento | Figma | Implementación actual |
|----------|--------|------------------------|
| Segundo botón | Morado sólido, texto blanco "Calcular el valor de mi casa" | Outline blanco |
| Íconos stats | SVG (casa, calendario, círculo) | Emojis 🏠 📅 ✓ |

## 8. Footer
| Elemento | Figma | Implementación actual |
|----------|--------|------------------------|
| Marca | "Ayudaventa" / "by habi.co" | "Ayudaventas" / "by habi.co" |
| Copyright | "Lovendo 2025. All right reserved" (o similar) | "© ayudaventas 2025. All rights reserved" |
| Links | "Terms & Conditions" · "Privacy Policy" | "Términos y Condiciones" · "Privacy Policy" (español) |

## 9. Estilos generales
- Revisar que border del navbar sea sutil (Figma usa color border info o gris).
- Card Features 1: borde #430070 8px, fondo #f1f1f1 ✓ ya aplicado.
- Segundo botón CTA: debe verse como botón morado relleno, no outline.

---

## Correcciones aplicadas (fidelidad Figma)

1. **Navbar:** "Ayudaventa" (singular), botón "Mi casa".
2. **Hero:** Pill "La forma mas facil de vender"; subtítulo "guia" sin tilde.
3. **Features 1:** Botón "Este soy yó".
4. **Features 2:** Botón destacado "Listo, soy yo!"; botones outline "Este soy yó".
5. **Habímetro:** Pill "VALOR COMERCIAL" en mayúsculas.
6. **CTA Stats:** Segundo botón morado sólido; íconos SVG (casa, calendario, %) con fondos circulares.
7. **Footer:** "Ayudaventa", links "Terms & Conditions" y "Privacy Policy".
