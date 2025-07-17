import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

const VideoInterview = () => {
  const navigate = useNavigate();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [formData, setFormData] = useState({
    observations: '',
    additionalInfo: ''
  });

  const diseaseCategories = {
    complexDiseases: [
      'Doença de Alzheimer', 'Demência', 'Parkinson', 'Esclerose Múltipla',
      'AVC com sequelas', 'Trauma craniano', 'Lesão medular'
    ],
    vascularDiseases: [
      'Hipertensão arterial', 'Varizes', 'Trombose venosa profunda',
      'Aneurisma', 'Arterioesclerose'
    ],
    heartDiseases: [
      'Infarto do miocárdio', 'Insuficiência cardíaca', 'Arritmias',
      'Valvulopatias', 'Marca-passo'
    ],
    endocrineDiseases: [
      'Diabetes mellitus', 'Hipotireoidismo', 'Hipertireoidismo',
      'Osteoporose', 'Obesidade mórbida'
    ],
    gastrointestinalDiseases: [
      'Gastrite', 'Úlcera péptica', 'Refluxo gastroesofágico',
      'Doença de Crohn', 'Retocolite ulcerativa'
    ],
    herniaDiseases: [
      'Hérnia inguinal', 'Hérnia umbilical', 'Hérnia incisional',
      'Hérnia de disco'
    ],
    intestinalDiseases: [
      'Síndrome do intestino irritável', 'Constipação crônica',
      'Doença diverticular', 'Pólipos intestinais'
    ],
    renalDiseases: [
      'Insuficiência renal crônica', 'Cálculos renais', 'Pielonefrite',
      'Glomerulonefrite'
    ],
    neurologicalDiseases: [
      'Epilepsia', 'Enxaqueca', 'Depressão', 'Ansiedade',
      'Transtorno bipolar', 'Esquizofrenia'
    ],
    orthopedicDiseases: [
      'Artrite', 'Artrose', 'Fibromialgia', 'Osteoporose',
      'Bursite', 'Tendinite'
    ],
    gynecologicalDiseases: [
      'Endometriose', 'Mioma uterino', 'Cistos ovarianos',
      'Câncer de mama', 'Câncer de colo uterino'
    ],
    bloodDiseases: [
      'Anemia', 'Leucemia', 'Hemofilia', 'Trombocitopenia'
    ],
    cancerDiseases: [
      'Câncer de pulmão', 'Câncer de próstata', 'Câncer de cólon',
      'Câncer de pele', 'Linfoma'
    ],
    ophthalmologicalDiseases: [
      'Glaucoma', 'Catarata', 'Degeneração macular', 'Retinopatia diabética'
    ],
    infectiousDiseases: [
      'Hepatite B', 'Hepatite C', 'HIV/AIDS', 'Tuberculose'
    ],
    dialysisDiseases: [
      'Hemodiálise', 'Diálise peritoneal', 'Transplante renal'
    ]
  };

  const handleCompleteAssessment = () => {
    navigate('/assessment-complete');
  };

  const renderDiseaseCategory = (categoryTitle: string, diseases: string[]) => (
    <div className="mb-6">
      <h4 className="font-semibold text-sm mb-3 text-gray-700">{categoryTitle}</h4>
      <div className="space-y-1">
        {diseases.map((disease) => (
          <div key={disease} className="text-sm text-gray-600">
            {disease}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Panel - Assessment Form */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Avaliação de Saúde</h2>
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
                      Olá! Me chamo <span className="font-semibold text-foreground">[seu nome]</span>, sou enfermeiro(a) e vou auxiliá-lo(a) a preencher sua Declaração de Saúde.
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
                      Por gentileza, poderia me falar o nome completo e a data de nascimento?
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
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Contato celular</p>
                    <p className="text-sm font-medium text-primary">(***) ****-****</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">E-mail</p>
                    <p className="text-sm font-medium text-primary">email@exemplo.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobilidade */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {/* Ícone "run" estilizado */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M13 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-3 8v6h-2v2h6v-2h-2v-7a2 2 0 0 0-2-2Z" />
                  </svg>
                  1. Mobilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm text-gray-700">
                <p className="flex items-center gap-3">
                  {/* Ícone círculo azul */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Você ou seu familiar notaram piora na capacidade de locomoção ou movimentação que impacte nas atividades do dia a dia?
                </p>
                <div className="pl-4 border-l-4 border-blue-300 space-y-2">
                  <p className="flex items-center gap-3">
                    {/* Ícone seta direita */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 17l5-5-5-5v10z" />
                    </svg>
                    <span className="font-semibold text-gray-900">1.1</span> Necessita de auxílio para realizar as atividades?
                  </p>
                  <p className="flex items-center gap-3">
                    {/* Ícone seta direita */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 17l5-5-5-5v10z" />
                    </svg>
                    <span className="font-semibold text-gray-900">1.2</span> Apresenta dificuldade para sustentar o tronco ou está acamado?
                  </p>
                </div>
              </CardContent>
            </Card>



            {/* Cognitiva */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {/* Ícone "cérebro" estilizado */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 2a1 1 0 0 0-1 1v2H6a2 2 0 0 0-2 2v2h1v4H4v2h1v3a3 3 0 0 0 6 0v-1h2v1a3 3 0 0 0 6 0v-3h1v-2h-1v-4h1V7a2 2 0 0 0-2-2h-2V3a1 1 0 0 0-1-1H9Z" />
                  </svg>
                  2. Cognitiva
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm text-gray-700">
                <p className="flex items-center gap-3">
                  {/* Ícone círculo roxo */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Você ou seu familiar perceberam que o sr(a) apresentou piora para se comunicar ou interagir com outras pessoas nos últimos meses?
                </p>
                <div className="pl-4 border-l-4 border-purple-300 space-y-2">
                  <p className="flex items-center gap-3">
                    {/* Ícone seta direita roxa */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 17l5-5-5-5v10z" />
                    </svg>
                    <span className="font-semibold text-gray-900">2.1</span> Necessita de auxílio para ser compreendido?
                  </p>
                </div>
              </CardContent>
            </Card>


            {/* Comorbidades */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {/* Ícone de "alerta/saúde" estilizado em vermelho */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 14h-2v-2h2Zm0-4h-2V7h2Z" />
                  </svg>
                  3. Comorbidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 flex items-center gap-2 text-gray-700">
                  {/* Ícone círculo vermelho preenchido */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Quais doenças o sr(a) sabe que tem, confirmada por um médico?
                </p>

                {renderDiseaseCategory('Grupo 1 - Complexas', diseaseCategories.complexDiseases)}
                {renderDiseaseCategory('Doenças de Veias e Artérias', diseaseCategories.vascularDiseases)}
                {renderDiseaseCategory('Doenças do Coração', diseaseCategories.heartDiseases)}
                {renderDiseaseCategory('Glândulas (Tireoide)', diseaseCategories.endocrineDiseases)}
                {renderDiseaseCategory('Trato Gastrointestinal', diseaseCategories.gastrointestinalDiseases)}
                {renderDiseaseCategory('Hérnia', diseaseCategories.herniaDiseases)}
                {renderDiseaseCategory('Intestino', diseaseCategories.intestinalDiseases)}
                {renderDiseaseCategory('Renal ou Urinário', diseaseCategories.renalDiseases)}
                {renderDiseaseCategory('Neurológica ou Psiquiátrica', diseaseCategories.neurologicalDiseases)}
                {renderDiseaseCategory('Ortopédica ou Reumatológica', diseaseCategories.orthopedicDiseases)}
                {renderDiseaseCategory('Ginecológica ou Mamária', diseaseCategories.gynecologicalDiseases)}
                {renderDiseaseCategory('Doenças do Sangue', diseaseCategories.bloodDiseases)}
                {renderDiseaseCategory('Câncer', diseaseCategories.cancerDiseases)}
                {renderDiseaseCategory('Doenças Oftalmológicas', diseaseCategories.ophthalmologicalDiseases)}
                {renderDiseaseCategory('Hepatite e AIDS', diseaseCategories.infectiousDiseases)}
                {renderDiseaseCategory('Insuficiência Renal ou Diálise', diseaseCategories.dialysisDiseases)}

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    {/* Ícone círculo pequeno azul */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <Label className="text-sm font-semibold text-gray-800 cursor-default">
                      Tem obesidade?
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Ícone círculo pequeno azul */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <Label className="text-sm font-semibold text-gray-800 cursor-default">
                      Tem órtese ou prótese?
                    </Label>
                  </div>

                                    <div className="flex items-center gap-2">
                    {/* Ícone círculo pequeno azul */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h3l2-2h2l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z" />
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z" />
                    </svg>
                    Informações Adicionais
                  </Label>
                </section>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <Button
            onClick={handleCompleteAssessment}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Concluir Formulário
          </Button>
        </div>
      </div>

      {/* Right Panel - Video */}
      <div className="flex-1 flex flex-col h-full">
        {/* Video Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Entrevista em Andamento</h1>
            <p className="text-sm text-gray-600">Beneficiário conectado</p>
          </div>
          <div className="text-sm text-gray-500">
            Gravação ativa ⏺️
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

          {/* Video controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <Button
              variant={audioEnabled ? "default" : "destructive"}
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="rounded-full w-12 h-12"
            >
              {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            <Button
              variant={videoEnabled ? "default" : "destructive"}
              size="sm"
              onClick={() => setVideoEnabled(!videoEnabled)}
              className="rounded-full w-12 h-12"
            >
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => navigate('/')}
              className="rounded-full w-12 h-12"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterview;
