import "../styles/price.scss";
import { FaStar, FaTrophy, FaMedal } from "react-icons/fa";

interface PriceProps {
  isLogged: boolean;
  setPage: (page: string) => void;
}

export default function PriceElement({ setPage, isLogged }: PriceProps) {
  const plans = [
    {
      name: "1 Dia",
      price: 30,
      displayPrice: "R$30,00",
      features: [],
      badge: { label: "1º", icon: <FaMedal /> },
      savings: null,
      glowColor: "200, 202, 255", // azul meio branco
    },
    {
      name: "1 Semana",
      price: 30,
      displayPrice: "R$140,00",
      features: [
        "Suporte via email"
      ],
      badge: { label: "2º", icon: <FaMedal /> },
      savings: null,
      glowColor: "100, 132, 255", // azul
    },
    {
      name: "1 Mês",
      price: 200,
      displayPrice: "R$200,00",
      features: [
        "Acesso completo", 
        "Suporte via telegram", 
        "Saque bônus automático"
      ],
      badge: { label: "3º", icon: <FaMedal /> },
      savings: null,
      glowColor: "250, 132, 255", // roxo
    },
    {
      name: "3 Meses",
      price: 500,
      displayPrice: "R$500,00",
      features: [
        "Acesso completo", 
        "Suporte via telegram", 
        "Saque bônus automático", 
        "Desconto adicional"
      ],
      badge: { label: "4º", icon: <FaTrophy /> },
      savings: { amount: 100 },
      glowColor: "255, 200, 0", // dourado
    },
    {
      name: "Vitalício",
      price: 2000,
      displayPrice: "R$2000,00",
      features: [
        "Acesso completo",
        "Suporte prioritário", 
        "Saque bônus automático",
        "Desconto exclusivo",
      ],
      badge: { label: "5º", icon: <FaStar /> },
      savings: { amount: 400 },
      glowColor: "0, 255, 132", // verde
    },
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
