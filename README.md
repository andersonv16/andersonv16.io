# 🇧🇷 Portal da Reforma Tributária (2026-2033)

> Um site informativo e interativo desenvolvido para simplificar o entendimento da Nova Reforma Tributária Brasileira (EC 132/2023).

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Tecnologias](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-blue)

## 📖 Sobre o Projeto

O ano de **2026** marca o início da transição do sistema tributário brasileiro. Este projeto tem como objetivo educar cidadãos e empresários sobre a substituição do antigo "manicômio tributário" (PIS, Cofins, ICMS, ISS, IPI) pelo novo modelo de **IVA Dual** (CBS e IBS).

O site oferece explicações didáticas sobre cada tributo e uma **calculadora exclusiva** que simula a carga tributária projetada para 2033.

## 🚀 Funcionalidades

* **Navegação Intuitiva:** Seções dedicadas para cada novo imposto (**CBS**, **IBS** e **IS**).
* **Calculadora Tributária:** Simulação em tempo real da carga tributária (IVA Dual), permitindo escolher entre:
    * Setor Padrão;
    * Setores com Redução (Saúde/Educação);
    * Isenção (Cesta Básica/Transporte);
    * Incidência de Imposto Seletivo ("Imposto do Pecado").
* **Design Responsivo:** Layout adaptável para desktop e mobile.
* **Micro-interações:** Animações suaves nos cards e botões para melhor experiência do usuário (UX).

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias nativas da web, garantindo leveza e alta performance:

* **HTML5:** Estrutura semântica e acessível.
* **CSS3:** Variáveis CSS (Custom Properties), Flexbox, Grid Layout e Animações (`keyframes`).
* **JavaScript (ES6+):** Manipulação do DOM, lógica matemática da calculadora e observers para animações de scroll.

## 📂 Estrutura de Arquivos

```text
/
├── index.html          # Página Inicial (Visão Geral)
├── cbs.html            # Página sobre a Contribuição Federal
├── ibs.html            # Página sobre o Imposto Estadual/Municipal
├── is.html             # Página sobre o Imposto Seletivo
├── calculator.html     # Ferramenta de cálculo
│
├── css/
│   ├── style.css       # Estilos globais e tipografia
│   ├── pages.css       # Estilos específicos das páginas informativas
│   └── calculator.css  # Estilização exclusiva da calculadora
│
└── js/
    ├── script.js       # Scripts gerais e menu
    ├── pages.js        # Animações de entrada e efeitos visuais
    └── calculator.js   # Lógica matemática dos impostos
