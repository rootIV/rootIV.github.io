import "../styles/price.scss";
import { FaStar, FaTrophy, FaMedal } from "react-icons/fa";

interface PriceProps {
  isLogged: boolean;
  setPage: (page: string) => void;
}

export default function PriceElement({ setPage, isLogged }: PriceProps) {
  const plans = [
    {
      name: "1 Mês",
      price: 250,
      displayPrice: "R$250,00",
      features: [
        "Acesso completo", 
        "Suporte via telegram"
      ],
      badge: { label: "1º", icon: <FaMedal /> },
      savings: null,
      glowColor: "250, 132, 255", // roxo
    },
    {
      name: "Saque de bônus",
      price: 300,
      displayPrice: "R$300,00",
      features: [
        "Saque de bônus automático", 
        "Com Logs"
      ],
      badge: { label: "2º", icon: <FaTrophy /> },
      savings: null,
      glowColor: "255, 200, 0", // dourado
    },
    {
      name: "1 Dia",
      price: 50,
      displayPrice: "R$50,00",
      features: [
        "Acesso completo", 
        "Suporte via telegram"
      ],
      badge: { label: "3º", icon: <FaMedal /> },
      savings: null,
      glowColor: "200, 202, 255", // azul meio branco
    },
    {
      name: "Vitalício",
      price: 2500,
      displayPrice: "R$2500,00",
      features: [
        "Acesso completo",
        "Suporte prioritário", 
        "Suporte via telegram",
        "Desconto exclusivo"
      ],
      badge: { label: "4º", icon: <FaStar /> },
      savings: { amount: 500 },
      glowColor: "0, 255, 132", // verde
    },
    {
      name: "1 Semana",
      price: 150,
      displayPrice: "R$150,00",
      features: [
        "Acesso completo",
        "Suporte via telegram"
      ],
      badge: { label: "5º", icon: <FaMedal /> },
      savings: null,
      glowColor: "100, 132, 255", // azul
    }
  ];

  function handleSubscribe() {
    if (isLogged) {
      setPage("status");
    } else {
      setPage("login");
    }
  }

  return (
    <div className="price-container">
      <h1>Nossos Planos</h1>
      <div className="cards">
        {plans.map((plan, index) => (
          <div
            className="card"
            key={index}
            style={{ "--glow-color": plan.glowColor } as any}
          >
            <span className="badge">
              {plan.badge.icon} {plan.badge.label}
            </span>
            <h2>{plan.name}</h2>
            <p className="price">{plan.displayPrice}</p>
            {plan.savings && (
              <p className="savings">
                Economizou{" "}
                <span className="amount">R${plan.savings.amount}</span>
              </p>
            )}
            <ul>
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <span style={{ color: "$secondary", marginRight: "0.5rem" }}>
                    ✔️
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <button onClick={() => handleSubscribe()}>Assinar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
