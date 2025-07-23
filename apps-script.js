/**
 * 📊 GOOGLE APPS SCRIPT - PISCAFORM INTEGRATION
 * 
 * Este código deve ser colado no Google Apps Script para integrar
 * o formulário PiscaForm com Google Sheets
 * 
 * Instruções de uso estão no README gerado
 */

// 🔧 CONFIGURAÇÕES - EDITE AQUI
const SHEET_NAME = 'PiscaForm Respostas'; // Nome da aba na planilha
const SPREADSHEET_ID = '1FXYEi0kJhnS1ZlErO_tqO5oVhYWGJN-GwrvngPblJt8'; // ID da sua planilha

/**
 * Função principal que recebe os dados do formulário
 */
function doPost(e) {
  try {
    console.log('📥 Recebendo dados do formulário...');
    
    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);
    console.log('📋 Dados recebidos:', data);
    
    // Adiciona os dados à planilha
    const result = addToSheet(data);
    
    // Retorna resposta de sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Dados salvos com sucesso!',
        row: result.row 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ Erro no doPost:', error);
    
    // Retorna resposta de erro
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        message: 'Erro ao salvar dados: ' + error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função para GET requests (teste)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      message: 'PiscaForm Apps Script está funcionando!',
      timestamp: new Date().toISOString() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Adiciona dados à planilha do Google Sheets
 */
function addToSheet(data) {
  try {
    // Obtém a planilha
    let spreadsheet;
    if (SPREADSHEET_ID && SPREADSHEET_ID !== 'SUA_PLANILHA_ID_AQUI') {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    // Obtém ou cria a aba
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      setupHeaders(sheet);
    }
    
    // Verifica se já tem cabeçalhos
    if (sheet.getLastRow() === 0) {
      setupHeaders(sheet);
    }
    
    // Prepara os dados para inserção
    const rowData = [
      new Date(), // Data/Hora
      data.name || '',
      data.phone || '',
      data.email || '',
      data.instagram || '',
      data.moment || '',
      data.vendeuFora || '',
      data.faturamento || '',
      data.caixaDisponivel || '',
      data.problemaPrincipal || '',
      data.areaAjuda || '',
      data.possuiSocio || '',
      data.porQueEscolher || '',
      data.compromisso || '',
      data.submittedAt || '',
      data.timestamp || ''
    ];
    
    // Adiciona nova linha
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    console.log('✅ Dados adicionados na linha:', nextRow);
    
    return { 
      success: true, 
      row: nextRow,
      data: rowData 
    };
    
  } catch (error) {
    console.error('❌ Erro ao adicionar à planilha:', error);
    throw error;
  }
}

/**
 * Configura os cabeçalhos da planilha
 */
function setupHeaders(sheet) {
  const headers = [
    'Data/Hora',
    'Nome',
    'WhatsApp',
    'E-mail',
    'Instagram',
    'Momento Atual',
    'Vendeu Fora do Brasil',
    'Faturamento Acumulado',
    'Caixa Disponível',
    'Problema Principal',
    'Área de Ajuda',
    'Possui Sócio',
    'Por que escolher você',
    'Compromisso',
    'Enviado em',
    'Timestamp'
  ];
  
  // Adiciona cabeçalhos
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formata cabeçalhos
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // Ajusta largura das colunas
  sheet.autoResizeColumns(1, headers.length);
  
  console.log('📋 Cabeçalhos configurados');
}

/**
 * Função para testar manualmente (opcional)
 */
function testFunction() {
  const testData = {
    name: 'João Silva',
    phone: '+5511999999999',
    email: 'joao@email.com',
    instagram: 'joaosilva',
    moment: 'A',
    vendeuFora: 'A',
    faturamento: 'C',
    caixaDisponivel: 'D',
    problemaPrincipal: 'A',
    areaAjuda: 'E',
    possuiSocio: 'B',
    porQueEscolher: 'Sou comprometido e quero escalar meu negócio no mercado internacional.',
    compromisso: 'A',
    submittedAt: new Date().toLocaleString('pt-BR'),
    timestamp: new Date().toISOString()
  };
  
  const result = addToSheet(testData);
  console.log('🧪 Teste realizado:', result);
}

/**
 * Função para obter dados da planilha (opcional)
 */
function getAllData() {
  try {
    let spreadsheet;
    if (SPREADSHEET_ID && SPREADSHEET_ID !== 'SUA_PLANILHA_ID_AQUI') {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    return data;
    
  } catch (error) {
    console.error('❌ Erro ao obter dados:', error);
    return [];
  }
} 