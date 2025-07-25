import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle2,
  UserCheck,
  Stethoscope,
  Edit3,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import stringSimilarity from 'string-similarity';

const AssessmentComplete = () => {
  const location = useLocation();
  const { jsonFinal } = location.state || {};

  const transcriptFromLocation =
    typeof jsonFinal?.transcript === 'string' ? jsonFinal.transcript : '';
  const durationFromLocation = jsonFinal?.duration || 0;

  const [mensagemServidor, setMensagemServidor] = useState(null);

  const perguntasTexto = [
    'Contato celular',
    'E-mail',
    'Mobilidade: Você ou seu familiar notaram piora na capacidade de locomoção ou movimentação que impacte nas atividades do dia a dia?',
    'Necessita de auxílio para realizar as atividades?',
    'Apresenta dificuldade para sustentar o tronco ou está acamado?',
    'Cognitiva: Você ou seu familiar perceberam que o sr(a) apresentou piora para se comunicar ou interagir com outras pessoas nos últimos meses?',
    'Necessita de auxílio para ser compreendido?',
    'Quais doenças o senhor sabe que tem, confirmado por um médico?',
  ];

  const doencas = [
    {
      grupo: 'Grupo 1 - Complexas',
      itens: [
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
      ],
    },
    {
      grupo: 'Grupo 2 - Não Complexas',
      itens: [
        'Dislipidemia',
        'Esteatose hepática',
        'Gastrite/DRGE sem doença ulcerosa péptica',
        'Hepatite viral crônica (B ou C)',
        'Hipertensão arterial sistêmica',
        'Hipotireoidismo',
        'Osteoartrose / osteoartrite',
        'Osteoporose',
        'Outros',
      ],
    },
    {
      grupo: 'Grupo 3 - Geriátrica',
      itens: [
        'Demência',
        'Instabilidade postural / Quedas recorrentes',
        'Alguma doença não foi mencionada?',
      ],
    },
  ];

  const navigate = useNavigate();

  const [respostas, setRespostas] = useState(() =>
    perguntasTexto.map((p) => ({ pergunta: p, resposta: '' }))
  );

  const [respostasCheckbox, setRespostasCheckbox] = useState([]);
  const [backupRespostas, setBackupRespostas] = useState(respostas);
  const [backupRespostasCheckbox, setBackupRespostasCheckbox] = useState(
    respostasCheckbox
  );
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarTranscricaoCompleta, setMostrarTranscricaoCompleta] =
    useState(false);

  useEffect(() => {
    try {
      if (typeof transcriptFromLocation !== 'string') {
        setMensagemServidor(null);
        return;
      }

      const match = transcriptFromLocation.match(/\[INFO\] ({[\s\S]*})/);

      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);

        if (Array.isArray(parsed.declaracao_saude)) {
          parsed.declaracao_saude = parsed.declaracao_saude.filter(
            (item) =>
              typeof item === 'object' &&
              item !== null &&
              typeof item.pergunta === 'string'
          );
        }

        setMensagemServidor(parsed);
      } else {
        setMensagemServidor(null);
      }
    } catch (err) {
      console.error('❌ Erro ao extrair JSON:', err);
      setMensagemServidor(null);
    }
  }, [transcriptFromLocation]);

  useEffect(() => {
    if (!mensagemServidor) return;

    const respostasMap = {};

    if (mensagemServidor.dados_pessoais) {
      if (mensagemServidor.dados_pessoais.celular) {
        respostasMap['Contato celular'] = mensagemServidor.dados_pessoais.celular;
      }
      if (mensagemServidor.dados_pessoais.email) {
        respostasMap['E-mail'] = mensagemServidor.dados_pessoais.email;
      }
    }

    if (Array.isArray(mensagemServidor.declaracao_saude)) {
      const perguntasDaIA = mensagemServidor.declaracao_saude
        .map((p) => p.pergunta)
        .filter((p) => typeof p === 'string');

      for (const minhaPergunta of perguntasTexto) {
        const melhorMatch = stringSimilarity.findBestMatch(
          minhaPergunta,
          perguntasDaIA
        );
        const melhor = melhorMatch.bestMatch;

        if (melhor.rating > 0.4) {
          const entradaIA = mensagemServidor.declaracao_saude.find(
            (p) => p.pergunta === melhor.target
          );
          const resposta = entradaIA?.resposta;

          if (typeof resposta === 'string') {
            respostasMap[minhaPergunta] = resposta;
          } else if (Array.isArray(entradaIA?.subperguntas)) {
            const respostasSub = entradaIA.subperguntas
              .filter((sub) => sub.resposta && sub.resposta.toLowerCase() === 'sim')
              .map((sub) => sub.pergunta)
              .join(', ');

            respostasMap[minhaPergunta] = respostasSub || 'Negativo para alternativas';
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

    const respostasDoencas = new Set();

    if (Array.isArray(mensagemServidor.declaracao_saude)) {
      for (const item of mensagemServidor.declaracao_saude) {
        if (Array.isArray(item.subperguntas)) {
          for (const sub of item.subperguntas) {
            if (sub.resposta && sub.resposta.toLowerCase() === 'sim') {
              respostasDoencas.add(sub.pergunta.toLowerCase());
            }
          }
        }
      }
    }

    const checkbox = doencas.flatMap(({ itens }) =>
      itens.filter((doenca) => respostasDoencas.has(doenca.toLowerCase()))
    );

    setRespostasCheckbox(checkbox);
  }, [mensagemServidor]);

  const handleChangeResposta = (idx, valor) => {
    setRespostas((r) =>
      r.map((item, i) => (i === idx ? { ...item, resposta: valor } : item))
    );
  };

  const iniciarEdicao = () => {
    setBackupRespostas(respostas.map((r) => ({ ...r })));
    setBackupRespostasCheckbox(respostasCheckbox.map((d) => d));
    setIsEditing(true);
  };

  const salvarEdicao = () => {
    setBackupRespostas(respostas.map((r) => ({ ...r })));
    setBackupRespostasCheckbox(respostasCheckbox.map((d) => d));
    setIsEditing(false);
  };

  const cancelarEdicao = () => {
    setRespostas(backupRespostas.map((r) => ({ ...r })));
    setRespostasCheckbox(backupRespostasCheckbox.map((d) => d));
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

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-5xl shadow-lg rounded-xl border border-gray-200 bg-white">
        <CardHeader className="text-center pb-6 border-b border-gray-300">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8 text-green-700" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
            Avaliação Concluída
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Transcrição processada em{' '}
            <span className="font-semibold text-green-600">
              {formatDuration(durationFromLocation)}
            </span>
          </p>
        </CardHeader>

        <CardContent className="px-10 py-8 space-y-10">
          <section>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-3">
                <UserCheck size={20} /> Dados e Respostas
              </h3>
              {isEditing ? (
                <div className="flex space-x-3">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2 px-4"
                    onClick={salvarEdicao}
                  >
                    <Check className="w-5 h-5" /> Salvar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2 px-4"
                    onClick={cancelarEdicao}
                  >
                    <X className="w-5 h-5" /> Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 px-4"
                  onClick={iniciarEdicao}
                >
                  <Edit3 className="w-5 h-5" /> Editar
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {respostas.map(({ pergunta, resposta }, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:items-center"
                >
                  <label className="w-full md:w-1/2 text-sm font-medium text-gray-700">
                    {pergunta}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="mt-2 md:mt-0 md:ml-6 w-full md:w-1/2 rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition"
                      value={resposta}
                      onChange={(e) => handleChangeResposta(i, e.target.value)}
                      placeholder="Digite a resposta"
                    />
                  ) : (
                    <div
                      className="mt-2 md:mt-0 md:ml-6 w-full md:w-1/2 bg-green-50 border border-green-200 rounded-md px-4 py-2 text-gray-900 text-sm whitespace-pre-wrap min-h-[36px] shadow-sm"
                      aria-label={`Resposta para ${pergunta}`}
                    >
                      {resposta || (
                        <span className="text-gray-400 italic">Sem resposta</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-3">
              <Stethoscope size={20} /> Doenças Confirmadas
            </h3>

            <div
              className="max-h-72 overflow-y-auto border border-gray-300 rounded-lg bg-white p-4 shadow-inner"
              aria-label="Lista de doenças confirmadas com scroll"
            >
              {doencas.map(({ grupo, itens }) => (
                <div key={grupo} className="mb-6 last:mb-0">
                  <h4 className="font-semibold text-md mb-3 text-gray-700 border-b border-gray-200 pb-1">
                    {grupo}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {itens.map((doenca) => {
                      const checked = respostasCheckbox.includes(doenca);
                      return (
                        <label
                          key={doenca}
                          className={`flex items-center space-x-2 cursor-pointer rounded border px-3 py-1.5 text-xs select-none transition-colors duration-200 ${
                            checked
                              ? 'border-green-600 bg-green-50 text-green-900 font-semibold shadow'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-green-50 hover:border-green-400'
                          }`}
                          onClick={() => toggleCheckbox(doenca)}
                          tabIndex={isEditing ? 0 : -1}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            className="cursor-pointer"
                            tabIndex={-1}
                          />
                          <span>{doenca}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-3">
              <Stethoscope size={20} /> Transcrição Completa
              <button
                onClick={() => setMostrarTranscricaoCompleta((v) => !v)}
                aria-label="Mostrar/Ocultar transcrição completa"
                className="ml-3 text-gray-400 hover:text-gray-700 transition-colors"
              >
                {mostrarTranscricaoCompleta ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </h3>
            {mostrarTranscricaoCompleta && (
              <pre
                className="max-h-48 overflow-auto rounded-md border border-gray-300 p-4 text-xs bg-gray-50 text-gray-800 whitespace-pre-wrap leading-relaxed font-mono shadow-inner"
                aria-live="polite"
              >
                {transcriptFromLocation || 'Sem transcrição disponível'}
              </pre>
            )}
          </section>

          <div className="flex justify-end space-x-4 mt-8">
            <Button
              variant="outline"
              size="default"
              className="px-6 py-2 font-semibold"
              onClick={handleApproveAssessment}
            >
              Aprovar Avaliação
            </Button>
            <Button
              variant="default"
              size="default"
              className="px-6 py-2 font-semibold"
              onClick={handleNextPatient}
            >
              Próximo Paciente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentComplete;
