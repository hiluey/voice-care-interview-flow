import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, UserCheck, Users, Stethoscope, Edit3, Check, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import stringSimilarity from 'string-similarity';

const AssessmentComplete = () => {
  const location = useLocation();
  const { jsonFinal } = location.state || {};

  const transcriptFromLocation = jsonFinal?.transcript || '';
  const durationFromLocation = jsonFinal?.duration || 0;

  // Estado para JSON extraído do transcript
  const [mensagemServidor, setMensagemServidor] = useState(null);

  // Extrai JSON do transcript uma vez quando transcriptFromLocation mudar
  useEffect(() => {
    try {
      const match = transcriptFromLocation.match(/\[INFO\] ({[\s\S]*})/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        setMensagemServidor(parsed);
      } else {
        setMensagemServidor(null);
      }
    } catch (err) {
      console.error('❌ Erro ao extrair JSON:', err);
      setMensagemServidor(null);
    }
  }, [transcriptFromLocation]);

  // Perguntas fixas (não editáveis)
  const perguntasTexto = [
    'Contato celular',
    'E-mail',
    'Você ou seu familiar notaram piora na capacidade de locomoção ou movimentação que impacte nas atividades do dia a dia?',
    '1.1 Necessita de auxílio para realizar as atividades?',
    '1.2 Apresenta dificuldade para sustentar o tronco ou está acamado?',
    '2. Cognitiva: Você ou seu familiar perceberam que o sr(a) apresentou piora para se comunicar ou interagir com outras pessoas nos últimos meses?',
    '2.1 Necessita de auxílio para ser compreendido?',
  ];

  // Lista de doenças para perguntas sim/não (checkbox)
  const doencas = [
    {
      grupo: 'Grupo 1 - Complexas', itens: [
        'Arritimia',
        'Cirrose hepática',
        'Depressão',
        'Diabetes com complicação',
        'Diabetes sem complicação',
        'Doença cerebrovascular',
        'Doença coronariana com infarto prévio',
        'Doença coronariana sem infarto prévio',
        'Doença de Parkinson',
        'Doença do tecido conjuntivo',
        'Doença hepática em grau moderado / grave',
        'Doença renal crônica em grau moderado / grave',
        'Doença vascular periférica',
        'Doenças psiquiátricas',
        'Dor crônica com limitação física',
        'DPOC',
        'Fratura por fragilidade',
        'Gastrite/DRGE com doença ulcerosa péptica',
        'Hemiplegia / Paraplegia',
        'HIV com Síndrome da Imunodeficiência Adquirida (AIDS)',
        'HIV sem Síndrome da Imunodeficiência Adquirida (AIDS)',
        'Insuficiência cardíaca',
        'Leucemia',
        'Linfoma',
        'Neoplasia maligna / metastática',
        'Neoplasia sólida',
        'Valvopatia cardíaca',
      ]
    },
    {
      grupo: 'Grupo 2 - Não Complexas', itens: [
        'Dislipidemia',
        'Esteatose hepática',
        'Gastrite/DRGE sem doença ulcerosa péptica',
        'Hepatite viral crônica (B ou C)',
        'Hipertensão arterial sistêmica',
        'Hipotireoidismo',
        'Osteoartrose / osteoartrite',
        'Osteoporose',
        'Outros',
      ]
    },
    {
      grupo: 'Grupo 3 - Geriátrica', itens: [
        'Demência',
        'Instabilidade postural / Quedas recorrentes',
        'Alguma doença não foi mencionada?',
      ]
    },
  ];

  const navigate = useNavigate();

  // Estados principais (respostas e checkbox)
  const [respostas, setRespostas] = useState(() =>
    perguntasTexto.map((p) => ({ pergunta: p, resposta: '' }))
  );
  const [respostasCheckbox, setRespostasCheckbox] = useState([]);

  // Backup para edição
  const [backupRespostas, setBackupRespostas] = useState(respostas);
  const [backupRespostasCheckbox, setBackupRespostasCheckbox] = useState(respostasCheckbox);

  // Estado de edição
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarTranscricaoCompleta, setMostrarTranscricaoCompleta] = useState(false);

  // Quando mensagemServidor mudar, preenche respostas e checkbox
  useEffect(() => {
    if (!mensagemServidor) return;

    const respostasMap = {};

    if (mensagemServidor.dados_pessoais) {
      if (mensagemServidor.dados_pessoais.celular)
        respostasMap['Contato celular'] = mensagemServidor.dados_pessoais.celular;
      if (mensagemServidor.dados_pessoais.email)
        respostasMap['E-mail'] = mensagemServidor.dados_pessoais.email;
    }

    if (Array.isArray(mensagemServidor.declaracao_saude)) {
      for (const minhaPergunta of perguntasTexto) {
        const perguntasDaIA = mensagemServidor.declaracao_saude.map(p => p.pergunta);
        const melhorMatch = stringSimilarity.findBestMatch(minhaPergunta, perguntasDaIA);
        const melhor = melhorMatch.bestMatch;

        if (melhor.rating > 0.4) {
          const resposta = mensagemServidor.declaracao_saude.find(p => p.pergunta === melhor.target)?.resposta;
          if (resposta) {
            respostasMap[minhaPergunta] = resposta;
          }
        }
      }
    }

    setRespostas(
      perguntasTexto.map((p) => ({
        pergunta: p,
        resposta: respostasMap[p] || '',
      }))
    );

    const textoCompleto = mensagemServidor.declaracao_saude
      ? mensagemServidor.declaracao_saude.map(d => d.resposta).join(' ').toLowerCase()
      : '';

    const checkbox = doencas.flatMap(({ itens }) =>
      itens.filter((doenca) => textoCompleto.includes(doenca.toLowerCase()))
    );

    setRespostasCheckbox(checkbox);
  }, [mensagemServidor]);

  // Funções auxiliares e handlers

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} s`;
  };

  const handleChangeResposta = (idx, valor) => {
    setRespostas((r) =>
      r.map((item, i) => (i === idx ? { ...item, resposta: valor } : item))
    );
  };

  const iniciarEdicao = () => {
    setBackupRespostas(respostas.map(r => ({ ...r })));
    setBackupRespostasCheckbox(respostasCheckbox.map(d => d));
    setIsEditing(true);
  };

  const salvarEdicao = () => {
    setBackupRespostas(respostas.map(r => ({ ...r })));
    setBackupRespostasCheckbox(respostasCheckbox.map(d => d));
    setIsEditing(false);
  };

  const cancelarEdicao = () => {
    setRespostas(backupRespostas.map(r => ({ ...r })));
    setRespostasCheckbox(backupRespostasCheckbox.map(d => d));
    setIsEditing(false);
  };

  const toggleCheckbox = (doenca) => {
    if (!isEditing) return;
    if (respostasCheckbox.includes(doenca)) {
      setRespostasCheckbox((prev) => prev.filter((d) => d !== doenca));
    } else {
      setRespostasCheckbox((prev) => [...prev, doenca]);
    }
  };

  const handleApproveAssessment = () => navigate('/');
  const handleNextPatient = () => navigate('/');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">Avaliação Concluída</CardTitle>
          <p className="text-gray-600 text-xs">
            A entrevista foi finalizada com sucesso. Todas as informações foram coletadas.
          </p>
        </CardHeader>

        <div className="flex flex-col max-h-[360px] border border-gray-300 rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-300">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
              <Stethoscope className="w-5 h-5" />
              Informações Gerais e Condições de Saúde
            </h3>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={iniciarEdicao}
                  aria-label="Editar respostas"
                  title="Editar"
                  className="text-blue-600 hover:text-blue-800 transition focus:outline-none inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                  style={{ background: 'transparent', border: 'none' }}
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
              ) : (
                <>
                  <button
                    onClick={salvarEdicao}
                    aria-label="Salvar respostas"
                    title="Salvar"
                    className="text-green-600 hover:text-green-800 transition focus:outline-none inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    <Check className="w-4 h-4" />
                    Salvar
                  </button>

                  <button
                    onClick={cancelarEdicao}
                    aria-label="Cancelar edição"
                    title="Cancelar"
                    className="text-red-600 hover:text-red-800 transition focus:outline-none inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-1 overflow-y-auto bg-white">
            <div className="w-1/2 p-5 border-r border-gray-300 overflow-y-auto">
              <div className="space-y-3">
                {respostas.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-2 last:border-b-0">
                    <p className="mb-1 text-sm font-light text-gray-600">{item.pergunta}</p>
                    {isEditing ? (
                      <textarea
                        className="w-full text-sm font-normal text-gray-800 bg-gray-50 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-300 resize-none px-3 py-1 leading-snug"
                        value={item.resposta}
                        onChange={(e) => handleChangeResposta(idx, e.target.value)}
                        rows={2}
                        spellCheck={false}
                        placeholder="Digite a resposta aqui..."
                      />
                    ) : (
                      <p className="text-sm font-normal text-gray-800 whitespace-pre-wrap min-h-[40px] leading-relaxed">
                        {item.resposta || <span className="text-gray-400 italic">- sem resposta -</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/2 p-5 overflow-y-auto text-xs text-gray-700">
              {doencas.map(({ grupo, itens }, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="font-semibold mb-1">{grupo}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {itens.map((doenca, j) => {
                      const doencaKey = doenca.toLowerCase();
                      const marcada = respostasCheckbox.includes(doencaKey);

                      return (
                        <div
                          key={j}
                          onClick={() => toggleCheckbox(doencaKey)}
                          className={`cursor-pointer select-none rounded px-2 py-1 text-center
                            ${marcada ? 'bg-green-100 text-green-800 font-semibold' : 'bg-red-100 text-red-800'}
                            ${isEditing ? 'hover:bg-opacity-70' : 'cursor-default'}
                          `}
                          title={isEditing ? `Clique para alterar ${doenca}` : undefined}
                        >
                          {doenca}: <span>{marcada ? 'Sim' : 'Não'}</span>
                        </div>
                      );
                    })}
                  </div>
                  {i !== doencas.length - 1 && (
                    <hr className="mt-3 border-t border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={() => setMostrarTranscricaoCompleta(!mostrarTranscricaoCompleta)}
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-400 transition"
          >
            {mostrarTranscricaoCompleta ? (
              <>
                Esconder Transcrição Completa
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Mostrar Transcrição Completa
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {mostrarTranscricaoCompleta && (
          <div className="bg-white border border-gray-300 rounded-md p-4 mt-4 max-h-[250px] overflow-y-auto text-xs text-gray-700">
            <pre className="whitespace-pre-wrap">{transcriptFromLocation || 'Nenhuma transcrição disponível.'}</pre>
          </div>
        )}

        <CardContent className="space-y-4 mt-6">
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="font-semibold text-sm text-gray-700 mb-1">Resumo da Avaliação</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Duração:</span>
                <span>{formatDuration(durationFromLocation)}</span>
              </div>
              <div className="flex justify-between">
                <span>Formulários:</span>
                <span>7/7 preenchidos</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600 font-medium">Completo</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleApproveAssessment}
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Aprovar Avaliação
            </Button>

            <Button
              onClick={handleNextPatient}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Próximo Atendimento
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentComplete;
