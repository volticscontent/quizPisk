function doPost(e) {
  try {
    // Pega os dados
    let data = JSON.parse(e.postData.contents);
    
    // Cria planilha nova sempre
    let planilha = SpreadsheetApp.create('PiscaForm-' + new Date().getTime());
    let aba = planilha.getActiveSheet();
    
    // Cabeçalhos
    aba.getRange('A1:N1').setValues([['Data', 'Nome', 'WhatsApp', 'Email', 'Instagram', 'Momento', 'Vendeu Fora', 'Faturamento', 'Caixa', 'Problema', 'Área Ajuda', 'Sócio', 'Por que escolher', 'Compromisso']]);
    
    // Dados
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
    
    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
    
  } catch (erro) {
    return ContentService.createTextOutput('ERRO').setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet() {
  return ContentService.createTextOutput('Funcionando');
}

function teste() {
  let planilha = SpreadsheetApp.create('TESTE-PiscaForm');
  let aba = planilha.getActiveSheet();
  aba.getRange('A1:N1').setValues([['Data', 'Nome', 'WhatsApp', 'Email', 'Instagram', 'Momento', 'Vendeu Fora', 'Faturamento', 'Caixa', 'Problema', 'Área Ajuda', 'Sócio', 'Por que escolher', 'Compromisso']]);
  aba.appendRow([new Date(), 'Teste', '11999999999', 'teste@teste.com', 'teste', 'A', 'A', 'R$ 50.000', 'B', 'A', 'E', 'B', 'Teste de funcionamento', 'A']);
  console.log(planilha.getUrl());
} 