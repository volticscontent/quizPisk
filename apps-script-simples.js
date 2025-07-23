/**
 * GOOGLE APPS SCRIPT - PISCAFORM SIMPLES
 * Versão simplificada que apenas recebe dados e salva na planilha
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
    const aba = planilha.getSheetByName(ABA_NOME);
    
    // Se a aba não existe, cria ela
    if (!aba) {
      const novaAba = planilha.insertSheet(ABA_NOME);
      // Adiciona cabeçalhos
      novaAba.getRange(1, 1, 1, 15).setValues([[
        'Nome', 'Email', 'WhatsApp', 'Instagram', 'Momento', 'Vendeu Fora', 
        'Faturamento', 'Caixa', 'Problema', 'Área Ajuda', 'Sócio', 
        'Por que escolher', 'Compromisso', 'Data/Hora', 'Status'
      ]]);
    }
    
    // Prepara os dados para inserir
    const linha = [
      dados.name || '',
      dados.email || '',
      dados.phone || '',
      dados.instagram || '',
      dados.moment || '',
      dados.vendeuFora || '',
      dados.faturamento || '',
      dados.caixaDisponivel || '',
      dados.problemaPrincipal || '',
      dados.areaAjuda || '',
      dados.possuiSocio || '',
      dados.porQueEscolher || '',
      dados.compromisso || '',
      new Date().toLocaleString('pt-BR'),
      'NOVO'
    ];
    
    // Pega a aba correta
    const sheet = planilha.getSheetByName(ABA_NOME);
    
    // Adiciona a linha na próxima posição vazia
    const proximaLinha = sheet.getLastRow() + 1;
    sheet.getRange(proximaLinha, 1, 1, linha.length).setValues([linha]);
    
    // Retorna sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Dados salvos!',
        linha: proximaLinha
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retorna erro
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
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
      message: 'PiscaForm funcionando!',
      planilha: PLANILHA_ID,
      aba: ABA_NOME
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
    }
    
    // Teste de escrita
    const linha = aba.getLastRow() + 1;
    aba.getRange(linha, 1).setValue('TESTE - ' + new Date());
    console.log('✅ Teste de escrita na linha:', linha);
    
    return 'Tudo funcionando!';
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
} 