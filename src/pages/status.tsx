import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/status.scss";

interface StatusData {
  situacao: string;
  plano: string;
  dataCompra: string;
  dataExpiracao: string;
}

export default function StatusElement() {
  const { token } = useAuth();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
            Authorization: `Bearer ${token}`
          }
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

  const pixValue = "R$ 49,90";
  const pixCode =
    "00020126580014BR.GOV.BCB.PIX0136e-mail-do-vendedor@provedor.com520400005303986540649.905802BR5925NOME DA SUA EMPRESA6009Sao Paulo62070503***63041D3A";

  if (loading) return <p>Carregando status...</p>;
  if (error) return <p style={{ color: "red" }}>Erro: {error}</p>;

  return (
    <div className="status-container">
      <div className="status-left">
        {!selectedPlan ? (
          <div className="plans">
            <h3>
              {status?.situacao === "Ativo" ? "Extender plano" : "Escolha um plano"}
            </h3>
            <div className="plan-options">
              <button onClick={() => setSelectedPlan("1 mês")}>1 mês</button>
              <button onClick={() => setSelectedPlan("3 meses")}>3 meses</button>
              <button onClick={() => setSelectedPlan("1 ano")}>1 ano</button>
            </div>
          </div>
        ) : (
          <>
            <div className="qrcode-box">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  pixCode
                )}`}
                alt="QR Code Pix"
              />
            </div>
            <div className="pix-info">
              <p>
                <strong>Plano escolhido:</strong> {selectedPlan}
              </p>
              <p>
                <strong>Valor:</strong> {pixValue}
              </p>
              <p>
                <strong>Pix copia e cola:</strong>
              </p>
              <textarea
                readOnly
                value={pixCode}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>
          </>
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
