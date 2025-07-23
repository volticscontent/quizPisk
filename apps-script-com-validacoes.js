/**
 * GOOGLE APPS SCRIPT - PISCAFORM COM VALIDAÇÕES
 * Versão com validações básicas de formato
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
    
    // Valida os dados básicos
    const validacao = validarDados(dados);
    if (!validacao.valido) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Dados inválidos',
          erros: validacao.erros
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Limpa e formata os dados
    const dadosLimpos = limparDados(dados);
    
    // Abre a planilha
    const planilha = SpreadsheetApp.openById(PLANILHA_ID);
    let aba = planilha.getSheetByName(ABA_NOME);
    
    // Se a aba não existe, cria ela
    if (!aba) {
      aba = planilha.insertSheet(ABA_NOME);
      // Adiciona cabeçalhos
      aba.getRange(1, 1, 1, 15).setValues([[
        'Nome', 'Email', 'WhatsApp', 'Instagram', 'Momento', 'Vendeu Fora', 
        'Faturamento', 'Caixa', 'Problema', 'Área Ajuda', 'Sócio', 
        'Por que escolher', 'Compromisso', 'Data/Hora', 'Status'
      ]]);
      
      // Formata cabeçalhos
      const headerRange = aba.getRange(1, 1, 1, 15);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
    }
    
    // Prepara os dados para inserir
    const linha = [
      dadosLimpos.nome,
      dadosLimpos.email,
      dadosLimpos.telefone,
      dadosLimpos.instagram,
      dadosLimpos.moment || '',
      dadosLimpos.vendeuFora || '',
      dadosLimpos.faturamento || '',
      dadosLimpos.caixaDisponivel || '',
      dadosLimpos.problemaPrincipal || '',
      dadosLimpos.areaAjuda || '',
      dadosLimpos.possuiSocio || '',
      dadosLimpos.porQueEscolher || '',
      dadosLimpos.compromisso || '',
      new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      'VALIDADO'
    ];
    
    // Adiciona a linha na próxima posição vazia
    const proximaLinha = aba.getLastRow() + 1;
    aba.getRange(proximaLinha, 1, 1, linha.length).setValues([linha]);
    
    // Log para debug
    console.log('✅ Dados salvos na linha:', proximaLinha);
    console.log('📋 Dados salvos:', dadosLimpos);
    
    // Retorna sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Dados salvos com sucesso!',
        linha: proximaLinha,
        dados: dadosLimpos
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ Erro geral:', error.toString());
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
 * Valida os dados básicos do formulário
 */
function validarDados(dados) {
  const erros = [];
  
  // Validar nome
  if (!dados.name || dados.name.trim().length < 2) {
    erros.push('Nome deve ter pelo menos 2 caracteres');
  }
  if (dados.name && dados.name.trim().length > 100) {
    erros.push('Nome muito longo (máximo 100 caracteres)');
  }
  
  // Validar email
  if (!dados.email) {
    erros.push('Email é obrigatório');
  } else if (!validarEmail(dados.email)) {
    erros.push('Email inválido (deve conter @ e domínio válido)');
  }
  
  // Validar telefone
  if (!dados.phone) {
    erros.push('Telefone é obrigatório');
  } else if (!validarTelefone(dados.phone)) {
    erros.push('Telefone inválido (deve ter entre 10-15 dígitos com código do país)');
  }
  
  // Validar Instagram
  if (!dados.instagram) {
    erros.push('Instagram é obrigatório');
  } else if (!validarInstagram(dados.instagram)) {
    erros.push('Instagram inválido (deve ter entre 3-30 caracteres, apenas letras, números e _)');
  }
  
  // Validar se pelo menos uma resposta do quiz foi preenchida
  const respostasQuiz = [
    dados.moment, dados.vendeuFora, dados.faturamento, dados.caixaDisponivel,
    dados.problemaPrincipal, dados.areaAjuda, dados.possuiSocio, dados.compromisso
  ];
  
  if (!respostasQuiz.some(resp => resp && resp.trim() !== '')) {
    erros.push('Pelo menos uma resposta do quiz deve ser preenchida');
  }
  
  return {
    valido: erros.length === 0,
    erros: erros
  };
}

/**
 * Valida formato de email
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valida formato de telefone
 */
function validarTelefone(telefone) {
  // Remove espaços, parênteses, hífen, +
  const numeroLimpo = telefone.replace(/[\s\(\)\-\+]/g, '');
  
  // Verifica se tem apenas números e tem entre 10-15 dígitos
  const regex = /^\d{10,15}$/;
  return regex.test(numeroLimpo);
}

/**
 * Valida formato de Instagram
 */
function validarInstagram(instagram) {
  // Remove @ se houver
  const instaLimpo = instagram.replace('@', '').trim();
  
  // Verifica se tem entre 3-30 caracteres e apenas letras, números, underscore e ponto
  const regex = /^[a-zA-Z0-9_.]{3,30}$/;
  return regex.test(instaLimpo);
}

/**
 * Limpa e formata os dados
 */
function limparDados(dados) {
  return {
    nome: dados.name.trim(),
    email: dados.email.toLowerCase().trim(),
    telefone: formatarTelefone(dados.phone),
    instagram: formatarInstagram(dados.instagram),
    moment: dados.moment || '',
    vendeuFora: dados.vendeuFora || '',
    faturamento: limparTexto(dados.faturamento),
    caixaDisponivel: dados.caixaDisponivel || '',
    problemaPrincipal: dados.problemaPrincipal || '',
    areaAjuda: dados.areaAjuda || '',
    possuiSocio: dados.possuiSocio || '',
    porQueEscolher: limparTexto(dados.porQueEscolher),
    compromisso: dados.compromisso || ''
  };
}

/**
 * Formata telefone para padrão brasileiro
 */
function formatarTelefone(telefone) {
  const numeroLimpo = telefone.replace(/[\s\(\)\-]/g, '');
  
  // Se não tem +, adiciona +55 para Brasil
  if (!numeroLimpo.startsWith('+')) {
    if (numeroLimpo.length === 11) {
      return '+55' + numeroLimpo;
    }
    return '+' + numeroLimpo;
  }
  
  return numeroLimpo;
}

/**
 * Formata Instagram (remove @ se houver)
 */
function formatarInstagram(instagram) {
  return instagram.replace('@', '').trim();
}

/**
 * Limpa texto removendo espaços extras
 */
function limparTexto(texto) {
  if (!texto) return '';
  return texto.trim().replace(/\s+/g, ' ');
}

/**
 * Para testes (GET)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'PiscaForm com validações funcionando!',
      planilha: PLANILHA_ID,
      aba: ABA_NOME,
      versao: 'Com Validações v1.0',
      validacoes: [
        'Email: formato válido com @ e domínio',
        'Telefone: 10-15 dígitos, auto-formatação +55',
        'Instagram: 3-30 caracteres, sem símbolos especiais',
        'Nome: 2-100 caracteres',
        'Quiz: pelo menos uma resposta obrigatória'
      ]
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Função para testar validações
 */
function testarValidacoes() {
  console.log('🧪 Testando validações...');
  
  // Teste com dados válidos
  const dadosValidos = {
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '+5511999887766',
    instagram: 'joao_silva',
    moment: 'A',
    vendeuFora: 'B',
    faturamento: 'R$ 50.000',
    compromisso: 'A'
  };
  
  const validacaoValida = validarDados(dadosValidos);
  console.log('✅ Dados válidos:', validacaoValida);
  
  // Teste com dados inválidos
  const dadosInvalidos = {
    name: 'J',
    email: 'email-inválido',
    phone: '123',
    instagram: 'a'
  };
  
  const validacaoInvalida = validarDados(dadosInvalidos);
  console.log('❌ Dados inválidos:', validacaoInvalida);
  
  return 'Testes concluídos - veja o console';
}

/**
 * Função para testar se tem acesso à planilha
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
    
    // Teste de escrita com dados válidos
    const linha = aba.getLastRow() + 1;
    const dadosTeste = [
      'TESTE VALIDAÇÕES',
      'teste@validacao.com',
      '+5511999999999',
      'teste_validacao',
      'A', 'A', 'R$ 25.000', 'A', 'A', 'A', 'A',
      'Teste das validações implementadas',
      'A',
      new Date().toLocaleString('pt-BR'),
      'TESTE'
    ];
    
    aba.getRange(linha, 1, 1, dadosTeste.length).setValues([dadosTeste]);
    console.log('✅ Teste de escrita na linha:', linha);
    
    return 'Tudo funcionando com validações!';
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
} 