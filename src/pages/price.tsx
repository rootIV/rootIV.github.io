import "../styles/price.scss";
import { FaStar, FaTrophy, FaMedal } from "react-icons/fa";

export default function PriceElement() {
  const plans = [
    {
      name: "1 Mês",
      price: 200,
      displayPrice: "R$200,00",
      features: ["Acesso completo", "Suporte via email"],
      badge: { label: "2º", icon: <FaMedal /> },
      savings: null,
      glowColor: "0, 132, 255", // dourado
    },
    {
      name: "3 Meses",
      price: 500,
      displayPrice: "R$500,00",
      features: ["Acesso completo", "Suporte via email", "Desconto adicional"],
      badge: { label: "1º", icon: <FaTrophy /> },
      savings: { amount: 100 },
      glowColor: "255, 200, 0", // azul
    },
    {
      name: "1 Ano",
      price: 1800,
      displayPrice: "R$1800,00",
      features: [
        "Acesso completo",
        "Suporte prioritário",
        "Desconto exclusivo",
      ],
      badge: { label: "3º", icon: <FaStar /> },
      savings: { amount: 600 },
      glowColor: "0, 255, 132", // verde
    },
  ];

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
            <button>Assinar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
