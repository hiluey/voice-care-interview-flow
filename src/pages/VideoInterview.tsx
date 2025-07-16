
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoInterview = () => {
  const navigate = useNavigate();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [formData, setFormData] = useState({
    mobilityAssistance: '',
    communicationAssistance: '',
    complexDiseases: [] as string[],
    vascularDiseases: [] as string[],
    heartDiseases: [] as string[],
    endocrineDiseases: [] as string[],
    gastrointestinalDiseases: [] as string[],
    herniaDiseases: [] as string[],
    intestinalDiseases: [] as string[],
    renalDiseases: [] as string[],
    neurologicalDiseases: [] as string[],
    orthopedicDiseases: [] as string[],
    gynecologicalDiseases: [] as string[],
    bloodDiseases: [] as string[],
    cancerDiseases: [] as string[],
    ophthalmologicalDiseases: [] as string[],
    infectiousDiseases: [] as string[],
    dialysisDiseases: [] as string[],
    hasObesity: '',
    hasProsthetics: '',
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

  const handleDiseaseChange = (category: string, disease: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category as keyof typeof prev] as string[], disease]
        : (prev[category as keyof typeof prev] as string[]).filter(d => d !== disease)
    }));
  };

  const handleCompleteAssessment = () => {
    navigate('/assessment-complete');
  };

  const renderDiseaseCategory = (categoryKey: string, categoryTitle: string, diseases: string[]) => (
    <div className="mb-6">
      <h4 className="font-semibold text-sm mb-3 text-gray-700">{categoryTitle}</h4>
      <div className="space-y-2">
        {diseases.map((disease) => (
          <div key={disease} className="flex items-center space-x-2">
            <Checkbox
              id={`${categoryKey}-${disease}`}
              checked={(formData[categoryKey as keyof typeof formData] as string[]).includes(disease)}
              onCheckedChange={(checked) => 
                handleDiseaseChange(categoryKey, disease, checked as boolean)
              }
            />
            <Label htmlFor={`${categoryKey}-${disease}`} className="text-sm">
              {disease}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Assessment Form */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Avaliação de Saúde</h2>
          <p className="text-sm text-gray-600">PEC Fast - Entrevista</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Mobilidade */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">1. Mobilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm mb-2">Você ou seu familiar perceberam que o sr(a) apresentou piora para locomover-se ou movimentar-se a ponto de impactar nas atividades cotidianas?</p>
                <RadioGroup 
                  value={formData.mobilityAssistance} 
                  onValueChange={(value) => setFormData(prev => ({...prev, mobilityAssistance: value}))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="mobility-sim" />
                    <Label htmlFor="mobility-sim" className="text-sm">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="mobility-nao" />
                    <Label htmlFor="mobility-nao" className="text-sm">Não</Label>
                  </div>
                </RadioGroup>
                
                <p className="text-sm mt-3 mb-2">1.1 Necessita de auxílio para as atividades?</p>
                <p className="text-sm mb-2">1.2 Apresenta dificuldade para sustentação do tronco ou está acamado?</p>
              </div>
            </CardContent>
          </Card>

          {/* Cognitiva */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">2. Cognitiva</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm mb-2">Você ou seu familiar perceberam que o sr(a) apresentou piora para se comunicar ou interagir com outras pessoas nos últimos meses?</p>
                <RadioGroup 
                  value={formData.communicationAssistance} 
                  onValueChange={(value) => setFormData(prev => ({...prev, communicationAssistance: value}))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="comm-sim" />
                    <Label htmlFor="comm-sim" className="text-sm">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="comm-nao" />
                    <Label htmlFor="comm-nao" className="text-sm">Não</Label>
                  </div>
                </RadioGroup>
                
                <p className="text-sm mt-3">2.1 Necessita de auxílio para ser compreendido?</p>
              </div>
            </CardContent>
          </Card>

          {/* Comorbidades */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">3. Comorbidades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Quais doenças o sr(a) sabe que tem, confirmada por um médico?</p>
              
              {renderDiseaseCategory('complexDiseases', 'Grupo 1 - Complexas', diseaseCategories.complexDiseases)}
              {renderDiseaseCategory('vascularDiseases', 'Doenças de Veias e Artérias', diseaseCategories.vascularDiseases)}
              {renderDiseaseCategory('heartDiseases', 'Doenças do Coração', diseaseCategories.heartDiseases)}
              {renderDiseaseCategory('endocrineDiseases', 'Glândulas (Tireoide)', diseaseCategories.endocrineDiseases)}
              {renderDiseaseCategory('gastrointestinalDiseases', 'Trato Gastrointestinal', diseaseCategories.gastrointestinalDiseases)}
              {renderDiseaseCategory('herniaDiseases', 'Hérnia', diseaseCategories.herniaDiseases)}
              {renderDiseaseCategory('intestinalDiseases', 'Intestino', diseaseCategories.intestinalDiseases)}
              {renderDiseaseCategory('renalDiseases', 'Renal ou Urinário', diseaseCategories.renalDiseases)}
              {renderDiseaseCategory('neurologicalDiseases', 'Neurológica ou Psiquiátrica', diseaseCategories.neurologicalDiseases)}
              {renderDiseaseCategory('orthopedicDiseases', 'Ortopédica ou Reumatológica', diseaseCategories.orthopedicDiseases)}
              {renderDiseaseCategory('gynecologicalDiseases', 'Ginecológica ou Mamária', diseaseCategories.gynecologicalDiseases)}
              {renderDiseaseCategory('bloodDiseases', 'Doenças do Sangue', diseaseCategories.bloodDiseases)}
              {renderDiseaseCategory('cancerDiseases', 'Câncer', diseaseCategories.cancerDiseases)}
              {renderDiseaseCategory('ophthalmologicalDiseases', 'Doenças Oftalmológicas', diseaseCategories.ophthalmologicalDiseases)}
              {renderDiseaseCategory('infectiousDiseases', 'Hepatite e AIDS', diseaseCategories.infectiousDiseases)}
              {renderDiseaseCategory('dialysisDiseases', 'Insuficiência Renal ou Diálise', diseaseCategories.dialysisDiseases)}

              <div className="mt-6 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Tem obesidade?</Label>
                  <RadioGroup 
                    value={formData.hasObesity} 
                    onValueChange={(value) => setFormData(prev => ({...prev, hasObesity: value}))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="obesity-sim" />
                      <Label htmlFor="obesity-sim" className="text-sm">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="obesity-nao" />
                      <Label htmlFor="obesity-nao" className="text-sm">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium">Tem órtese ou prótese?</Label>
                  <RadioGroup 
                    value={formData.hasProsthetics} 
                    onValueChange={(value) => setFormData(prev => ({...prev, hasProsthetics: value}))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="prosthetics-sim" />
                      <Label htmlFor="prosthetics-sim" className="text-sm">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="prosthetics-nao" />
                      <Label htmlFor="prosthetics-nao" className="text-sm">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="observations" className="text-sm font-medium">Observações</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => setFormData(prev => ({...prev, observations: e.target.value}))}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalInfo" className="text-sm font-medium">Informações Adicionais</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData(prev => ({...prev, additionalInfo: e.target.value}))}
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button 
            onClick={handleCompleteAssessment}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Concluir Formulário
          </Button>
        </div>
      </div>

      {/* Right Panel - Video */}
      <div className="flex-1 flex flex-col">
        {/* Video Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Entrevista em Andamento</h1>
            <p className="text-sm text-gray-600">Beneficiário conectado</p>
          </div>
          <div className="text-sm text-gray-500">
            Gravação ativa ⏺️
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 bg-gray-900 relative">
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
