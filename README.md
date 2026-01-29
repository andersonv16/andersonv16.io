# Reforma Tributária - Site Otimizado 🚀

## ✨ Melhorias Implementadas

### 1. 🎨 Paleta de Cores Otimizada (Sistema Azul Original)
- **Cor Primária:** `#1a3a52` (Azul escuro profissional)
- **Cor Secundária:** `#2a5a7a` (Azul médio)
- **Cor Destaque:** `#0066cc` (Azul vibrante)
- **Cor Acento:** `#ffb700` (Amarelo dourado)
- **Cores de Fundo:** `#f0f2f5` e `#e6e9ed` (cinzas suaves)

A paleta mantém a identidade visual original com azul profissional e acentos em dourado, garantindo ótima legibilidade e contraste.

### 2. 📱 Responsividade Mobile Completa
- **Grid Dinâmico:** `grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr))`
- **Breakpoints:**
  - Desktop: > 1024px
  - Tablet: 768px - 1024px
  - Mobile: < 768px
  - Mobile pequeno: < 480px
- **Menu Mobile:** Menu vertical com wrap automático
- **Cards Flexíveis:** Adaptam-se automaticamente ao tamanho da tela
- **Fontes Responsivas:** Uso de `clamp()` para títulos escaláveis

### 3. 💰 Detalhamento Completo dos Impostos Antigos
A calculadora agora mostra:

#### Sistema Antigo (Base: São Paulo)
- **PIS:** Alíquota e valor separados
- **COFINS:** Alíquota e valor separados
- **ICMS-SP:** Alíquota 18% (média de SP) e valor
- **ISS:** Alíquota 5% (para serviços) e valor
- **Efeito Cascata:** Custo adicional de 12% (impostos sobre impostos)

Cada imposto é apresentado em um card individual com:
- Ícone distintivo
- Nome completo do imposto
- Descrição (Federal, Estadual, Municipal)
- Alíquota aplicada
- Valor calculado

### 4. 🎯 Setores e Reduções Expandidos
**Novos setores adicionados:**
- Produtos Culturais (60% de redução)
- Alimentos in natura (40% de redução)
- Medicamentos (60% de redução)
- Dispositivos Médicos (60% de redução)
- Transporte Coletivo (100% de isenção)
- Agricultura Familiar (100% de isenção)
- Extração Mineral (IS 1%)
- Apostas (IS 12%)

Total de **10 categorias** com reduções e **6 categorias** de IS.

### 5. 📊 Gráficos Dinâmicos e Interativos (Chart.js)

#### Gráfico 1: Composição dos Impostos (Doughnut)
- Mostra a proporção entre CBS, IBS e IS (se aplicável)
- Cores da paleta do site
- Tooltips formatados em Real (R$)

#### Gráfico 2: Comparação Sistema Antigo vs Novo (Bar)
- Comparação visual lado a lado
- Vermelho para sistema antigo (mais caro)
- Verde para sistema novo (mais econômico)

#### Gráfico 3: Detalhamento Completo (Horizontal Bar)
- Mostra TODOS os impostos antigos individualmente
- Efeito cascata destacado
- Impostos novos (CBS, IBS, IS)
- Permite visualizar exatamente onde está cada real pago

### 6. 🔧 Otimização de Código

#### Antes:
- 3 arquivos CSS (1.809 linhas)
- 3 arquivos JS (1.059+ linhas)
- Código duplicado
- Scripts separados

#### Depois:
- 1 arquivo CSS unificado (1.100 linhas) - **Redução de 39%**
- 1 arquivo JS otimizado (800+ linhas) - **Redução de 24%**
- Variáveis CSS centralizadas
- Funções reutilizáveis
- Melhor organização

### 7. 📐 Grid Responsivo Melhorado

```css
/* Grid principal */
.container-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
    gap: 25px;
    padding: var(--espacamento-xl) var(--espacamento-md);
    max-width: 1400px;
    margin: 0 auto;
}

/* Responsivo para tablets */
@media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
}

/* Responsivo para mobile */
@media (max-width: 768px) {
    grid-template-columns: 1fr;
}
```

### 8. 🎨 Destaque 2026 no IBS
A seção "Destaque de 2026" na página do IBS agora usa o mesmo estilo visual da "Dica do Especialista":
- Fundo com gradiente azul (primária → secundária)
- Título em amarelo dourado
- Texto centralizado
- Visual consistente com outras seções de destaque

### 9. 🎨 Variáveis CSS Centralizadas

```css
:root {
    /* Cores */
    --cor-primaria: #4F1818;
    --cor-secundaria: #7A2828;
    --cor-destaque: #A63838;
    --cor-acento: #D4AF37;
    
    /* Espaçamentos */
    --espacamento-xs: 8px;
    --espacamento-sm: 12px;
    --espacamento-md: 20px;
    --espacamento-lg: 30px;
    --espacamento-xl: 40px;
    
    /* Raios de borda */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    
    /* Sombras */
    --sombra-leve: 0 4px 15px rgba(79, 24, 24, 0.08);
    --sombra-media: 0 8px 25px rgba(79, 24, 24, 0.12);
    --sombra-forte: 0 12px 35px rgba(79, 24, 24, 0.25);
}
```

## 📁 Estrutura do Projeto

```
projeto-otimizado/
├── index.html              # Página inicial
├── calculator.html         # Calculadora de impostos
├── cbs.html               # Informações sobre CBS
├── ibs.html               # Informações sobre IBS
├── is.html                # Informações sobre IS
├── css/
│   └── main.css           # CSS unificado e otimizado
└── js/
    └── calculator.js      # JavaScript otimizado
```

## 🚀 Como Usar

1. **Abra o `index.html`** em um navegador moderno
2. **Navegue** pelas páginas usando o menu superior
3. **Use a calculadora** para simular impostos
4. **Visualize os gráficos** com a comparação detalhada

## 💡 Recursos Técnicos

### Dependências
- **Chart.js 4.4.0** (via CDN) - Para gráficos interativos
- **Google Fonts** - Poppins e Inter

### Compatibilidade
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile (iOS/Android)

### Performance
- CSS minificado
- JavaScript otimizado
- Animações suaves com `transition` e `animation`
- Lazy loading de gráficos (renderização após DOM pronto)

## 📊 Comparação de Código

| Métrica | Antes | Depois | Redução |
|---------|-------|--------|---------|
| Linhas CSS | 1.809 | 1.100 | -39% |
| Linhas JS | 1.059+ | 800+ | -24% |
| Arquivos CSS | 3 | 1 | -67% |
| Arquivos JS | 3 | 1 | -67% |
| Setores | 4 | 10 | +150% |
| Impostos IS | 4 | 6 | +50% |

## 🎯 Funcionalidades da Calculadora

### Cálculos Realizados
1. **CBS** (Contribuição sobre Bens e Serviços)
2. **IBS** (Imposto sobre Bens e Serviços)
3. **IS** (Imposto Seletivo - opcional)
4. **Sistema Antigo:**
   - PIS
   - COFINS
   - ICMS-SP (18%)
   - ISS (para serviços)
   - Efeito Cascata (12%)

### Resultados Apresentados
- Valor base do produto
- Detalhamento de cada imposto (novo sistema)
- Detalhamento de cada imposto (sistema antigo)
- Comparação visual com gráficos
- Economia ou variação
- Valor final ao consumidor
- Resumo executivo

## 🎨 Destaques Visuais

### Cards com Animação
```css
.card-animado {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.6s ease forwards;
}
```

### Hover Interativo
```css
section:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--sombra-forte);
}
```

### Gradientes Modernos
```css
background: linear-gradient(135deg, var(--cor-primaria) 0%, var(--cor-secundaria) 100%);
```

## 📱 Testes de Responsividade

Testado em:
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667 - iPhone SE)
- Mobile (360x640 - Android)

## 🔄 Melhorias Futuras Sugeridas

1. **Backend Integration** - Salvar simulações
2. **Exportar PDF** - Download dos resultados
3. **Comparar múltiplos produtos** - Tabela comparativa
4. **Histórico de cálculos** - LocalStorage
5. **Dark Mode** - Tema escuro opcional

## 📝 Notas Técnicas

### ICMS Base SP
- Utilizamos 18% como alíquota média do ICMS de São Paulo
- O ICMS varia entre estados (7% a 25%)
- Para cálculos mais precisos, considere a alíquota do seu estado

### Efeito Cascata
- Estimado em 12% do total de impostos
- Representa a tributação em cascata do sistema antigo
- No novo sistema, não existe efeito cascata (não-cumulatividade plena)

### Não-Cumulatividade
- O sistema novo permite dedução total dos créditos
- Incentiva a formalização da economia
- Elimina distorções competitivas

## 👨‍💻 Desenvolvido por

Anderson V.

---

**Última atualização:** Janeiro 2026
**Versão:** 2.0 (Otimizada)
