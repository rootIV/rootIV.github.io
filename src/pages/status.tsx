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
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    };
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
  const [timer, setTimer] = useState(5 * 60);

  const planMap: Record<string, string> = {
    "1 dia": "1dia",
    "1 semana": "1semana",
    "1 mês": "1mes",
    "Saque de bônus": "withdbonus",
    Vitalício: "vitalicio",
  };

  const planValueMap: Record<string, string> = {
    "1 dia": "R$50,00",
    "1 semana": "R$150,00",
    "1 mês": "R$250,00",
    "Saque de bônus": "R$300,00",
    Vitalício: "R$2500,00",
  };

  useEffect(() => {
    if (!pixData) return;
    if (timer <= 0) {
      setPixData(null);
      setSelectedPlan(null);
      setTimer(5 * 60);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [pixData, timer]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
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
        console.log("Enviando token para /status:", token);

        const res = await fetch(
          `https://api.beetomation.shop/serialkey/status`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Status HTTP:", res.status);
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
    setTimer(5 * 60);

    const body = {
      PlanId: planId,
      Email: email,
    };

    try {
      const res = await fetch(`https://api.beetomation.shop/pix/create`, {
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
              {pixData?.point_of_interaction?.transaction_data
                ?.qr_code_base64 && (
                <div className="qrcode-box">
                  <img
                    src={`data:image/png;base64,${pixData.point_of_interaction.transaction_data.qr_code_base64}`}
                    alt="QR Code Pix"
                  />
                </div>
              )}

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
                <p>
                  <strong>Tempo restante:</strong> {formatTime(timer)}
                </p>
                <textarea
                  readOnly
                  value={
                    pixData?.point_of_interaction?.transaction_data?.qr_code ||
                    ""
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
