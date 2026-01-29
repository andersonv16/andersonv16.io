// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧮 Calculator.js carregado!');
    initCalculator();
});

// ========== CONFIGURAÇÃO DA CALCULADORA ==========
function initCalculator() {
    const aplicarISCheckbox = document.getElementById('aplicar-is');
    const tipoISGroup = document.getElementById('tipo-is-group');
    
    // Mostrar/esconder opções do IS
    if (aplicarISCheckbox && tipoISGroup) {
        aplicarISCheckbox.addEventListener('change', function() {
            if (this.checked) {
                tipoISGroup.style.display = 'block';
                tipoISGroup.style.animation = 'slideInUp 0.4s ease';
            } else {
                tipoISGroup.style.display = 'none';
            }
        });
    }
}

// ========== FUNÇÃO PRINCIPAL DE CÁLCULO ==========
function calcularImpostos() {
    console.log('🔢 Calculando impostos...');
    
    // 1. Obter valores do formulário
    const valorProduto = parseFloat(document.getElementById('valor-produto').value);
    const tipoOperacao = document.getElementById('tipo-operacao').value;
    const creditoAnterior = parseFloat(document.getElementById('credito-anterior').value) || 0;
    const aplicarIS = document.getElementById('aplicar-is').checked;
    const tipoIS = document.getElementById('tipo-is').value;
    
    // 2. Validação
    if (!valorProduto || valorProduto <= 0) {
        mostrarAlerta('⚠️ Por favor, insira um valor válido para o produto!');
        return;
    }
    
    // 3. Definir alíquotas base
    let aliquotaCBS = 8.8;
    let aliquotaIBS = 17.7;
    let percentualReducao = 0;
    let nomeOperacao = 'Operação Normal';
    
    // 4. Aplicar reduções
    switch(tipoOperacao) {
        case 'saude':
            percentualReducao = 60;
            aliquotaCBS = aliquotaCBS * 0.4;
            aliquotaIBS = aliquotaIBS * 0.4;
            nomeOperacao = 'Saúde';
            break;
        case 'educacao':
            percentualReducao = 60;
            aliquotaCBS = aliquotaCBS * 0.4;
            aliquotaIBS = aliquotaIBS * 0.4;
            nomeOperacao = 'Educação';
            break;
        case 'transporte':
            percentualReducao = 100;
            aliquotaCBS = 0;
            aliquotaIBS = 0;
            nomeOperacao = 'Transporte Público';
            break;
        case 'cesta-basica':
            percentualReducao = 100;
            aliquotaCBS = 0;
            aliquotaIBS = 0;
            nomeOperacao = 'Cesta Básica';
            break;
    }
    
    // 5. Calcular CBS e IBS
    const valorCBS = valorProduto * (aliquotaCBS / 100);
    const valorIBS = valorProduto * (aliquotaIBS / 100);
    
    // 6. Calcular IS
    let valorIS = 0;
    let aliquotaIS = 0;
    let nomeProdutoIS = '';
    
    if (aplicarIS) {
        switch(tipoIS) {
            case 'cigarro':
                aliquotaIS = 25;
                nomeProdutoIS = 'Cigarro';
                break;
            case 'bebida-alcoolica':
                aliquotaIS = 15;
                nomeProdutoIS = 'Bebida Alcoólica';
                break;
            case 'refrigerante':
                aliquotaIS = 10;
                nomeProdutoIS = 'Refrigerante';
                break;
            case 'veiculo-poluente':
                aliquotaIS = 8;
                nomeProdutoIS = 'Veículo Poluente';
                break;
        }
        valorIS = valorProduto * (aliquotaIS / 100);
    }
    
    // 7. Totais
    const totalImpostos = valorCBS + valorIBS + valorIS;
    const valorReducao = percentualReducao > 0 ? (valorProduto * ((8.8 + 17.7) / 100)) - (valorCBS + valorIBS) : 0;
    const totalARecolher = Math.max(totalImpostos - creditoAnterior, 0);
    const valorFinal = valorProduto + totalARecolher;
    
    // 8. Sistema antigo
    const sistemaAntigo = calcularSistemaAntigo(valorProduto, tipoOperacao);
    const sistemaNovo = totalImpostos;
    const economia = sistemaAntigo - sistemaNovo;
    
    // 9. CRIAR PÁGINA DE RESULTADO
    criarPaginaResultado({
        valorBase: valorProduto,
        valorCBS,
        aliquotaCBS,
        valorIBS,
        aliquotaIBS,
        valorIS,
        aliquotaIS,
        aplicarIS,
        nomeProdutoIS,
        valorReducao,
        percentualReducao,
        nomeOperacao,
        creditoAnterior,
        totalImpostos,
        valorFinal,
        totalARecolher,
        sistemaAntigo,
        sistemaNovo,
        economia
    });
}

// ========== CALCULAR SISTEMA ANTIGO ==========
function calcularSistemaAntigo(valorProduto, tipoOperacao) {
    let aliquotaTotal = 32.25;
    
    if (tipoOperacao === 'saude' || tipoOperacao === 'educacao') {
        aliquotaTotal = 15;
    } else if (tipoOperacao === 'transporte' || tipoOperacao === 'cesta-basica') {
        aliquotaTotal = 8;
    }
    
    return valorProduto * (aliquotaTotal / 100);
}

// ========== CRIAR PÁGINA DE RESULTADO ==========
function criarPaginaResultado(dados) {
    // Esconder todo o conteúdo atual
    const containerGrid = document.querySelector('.container-grid');
    containerGrid.style.display = 'none';
    
    // Criar container de resultado
    const resultadoPage = document.createElement('div');
    resultadoPage.id = 'pagina-resultado';
    resultadoPage.className = 'pagina-resultado';
    
    resultadoPage.innerHTML = `
        <div class="resultado-header">
            <button class="btn-voltar" onclick="voltarCalculadora()">
                ← Voltar para Calculadora
            </button>
            <h1 class="resultado-titulo">📊 Resultado do Cálculo</h1>
            <p class="resultado-subtitulo">Simulação da Reforma Tributária 2033</p>
        </div>
        
        <div class="resultado-container">
            <!-- RESUMO EXECUTIVO -->
            <div class="resumo-executivo">
                <div class="resumo-item destaque-principal">
                    <span class="resumo-label">💰 Valor Final ao Consumidor</span>
                    <span class="resumo-valor grande">${formatarMoeda(dados.valorFinal)}</span>
                </div>
                
                <div class="resumo-grid">
                    <div class="resumo-item">
                        <span class="resumo-label">Valor Base</span>
                        <span class="resumo-valor">${formatarMoeda(dados.valorBase)}</span>
                    </div>
                    <div class="resumo-item">
                        <span class="resumo-label">Total de Impostos</span>
                        <span class="resumo-valor">${formatarMoeda(dados.totalImpostos)}</span>
                    </div>
                </div>
            </div>
            
            <!-- DETALHAMENTO DOS IMPOSTOS -->
            <div class="detalhamento-section">
                <h2 class="section-title">🧾 Detalhamento dos Impostos</h2>
                
                <div class="imposto-card">
                    <div class="imposto-header cbs">
                        <span class="imposto-icone">🏛️</span>
                        <div>
                            <h3>CBS - Contribuição Federal</h3>
                            <p>Contribuição sobre Bens e Serviços</p>
                        </div>
                    </div>
                    <div class="imposto-detalhes">
                        <div class="detalhe-linha">
                            <span class="detalhe-label">Alíquota Padrão:</span>
                            <span class="detalhe-valor">8,8%</span>
                        </div>
                        ${dados.percentualReducao > 0 ? `
                        <div class="detalhe-linha reducao">
                            <span class="detalhe-label">Redução (${dados.nomeOperacao}):</span>
                            <span class="detalhe-valor">-${dados.percentualReducao}%</span>
                        </div>
                        ` : ''}
                        <div class="detalhe-linha destaque">
                            <span class="detalhe-label">Alíquota Aplicada:</span>
                            <span class="detalhe-valor">${dados.aliquotaCBS.toFixed(2)}%</span>
                        </div>
                        <div class="detalhe-linha calculo">
                            <span class="detalhe-label">Cálculo:</span>
                            <span class="detalhe-valor">${formatarMoeda(dados.valorBase)} × ${dados.aliquotaCBS.toFixed(2)}%</span>
                        </div>
                        <div class="detalhe-linha total">
                            <span class="detalhe-label">Valor CBS:</span>
                            <span class="detalhe-valor grande">${formatarMoeda(dados.valorCBS)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="imposto-card">
                    <div class="imposto-header ibs">
                        <span class="imposto-icone">🏙️</span>
                        <div>
                            <h3>IBS - Imposto sobre Bens e Serviços</h3>
                            <p>Estadual + Municipal</p>
                        </div>
                    </div>
                    <div class="imposto-detalhes">
                        <div class="detalhe-linha">
                            <span class="detalhe-label">Alíquota Padrão:</span>
                            <span class="detalhe-valor">17,7%</span>
                        </div>
                        ${dados.percentualReducao > 0 ? `
                        <div class="detalhe-linha reducao">
                            <span class="detalhe-label">Redução (${dados.nomeOperacao}):</span>
                            <span class="detalhe-valor">-${dados.percentualReducao}%</span>
                        </div>
                        ` : ''}
                        <div class="detalhe-linha destaque">
                            <span class="detalhe-label">Alíquota Aplicada:</span>
                            <span class="detalhe-valor">${dados.aliquotaIBS.toFixed(2)}%</span>
                        </div>
                        <div class="detalhe-linha calculo">
                            <span class="detalhe-label">Cálculo:</span>
                            <span class="detalhe-valor">${formatarMoeda(dados.valorBase)} × ${dados.aliquotaIBS.toFixed(2)}%</span>
                        </div>
                        <div class="detalhe-linha total">
                            <span class="detalhe-label">Valor IBS:</span>
                            <span class="detalhe-valor grande">${formatarMoeda(dados.valorIBS)}</span>
                        </div>
                    </div>
                </div>
                
                ${dados.aplicarIS ? `
                <div class="imposto-card">
                    <div class="imposto-header is">
                        <span class="imposto-icone">🚭</span>
                        <div>
                            <h3>IS - Imposto Seletivo</h3>
                            <p>Produto: ${dados.nomeProdutoIS}</p>
                        </div>
                    </div>
                    <div class="imposto-detalhes">
                        <div class="detalhe-linha">
                            <span class="detalhe-label">Alíquota IS:</span>
                            <span class="detalhe-valor">${dados.aliquotaIS}%</span>
                        </div>
                        <div class="detalhe-linha calculo">
                            <span class="detalhe-label">Cálculo:</span>
                            <span class="detalhe-valor">${formatarMoeda(dados.valorBase)} × ${dados.aliquotaIS}%</span>
                        </div>
                        <div class="detalhe-linha total">
                            <span class="detalhe-label">Valor IS:</span>
                            <span class="detalhe-valor grande">${formatarMoeda(dados.valorIS)}</span>
                        </div>
                        <div class="alerta-is">
                            ⚠️ O Imposto Seletivo não gera créditos tributários
                        </div>
                    </div>
                </div>
                ` : ''}
                
                ${dados.creditoAnterior > 0 ? `
                <div class="credito-card">
                    <div class="credito-header">
                        <span class="credito-icone">💳</span>
                        <h3>Crédito de Impostos Anteriores</h3>
                    </div>
                    <div class="credito-detalhes">
                        <p>Você possui créditos de impostos pagos na compra de insumos que podem ser deduzidos:</p>
                        <div class="detalhe-linha credito-linha">
                            <span class="detalhe-label">Crédito Disponível:</span>
                            <span class="detalhe-valor">${formatarMoeda(dados.creditoAnterior)}</span>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <!-- RESUMO FINAL -->
            <div class="resumo-final-section">
                <h2 class="section-title">📋 Resumo Final</h2>
                <div class="resumo-final-card">
                    <div class="linha-resumo">
                        <span class="label">Valor Base do Produto/Serviço</span>
                        <span class="valor">${formatarMoeda(dados.valorBase)}</span>
                    </div>
                    <div class="separador-resumo"></div>
                    <div class="linha-resumo">
                        <span class="label">CBS (${dados.aliquotaCBS.toFixed(2)}%)</span>
                        <span class="valor positivo">+ ${formatarMoeda(dados.valorCBS)}</span>
                    </div>
                    <div class="linha-resumo">
                        <span class="label">IBS (${dados.aliquotaIBS.toFixed(2)}%)</span>
                        <span class="valor positivo">+ ${formatarMoeda(dados.valorIBS)}</span>
                    </div>
                    ${dados.aplicarIS ? `
                    <div class="linha-resumo">
                        <span class="label">IS (${dados.aliquotaIS}%)</span>
                        <span class="valor positivo">+ ${formatarMoeda(dados.valorIS)}</span>
                    </div>
                    ` : ''}
                    ${dados.creditoAnterior > 0 ? `
                    <div class="linha-resumo">
                        <span class="label">Crédito Anterior</span>
                        <span class="valor negativo">- ${formatarMoeda(dados.creditoAnterior)}</span>
                    </div>
                    ` : ''}
                    <div class="separador-resumo"></div>
                    <div class="linha-resumo total-impostos">
                        <span class="label">Total de Impostos a Recolher</span>
                        <span class="valor">${formatarMoeda(dados.totalARecolher)}</span>
                    </div>
                    <div class="linha-resumo valor-final">
                        <span class="label">💰 Valor Total ao Consumidor</span>
                        <span class="valor">${formatarMoeda(dados.valorFinal)}</span>
                    </div>
                </div>
            </div>
            
            <!-- COMPARAÇÃO -->
            <div class="comparacao-section">
                <h2 class="section-title">📊 Comparação: Sistema Antigo vs Novo</h2>
                <div class="comparacao-cards">
                    <div class="comparacao-card antigo">
                        <span class="comparacao-icone">📜</span>
                        <h3>Sistema Antigo</h3>
                        <p class="comparacao-descricao">PIS + COFINS + ICMS + ISS<br>(com efeito cascata)</p>
                        <div class="comparacao-valor">${formatarMoeda(dados.sistemaAntigo)}</div>
                    </div>
                    
                    <div class="comparacao-seta">
                        ${dados.economia > 0 ? '📉' : dados.economia < 0 ? '📈' : '➡️'}
                    </div>
                    
                    <div class="comparacao-card novo">
                        <span class="comparacao-icone">✨</span>
                        <h3>Sistema Novo</h3>
                        <p class="comparacao-descricao">CBS + IBS${dados.aplicarIS ? ' + IS' : ''}<br>(sem efeito cascata)</p>
                        <div class="comparacao-valor">${formatarMoeda(dados.sistemaNovo)}</div>
                    </div>
                </div>
                
                ${Math.abs(dados.economia) > 0.01 ? `
                <div class="economia-card ${dados.economia > 0 ? 'economia-positiva' : 'economia-negativa'}">
                    <span class="economia-icone">${dados.economia > 0 ? '💰' : '⚠️'}</span>
                    <div class="economia-conteudo">
                        <h3>${dados.economia > 0 ? 'Economia Estimada' : 'Aumento Estimado'}</h3>
                        <div class="economia-valor">${formatarMoeda(Math.abs(dados.economia))}</div>
                        <p class="economia-percentual">${((Math.abs(dados.economia) / dados.sistemaAntigo) * 100).toFixed(1)}% ${dados.economia > 0 ? 'a menos' : 'a mais'} que o sistema antigo</p>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <!-- OBSERVAÇÕES -->
            <div class="observacoes-section">
                <h3>⚠️ Observações Importantes</h3>
                <ul class="observacoes-lista">
                    <li>📌 Esta simulação utiliza as alíquotas projetadas para 2033 (sistema completo)</li>
                    <li>📌 Em 2026, as alíquotas são reduzidas: CBS 0,9% e IBS 0,1% (fase de teste)</li>
                    <li>📌 Os valores podem sofrer ajustes conforme a implementação da reforma</li>
                    <li>📌 Créditos tributários permitem abater impostos pagos em etapas anteriores</li>
                    ${dados.aplicarIS ? '<li>📌 O Imposto Seletivo não gera créditos e é cobrado uma única vez na cadeia</li>' : ''}
                </ul>
            </div>
        </div>
    `;
    
    // Inserir após o h1
    const h1 = document.querySelector('h1');
    h1.insertAdjacentElement('afterend', resultadoPage);
    
    // Animar entrada
    setTimeout(() => {
        resultadoPage.style.opacity = '1';
        resultadoPage.style.transform = 'translateY(0)';
    }, 10);
    
    // Scroll suave para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Confetti
    createCalculatorConfetti();
}

// ========== VOLTAR PARA CALCULADORA ==========
function voltarCalculadora() {
    const resultadoPage = document.getElementById('pagina-resultado');
    const containerGrid = document.querySelector('.container-grid');
    
    // Animar saída
    resultadoPage.style.opacity = '0';
    resultadoPage.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        resultadoPage.remove();
        containerGrid.style.display = 'grid';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
}

// ========== FORMATAR MOEDA ==========
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ========== ALERTA ==========
function mostrarAlerta(mensagem) {
    const alerta = document.createElement('div');
    alerta.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        color: white;
        padding: 25px 40px;
        border-radius: 15px;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        animation: alertaPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    `;
    alerta.textContent = mensagem;
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        alerta.style.animation = 'alertaClose 0.3s ease forwards';
        setTimeout(() => alerta.remove(), 300);
    }, 3000);
}

// ========== CONFETTI ==========
function createCalculatorConfetti() {
    const colors = ['#0066cc', '#ffb700', '#1a3a52', '#2e7d32'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -20px;
            opacity: ${Math.random() * 0.7 + 0.3};
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 9999;
            border-radius: 50%;
            animation: confettiFall ${2 + Math.random() * 1.5}s ease-out forwards;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3500);
    }
}

// ========== ESTILOS ==========
const calcstyle = document.createElement('style');
calcstyle.textContent = `
    @keyframes alertaPop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    @keyframes alertaClose {
        to { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    }
    @keyframes confettiFall {
        to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    
    .pagina-resultado {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        margin-bottom: 40px;
    }
    
    .resultado-header {
        text-align: center;
        padding: 40px 20px;
        background: linear-gradient(135deg, #1a3a52 0%, #0066cc 100%);
        border-radius: 20px;
        margin: 20px;
        position: relative;
    }
    
    .btn-voltar {
        position: absolute;
        left: 20px;
        top: 20px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        padding: 12px 24px;
        border-radius: 10px;
        cursor: pointer;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-voltar:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateX(-5px);
    }
    
    .resultado-titulo {
        color: white;
        font-size: 24px;
        margin: 40px 0 10px 0;
        font-family: 'Poppins', sans-serif;
    }
    
    .resultado-subtitulo {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
    }
    
    .resultado-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
    
    .resumo-executivo {
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        padding: 40px;
        border-radius: 20px;
        margin-bottom: 30px;
        color: white;
    }
    
    .resumo-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        margin: 10px 0;
    }
    
    .resumo-item.destaque-principal {
        background: rgba(255, 183, 0, 0.3);
        border: 2px solid #ffb700;
        padding: 30px;
        margin-bottom: 20px;
    }
    
    .resumo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
    }
    
    .resumo-label {
        font-size: 16px;
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
    }
    
    .resumo-valor {
        font-size: 24px;
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
    }
    
    .resumo-valor.grande {
        font-size: 42px;
    }
    
    .section-title {
        color: #1a3a52;
        font-size: 24px;
        font-family: 'Poppins', sans-serif;
        margin: 30px 0 20px 0;
        padding-bottom: 10px;
        border-bottom: 3px solid #0066cc;
    }
    
    .detalhamento-section {
        margin: 30px 0;
    }
    
    .imposto-card {
        background: white;
        border-radius: 15px;
        padding: 0;
        margin: 20px 0;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border: 2px solid #e0e0e0;
    }
    
    .imposto-header {
        padding: 25px;
        display: flex;
        align-items: center;
        gap: 20px;
        color: white;
    }
    
    .imposto-header.cbs {
        background: linear-gradient(135deg, #1a3a52 0%, #2a5a7a 100%);
    }
    
    .imposto-header.ibs {
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
    }
    
    .imposto-header.is {
        background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
    }
    
    .imposto-icone {
        font-size: 48px;
    }
    
    .imposto-header h3 {
        margin: 0;
        font-size: 20px;
        color: white;
        border: none;
        padding: 0;
    }
    
    .imposto-header h3::after {
        display: none;
    }
    
    .imposto-header p {
        margin: 5px 0 0 0;
        opacity: 0.9;
        font-size: 14px;
    }
    
    .imposto-detalhes {
        padding: 25px;
        background: #f8f9fa;
    }
    
    .detalhe-linha {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .detalhe-linha.reducao {
        color: #2e7d32;
        font-weight: 600;
    }
    
    .detalhe-linha.destaque {
        background: #fff3cd;
        padding: 15px;
        border-radius: 8px;
        border: 2px solid #ffb700;
        margin: 10px 0;
    }
    
    .detalhe-linha.calculo {
        background: #e3f2ff;
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
    }
    
    .detalhe-linha.total {
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        color: white;
        padding: 20px;
        border-radius: 10px;
        margin-top: 15px;
        border: none;
        font-size: 18px;
    }
    
    .detalhe-label {
        font-weight: 600;
        color: #1a3a52;
    }
    
    .detalhe-linha.total .detalhe-label,
    .detalhe-linha.total .detalhe-valor {
        color: white;
    }
    
    .detalhe-valor.grande {
        font-size: 24px;
        font-weight: 700;
    }
    
    .alerta-is {
        background: #fff3cd;
        border-left: 4px solid #ffb700;
        padding: 15px;
        margin-top: 15px;
        border-radius: 5px;
        font-size: 14px;
        color: #856404;
    }
    
    .credito-card {
        background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
        border-radius: 15px;
        padding: 0;
        margin: 20px 0;
        overflow: hidden;
        border: 2px solid #2e7d32;
    }
    
    .credito-header {
        padding: 20px 25px;
        display: flex;
        align-items: center;
        gap: 15px;
        background: rgba(255, 255, 255, 0.3);
    }
    
    .credito-icone {
        font-size: 36px;
    }
    
    .credito-header h3 {
        margin: 0;
        color: #1b5e20;
        border: none;
        padding: 0;
        font-size: 20px;
    }
    
    .credito-header h3::after {
        display: none;
    }
    
    .credito-detalhes {
        padding: 25px;
    }
    
    .credito-detalhes p {
        color: #1b5e20;
        margin-bottom: 15px;
    }
    
    .credito-linha {
        background: white;
        padding: 15px;
        border-radius: 8px;
        border: 2px solid #2e7d32;
    }
    
    .resumo-final-section {
        margin: 30px 0;
    }
    
    .resumo-final-card {
        background: white;
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }
    
    .linha-resumo {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
        font-size: 16px;
    }
    
    .linha-resumo .label {
        font-weight: 600;
        color: #1a3a52;
    }
    
    .linha-resumo .valor {
        font-weight: 700;
        color: #0066cc;
        font-family: 'Poppins', sans-serif;
    }
    
    .linha-resumo .valor.positivo {
        color: #d32f2f;
    }
    
    .linha-resumo .valor.negativo {
        color: #2e7d32;
    }
    
    .separador-resumo {
        height: 2px;
        background: linear-gradient(90deg, transparent, #0066cc, transparent);
        margin: 15px 0;
    }
    
    .linha-resumo.total-impostos {
        background: #e3f2ff;
        padding: 20px;
        border-radius: 10px;
        margin: 10px 0;
        font-size: 18px;
    }
    
    .linha-resumo.valor-final {
        background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        color: white;
        padding: 25px;
        border-radius: 12px;
        margin-top: 15px;
        font-size: 20px;
    }
    
    .linha-resumo.valor-final .label,
    .linha-resumo.valor-final .valor {
        color: white;
        font-size: 24px;
    }
    
    .comparacao-section {
        margin: 30px 0;
    }
    
    .comparacao-cards {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 20px;
        align-items: center;
        margin: 20px 0;
    }
    
    .comparacao-card {
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }
    
    .comparacao-card.antigo {
        border: 3px solid #d32f2f;
    }
    
    .comparacao-card.novo {
        border: 3px solid #2e7d32;
    }
    
    .comparacao-icone {
        font-size: 48px;
        display: block;
        margin-bottom: 15px;
    }
    
    .comparacao-card h3 {
        color: #1a3a52;
        margin: 10px 0;
        border: none;
        padding: 0;
        font-size: 20px;
    }
    
    .comparacao-card h3::after {
        display: none;
    }
    
    .comparacao-descricao {
        color: #666;
        font-size: 14px;
        margin: 10px 0;
    }
    
    .comparacao-valor {
        font-size: 32px;
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
        margin-top: 15px;
    }
    
    .comparacao-card.antigo .comparacao-valor {
        color: #d32f2f;
    }
    
    .comparacao-card.novo .comparacao-valor {
        color: #2e7d32;
    }
    
    .comparacao-seta {
        font-size: 48px;
        text-align: center;
    }
    
    .economia-card {
        background: white;
        padding: 30px;
        border-radius: 15px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 25px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }
    
    .economia-card.economia-positiva {
        border: 3px solid #2e7d32;
        background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    }
    
    .economia-card.economia-negativa {
        border: 3px solid #d32f2f;
        background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    }
    
    .economia-icone {
        font-size: 64px;
    }
    
    .economia-conteudo h3 {
        color: #1a3a52;
        margin: 0 0 10px 0;
        border: none;
        padding: 0;
        font-size: 20px;
    }
    
    .economia-conteudo h3::after {
        display: none;
    }
    
    .economia-valor {
        font-size: 42px;
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
        margin: 10px 0;
    }
    
    .economia-positiva .economia-valor {
        color: #2e7d32;
    }
    
    .economia-negativa .economia-valor {
        color: #d32f2f;
    }
    
    .economia-percentual {
        font-size: 16px;
        color: #666;
        margin: 5px 0;
    }
    
    .observacoes-section {
        background: #fff3cd;
        padding: 25px;
        border-radius: 15px;
        border-left: 5px solid #ffb700;
        margin: 30px 0;
    }
    
    .observacoes-section h3 {
        color: #856404;
        margin: 0 0 15px 0;
        border: none;
        padding: 0;
        font-size: 20px;
    }
    
    .observacoes-section h3::after {
        display: none;
    }
    
    .observacoes-lista {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .observacoes-lista li {
        padding: 10px 0;
        color: #856404;
        font-size: 14px;
    }
    
    @media (max-width: 768px) {
        .btn-voltar {
            position: static;
            display: block;
            margin-bottom: 20px;
        }
        
        .resultado-titulo {
            font-size: 24px;
        }
        
        .resumo-executivo {
            padding: 20px;
        }
        
        .resumo-valor.grande {
            font-size: 28px;
        }
        
        .comparacao-cards {
            grid-template-columns: 1fr;
        }
        
        .comparacao-seta {
            transform: rotate(90deg);
        }
        
        .economia-card {
            flex-direction: column;
            text-align: center;
        }
    }
`;
document.head.appendChild(calcstyle);

console.log('✅ Calculator.js carregado com sucesso!');
