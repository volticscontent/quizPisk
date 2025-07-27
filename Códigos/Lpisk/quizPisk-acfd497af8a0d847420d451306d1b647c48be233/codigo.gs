/**
 * GOOGLE APPS SCRIPT - PISCAFORM COM TRACKING
 * Baseado na versão simples que funcionava + tracking de campanha
 * 
 * ID da Planilha: 1D4X8vYJOltu13Xi9xrCUqqTBQVmg5EHDkYmj8B4_Bx4
 * Nome da Aba: Dados
 */

const PLANILHA_ID = '1D4X8vYJOltu13Xi9xrCUqqTBQVmg5EHDkYmj8B4_Bx4';
const ABA_NOME = 'Dados';

/**
 * Recebe dados do formulário e salva na planilha
 */
function doPost(e) {
  try {
    // Pega os dados enviados
    const dados = e.parameter;
    
    // Abre a planilha
    const planilha = SpreadsheetApp.openById(PLANILHA_ID);
    let aba = planilha.getSheetByName(ABA_NOME);
    
    // Se a aba não existe, cria ela
    if (!aba) {
      aba = planilha.insertSheet(ABA_NOME);
      // Adiciona cabeçalhos com tracking
      aba.getRange(1, 1, 1, 25).setValues([[
        'Nome', 'Email', 'WhatsApp', 'Instagram', 'Momento', 'Vendeu Fora', 
        'Faturamento', 'Caixa', 'Problema', 'Área Ajuda', 'Sócio', 
        'Por que escolher', 'Compromisso', 'Data/Hora', 'Status',
        'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Term', 'UTM Content',
        'Facebook ID', 'Google ID', 'Referrer', 'Step Reached', 'Progresso %'
      ]]);
      
      // Formatação básica do cabeçalho
      try {
        const headerRange = aba.getRange(1, 1, 1, 25);
        headerRange.setBackground('#4285f4')
                   .setFontColor('#ffffff')
                   .setFontWeight('bold')
                   .setHorizontalAlignment('center');
        aba.setFrozenRows(1);
      } catch (formatError) {
        // Se formatação falhar, continua sem ela
        console.warn('Formatação do cabeçalho falhou, continuando...');
      }
    }
    
    // Função para limpar campos vazios
    const limparCampo = (valor) => {
      if (!valor || valor === 'null' || valor === 'undefined' || String(valor).trim() === '') {
        return '-';
      }
      return String(valor).trim();
    };
    
    // Prepara os dados para inserir incluindo tracking
    const linha = [
      dados.name || '-',
      dados.email || '-',
      dados.phone || '-',
      dados.instagram || '-',
      dados.moment || '-',
      dados.vendeuFora || '-',
      dados.faturamento || '-',
      dados.caixaDisponivel || '-',
      dados.problemaPrincipal || '-',
      dados.areaAjuda || '-',
      dados.possuiSocio || '-',
      dados.porQueEscolher || '-',
      dados.compromisso || '-',
      new Date().toLocaleString('pt-BR'),
      dados.status || 'quiz_completo',
      // Dados de tracking/campanha
      dados.utm_source || '-',
      dados.utm_medium || '-',
      dados.utm_campaign || '-',
      dados.utm_term || '-',
      dados.utm_content || '-',
      dados.fbclid || '-',
      dados.gclid || '-',
      dados.referrer || '-',
      dados.step_reached || 'finished',
      dados.progress_percentage || '100'
    ];
    
    // Adiciona a linha na próxima posição vazia
    const proximaLinha = aba.getLastRow() + 1;
    aba.getRange(proximaLinha, 1, 1, linha.length).setValues([linha]);
    
    // Formatação opcional da linha (não crítica)
    try {
      const range = aba.getRange(proximaLinha, 1, 1, 25);
      
      // Cores baseadas no status
      if (dados.status === 'lead_parcial') {
        range.setBackground('#fff3cd'); // Amarelo claro
      } else if (dados.status === 'quiz_completo') {
        range.setBackground('#d4edda'); // Verde claro
      }
      
      // Coluna de status destacada
      const statusRange = aba.getRange(proximaLinha, 15);
      if (dados.status === 'lead_parcial') {
        statusRange.setBackground('#ffc107').setFontWeight('bold');
      } else if (dados.status === 'quiz_completo') {
        statusRange.setBackground('#28a745').setFontColor('#ffffff').setFontWeight('bold');
      }
      
    } catch (formatError) {
      // Se formatação falhar, continua sem ela
      console.warn('Formatação da linha falhou, mas dados foram salvos');
    }
    
    // Retorna sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Dados salvos com tracking!',
        linha: proximaLinha,
        tracking: {
          utm_source: dados.utm_source,
          utm_campaign: dados.utm_campaign,
          referrer: dados.referrer,
          status: dados.status
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retorna erro
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        message: 'Erro ao salvar: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Para testes (GET)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'PiscaForm com Tracking funcionando!',
      planilha: PLANILHA_ID,
      aba: ABA_NOME,
      versao: 'v4.0 - Híbrida Simples + Tracking'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Função para testar se tem acesso à planilha
 * Execute esta função manualmente uma vez para autorizar
 */
function testarAcesso() {
  try {
    const planilha = SpreadsheetApp.openById(PLANILHA_ID);
    console.log('✅ Planilha acessível:', planilha.getName());
    
    let aba = planilha.getSheetByName(ABA_NOME);
    if (!aba) {
      aba = planilha.insertSheet(ABA_NOME);
      console.log('✅ Aba criada:', ABA_NOME);
      
      // Adiciona cabeçalhos de teste com tracking
      aba.getRange(1, 1, 1, 25).setValues([[
        'Nome', 'Email', 'WhatsApp', 'Instagram', 'Momento', 'Vendeu Fora', 
        'Faturamento', 'Caixa', 'Problema', 'Área Ajuda', 'Sócio', 
        'Por que escolher', 'Compromisso', 'Data/Hora', 'Status',
        'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Term', 'UTM Content',
        'Facebook ID', 'Google ID', 'Referrer', 'Step Reached', 'Progresso %'
      ]]);
    }
    
    // Teste de escrita com dados completos
    const linha = aba.getLastRow() + 1;
    const dadosTeste = [
      'João Teste', 'joao@teste.com', '+5511999999999', 'joao_teste', 
      'Estou começando do zero no digital', 'Nunca vendi', 'R$ 25.000', 
      'Menos de R$5.000', 'Margem baixa vendendo no Brasil', 'Todos', 
      'Sim', 'Quero escalar meu negócio rapidamente', 'Sim, me comprometo',
      new Date().toLocaleString('pt-BR'), 'quiz_completo',
      'google', 'cpc', 'campanha_dropshipping', 'dropshipping_brasil', 'anuncio_01',
      '-', 'gclid_12345', 'https://google.com/search', 'finished', '100'
    ];
    
    aba.getRange(linha, 1, 1, dadosTeste.length).setValues([dadosTeste]);
    console.log('✅ Teste de escrita com tracking na linha:', linha);
    
    return 'Tudo funcionando com tracking!';
    
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

/**
 * Função para limpar/recriar a planilha (opcional)
 */
function recriarPlanilha() {
  try {
    const planilha = SpreadsheetApp.openById(PLANILHA_ID);
    
    // Remove aba existente se houver
    const abaExistente = planilha.getSheetByName(ABA_NOME);
    if (abaExistente) {
      planilha.deleteSheet(abaExistente);
      console.log('🗑️ Aba existente removida');
    }
    
    // Cria nova aba
    const novaAba = planilha.insertSheet(ABA_NOME);
    
    // Adiciona cabeçalhos
    novaAba.getRange(1, 1, 1, 25).setValues([[
      'Nome', 'Email', 'WhatsApp', 'Instagram', 'Momento', 'Vendeu Fora', 
      'Faturamento', 'Caixa', 'Problema', 'Área Ajuda', 'Sócio', 
      'Por que escolher', 'Compromisso', 'Data/Hora', 'Status',
      'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Term', 'UTM Content',
      'Facebook ID', 'Google ID', 'Referrer', 'Step Reached', 'Progresso %'
    ]]);
    
    // Formatação do cabeçalho
    const headerRange = novaAba.getRange(1, 1, 1, 25);
    headerRange.setBackground('#4285f4')
               .setFontColor('#ffffff')
               .setFontWeight('bold')
               .setHorizontalAlignment('center');
    
    novaAba.setFrozenRows(1);
    
    console.log('✅ Nova planilha criada com sucesso!');
    
    return 'Planilha recriada com tracking!';
    
  } catch (error) {
    console.error('❌ Erro ao recriar planilha:', error);
    throw error;
  }
} 