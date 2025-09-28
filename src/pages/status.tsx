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

export default function StatusElement() {
  const { token } = useAuth();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function handlePlanSelection(plan: string) {
    setSelectedPlan(plan);

    try {
      const res = await fetch(`https://localhost:7240/pix/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: plan === "1 mês" ? 49.9 : plan === "3 meses" ? 129.9 : 399.9,
          description: `Assinatura Betomation - ${plan}`,
          email: "vitordevcontato@gmail.com",
        }),
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
              <button onClick={() => handlePlanSelection("1 mês")}>
                1 mês
              </button>
              <button onClick={() => handlePlanSelection("3 meses")}>
                3 meses
              </button>
              <button onClick={() => handlePlanSelection("1 ano")}>
                1 ano
              </button>
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
                  <strong>Plano escolhido:</strong> {selectedPlan}
                </p>
                <p>
                  <strong>Valor:</strong>{" "}
                  {selectedPlan === "1 mês"
                    ? "R$ 49,90"
                    : selectedPlan === "3 meses"
                    ? "R$ 129,90"
                    : "R$ 399,90"}
                </p>
                <p>
                  <strong>Pix copia e cola:</strong>
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
