"use client";

import { useState } from "react";
import { WHATSAPP_LINK } from "@/lib/constants";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hi ARTHVRA, I'm ${name}${phone ? ` (${phone})` : ""}.\n\n${message}`
    );
    window.open(`${WHATSAPP_LINK}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line p-6 space-y-4">
      <div>
        <label className="label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
          placeholder="07xxxxxxxx"
        />
      </div>
      <div>
        <label className="label" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input min-h-[120px]"
        />
      </div>
      <button type="submit" className="btn btn-ember px-6 py-3 text-sm rounded-full">
        Continue on WhatsApp
      </button>
    </form>
  );
}
