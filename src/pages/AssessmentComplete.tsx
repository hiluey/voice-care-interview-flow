import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, UserCheck, Users, Stethoscope, Pencil, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssessmentComplete = () => {
  const navigate = useNavigate();

  const [editando, setEditando] = useState(false);
  const [resumoEntrevista, setResumoEntrevista] = useState({
    doencasConfirmadas: 'Hipertensão, Diabetes tipo 2, Artrose',
    mobilidade: 'Necessita de auxílio para caminhar em casa, com uso de bengala.',
    cognicao: 'Apresenta dificuldade leve de memória recente, mas compreende comandos.',
    observacoes: 'Paciente demonstrou bom humor e compreensão durante a entrevista.'
  });

  const [edits, setEdits] = useState({ ...resumoEntrevista });

  const handleEdit = () => setEditando(true);
  const handleCancel = () => {
    setEdits(resumoEntrevista);
    setEditando(false);
  };

  const handleSave = () => {
    setResumoEntrevista(edits);
    setEditando(false);
  };

  const handleChange = (field: string, value: string) => {
    setEdits(prev => ({ ...prev, [field]: value }));
  };

  const handleApproveAssessment = () => {
    console.log('Avaliação aprovada');
    navigate('/');
  };

  const handleNextPatient = () => {
    console.log('Próximo atendimento');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">Avaliação Concluída</CardTitle>
          <p className="text-gray-600 text-xs">
            A entrevista foi finalizada com sucesso. Todas as informações foram coletadas.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Resumo da entrevista */}
          <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-gray-500" />
                Resumo da Entrevista
              </h3>

              {!editando ? (
                <button onClick={handleEdit} className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1">
                  <Pencil className="w-3 h-3" />
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1">
                    <Save className="w-3 h-3" />
                    Salvar
                  </button>
                  <button onClick={handleCancel} className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1">
                    <X className="w-3 h-3" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
              {['doencasConfirmadas', 'mobilidade', 'cognicao', 'observacoes'].map((campo) => (
                <div key={campo}>
                  <span className="font-medium text-gray-800 capitalize">
                    {campo === 'doencasConfirmadas' ? 'Doenças confirmadas' :
                     campo === 'mobilidade' ? 'Mobilidade' :
                     campo === 'cognicao' ? 'Cognição' : 'Observações'}:
                  </span>
                  {editando ? (
                    <textarea
                      className="mt-1 w-full border border-gray-300 rounded-sm px-2 py-1 text-xs"
                      value={edits[campo as keyof typeof edits]}
                      onChange={(e) => handleChange(campo, e.target.value)}
                      rows={2}
                    />
                  ) : (
                    <div className="mt-1 text-gray-700">
                      {resumoEntrevista[campo as keyof typeof resumoEntrevista]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resumo técnico */}
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="font-semibold text-sm text-gray-700 mb-1">Resumo da Avaliação</h3>
            <div className="space-y-1 text-xs text-gray-600">
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

          {/* Botões */}
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
