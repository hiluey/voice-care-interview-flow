
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, UserCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssessmentComplete = () => {
  const navigate = useNavigate();

  const handleApproveAssessment = () => {
    // Aqui seria implementada a lógica de aprovação
    console.log('Avaliação aprovada');
    navigate('/');
  };

  const handleNextPatient = () => {
    // Aqui seria implementada a lógica para próximo atendimento
    console.log('Próximo atendimento');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl text-gray-800">Avaliação Concluída</CardTitle>
          <p className="text-gray-600 text-sm">
            A entrevista foi finalizada com sucesso. Todas as informações foram coletadas.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Resumo da Avaliação</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Duração:</span>
                <span>12 min 30s</span>
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

          <div className="space-y-3">
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
              className="text-sm text-gray-500 hover:text-gray-700"
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
