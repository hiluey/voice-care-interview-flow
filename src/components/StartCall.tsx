
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, Phone, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StartCall = () => {
  const navigate = useNavigate();
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    nameE: '',
    position: ''
  });

  const handleStartCall = () => {
    if (patientInfo.name && patientInfo.nameE) {
      navigate('/video-interview');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Sistema de Avaliação de Saúde
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Plataforma integrada para condução de entrevistas de entrada com transcrição automática e preenchimento inteligente de formulários.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Vídeo chamada integrada</h3>
                <p className="text-sm text-gray-600">Interface profissional para entrevistas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Redução de tempo</h3>
                <p className="text-sm text-gray-600">Eliminação da digitação manual</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Fluxo otimizado</h3>
                <p className="text-sm text-gray-600">7 etapas em formulário único</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Start Call Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gray-800">
              Iniciar Nova Avaliação
            </CardTitle>
            <p className="text-center text-sm text-gray-600">
              Preencha os dados do beneficiário para iniciar a entrevista
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Nome do Beneficiário</Label>
              <Input
                id="patientName"
                type="text"
                placeholder="Digite o nome completo"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo(prev => ({...prev, name: e.target.value}))}
              />
            </div>

          
            <div className="space-y-2">
              <Label htmlFor="patientName">Nome do Enfermeiro</Label>
              <Input
                id="patientNameE"
                type="text"
                placeholder="Digite o nome completo"
                value={patientInfo.nameE}
                onChange={(e) => setPatientInfo(prev => ({...prev, nameE: e.target.value}))}
              />
            </div>



            <div className="pt-4">
              <Button 
                onClick={handleStartCall}
                disabled={!patientInfo.name || !patientInfo.nameE}
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                size="lg"
              >
                <Phone className="w-4 h-4" />
                Iniciar Chamada
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              A chamada será automaticamente gravada para fins de qualidade e treinamento
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StartCall;
