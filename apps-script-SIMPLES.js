/**
 * 🚀 GOOGLE APPS SCRIPT SIMPLES - SÓ FUNCIONA!
 * Cole este código e pronto. Não precisa configurar nada.
 */

function doPost(e) {
  try {
    // Pega os dados do formulário
    let data = JSON.parse(e.postData.contents);
    
    // Abre/cria a planilha
    let planilha = SpreadsheetApp.create('PiscaForm Respostas');
    let aba = planilha.getActiveSheet();
    
    // Se não tem cabeçalho, adiciona
    if (aba.getLastRow() == 0) {
      aba.getRange(1, 1, 1, 14).setValues([['Data', 'Nome', 'WhatsApp', 'Email', 'Instagram', 'Momento', 'Vendeu Fora', 'Faturamento', 'Caixa', 'Problema', 'Área Ajuda', 'Sócio', 'Por que escolher', 'Compromisso']]);
    }
    
    // Adiciona os dados
    aba.appendRow([
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
    ]);
    
    // Resposta de sucesso
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Dados salvos!',
      url: planilha.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (erro) {
    // Se der erro, ainda responde
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: erro.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('PiscaForm funcionando!');
}

// Função de teste
function testar() {
  let dados = {
    name: 'Teste',
    phone: '+5511999999999',
    email: 'teste@teste.com',
    faturamento: 'R$ 50.000'
  };
  
  let planilha = SpreadsheetApp.create('PiscaForm Respostas TESTE');
  let aba = planilha.getActiveSheet();
  
  aba.getRange(1, 1, 1, 14).setValues([['Data', 'Nome', 'WhatsApp', 'Email', 'Instagram', 'Momento', 'Vendeu Fora', 'Faturamento', 'Caixa', 'Problema', 'Área Ajuda', 'Sócio', 'Por que escolher', 'Compromisso']]);
  
  aba.appendRow([
    new Date(),
    dados.name,
    dados.phone,
    dados.email,
    dados.instagram || '',
    dados.moment || '',
    dados.vendeuFora || '',
    dados.faturamento,
    dados.caixaDisponivel || '',
    dados.problemaPrincipal || '',
    dados.areaAjuda || '',
    dados.possuiSocio || '',
    dados.porQueEscolher || '',
    dados.compromisso || ''
  ]);
  
  console.log('Planilha criada:', planilha.getUrl());
  return planilha.getUrl();
} 