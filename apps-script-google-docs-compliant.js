/**
 * GOOGLE APPS SCRIPT - PISCAFORM
 * Baseado nas melhores práticas da documentação oficial do Google
 * Fonte: https://developers.google.com/apps-script/guides/sheets/functions
 * 
 * PLANILHA: https://docs.google.com/spreadsheets/d/1D4X8vYJOltu13Xi9xrCUqqTBQVmg5EHDkYmj8B4_Bx4/edit
 * ABA: Dados
 * 
 * VERSÃO: Google Docs Compliant
 * DATA: 23/01/2025
 */

// Configurações da planilha
const CONFIG = {
  SPREADSHEET_ID: '1D4X8vYJOltu13Xi9xrCUqqTBQVmg5EHDkYmj8B4_Bx4',
  SHEET_NAME: 'Dados',
  TIMEZONE: 'America/Sao_Paulo'
};

/**
 * Função para processar requisições POST do formulário
 * Segue as diretrizes de Web Apps do Google Apps Script
 */
function doPost(e) {
  console.log('🚀 PiscaForm - Iniciando processamento');
  
  try {
    // Log da requisição recebida
    console.log('📥 Parâmetros recebidos:', JSON.stringify(e.parameter));
    
    // Validar entrada
    if (!e || !e.parameter) {
      throw new Error('Nenhum parâmetro recebido na requisição');
    }

    // Processar dados
    const formData = processFormData(e.parameter);
    
    // Salvar na planilha
    const result = saveToSheet(formData);
    
    // Retornar sucesso
    console.log('✅ Processamento concluído com sucesso');
    return createJsonResponse({
      success: true,
      message: 'Dados salvos com sucesso!',
      data: {
        row: result.row,
        timestamp: new Date().toISOString(),
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/edit`
      }
    });

  } catch (error) {
    console.error('❌ Erro no processamento:', error.toString());
    return createJsonResponse({
      success: false,
      error: error.toString(),
      message: 'Erro ao processar dados do formulário'
    });
  }
}

/**
 * Função para processar requisições GET (testes e verificação)
 */
function doGet(e) {
  console.log('📡 Requisição GET recebida para teste');
  
  return createJsonResponse({
    success: true,
    message: 'PiscaForm API funcionando!',
    version: 'Google Docs Compliant v1.0',
    timestamp: new Date().toISOString(),
    config: {
      spreadsheetId: CONFIG.SPREADSHEET_ID,
      sheetName: CONFIG.SHEET_NAME,
      timezone: CONFIG.TIMEZONE
    },
    links: {
      spreadsheet: `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/edit`,
      documentation: 'https://developers.google.com/apps-script/guides/sheets/functions'
    }
  });
}

/**
 * Processa e valida os dados do formulário
 * Aplica limpeza e formatação dos dados conforme necessário
 */
function processFormData(params) {
  console.log('🔄 Processando dados do formulário...');
  
  // Validações básicas
  validateRequiredFields(params);
  
  // Limpeza e formatação dos dados
  const cleanData = {
    // Informações pessoais
    nome: cleanString(params.name),
    email: cleanEmail(params.email),
    whatsapp: cleanPhone(params.phone),
    instagram: cleanInstagram(params.instagram),
    
    // Respostas do quiz
    momentoAtual: params.moment || '',
    vendeuFora: params.vendeuFora || '',
    faturamento: cleanString(params.faturamento),
    caixaDisponivel: params.caixaDisponivel || '',
    problemaPrincipal: params.problemaPrincipal || '',
    areaAjuda: params.areaAjuda || '',
    possuiSocio: params.possuiSocio || '',
    porQueEscolher: cleanText(params.porQueEscolher),
    compromisso: params.compromisso || '',
    
    // Metadados
    dataHora: formatDateTime(),
    timestamp: new Date().toISOString(),
    status: 'NOVO',
    origem: 'PiscaForm'
  };
  
  console.log('✅ Dados processados e validados');
  return cleanData;
}

/**
 * Salva os dados na planilha Google Sheets
 * Segue as melhores práticas de performance do Google Apps Script
 */
function saveToSheet(data) {
  console.log('💾 Iniciando salvamento na planilha...');
  
  try {
    // Abrir planilha
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    console.log('📊 Planilha aberta:', spreadsheet.getName());
    
    // Obter ou criar aba
    let sheet = getOrCreateSheet(spreadsheet);
    
    // Preparar dados para inserção
    const rowData = prepareRowData(data);
    
    // Inserir dados (operação atômica)
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    console.log(`✅ Dados salvos na linha ${nextRow} da aba "${CONFIG.SHEET_NAME}"`);
    
    return {
      success: true,
      row: nextRow,
      sheetName: CONFIG.SHEET_NAME
    };

  } catch (error) {
    console.error('❌ Erro ao salvar na planilha:', error.toString());
    throw new Error(`Falha ao salvar na planilha: ${error.message}`);
  }
}

/**
 * Obtém a aba ou cria uma nova com cabeçalhos formatados
 */
function getOrCreateSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    console.log(`📝 Criando nova aba: ${CONFIG.SHEET_NAME}`);
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
    setupSheetHeaders(sheet);
  } else {
    console.log(`✅ Aba encontrada: ${CONFIG.SHEET_NAME}`);
    ensureHeaders(sheet);
  }
  
  return sheet;
}

/**
 * Configura os cabeçalhos da planilha com formatação
 */
function setupSheetHeaders(sheet) {
  const headers = getSheetHeaders();
  
  // Inserir cabeçalhos
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatar cabeçalhos
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold')
             .setBackground('#4285f4')
             .setFontColor('white')
             .setFontSize(11)
             .setHorizontalAlignment('center');
  
  // Auto-redimensionar colunas
  sheet.autoResizeColumns(1, headers.length);
  
  // Congelar primeira linha
  sheet.setFrozenRows(1);
  
  console.log('✅ Cabeçalhos configurados e formatados');
}

/**
 * Garante que os cabeçalhos existem na planilha
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    setupSheetHeaders(sheet);
  }
}

/**
 * Define os cabeçalhos das colunas
 */
function getSheetHeaders() {
  return [
    'Nome',
    'Email',
    'WhatsApp',
    'Instagram',
    'Momento Atual',
    'Vendeu Fora',
    'Faturamento',
    'Caixa Disponível',
    'Problema Principal',
    'Área de Ajuda',
    'Possui Sócio',
    'Por que escolher',
    'Compromisso',
    'Data/Hora',
    'Timestamp',
    'Status',
    'Origem'
  ];
}

/**
 * Prepara os dados para inserção na planilha
 */
function prepareRowData(data) {
  return [
    data.nome,
    data.email,
    data.whatsapp,
    data.instagram,
    data.momentoAtual,
    data.vendeuFora,
    data.faturamento,
    data.caixaDisponivel,
    data.problemaPrincipal,
    data.areaAjuda,
    data.possuiSocio,
    data.porQueEscolher,
    data.compromisso,
    data.dataHora,
    data.timestamp,
    data.status,
    data.origem
  ];
}

/**
 * Funções de validação
 */
function validateRequiredFields(params) {
  const required = ['name', 'email', 'phone', 'instagram'];
  const missing = required.filter(field => !params[field] || params[field].trim() === '');
  
  if (missing.length > 0) {
    throw new Error(`Campos obrigatórios ausentes: ${missing.join(', ')}`);
  }
  
  // Validações específicas
  if (!isValidEmail(params.email)) {
    throw new Error('Email inválido');
  }
  
  if (params.name.trim().length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres');
  }
  
  if (params.phone.trim().length < 10) {
    throw new Error('Telefone deve ter pelo menos 10 dígitos');
  }
}

/**
 * Funções de limpeza de dados
 */
function cleanString(str) {
  return str ? str.toString().trim() : '';
}

function cleanEmail(email) {
  return email ? email.toString().toLowerCase().trim() : '';
}

function cleanPhone(phone) {
  return phone ? phone.toString().trim() : '';
}

function cleanInstagram(instagram) {
  return instagram ? instagram.toString().replace('@', '').trim() : '';
}

function cleanText(text) {
  return text ? text.toString().trim().replace(/\s+/g, ' ') : '';
}

function isValidEmail(email) {
  return email && email.includes('@') && email.includes('.');
}

/**
 * Formata data/hora no fuso horário brasileiro
 */
function formatDateTime() {
  return new Date().toLocaleString('pt-BR', {
    timeZone: CONFIG.TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Cria resposta JSON padronizada
 */
function createJsonResponse(data) {
  const response = ContentService
    .createTextOutput(JSON.stringify(data, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
  
  console.log('📤 Resposta JSON criada:', JSON.stringify(data, null, 2));
  return response;
}

/**
 * Função para teste de autorização
 * Execute esta função manualmente para autorizar o script
 */
function testAuthorization() {
  console.log('🔐 Testando autorização...');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = getOrCreateSheet(spreadsheet);
    
    // Teste de escrita
    const testRow = sheet.getLastRow() + 1;
    const testData = [
      'TESTE AUTORIZAÇÃO',
      'teste@email.com',
      '+5511999999999',
      'teste',
      'A', 'A', 'Teste', 'A', 'A', 'A', 'A',
      'Teste de autorização do sistema',
      'A',
      formatDateTime(),
      new Date().toISOString(),
      'TESTE',
      'Apps Script'
    ];
    
    sheet.getRange(testRow, 1, 1, testData.length).setValues([testData]);
    
    console.log('✅ Teste de autorização realizado com sucesso na linha:', testRow);
    
    return {
      success: true,
      message: 'Autorização concedida com sucesso!',
      spreadsheetName: spreadsheet.getName(),
      sheetName: CONFIG.SHEET_NAME,
      testRow: testRow
    };
    
  } catch (error) {
    console.error('❌ Erro de autorização:', error.toString());
    throw error;
  }
}

/**
 * Função para inserir dados de teste
 */
function insertTestData() {
  console.log('🧪 Inserindo dados de teste...');
  
  const testParams = {
    name: 'João Silva Teste',
    email: 'joao.teste@piscaform.com',
    phone: '+5511987654321',
    instagram: 'joao_teste',
    moment: 'B',
    vendeuFora: 'A',
    faturamento: 'R$ 50.000',
    caixaDisponivel: 'C',
    problemaPrincipal: 'A',
    areaAjuda: 'E',
    possuiSocio: 'B',
    porQueEscolher: 'Este é um teste completo do sistema PiscaForm para verificar se todos os dados estão sendo salvos corretamente na planilha Google Sheets.',
    compromisso: 'A'
  };
  
  try {
    const result = doPost({ parameter: testParams });
    console.log('✅ Dados de teste inseridos:', result);
    return result;
  } catch (error) {
    console.error('❌ Erro ao inserir dados de teste:', error);
    throw error;
  }
} 