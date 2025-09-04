// Salve em: components/modalContactsCourses/SubscriptionForm.tsx

"use client";

import { useState } from "react";
import { Send, ChevronDown, CheckCircle, Loader2 } from "lucide-react";

// --- Componentes de estado (sem alterações na aparência) ---
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-80 text-center">
    <Loader2 className="h-12 w-12 text-red-700 animate-spin" />
    <p className="mt-4 text-lg font-medium text-zinc-600">
      Enviando seus dados...
    </p>
  </div>
);
const SuccessState = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-col items-center justify-center h-80 text-center">
    <CheckCircle className="h-16 w-16 text-red-700" />
    <h2 className="mt-4 text-3xl font-bold text-zinc-800">
      Inscrição Enviada!
    </h2>
    <p className="mt-2 text-zinc-600">
      Obrigado! Em breve nossa equipe entrará em contato com você.
    </p>
    <button
      onClick={onClose}
      className="mt-8 w-full sm:w-auto px-8 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
    >
      Voltar para a página
    </button>
  </div>
);

// --- ✅ Definição correta das propriedades que o formulário ACEITA ---
type SubscriptionFormProps = {
  status: "form" | "loading" | "success";
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  selectedContent: string;
};

const areasDeInteresse = [
  "Saúde",
  "Administração e Gestão",
  "Tecnologia e Informática",
  "Engenharia e Manutenção",
  "Construção e Infraestrutura",
  "Meio Ambiente e Agropecuária",
  "Serviços",
];

export default function SubscriptionForm({
  status,
  onSubmit,
  onCancel,
  selectedContent,
}: SubscriptionFormProps) {
  // Este estado é apenas para controlar a máscara do input, é uma lógica de UI que pode ficar aqui.
  const [whatsapp, setWhatsapp] = useState("");

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    let formattedValue = rawValue.substring(0, 11);
    if (formattedValue.length > 2)
      formattedValue = `(${formattedValue.substring(
        0,
        2
      )}) ${formattedValue.substring(2)}`;
    if (formattedValue.length > 8)
      formattedValue = `(${formattedValue.substring(
        0,
        2
      )}) ${formattedValue.substring(2, 7)}-${formattedValue.substring(7)}`;
    setWhatsapp(formattedValue);
  };

  // O componente agora obedece o 'status' que vem do pai
  if (status === "loading") return <LoadingState />;
  if (status === "success") return <SuccessState onClose={onCancel} />;

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-zinc-800">Quero me Inscrever</h2>
      <p className="text-zinc-500 mt-2 mb-6">
        Preencha seus dados para garantir sua vaga.
      </p>
      <div className="mb-6">
        <span className="inline-block bg-zinc-100 text-zinc-700 text-sm font-medium px-4 py-1.5 rounded-full">
          Curso: <strong>{selectedContent}</strong>
        </span>
      </div>

      {/* O formulário agora chama a função 'onSubmit' que vem do pai */}
      <form onSubmit={onSubmit} className="text-left">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-600 mb-1"
            >
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-zinc-100 border-2 border-transparent rounded-lg placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label
              htmlFor="whatsapp"
              className="block text-sm font-medium text-zinc-600 mb-1"
            >
              WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              required
              className="w-full px-4 py-3 bg-zinc-100 border-2 border-transparent rounded-lg placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
              placeholder="(00) 00000-0000"
              value={whatsapp}
              onChange={handleWhatsappChange}
            />
          </div>
          <div>
            <label
              htmlFor="interestArea"
              className="block text-sm font-medium text-zinc-600 mb-1"
            >
              Área de Interesse <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="interestArea"
                name="interestArea"
                required
                defaultValue=""
                className="w-full appearance-none px-4 py-3 bg-zinc-100 border-2 border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
              >
                <option value="" disabled>
                  Selecione uma área
                </option>
                {areasDeInteresse.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-8">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 text-zinc-600 font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full flex-1 px-6 py-3 flex items-center justify-center gap-2 bg-red-700 text-white font-bold rounded-lg shadow-lg hover:bg-red-800 transition-all"
          >
            <Send size={18} />
            <span>Enviar Inscrição</span>
          </button>
        </div>
      </form>
    </div>
  );
}
