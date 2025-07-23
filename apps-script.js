/**
 * 📊 GOOGLE APPS SCRIPT - PISCAFORM INTEGRATION
 * 
 * Este código deve ser colado no Google Apps Script para integrar
 * o formulário PiscaForm com Google Sheets
 * 
 * Baseado na documentação oficial: https://developers.google.com/workspace/sheets/api/quickstart/apps-script
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
    console.log('📋 Parâmetros recebidos:', e);
    
    let data;
    
    // Tenta diferentes formas de extrair os dados
    if (e.postData && e.postData.contents) {
      console.log('📄 Dados brutos:', e.postData.contents);
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      console.log('📊 Usando parâmetros:', e.parameter);
      data = e.parameter;
    } else if (e.parameters) {
      console.log('📋 Usando parameters:', e.parameters);
      data = e.parameters;
    } else {
      throw new Error('Nenhum dado encontrado na requisição');
    }
    
    console.log('✅ Dados processados:', data);
    
    // Adiciona os dados à planilha
    const result = addToSheet(data);
    
    // Retorna resposta de sucesso (sem setHeaders para compatibilidade)
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Dados salvos com sucesso!',
        row: result.row,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ Erro no doPost:', error);
    
    // Retorna resposta de erro (sem setHeaders para compatibilidade)
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        message: 'Erro ao salvar dados: ' + error.toString(),
        error: error.name,
        timestamp: new Date().toISOString()
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
      timestamp: new Date().toISOString(),
      version: '3.0 - Corrigido',
      url: 'AKfycbz_OGpFllYdoyUjVBf7f4lr7uYqg6P4SSMZk0nWZNOdR0ss9UBWRc9SC04jCy7QWzNG'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Adiciona dados à planilha do Google Sheets
 */
function addToSheet(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // Adiciona cabeçalhos se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      const headers = ['Data/Hora', 'Nome', 'WhatsApp', 'E-mail', 'Instagram', 'Momento', 'Vendeu Fora', 'Faturamento', 'Caixa', 'Problema', 'Área Ajuda', 'Sócio', 'Por que escolher', 'Compromisso'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Adiciona nova linha com dados
    const rowData = [
      new Date(),
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
      data.compromisso || ''
    ];
    
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    console.log('✅ Dados adicionados na linha:', nextRow);
    return { success: true, row: nextRow };
    
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
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
    compromisso: 'A'
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

/**
 * Função para testar autorização (NOVA - v3.0)
 */
function testAuthorization() {
  console.log('🔐 Testando autorização...');
  
  try {
    // Testa acesso à planilha
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Planilha acessada:', spreadsheet.getName());
    
    // Testa função de adição
    const testData = {
      name: 'Teste Autorização',
      phone: '+5511999999999',
      email: 'teste@auth.com',
      instagram: 'teste_auth',
      moment: 'A',
      vendeuFora: 'A',
      faturamento: 'B',
      caixaDisponivel: 'C',
      problemaPrincipal: 'A',
      areaAjuda: 'E',
      possuiSocio: 'B',
      porQueEscolher: 'Teste de autorização do Google Apps Script para PiscaForm.',
      compromisso: 'A',
      timestamp: new Date().toISOString(),
      submittedAt: new Date().toLocaleString('pt-BR')
    };
    
    const result = addToSheet(testData);
    console.log('✅ Autorização funcionando! Resultado:', result);
    console.log('📋 Verifique a planilha para confirmar que os dados foram salvos');
    
    return { 
      success: true, 
      message: 'Autorização OK!', 
      result: result 
    };
    
  } catch (error) {
    console.error('❌ Erro de autorização:', error);
    return { 
      success: false, 
      message: 'Erro de autorização: ' + error.toString() 
    };
  }
} 