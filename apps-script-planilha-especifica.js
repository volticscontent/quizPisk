/**
 * GOOGLE APPS SCRIPT - PISCAFORM 
 * PLANILHA ESPECÍFICA: 1D4X8vYJOltu13Xi9xrCUqqTBQVmg5EHDkYmj8B4_Bx4
 * ABA: Dados
 * 
 * Este script recebe dados do formulário PiscaForm e salva na planilha específica:
 * https://docs.google.com/spreadsheets/d/1D4X8vYJOltu13Xi9xrCUqqTBQVmg5EHDkYmj8B4_Bx4/edit?gid=0#gid=0
 * 
 * CONFIGURAÇÃO:
 * 1. Cole este código no Google Apps Script
 * 2. Execute "testAuthorization" uma vez para autorizar
 * 3. Deploy como Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copie a URL do deployment e atualize no frontend
 * 
 * VERSÃO: Planilha Específica - Aba Dados
 * DATA: 23/01/2025
 */

// ID da planilha específica do usuário
const SPREADSHEET_ID = '1D4X8vYJOltu13Xi9xrCUqqTBQVmg5EHDkYmj8B4_Bx4';
const SHEET_NAME = 'Dados'; // Nome da aba que já existe na planilha

/**
 * Função principal que processa requisições POST
 */
function doPost(e) {
  console.log('🔄 PiscaForm - Nova submissão recebida');
  
  try {
    // Validar dados recebidos
    if (!e || !e.parameter) {
      console.error('❌ Nenhum dado recebido');
      return createResponse({
        success: false,
        error: 'NO_DATA',
        message: 'Nenhum dado foi recebido na requisição'
      });
    }

    console.log('📥 Dados recebidos:', JSON.stringify(e.parameter));

    // Processar e validar dados
    const processedData = processFormData(e.parameter);
    
    if (!processedData.isValid) {
      console.error('❌ Dados inválidos:', processedData.errors);
      return createResponse({
        success: false,
        error: 'INVALID_DATA',
        message: 'Dados inválidos',
        errors: processedData.errors
      });
    }

    // Salvar na planilha
    const saveResult = saveToSpreadsheet(processedData.data);
    
    if (saveResult.success) {
      console.log('✅ Dados salvos com sucesso na linha:', saveResult.row);
      return createResponse({
        success: true,
        message: 'Dados salvos com sucesso!',
        data: {
          row: saveResult.row,
          spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      console.error('❌ Erro ao salvar:', saveResult.error);
      return createResponse({
        success: false,
        error: 'SAVE_ERROR',
        message: 'Erro ao salvar dados na planilha',
        details: saveResult.error
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.toString());
    return createResponse({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor',
      details: error.toString()
    });
  }
}

/**
 * Função para requisições GET (testes e verificação)
 */
function doGet(e) {
  console.log('📡 Requisição GET recebida');
  
  return createResponse({
    success: true,
    message: 'PiscaForm API funcionando!',
    version: 'FINAL - Planilha Específica - Aba Dados',
    timestamp: new Date().toISOString(),
    spreadsheetId: SPREADSHEET_ID,
    planilhaUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
    sheetName: SHEET_NAME
  });
}

/**
 * Processa e valida os dados do formulário
 */
function processFormData(params) {
  const errors = [];
  
  // Validações obrigatórias
  if (!params.name || params.name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }
  
  if (!params.email || !params.email.includes('@')) {
    errors.push('Email deve ser válido');
  }
  
  if (!params.phone || params.phone.trim().length < 10) {
    errors.push('Telefone deve ter pelo menos 10 dígitos');
  }
  
  if (!params.instagram || params.instagram.trim().length < 3) {
    errors.push('Instagram deve ser válido');
  }

  // Se há erros, retorna inválido
  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors,
      data: null
    };
  }

  // Dados processados e limpos
  const cleanData = {
    // Informações pessoais
    nome: params.name ? params.name.trim() : '',
    email: params.email ? params.email.toLowerCase().trim() : '',
    whatsapp: params.phone ? params.phone.trim() : '',
    instagram: params.instagram ? params.instagram.replace('@', '').trim() : '',
    
    // Respostas do quiz
    momentoAtual: params.moment || '',
    vendeuFora: params.vendeuFora || '',
    faturamento: params.faturamento || '',
    caixaDisponivel: params.caixaDisponivel || '',
    problemaPrincipal: params.problemaPrincipal || '',
    areaAjuda: params.areaAjuda || '',
    possuiSocio: params.possuiSocio || '',
    porQueEscolher: params.porQueEscolher || '',
    compromisso: params.compromisso || '',
    
    // Metadados
    dataHora: new Date().toLocaleString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    timestamp: new Date().toISOString(),
    status: 'NOVO'
  };

  return {
    isValid: true,
    errors: [],
    data: cleanData
  };
}

/**
 * Salva os dados na aba "Dados" da planilha específica
 */
function saveToSpreadsheet(data) {
  try {
    console.log('💾 Conectando à planilha:', SPREADSHEET_ID);
    console.log('📋 Usando aba:', SHEET_NAME);
    
    // Abre a planilha pelo ID
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Busca a aba "Dados"
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.log('❌ Aba "Dados" não encontrada. Criando nova aba...');
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Cabeçalhos das colunas
      const headers = [
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
        'Status'
      ];
      
      // Adiciona cabeçalhos
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formata cabeçalhos
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontSize(12);
      
      // Ajusta largura das colunas
      sheet.autoResizeColumns(1, headers.length);
      
      console.log('✅ Aba "Dados" criada e formatada com sucesso');
    } else {
      console.log('✅ Aba "Dados" encontrada');
    }

    // Verifica se a primeira linha tem cabeçalhos
    const firstRow = sheet.getRange(1, 1, 1, 15).getValues()[0];
    const hasHeaders = firstRow.some(cell => cell && cell.toString().trim() !== '');
    
    if (!hasHeaders) {
      console.log('📝 Adicionando cabeçalhos à aba existente...');
      const headers = [
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
        'Status'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formata cabeçalhos
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontSize(12);
    }

    // Prepara dados para inserção
    const rowData = [
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
      data.status
    ];

    // Adiciona nova linha
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    console.log(`✅ Dados salvos na linha ${nextRow} da aba "${SHEET_NAME}"`);
    
    return {
      success: true,
      row: nextRow,
      sheetName: SHEET_NAME
    };

  } catch (error) {
    console.error('❌ Erro ao salvar na planilha:', error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Cria resposta padronizada em JSON
 */
function createResponse(data) {
  const response = ContentService
    .createTextOutput(JSON.stringify(data, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
  
  console.log('📤 Resposta enviada:', JSON.stringify(data, null, 2));
  return response;
}

/**
 * Função para teste de autorização
 * Execute esta função manualmente no Apps Script para autorizar permissões
 */
function testAuthorization() {
  console.log('🔐 Testando autorização e acesso à planilha...');
  console.log('📋 Planilha ID:', SPREADSHEET_ID);
  console.log('📄 Aba:', SHEET_NAME);
  
  try {
    // Tenta acessar a planilha
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const spreadsheetName = spreadsheet.getName();
    
    console.log('✅ Planilha acessível:', spreadsheetName);
    
    // Busca a aba "Dados"
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      console.log('⚠️ Aba "Dados" não encontrada. Criando...');
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      console.log('✅ Aba "Dados" criada');
    } else {
      console.log('✅ Aba "Dados" já existe');
    }
    
    // Teste de escrita
    const testRow = sheet.getLastRow() + 1;
    sheet.getRange(testRow, 1).setValue('TESTE AUTORIZAÇÃO - ' + new Date().toLocaleString('pt-BR'));
    
    console.log('✅ Teste de escrita realizado na linha:', testRow);
    
    return {
      success: true,
      message: 'Autorização concedida com sucesso!',
      spreadsheetName: spreadsheetName,
      sheetName: SHEET_NAME,
      testRow: testRow,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`
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
  
  const testData = {
    name: 'João Teste Silva',
    email: 'joao.teste@email.com', 
    phone: '+5511999887766',
    instagram: 'joao_teste_piscaform',
    moment: 'A',
    vendeuFora: 'B',
    faturamento: 'R$ 25.000',
    caixaDisponivel: 'C',
    problemaPrincipal: 'A',
    areaAjuda: 'E',
    possuiSocio: 'B',
    porQueEscolher: 'Este é um teste de inserção de dados no sistema PiscaForm. Demonstra como os dados serão salvos na aba Dados da planilha Google Sheets.',
    compromisso: 'A'
  };
  
  try {
    const result = doPost({ parameter: testData });
    console.log('✅ Dados de teste inseridos:', result);
    return result;
  } catch (error) {
    console.error('❌ Erro ao inserir dados de teste:', error);
    throw error;
  }
}

/**
 * Função para limpar dados de teste
 */
function clearTestData() {
  console.log('🧹 Limpando dados de teste...');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.log('⚠️ Aba "Dados" não existe ainda');
      return;
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      console.log('ℹ️ Não há dados para limpar');
      return;
    }
    
    // Busca linhas com dados de teste
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 15);
    const values = dataRange.getValues();
    
    let deletedCount = 0;
    
    // Remove de baixo para cima para não afetar índices
    for (let i = values.length - 1; i >= 0; i--) {
      const row = values[i];
      const nome = row[0] ? row[0].toString().toLowerCase() : '';
      
      // Remove se contém "teste" no nome
      if (nome.includes('teste') || nome.includes('test')) {
        sheet.deleteRow(i + 2); // +2 porque começamos da linha 2
        deletedCount++;
      }
    }
    
    console.log(`✅ ${deletedCount} linhas de teste removidas`);
    
    return {
      success: true,
      deletedRows: deletedCount
    };
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados de teste:', error);
    throw error;
  }
}

/**
 * Função para verificar estrutura da planilha
 */
function checkSpreadsheetStructure() {
  console.log('🔍 Verificando estrutura da planilha...');
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = spreadsheet.getSheets();
    
    console.log('📊 Planilha:', spreadsheet.getName());
    console.log('📄 Total de abas:', sheets.length);
    
    sheets.forEach((sheet, index) => {
      console.log(`   ${index + 1}. ${sheet.getName()}`);
    });
    
    const targetSheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (targetSheet) {
      console.log(`✅ Aba "${SHEET_NAME}" encontrada`);
      console.log(`📏 Linhas: ${targetSheet.getLastRow()}`);
      console.log(`📐 Colunas: ${targetSheet.getLastColumn()}`);
      
      if (targetSheet.getLastRow() > 0) {
        const firstRow = targetSheet.getRange(1, 1, 1, Math.min(targetSheet.getLastColumn(), 15)).getValues()[0];
        console.log('📋 Primeira linha:', firstRow);
      }
    } else {
      console.log(`❌ Aba "${SHEET_NAME}" não encontrada`);
    }
    
    return {
      success: true,
      spreadsheetName: spreadsheet.getName(),
      totalSheets: sheets.length,
      sheetNames: sheets.map(s => s.getName()),
      targetSheetExists: !!targetSheet
    };
    
  } catch (error) {
    console.error('❌ Erro ao verificar estrutura:', error.toString());
    throw error;
  }
} 