import { useState } from "react";
import { Plus, CreditCard, Check, Trash2, ShieldCheck } from "lucide-react";

export const SavedCards = () => {
  const [cards, setCards] = useState([
    {
      id: "card_1",
      bankName: "HDFC Bank",
      cardType: "VISA Signature",
      cardNumber: "**** **** **** 4821",
      cardholder: "Aarohi Sharma",
      expiry: "09/29",
      gradient: "from-[#cd6615] to-[#f49f50]",
      isDefault: true,
    },
    {
      id: "card_2",
      bankName: "ICICI Bank",
      cardType: "Mastercard World",
      cardNumber: "**** **** **** 8819",
      cardholder: "Aarohi Sharma",
      expiry: "11/27",
      gradient: "from-[#2b5876] to-[#4e4376]",
      isDefault: false,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState({
    bankName: "",
    cardType: "VISA",
    cardNumber: "",
    cardholder: "Aarohi Sharma",
    expiry: "",
  });

  const handleSetDefault = (id) => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        isDefault: card.id === id,
      }))
    );
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this card?");
    if (confirm) {
      setCards((prev) => prev.filter((card) => card.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newCard.bankName || !newCard.cardNumber || !newCard.expiry) {
      alert("Please fill out all required fields.");
      return;
    }

    // Format last 4 digits
    const digitsOnly = newCard.cardNumber.replace(/\D/g, "");
    const last4 = digitsOnly.slice(-4) || "0000";

    const gradients = [
      "from-[#cd6615] to-[#f49f50]",
      "from-[#2b5876] to-[#4e4376]",
      "from-teal-600 to-emerald-800",
      "from-purple-600 to-indigo-850",
    ];
    const chosenGradient = gradients[cards.length % gradients.length];

    const created = {
      id: `card_${Date.now()}`,
      bankName: newCard.bankName,
      cardType: newCard.cardType + " Card",
      cardNumber: `**** **** **** ${last4}`,
      cardholder: newCard.cardholder,
      expiry: newCard.expiry,
      gradient: chosenGradient,
      isDefault: cards.length === 0,
    };

    setCards((prev) => [...prev, created]);
    setIsAdding(false);
    // Reset form
    setNewCard({
      bankName: "",
      cardType: "VISA",
      cardNumber: "",
      cardholder: "Aarohi Sharma",
      expiry: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Saved Cards</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your credit and debit cards for faster checkout
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#cd6615] hover:bg-[#b2550f] text-white font-medium rounded-xl text-sm shadow-sm transition duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Card
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-50/50 border border-gray-150 rounded-2xl p-6 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Add a New Card</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={newCard.bankName}
                  onChange={handleInputChange}
                  placeholder="e.g. HDFC Bank"
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Card Brand
                </label>
                <select
                  name="cardType"
                  value={newCard.cardType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none bg-white"
                >
                  <option value="VISA">VISA</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="RuPay">RuPay</option>
                  <option value="American Express">American Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={newCard.cardNumber}
                  onChange={handleInputChange}
                  maxLength="19"
                  placeholder="16-digit card number"
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={newCard.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholder"
                  value={newCard.cardholder}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:border-[#cd6615] focus:outline-none bg-gray-50"
                  disabled
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-gray-200">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#cd6615] hover:bg-[#b2550f] text-white font-medium rounded-xl text-sm transition cursor-pointer"
              >
                Save Card
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl text-sm transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col justify-between"
          >
            {/* Visual Credit Card */}
            <div className={`w-full aspect-[1.586/1] bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white shadow-md flex flex-col justify-between relative overflow-hidden`}>
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="block text-[10px] tracking-widest text-white/70 font-semibold uppercase">{card.bankName}</span>
                  <span className="text-xs font-bold text-white/95">{card.cardType}</span>
                </div>
                <CreditCard className="w-8 h-8 text-white/80" />
              </div>

              <div className="my-auto">
                <span className="text-xl sm:text-2xl font-mono tracking-widest block text-white/95">{card.cardNumber}</span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="block text-[8px] tracking-wider text-white/60 font-semibold uppercase">Cardholder</span>
                  <span className="text-sm font-semibold text-white/95">{card.cardholder}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] tracking-wider text-white/60 font-semibold uppercase">Expires</span>
                  <span className="text-sm font-semibold text-white/95">{card.expiry}</span>
                </div>
              </div>
            </div>

            {/* Actions below the card */}
            <div className="mt-3 flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="default_card"
                  checked={card.isDefault}
                  onChange={() => handleSetDefault(card.id)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    card.isDefault ? "border-[#cd6615]" : "border-gray-350"
                  }`}
                >
                  {card.isDefault && <div className="w-2 h-2 rounded-full bg-[#cd6615]"></div>}
                </div>
                <span className="text-xs font-semibold text-gray-650 hover:text-gray-900">
                  Set as Default Payment Method
                </span>
              </label>

              {!card.isDefault && (
                <button
                  onClick={() => handleDelete(card.id)}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  title="Remove Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex items-center gap-3 text-xs text-gray-500 mt-6">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
        <span>Your payment details are encrypted. NexCart processes transaction details securely.</span>
      </div>
    </div>
  );
};

export default SavedCards;
