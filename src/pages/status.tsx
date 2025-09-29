import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/status.scss";

interface StatusData {
  situacao: string;
  plano: string;
  dataCompra: string;
  dataExpiracao: string;
}

interface PixResponse {
  id: string;
  status: string;
  transactions: {
    payments: Array<{
      payment_method: {
        qr_code: string;
        qr_code_base64: string;
        ticket_url: string;
      };
    }>;
  };
}

interface StatusElementProps {
  email: string;
}

export default function StatusElement({ email }: StatusElementProps) {
  const { token } = useAuth();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const planMap: Record<string, string> = {
    "1 dia": "1dia",
    "1 semana": "1semana",
    "1 mês": "1mes",
    "3 meses": "3meses",
    Vitalício: "vitalicio",
  };

  const planValueMap: Record<string, string> = {
    "1 dia": "R$30,00",
    "1 semana": "R$140,00",
    "1 mês": "R$200,00",
    "3 meses": "R$500,00",
    Vitalício: "R$2000,00",
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchStatus() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`https://localhost:7240/serialkey/status`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar status");
        const data: StatusData = await res.json();
        setStatus(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [token]);

  async function handlePlanSelection(planId: string) {
    if (!email) {
      setError("Email não disponível");
      return;
    }

    setSelectedPlan(planId);

    const body = {
      PlanId: planId,
      Email: email,
    };

    try {
      const res = await fetch(`https://localhost:7240/pix/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Erro ao gerar Pix");

      const data: PixResponse = await res.json();
      setPixData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao criar Pix");
    }
  }

  if (loading) return <p>Carregando status...</p>;
  if (error) return <p style={{ color: "red" }}>Erro: {error}</p>;

  return (
    <div className="status-container">
      <div className="status-left">
        {!selectedPlan ? (
          <div className="plans">
            <h3>
              {status?.situacao === "Ativo"
                ? "Extender plano"
                : "Escolha um plano"}
            </h3>
            <div className="plan-options">
              {Object.keys(planMap).map((label) => (
                <button
                  key={label}
                  onClick={() => handlePlanSelection(planMap[label])}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          pixData && (
            <>
              <div className="qrcode-box">
                <img
                  src={`data:image/png;base64,${pixData.transactions.payments[0].payment_method.qr_code_base64}`}
                  alt="QR Code Pix"
                />
              </div>
              <div className="pix-info">
                <p>
                  <strong>Plano escolhido:</strong>{" "}
                  {Object.keys(planMap).find(
                    (key) => planMap[key] === selectedPlan
                  )}
                </p>
                <p>
                  <strong>Valor:</strong>{" "}
                  {
                    planValueMap[
                      Object.keys(planMap).find(
                        (key) => planMap[key] === selectedPlan
                      ) || ""
                    ]
                  }
                </p>
                <textarea
                  readOnly
                  value={
                    pixData.transactions.payments[0].payment_method.qr_code
                  }
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
              </div>
            </>
          )
        )}
      </div>

      <div className="status-right">
        <ul>
          <li>
            <strong>Situação:</strong> {status?.situacao ?? "Inativo"}
          </li>
          <li>
            <strong>Plano atual:</strong> {status?.plano ?? "Nenhum"}
          </li>
          <li>
            <strong>Data de Compra:</strong> {status?.dataCompra ?? "0"}
          </li>
          <li>
            <strong>Vencimento:</strong> {status?.dataExpiracao ?? "0"}
          </li>
        </ul>
      </div>
    </div>
  );
}
