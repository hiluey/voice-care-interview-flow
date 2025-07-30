import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Video } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, Square, Check } from "lucide-react";

const SAMPLE_RATE = 16000;
const CHUNK_SIZE = 1024;

const VideoInterview = () => {
  const diseaseCategories = {
    complexDiseases: [
      "Arritimia",
      "Cirrose hepática",
      "Depressão",
      "Diabetes COM complicação",
      "Diabetes SEM complicação",
      "Doença Cerebrovascular",
      "Doença Coronariana COM infarto prévio",
      "Doença Coronariana SEM infarto prévio (ex. ANGIOPLASTIA, ANGINA)",
      "Doença de Parkinson",
      "Doença do Tecido Conjuntivo",
      "Doença Hepática em grau MODERADO / GRAVE",
      "Doença Renal Crônica em grau MODERADO / GRAVE",
      "Doença Vascular Periférica",
      "Doenças psiquiátricas (ex. Esquizofrenia, Transt. Afetivo Bipolar, Transt. de Ansiedade, etc.)",
      "Dor Crônica COM limitação física",
      "DPOC",
      "Fratura por Fragilidade (ex. Ft do Rádio Distal, Ft do Fêmur Proximal, Ft vertebral)",
      "Gastrite/DRGE COM doença ulcerosa péptica",
      "Hemiplegia / Paraplegia",
      "HIV COM Sínd. da Imunodeficiência Adquirida (AIDS)",
      "HIV SEM Sínd. da Imunodeficiência Adquirida (AIDS)",
      "Insuficiencia Cardiaca",
      "Leucemia",
      "Linfoma",
      "Neoplasia maligna / metastática",
      "Neoplasia sólida",
      "Valvopatia cardíaca",
    ],
    geriatricDiseases: [
      "Demência",
      "Instabilidade postural / Quedas recorrentes",
    ],
    nonComplexDiseases: [
      "Dislipidemia",
      "Esteatose hepática",
      "Gastrite/DRGE SEM doença ulcerosa péptica",
      "Hepatite viral crônica (B ou C)",
      "Hipertensão Arterial Sistêmica",
      "Hipotireoidismo",
      "Osteoartrose / osteoartrite",
      "Osteoporose",
      "Outros",
    ],
  };
  const perguntasTexto = [
    "Contato celular",
    "E-mail",
    "Você ou seu familiar notaram piora na capacidade de locomoção ou movimentação que impacte nas atividades do dia a dia?",
    "1.1 Necessita de auxílio para realizar as atividades?",
    "1.2 Apresenta dificuldade para sustentar o tronco ou está acamado?",
    "2. Cognitiva: Você ou seu familiar perceberam que o sr(a) apresentou piora para se comunicar ou interagir com outras pessoas nos últimos meses?",
    "2.1 Necessita de auxílio para ser compreendido?",
  ];

  const [respostas, setRespostas] = useState(
    perguntasTexto.map((p) => ({ pergunta: p, resposta: "" })),
  );

  const [respostasCheckbox, setRespostasCheckbox] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const patientName = location.state?.patientName || "";
  const nurseName = location.state?.nurseName || "";
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // para controlar o setInterval
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stoppedRef = useRef(false); // flag para evitar múltiplas paradas

  // Converter Float32Array para Int16Array (PCM 16 bits)
  const floatTo16BitPCM = (input: Float32Array) => {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return output.buffer;
  };

  const startRecording = async () => {
    try {
      setTranscript("");
      setStartTime(Date.now());
      stoppedRef.current = false;

      const socket = new WebSocket(
        "wss://entrevista-api.hml.cloud.medsenior.com.br/ws/audio",
      );
      socketRef.current = socket;

      console.log("Conectando ao WebSocket para transcrição...");
      console.log("WebSocket criado, estado inicial:", socket.readyState);
      socket.onopen = async () => {
        console.log(
          "WebSocket conectado. Solicitando permissão do microfone...",
        );
        console.log("WebSocket aberto, estado:", socket.readyState);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: SAMPLE_RATE,
            channelCount: 1,
            noiseSuppression: true,
            echoCancellation: true,
          },
        });
        streamRef.current = stream;

        const AudioCtx =
          window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioCtx({ sampleRate: SAMPLE_RATE });
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(CHUNK_SIZE, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (event) => {
          if (socket.readyState === WebSocket.OPEN) {
            const pcm = floatTo16BitPCM(event.inputBuffer.getChannelData(0));
            console.log("Enviando áudio chunk, bytes:", pcm.byteLength);
            socket.send(pcm);
          }
        };

        setDuration(0); // zera o contador ao começar
        intervalRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000);
        setRecording(true);
        console.log("Gravação iniciada. Fale agora.");
      };
      const oldOnMessage = socket.onmessage;
      socket.onmessage = (event) => {
        console.log("Mensagem do servidor:", event.data);
        const message = event.data;

        if (typeof message === "string") {
          try {
            const json = JSON.parse(message);

            if (json.respostas && json.doencas) {
              setRespostas(
                perguntasTexto.map((p) => ({
                  pergunta: p,
                  resposta: json.respostas[p] || "",
                })),
              );

              setRespostasCheckbox(
                json.doencas.map((d: string) => d.toLowerCase()),
              );

              console.log("JSON final recebido da IA:", json);

              // Encerrar WebSocket só depois de receber o JSON
              if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.close();
              }

              return;
            }
          } catch (e) {
            // Não era JSON, seguir com fluxo normal
          }

          if (message.startsWith("TRANSCRIÇÃO PARCIAL:")) {
            setTranscript(
              (prev) =>
                prev + message.replace("TRANSCRIÇÃO PARCIAL:", "").trim() + " ",
            );
          } else if (message.startsWith("FINAL:")) {
            const textoFinal = message.replace("FINAL:", "").trim();
            setTranscript((prev) => prev + "\n[FIM]: " + textoFinal);
            console.log("ℹ️ Transcrição final recebida.");
            // ⚠️ Não feche o socket aqui ainda!
          } else {
            setTranscript((prev) => prev + "\n[INFO] " + message);
          }
        }
      };

      socket.onerror = (event) => {
        console.error("Erro no WebSocket:", event);
        stopRecording();
      };

      socket.onclose = (event) => {
        console.log("WebSocket desconectado:", event);
        stopRecording();
      };
    } catch (err) {
      console.error("Erro ao iniciar gravação:", err);
      stopRecording();
    }
  };
  const stopRecording = () => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;

    console.log("Parando gravação...");

    if (processorRef.current) processorRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    if (streamRef.current)
      streamRef.current.getTracks().forEach((track) => track.stop());

    clearInterval(intervalRef.current);
    setRecording(false);

    try {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ action: "encerrar" }));
        console.log('Comando "encerrar" enviado ao WebSocket');
      }
    } catch (e) {
      console.warn(" Erro ao enviar comando encerrar:", e);
    }
  };

  const handleCompleteAssessment = () => {
    stopRecording();

    const jsonFinal = {
      transcript,
      duration,
      respostas,
      respostasCheckbox,
    };
    navigate("/assessment-complete", {
      state: { jsonFinal, patientName, nurseName },
    });
  };

  const renderCategory = (
    label: React.ReactNode,
    items: string[],
    keyId: string,
  ) => (
    <div key={keyId} className="mb-4">
      <h3 className="font-semibold text-sm text-gray-800 mb-1">{label}</h3>
      <ul className="pl-4 space-y-1">
        {items.map((disease, index) => (
          <li
            key={`${disease}-${index}`}
            className="text-sm text-gray-700 flex items-start"
          >
            <span className="text-gray-500 mr-2 mt-0.5">•</span>
            <span>{disease}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Panel - Assessment Form */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            Avaliação de Saúde
          </h2>
          <p className="text-sm text-gray-600">PEC Fast - Entrevista</p>
        </div>
        <ScrollArea className="flex-1 h-0">
          <div className="p-4 space-y-6">
            {/*Identificação*/}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Identificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Olá! Me chamo{" "}
                      <span className="font-semibold text-foreground">
                        [seu nome]
                      </span>
                      , sou enfermeiro(a) e vou auxiliá-lo(a) a preencher sua
                      Declaração de Saúde.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Dica 1:</p>
                    <p className="text-sm font-medium text-primary">
                      O sr(a) poderia me mostrar um documento com foto?
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Dica 2:</p>
                    <p className="text-sm font-medium text-primary">
                      Por gentileza, poderia me falar o nome completo e a data
                      de nascimento?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Contatos de saúde */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Contatos de saúde</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Dica 1:</p>
                  <p className="text-sm font-medium text-primary">
                    Registrar o contato telefônico principal do beneficiário.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Dica 2:</p>
                  <p className="text-sm font-medium text-primary">
                    Em caso de ausência desse contato, registrar o número da
                    pessoa que o acompanha diariamente.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Dica 3:</p>
                  <p className="text-sm font-medium text-primary">
                    Seus dados serão utilizados para fins de acompanhamento
                    assistencial da saúde na MedSênior.
                  </p>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Contato celular
                    </p>
                    <p className="text-sm font-medium text-primary">
                      (***) ****-****
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">E-mail</p>
                    <p className="text-sm font-medium text-primary">
                      email@exemplo.com
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Este registro é fundamental para assegurar o sucesso do
                    acompanhamento assistencial da saúde do beneficiário na
                    MedSênior.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mobilidade */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {/* Ícone "run" estilizado */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-3 8v6h-2v2h6v-2h-2v-7a2 2 0 0 0-2-2Z" />
                  </svg>
                  1. Mobilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm text-gray-700">
                <p className="flex items-center gap-3">
                  {/* Ícone círculo azul */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Você ou seu familiar notaram piora na capacidade de locomoção
                  ou movimentação que impacte nas atividades do dia a dia?
                </p>
                <div className="pl-4 border-l-4 border-blue-300 space-y-2">
                  <p className="flex items-center gap-3">
                    {/* Ícone seta direita */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 17l5-5-5-5v10z" />
                    </svg>
                    <span className="font-semibold text-gray-900">1.1</span>{" "}
                    Necessita de auxílio para realizar as atividades?
                  </p>
                  <p className="flex items-center gap-3">
                    {/* Ícone seta direita */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 17l5-5-5-5v10z" />
                    </svg>
                    <span className="font-semibold text-gray-900">1.2</span>{" "}
                    Apresenta dificuldade para sustentar o tronco ou está
                    acamado?
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cognitiva */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {/* Ícone "cérebro" estilizado */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 2a1 1 0 0 0-1 1v2H6a2 2 0 0 0-2 2v2h1v4H4v2h1v3a3 3 0 0 0 6 0v-1h2v1a3 3 0 0 0 6 0v-3h1v-2h-1v-4h1V7a2 2 0 0 0-2-2h-2V3a1 1 0 0 0-1-1H9Z" />
                  </svg>
                  2. Cognitiva
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm text-gray-700">
                <p className="flex items-center gap-3">
                  {/* Ícone círculo roxo */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Você ou seu familiar perceberam que o sr(a) apresentou piora
                  para se comunicar ou interagir com outras pessoas nos últimos
                  meses?
                </p>
                <div className="pl-4 border-l-4 border-purple-300 space-y-2">
                  <p className="flex items-center gap-3">
                    {/* Ícone seta direita roxa */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-purple-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 17l5-5-5-5v10z" />
                    </svg>
                    <span className="font-semibold text-gray-900">2.1</span>{" "}
                    Necessita de auxílio para ser compreendido?
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Comorbidades */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {/* Ícone de "alerta/saúde" estilizado em vermelho */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14h-2v-2h2Zm0-4h-2V7h2Z" />
                  </svg>
                  3. Comorbidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 flex items-center gap-2 text-gray-700">
                  {/* Ícone círculo vermelho preenchido */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Quais doenças o sr(a) sabe que tem, confirmada por um médico?
                </p>

                <div className="space-y-4">
                  {renderCategory(
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Grupo 1 - Complexas
                    </span>,
                    diseaseCategories.complexDiseases,
                    "complexas",
                  )}
                  {renderCategory(
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      Grupo 2 - Não Complexas
                    </span>,
                    diseaseCategories.nonComplexDiseases,
                    "nao-complexas",
                  )}
                  {renderCategory(
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Grupo 3 - Geriátrica
                    </span>,
                    diseaseCategories.geriatricDiseases,
                    "geriatrica",
                  )}
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    {/* Ícone círculo pequeno azul */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <Label className="text-sm font-semibold text-gray-800 cursor-default">
                      Alguma doença não foi mencionada?
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                    />
                  </svg>
                  Finalização
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-sm text-gray-700">
                <section className="pl-6">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 cursor-default">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-indigo-600 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h3l2-2h2l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z"
                      />
                    </svg>
                    Observações
                  </Label>
                </section>

                <section className="pl-6">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 cursor-default">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-indigo-600 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z"
                      />
                    </svg>
                    Informações Adicionais
                  </Label>
                </section>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <div className="w-full flex justify-center px-6 pb-6 pt-4">
          <div className="max-w-xs w-full">
            <Button
              onClick={recording ? stopRecording : startRecording}
              variant="ghost"
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-sm transition-all duration-200 border border-black/10
        ${
          recording
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-green-100 text-green-600 hover:bg-green-200"
        }
      `}
            >
              {recording ? <Square size={18} /> : <Mic size={18} />}
              {recording ? "Parar Gravação" : "Gravar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Video */}
      <div className="flex-1 flex flex-col h-full">
        {/* Video Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              Entrevista em Andamento
            </h1>
            <p className="text-sm text-gray-600">Beneficiário conectado</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <span className="font-medium text-gray-700">Tempo:</span>
              <span className="font-mono">{formatDuration(duration)}</span>
            </div>

            <Button
              onClick={handleCompleteAssessment}
              variant="ghost"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
            >
              <Check size={16} />
              Concluir
            </Button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-white text-lg">Beneficiário</p>
              <p className="text-gray-400 text-sm">Vídeo ativo</p>
            </div>
          </div>

          {/* Local video - small corner */}
          <div className="absolute bottom-4 right-4 w-48 h-32 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Video className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-white text-xs">Você</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterview;
