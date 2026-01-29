// ========== CONFIGURAÇÕES E CONSTANTES ==========
const ALIQUOTAS = {
    CBS: 8.8,
    IBS: 17.7,
    TOTAL: 26.5
};

const IMPOSTOS_ANTIGOS_SP = {
    PIS: 1.65,
    COFINS: 7.6,
    ICMS: 18.0,  // ICMS médio SP
    ISS: 5.0     // ISS médio (para serviços)
};

const REDUCOES = {
    saude: { percentual: 60, nome: 'Saúde' },
    educacao: { percentual: 60, nome: 'Educação' },
    transporte: { percentual: 100, nome: 'Transporte Público' },
    'cesta-basica': { percentual: 100, nome: 'Cesta Básica' },
    cultura: { percentual: 60, nome: 'Produtos Culturais' },
    alimentos: { percentual: 40, nome: 'Alimentos in natura' },
    medicamentos: { percentual: 60, nome: 'Medicamentos' },
    'dispositivos-medicos': { percentual: 60, nome: 'Dispositivos Médicos' },
    'transporte-coletivo': { percentual: 100, nome: 'Transporte Coletivo' },
    'agricultura-familiar': { percentual: 100, nome: 'Agricultura Familiar' }
};

const IS_ALIQUOTAS = {
    cigarro: { aliquota: 25, nome: 'Cigarro' },
    'bebida-alcoolica': { aliquota: 15, nome: 'Bebida Alcoólica' },
    refrigerante: { aliquota: 10, nome: 'Refrigerante' },
    'veiculo-poluente': { aliquota: 8, nome: 'Veículo Poluente' },
    'mineracao': { aliquota: 1, nome: 'Mineração' },
    'apostas': { aliquota: 12, nome: 'Apostas' }
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧮 Calculator.js otimizado carregado!');
    initCalculator();
});

function initCalculator() {
    const aplicarISCheckbox = document.getElementById('aplicar-is');
    const tipoISGroup = document.getElementById('tipo-is-group');
    
    if (aplicarISCheckbox && tipoISGroup) {
        aplicarISCheckbox.addEventListener('change', function() {
            tipoISGroup.style.display = this.checked ? 'block' : 'none';
            if (this.checked) {
                tipoISGroup.style.animation = 'slideInUp 0.4s ease';
            }
        });
    }
}

// ========== FUNÇÃO PRINCIPAL DE CÁLCULO ==========
function calcularImpostos() {
    console.log('🔢 Calculando impostos...');
    
    const valorProduto = parseFloat(document.getElementById('valor-produto').value);
    const tipoOperacao = document.getElementById('tipo-operacao').value;
    const creditoAnterior = parseFloat(document.getElementById('credito-anterior').value) || 0;
    const aplicarIS = document.getElementById('aplicar-is').checked;
    const tipoIS = document.getElementById('tipo-is').value;
    
    if (!valorProduto || valorProduto <= 0) {
        alert('⚠️ Por favor, insira um valor válido para o produto!');
        return;
    }
    
    // Calcular novo sistema
    const reducao = REDUCOES[tipoOperacao] || { percentual: 0, nome: 'Operação Normal' };
    const fatorReducao = 1 - (reducao.percentual / 100);
    
    const aliquotaCBS = ALIQUOTAS.CBS * fatorReducao;
    const aliquotaIBS = ALIQUOTAS.IBS * fatorReducao;
    
    const valorCBS = valorProduto * (aliquotaCBS / 100);
    const valorIBS = valorProduto * (aliquotaIBS / 100);
    
    // Calcular IS
    let valorIS = 0;
    let aliquotaIS = 0;
    let nomeProdutoIS = '';
    
    if (aplicarIS && IS_ALIQUOTAS[tipoIS]) {
        aliquotaIS = IS_ALIQUOTAS[tipoIS].aliquota;
        nomeProdutoIS = IS_ALIQUOTAS[tipoIS].nome;
        valorIS = valorProduto * (aliquotaIS / 100);
    }
    
    const totalImpostosNovos = valorCBS + valorIBS + valorIS;
    const valorReducao = reducao.percentual > 0 ? 
        (valorProduto * (ALIQUOTAS.TOTAL / 100)) - (valorCBS + valorIBS) : 0;
    const totalARecolher = Math.max(totalImpostosNovos - creditoAnterior, 0);
    const valorFinal = valorProduto + totalARecolher;
    
    // Calcular sistema antigo detalhado
    const impostosAntigos = calcularImpostosAntigos(valorProduto, tipoOperacao);
    
    const dados = {
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
        reducao,
        creditoAnterior,
        totalImpostos: totalImpostosNovos,
        valorFinal,
        totalARecolher,
        impostosAntigos,
        sistemaNovo: totalImpostosNovos,
        economia: impostosAntigos.total - totalImpostosNovos
    };
    
    criarPaginaResultado(dados);
}

// ========== CALCULAR IMPOSTOS ANTIGOS DETALHADOS (SP) ==========
function calcularImpostosAntigos(valorProduto, tipoOperacao) {
    let fatorPIS = 1;
    let fatorCOFINS = 1;
    let fatorICMS = 1;
    let fatorISS = 0; // ISS só para serviços
    
    // Aplicar reduções aproximadas do sistema antigo
    if (tipoOperacao === 'saude' || tipoOperacao === 'medicamentos' || tipoOperacao === 'dispositivos-medicos') {
        fatorPIS = 0.65;
        fatorCOFINS = 0.65;
        fatorICMS = 0.7;
    } else if (tipoOperacao === 'educacao') {
        fatorPIS = 0;
        fatorCOFINS = 0;
        fatorICMS = 0.6;
    } else if (tipoOperacao === 'cesta-basica' || tipoOperacao === 'alimentos') {
        fatorPIS = 0;
        fatorCOFINS = 0;
        fatorICMS = 0.7; // ICMS reduzido mas não zero
    } else if (tipoOperacao === 'transporte' || tipoOperacao === 'transporte-coletivo') {
        fatorPIS = 0.6;
        fatorCOFINS = 0.6;
        fatorICMS = 0.5;
    }
    
    // Considerar ISS para alguns serviços
    const isServico = ['saude', 'educacao', 'transporte', 'transporte-coletivo'].includes(tipoOperacao);
    if (isServico) {
        fatorISS = 1;
        fatorICMS = 0; // Serviços não têm ICMS
    }
    
    const valorPIS = valorProduto * (IMPOSTOS_ANTIGOS_SP.PIS / 100) * fatorPIS;
    const valorCOFINS = valorProduto * (IMPOSTOS_ANTIGOS_SP.COFINS / 100) * fatorCOFINS;
    const valorICMS = valorProduto * (IMPOSTOS_ANTIGOS_SP.ICMS / 100) * fatorICMS;
    const valorISS = valorProduto * (IMPOSTOS_ANTIGOS_SP.ISS / 100) * fatorISS;
    
    // Efeito cascata aproximado (impostos sobre impostos)
    const efeitoCascata = (valorPIS + valorCOFINS + valorICMS + valorISS) * 0.12;
    
    return {
        PIS: {
            aliquota: IMPOSTOS_ANTIGOS_SP.PIS * fatorPIS,
            valor: valorPIS
        },
        COFINS: {
            aliquota: IMPOSTOS_ANTIGOS_SP.COFINS * fatorCOFINS,
            valor: valorCOFINS
        },
        ICMS: {
            aliquota: IMPOSTOS_ANTIGOS_SP.ICMS * fatorICMS,
            valor: valorICMS
        },
        ISS: {
            aliquota: IMPOSTOS_ANTIGOS_SP.ISS * fatorISS,
            valor: valorISS
        },
        efeitoCascata,
        total: valorPIS + valorCOFINS + valorICMS + valorISS + efeitoCascata
    };
}

// ========== CRIAR PÁGINA DE RESULTADO ==========
function criarPaginaResultado(dados) {
    const containerGrid = document.querySelector('.container-grid');
    containerGrid.style.display = 'none';
    
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
            ${criarResumoExecutivo(dados)}
            ${criarDetalhamentoImpostos(dados)}
            ${criarDetalhamentoImpostosAntigos(dados)}
            ${criarComparacao(dados)}
            ${criarGraficos(dados)}
            ${criarResumoFinal(dados)}
            ${criarObservacoes()}
        </div>
    `;
    
    document.body.appendChild(resultadoPage);
    
    // Renderizar gráficos após o DOM estar pronto
    setTimeout(() => {
        renderizarGraficos(dados);
    }, 100);
}

// ========== COMPONENTES HTML ==========
function criarResumoExecutivo(dados) {
    return `
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
    `;
}

function criarDetalhamentoImpostos(dados) {
    return `
        <div class="detalhamento-section">
            <h2 class="section-title">🧾 Novo Sistema Tributário</h2>
            
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
                        <span class="detalhe-valor">${ALIQUOTAS.CBS}%</span>
                    </div>
                    ${dados.reducao.percentual > 0 ? `
                    <div class="detalhe-linha reducao">
                        <span class="detalhe-label">Redução (${dados.reducao.nome}):</span>
                        <span class="detalhe-valor">-${dados.reducao.percentual}%</span>
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
                        <span class="detalhe-valor">${ALIQUOTAS.IBS}%</span>
                    </div>
                    ${dados.reducao.percentual > 0 ? `
                    <div class="detalhe-linha reducao">
                        <span class="detalhe-label">Redução (${dados.reducao.nome}):</span>
                        <span class="detalhe-valor">-${dados.reducao.percentual}%</span>
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
            <div class="imposto-card is-card">
                <div class="imposto-header is">
                    <span class="imposto-icone">🚭</span>
                    <div>
                        <h3>IS - Imposto Seletivo</h3>
                        <p>${dados.nomeProdutoIS}</p>
                    </div>
                </div>
                <div class="imposto-detalhes">
                    <div class="detalhe-linha destaque">
                        <span class="detalhe-label">Alíquota:</span>
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
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

function criarDetalhamentoImpostosAntigos(dados) {
    const imp = dados.impostosAntigos;
    
    return `
        <div class="detalhamento-section sistema-antigo-section">
            <h2 class="section-title">📜 Sistema Tributário Anterior (Base: SP)</h2>
            <p class="sistema-antigo-descricao">Simulação dos impostos que seriam aplicados no sistema anterior, com base nas alíquotas de São Paulo</p>
            
            ${imp.PIS.valor > 0 ? `
            <div class="imposto-card antigo">
                <div class="imposto-header pis">
                    <span class="imposto-icone">💼</span>
                    <div>
                        <h3>PIS - Programa de Integração Social</h3>
                        <p>Contribuição Federal</p>
                    </div>
                </div>
                <div class="imposto-detalhes">
                    <div class="detalhe-linha">
                        <span class="detalhe-label">Alíquota Aplicada:</span>
                        <span class="detalhe-valor">${imp.PIS.aliquota.toFixed(2)}%</span>
                    </div>
                    <div class="detalhe-linha total">
                        <span class="detalhe-label">Valor PIS:</span>
                        <span class="detalhe-valor grande">${formatarMoeda(imp.PIS.valor)}</span>
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${imp.COFINS.valor > 0 ? `
            <div class="imposto-card antigo">
                <div class="imposto-header cofins">
                    <span class="imposto-icone">💰</span>
                    <div>
                        <h3>COFINS - Contribuição para Financiamento da Seguridade Social</h3>
                        <p>Contribuição Federal</p>
                    </div>
                </div>
                <div class="imposto-detalhes">
                    <div class="detalhe-linha">
                        <span class="detalhe-label">Alíquota Aplicada:</span>
                        <span class="detalhe-valor">${imp.COFINS.aliquota.toFixed(2)}%</span>
                    </div>
                    <div class="detalhe-linha total">
                        <span class="detalhe-label">Valor COFINS:</span>
                        <span class="detalhe-valor grande">${formatarMoeda(imp.COFINS.valor)}</span>
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${imp.ICMS.valor > 0 ? `
            <div class="imposto-card antigo">
                <div class="imposto-header icms">
                    <span class="imposto-icone">🏪</span>
                    <div>
                        <h3>ICMS - Imposto sobre Circulação de Mercadorias e Serviços</h3>
                        <p>Estadual (Base: São Paulo)</p>
                    </div>
                </div>
                <div class="imposto-detalhes">
                    <div class="detalhe-linha">
                        <span class="detalhe-label">Alíquota Aplicada (SP):</span>
                        <span class="detalhe-valor">${imp.ICMS.aliquota.toFixed(2)}%</span>
                    </div>
                    <div class="detalhe-linha total">
                        <span class="detalhe-label">Valor ICMS:</span>
                        <span class="detalhe-valor grande">${formatarMoeda(imp.ICMS.valor)}</span>
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${imp.ISS.valor > 0 ? `
            <div class="imposto-card antigo">
                <div class="imposto-header iss">
                    <span class="imposto-icone">🏛️</span>
                    <div>
                        <h3>ISS - Imposto sobre Serviços</h3>
                        <p>Municipal</p>
                    </div>
                </div>
                <div class="imposto-detalhes">
                    <div class="detalhe-linha">
                        <span class="detalhe-label">Alíquota Aplicada:</span>
                        <span class="detalhe-valor">${imp.ISS.aliquota.toFixed(2)}%</span>
                    </div>
                    <div class="detalhe-linha total">
                        <span class="detalhe-label">Valor ISS:</span>
                        <span class="detalhe-valor grande">${formatarMoeda(imp.ISS.valor)}</span>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="imposto-card cascata-card">
                <div class="imposto-header cascata">
                    <span class="imposto-icone">⚠️</span>
                    <div>
                        <h3>Efeito Cascata</h3>
                        <p>Impostos sobre impostos (estimado em 12%)</p>
                    </div>
                </div>
                <div class="imposto-detalhes">
                    <div class="detalhe-linha total">
                        <span class="detalhe-label">Custo Adicional:</span>
                        <span class="detalhe-valor grande">${formatarMoeda(imp.efeitoCascata)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function criarComparacao(dados) {
    const economia = dados.economia;
    const percentualEconomia = ((economia / dados.impostosAntigos.total) * 100).toFixed(1);
    const isEconomia = economia > 0;
    
    return `
        <div class="comparacao-section">
            <h2 class="section-title">📈 Comparação: Sistema Antigo vs Novo</h2>
            
            <div class="comparacao-cards">
                <div class="comparacao-card antigo">
                    <span class="comparacao-icone">📜</span>
                    <h3>Sistema Anterior</h3>
                    <p class="comparacao-descricao">PIS + COFINS + ICMS/ISS + Efeito Cascata</p>
                    <p class="comparacao-valor">${formatarMoeda(dados.impostosAntigos.total)}</p>
                    <p class="comparacao-info">Com distorções tributárias</p>
                </div>
                
                <div class="comparacao-seta">
                    ${isEconomia ? '✅' : '⚠️'}
                </div>
                
                <div class="comparacao-card novo">
                    <span class="comparacao-icone">🆕</span>
                    <h3>Sistema Novo</h3>
                    <p class="comparacao-descricao">CBS + IBS${dados.aplicarIS ? ' + IS' : ''}</p>
                    <p class="comparacao-valor">${formatarMoeda(dados.sistemaNovo)}</p>
                    <p class="comparacao-info">Transparente e simplificado</p>
                </div>
            </div>
            
            <div class="economia-card ${isEconomia ? 'economia-positiva' : 'economia-negativa'}">
                <div class="economia-icone">${isEconomia ? '💚' : '📊'}</div>
                <div class="economia-conteudo">
                    <h3>${isEconomia ? 'Economia Estimada' : 'Variação'}</h3>
                    <p class="economia-valor">${isEconomia ? '' : '+'} ${formatarMoeda(Math.abs(economia))}</p>
                    <p class="economia-percentual">${isEconomia ? '-' : '+'} ${Math.abs(percentualEconomia)}% em relação ao sistema anterior</p>
                </div>
            </div>
        </div>
    `;
}

function criarGraficos(dados) {
    return `
        <div class="graficos-section">
            <h2 class="section-title">📊 Visualização Gráfica</h2>
            
            <div class="graficos-grid">
                <div class="grafico-card">
                    <h3>Composição dos Impostos</h3>
                    <canvas id="grafico-composicao"></canvas>
                </div>
                
                <div class="grafico-card">
                    <h3>Comparação Sistema Antigo vs Novo</h3>
                    <canvas id="grafico-comparacao"></canvas>
                </div>
            </div>
            
            <div class="grafico-card-full">
                <h3>Detalhamento Completo</h3>
                <canvas id="grafico-detalhamento"></canvas>
            </div>
        </div>
    `;
}

function criarResumoFinal(dados) {
    return `
        <div class="resumo-final-section">
            <h2 class="section-title">💼 Resumo Final</h2>
            
            <div class="resumo-final-card">
                <div class="linha-resumo">
                    <span class="label">Valor Base do Produto/Serviço:</span>
                    <span class="valor">${formatarMoeda(dados.valorBase)}</span>
                </div>
                
                <div class="separador-resumo"></div>
                
                <div class="linha-resumo">
                    <span class="label">CBS (${dados.aliquotaCBS.toFixed(2)}%):</span>
                    <span class="valor positivo">${formatarMoeda(dados.valorCBS)}</span>
                </div>
                
                <div class="linha-resumo">
                    <span class="label">IBS (${dados.aliquotaIBS.toFixed(2)}%):</span>
                    <span class="valor positivo">${formatarMoeda(dados.valorIBS)}</span>
                </div>
                
                ${dados.aplicarIS ? `
                <div class="linha-resumo">
                    <span class="label">IS - ${dados.nomeProdutoIS} (${dados.aliquotaIS}%):</span>
                    <span class="valor positivo">${formatarMoeda(dados.valorIS)}</span>
                </div>
                ` : ''}
                
                ${dados.valorReducao > 0 ? `
                <div class="linha-resumo">
                    <span class="label">Redução Aplicada (${dados.reducao.nome}):</span>
                    <span class="valor negativo">- ${formatarMoeda(dados.valorReducao)}</span>
                </div>
                ` : ''}
                
                ${dados.creditoAnterior > 0 ? `
                <div class="linha-resumo">
                    <span class="label">Crédito de Impostos Anteriores:</span>
                    <span class="valor negativo">- ${formatarMoeda(dados.creditoAnterior)}</span>
                </div>
                ` : ''}
                
                <div class="separador-resumo"></div>
                
                <div class="linha-resumo total-impostos">
                    <span class="label">Total de Impostos:</span>
                    <span class="valor">${formatarMoeda(dados.totalImpostos)}</span>
                </div>
                
                <div class="linha-resumo valor-final">
                    <span class="label">💰 Valor Final ao Consumidor:</span>
                    <span class="valor">${formatarMoeda(dados.valorFinal)}</span>
                </div>
            </div>
        </div>
    `;
}

function criarObservacoes() {
    return `
        <div class="observacoes-section">
            <h3>⚠️ Observações Importantes</h3>
            <ul class="observacoes-lista">
                <li>✅ <strong>Valores Estimados:</strong> Esta calculadora utiliza as alíquotas projetadas para o sistema final em 2033.</li>
                <li>📅 <strong>Período de Transição:</strong> Estamos atualmente em 2026, na fase de teste com alíquotas reduzidas (CBS: 0,9% e IBS: 0,1%).</li>
                <li>🏛️ <strong>ICMS Base SP:</strong> Os cálculos do sistema antigo utilizam a alíquota média do ICMS de São Paulo (18%).</li>
                <li>⚖️ <strong>Efeito Cascata:</strong> No sistema antigo, estimamos um custo adicional de 12% devido ao efeito cascata dos impostos.</li>
                <li>🔄 <strong>Créditos Tributários:</strong> No novo sistema, os créditos de impostos pagos em etapas anteriores podem ser deduzidos integralmente.</li>
                <li>📊 <strong>Variações:</strong> Os valores podem variar conforme ajustes na implementação da reforma.</li>
            </ul>
        </div>
    `;
}

// ========== RENDERIZAR GRÁFICOS ==========
function renderizarGraficos(dados) {
    // Gráfico de Composição
    const ctxComposicao = document.getElementById('grafico-composicao');
    if (ctxComposicao) {
        new Chart(ctxComposicao, {
            type: 'doughnut',
            data: {
                labels: ['CBS', 'IBS', dados.aplicarIS ? 'IS' : null].filter(Boolean),
                datasets: [{
                    data: [dados.valorCBS, dados.valorIBS, dados.aplicarIS ? dados.valorIS : null].filter(v => v !== null),
                    backgroundColor: ['#0066cc', '#ffb700', '#2a5a7a'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'Poppins', size: 12 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + formatarMoeda(context.parsed);
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Comparação
    const ctxComparacao = document.getElementById('grafico-comparacao');
    if (ctxComparacao) {
        new Chart(ctxComparacao, {
            type: 'bar',
            data: {
                labels: ['Sistema Antigo', 'Sistema Novo'],
                datasets: [{
                    label: 'Total de Impostos',
                    data: [dados.impostosAntigos.total, dados.sistemaNovo],
                    backgroundColor: ['#D32F2F', '#2E7D32'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Total: ' + formatarMoeda(context.parsed.y);
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Detalhamento
    const ctxDetalhamento = document.getElementById('grafico-detalhamento');
    if (ctxDetalhamento) {
        const labelsAntigo = [];
        const valoresAntigo = [];
        
        if (dados.impostosAntigos.PIS.valor > 0) {
            labelsAntigo.push('PIS');
            valoresAntigo.push(dados.impostosAntigos.PIS.valor);
        }
        if (dados.impostosAntigos.COFINS.valor > 0) {
            labelsAntigo.push('COFINS');
            valoresAntigo.push(dados.impostosAntigos.COFINS.valor);
        }
        if (dados.impostosAntigos.ICMS.valor > 0) {
            labelsAntigo.push('ICMS');
            valoresAntigo.push(dados.impostosAntigos.ICMS.valor);
        }
        if (dados.impostosAntigos.ISS.valor > 0) {
            labelsAntigo.push('ISS');
            valoresAntigo.push(dados.impostosAntigos.ISS.valor);
        }
        labelsAntigo.push('Efeito Cascata');
        valoresAntigo.push(dados.impostosAntigos.efeitoCascata);
        
        new Chart(ctxDetalhamento, {
            type: 'bar',
            data: {
                labels: [...labelsAntigo, 'CBS', 'IBS', dados.aplicarIS ? 'IS' : null].filter(Boolean),
                datasets: [{
                    label: 'Valor do Imposto',
                    data: [...valoresAntigo, dados.valorCBS, dados.valorIBS, dados.aplicarIS ? dados.valorIS : null].filter(v => v !== null && v !== undefined),
                    backgroundColor: [
                        ...labelsAntigo.map(() => '#D32F2F'),
                        '#0066cc',
                        '#ffb700',
                        dados.aplicarIS ? '#2a5a7a' : null
                    ].filter(Boolean),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Valor: ' + formatarMoeda(context.parsed.x);
                            }
                        }
                    }
                }
            }
        });
    }
}

// ========== FUNÇÕES AUXILIARES ==========
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function voltarCalculadora() {
    const resultadoPage = document.getElementById('pagina-resultado');
    const containerGrid = document.querySelector('.container-grid');
    
    if (resultadoPage) {
        resultadoPage.remove();
    }
    if (containerGrid) {
        containerGrid.style.display = 'grid';
    }
}

// ========== ESTILOS INJETADOS ==========
const style = document.createElement('style');
style.textContent = `
    .pagina-resultado {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .resultado-header {
        text-align: center;
        margin-bottom: 40px;
    }
    
    .resultado-titulo {
        margin: 20px 0 10px 0;
    }
    
    .resultado-subtitulo {
        color: var(--cor-texto-claro);
        font-size: 16px;
    }
    
    .resultado-container {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    
    .resumo-executivo {
        background: linear-gradient(135deg, var(--branco) 0%, var(--cor-fundo) 100%);
        border-radius: var(--radius-lg);
        padding: 30px;
        box-shadow: var(--sombra-media);
    }
    
    .resumo-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        margin-bottom: 15px;
        background: #e9ecef;
        border-radius: var(--radius-md);
    }
    
    .resumo-item.destaque-principal {
        background: linear-gradient(135deg, var(--cor-destaque) 0%, var(--cor-primaria) 100%);
        color: var(--branco);
        padding: 25px;
        margin-bottom: 25px;
        flex-direction: column;
        gap: 10px;
    }
    
    .resumo-label {
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
        font-size: 16px;
    }
    
    .resumo-valor {
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        color: var(--cor-destaque);
    }
    
    .resumo-item.destaque-principal .resumo-label,
    .resumo-item.destaque-principal .resumo-valor {
        color: var(--branco);
    }
    
    .resumo-valor.grande {
        font-size: 36px;
    }
    
    .resumo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }
    
    .detalhamento-section {
        background: var(--branco);
        border-radius: var(--radius-lg);
        padding: 30px;
        box-shadow: var(--sombra-leve);
    }
    
    .sistema-antigo-section {
        background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
        border: 2px solid var(--cor-erro);
    }
    
    .sistema-antigo-descricao {
        text-align: center;
        color: var(--cor-texto-claro);
        margin-bottom: 20px;
        font-style: italic;
    }
    
    .section-title {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .imposto-card {
        background: var(--branco);
        border-radius: var(--radius-md);
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: var(--sombra-leve);
        border-left: 5px solid var(--cor-destaque);
        transition: all var(--transicao-rapida);
    }
    
    .imposto-card:hover {
        transform: translateX(5px);
        box-shadow: var(--sombra-media);
    }
    
    .imposto-card.antigo {
        border-left-color: var(--cor-erro);
        background: linear-gradient(135deg, #FFFFFF 0%, #FFF5F5 100%);
    }
    
    .imposto-card.is-card {
        border-left-color: var(--cor-alerta);
    }
    
    .imposto-card.cascata-card {
        border-left-color: var(--cor-alerta);
        background: linear-gradient(135deg, #FFF9E6 0%, #FFE8B3 100%);
    }
    
    .imposto-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid var(--cor-fundo);
    }
    
    .imposto-icone {
        font-size: 40px;
    }
    
    .imposto-header h3 {
        margin: 0;
        padding: 0;
        border: none;
        font-size: 18px;
    }
    
    .imposto-header h3::after {
        display: none;
    }
    
    .imposto-header p {
        margin: 5px 0 0 0;
        font-size: 13px;
        color: var(--cor-texto-claro);
    }
    
    .imposto-detalhes {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .detalhe-linha {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: #f8f9fa;
        border-radius: var(--radius-sm);
        transition: all var(--transicao-rapida);
    }
    
    .detalhe-linha:hover {
        background: #e9ecef;
    }
    
    .detalhe-linha.reducao {
        background: linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%);
        border-left: 4px solid var(--cor-sucesso);
    }
    
    .detalhe-linha.destaque {
        background: linear-gradient(135deg, #e3f2ff 0%, #bbdefb 100%);
        border-left: 4px solid var(--cor-destaque);
        font-weight: 600;
    }
    
    .detalhe-linha.calculo {
        background: linear-gradient(135deg, #FFF9E6 0%, #FFE8B3 100%);
        font-family: 'Courier New', monospace;
    }
    
    .detalhe-linha.total {
        background: linear-gradient(135deg, var(--cor-destaque) 0%, var(--cor-primaria) 100%);
        color: var(--branco);
        padding: 15px;
        margin-top: 10px;
        font-weight: 700;
    }
    
    .detalhe-linha.total .detalhe-label,
    .detalhe-linha.total .detalhe-valor {
        color: var(--branco);
    }
    
    .detalhe-label {
        font-weight: 500;
        color: var(--cor-primaria);
    }
    
    .detalhe-valor {
        font-weight: 600;
        color: var(--cor-destaque);
        font-family: 'Poppins', sans-serif;
    }
    
    .detalhe-valor.grande {
        font-size: 20px;
    }
    
    .comparacao-section {
        background: var(--branco);
        border-radius: var(--radius-lg);
        padding: 30px;
        box-shadow: var(--sombra-leve);
    }
    
    .comparacao-cards {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 20px;
        align-items: center;
        margin: 20px 0;
    }
    
    .comparacao-card {
        background: var(--branco);
        padding: 30px;
        border-radius: var(--radius-md);
        text-align: center;
        box-shadow: var(--sombra-leve);
        transition: all var(--transicao-rapida);
    }
    
    .comparacao-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--sombra-media);
    }
    
    .comparacao-card.antigo {
        border: 3px solid var(--cor-erro);
    }
    
    .comparacao-card.novo {
        border: 3px solid var(--cor-sucesso);
    }
    
    .comparacao-icone {
        font-size: 48px;
        display: block;
        margin-bottom: 15px;
    }
    
    .comparacao-card h3 {
        color: var(--cor-primaria);
        margin: 10px 0;
        border: none;
        padding: 0;
        font-size: 20px;
    }
    
    .comparacao-card h3::after {
        display: none;
    }
    
    .comparacao-descricao {
        color: var(--cor-texto-claro);
        font-size: 14px;
        margin: 10px 0;
    }
    
    .comparacao-valor {
        font-size: 32px;
        font-weight: 700;
        font-family: 'Poppins', sans-serif;
        margin: 15px 0;
    }
    
    .comparacao-card.antigo .comparacao-valor {
        color: var(--cor-erro);
    }
    
    .comparacao-card.novo .comparacao-valor {
        color: var(--cor-sucesso);
    }
    
    .comparacao-info {
        font-size: 12px;
        color: var(--cor-texto-claro);
        font-style: italic;
    }
    
    .comparacao-seta {
        font-size: 48px;
        text-align: center;
    }
    
    .economia-card {
        background: var(--branco);
        padding: 30px;
        border-radius: var(--radius-md);
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 25px;
        box-shadow: var(--sombra-leve);
        transition: all var(--transicao-rapida);
    }
    
    .economia-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--sombra-media);
    }
    
    .economia-card.economia-positiva {
        border: 3px solid var(--cor-sucesso);
        background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
    }
    
    .economia-card.economia-negativa {
        border: 3px solid var(--cor-alerta);
        background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
    }
    
    .economia-icone {
        font-size: 64px;
    }
    
    .economia-conteudo h3 {
        color: var(--cor-primaria);
        margin: 0 0 10px 0;
        border: none;
        padding: 0;
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
        color: var(--cor-sucesso);
    }
    
    .economia-negativa .economia-valor {
        color: var(--cor-alerta);
    }
    
    .economia-percentual {
        font-size: 16px;
        color: var(--cor-texto-claro);
    }
    
    .graficos-section {
        background: var(--branco);
        border-radius: var(--radius-lg);
        padding: 30px;
        box-shadow: var(--sombra-leve);
    }
    
    .graficos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin: 20px 0;
    }
    
    .grafico-card {
        background: #f8f9fa;
        padding: 25px;
        border-radius: var(--radius-md);
        box-shadow: var(--sombra-leve);
    }
    
    .grafico-card h3 {
        text-align: center;
        margin-bottom: 20px;
        font-size: 16px;
    }
    
    .grafico-card-full {
        background: #f8f9fa;
        padding: 25px;
        border-radius: var(--radius-md);
        box-shadow: var(--sombra-leve);
        margin-top: 30px;
    }
    
    .grafico-card-full h3 {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .resumo-final-section {
        background: var(--branco);
        border-radius: var(--radius-lg);
        padding: 30px;
        box-shadow: var(--sombra-leve);
    }
    
    .resumo-final-card {
        background: #f8f9fa;
        border-radius: var(--radius-md);
        padding: 25px;
        margin-top: 20px;
    }
    
    .linha-resumo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        margin-bottom: 10px;
        border-radius: var(--radius-sm);
        background: var(--branco);
    }
    
    .linha-resumo .label {
        font-weight: 600;
        color: var(--cor-primaria);
    }
    
    .linha-resumo .valor {
        font-weight: 700;
        color: var(--cor-destaque);
        font-family: 'Poppins', sans-serif;
    }
    
    .linha-resumo .valor.positivo {
        color: var(--cor-erro);
    }
    
    .linha-resumo .valor.negativo {
        color: var(--cor-sucesso);
    }
    
    .separador-resumo {
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--cor-destaque), transparent);
        margin: 15px 0;
    }
    
    .linha-resumo.total-impostos {
        background: linear-gradient(135deg, #e3f2ff 0%, #bbdefb 100%);
        border: 2px solid var(--cor-destaque);
        padding: 20px;
        font-size: 18px;
    }
    
    .linha-resumo.valor-final {
        background: linear-gradient(135deg, var(--cor-destaque) 0%, var(--cor-primaria) 100%);
        color: var(--branco);
        padding: 25px;
        margin-top: 15px;
        font-size: 20px;
    }
    
    .linha-resumo.valor-final .label,
    .linha-resumo.valor-final .valor {
        color: var(--branco);
        font-size: 24px;
    }
    
    .observacoes-section {
        background: linear-gradient(135deg, #FFF9E6 0%, #FFE8B3 100%);
        border-radius: var(--radius-lg);
        padding: 30px;
        border-left: 5px solid var(--cor-alerta);
    }
    
    .observacoes-section h3 {
        color: var(--cor-primaria);
        margin-bottom: 20px;
    }
    
    .observacoes-lista {
        list-style: none;
        padding: 0;
    }
    
    .observacoes-lista li {
        padding: 12px 0;
        color: var(--cor-texto);
        font-size: 15px;
        line-height: 1.6;
    }
    
    @media (max-width: 768px) {
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
        
        .graficos-grid {
            grid-template-columns: 1fr;
        }
        
        .resumo-grid {
            grid-template-columns: 1fr;
        }
        
        .linha-resumo {
            flex-direction: column;
            gap: 8px;
            text-align: center;
        }
        
        .resumo-valor.grande {
            font-size: 28px;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Calculator.js otimizado carregado com sucesso!');
