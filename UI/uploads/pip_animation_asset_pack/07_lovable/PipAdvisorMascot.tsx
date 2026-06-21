import React, { useEffect, useMemo, useRef, useState } from "react";

type PipState =
  | "idle"
  | "listening"
  | "standingUp"
  | "thinking"
  | "explaining"
  | "speaking"
  | "holdingDocument"
  | "reassuring"
  | "conversing"
  | "sittingBackDown"
  | "idleAlt"
  | "happy";

type PipTrigger =
  | "default"
  | "input_focus"
  | "input_typing"
  | "message_submit"
  | "response_loading"
  | "response_streaming"
  | "response_document_reference"
  | "response_complete"
  | "user_inactive"
  | "success";

const pipAssets: Record<PipState, string> = {
  idle: "/assets/pip/01_idle_seated_at_desk.png",
  listening: "/assets/pip/02_listening_to_user.png",
  standingUp: "/assets/pip/03_standing_up.png",
  thinking: "/assets/pip/04_thinking_hand_on_chin.png",
  explaining: "/assets/pip/05_explaining_advice_pointing.png",
  speaking: "/assets/pip/06_speaking_with_gestures.png",
  holdingDocument: "/assets/pip/07_holding_a_document.png",
  reassuring: "/assets/pip/08_reassuring_user.png",
  conversing: "/assets/pip/09_conversing_active_listening.png",
  sittingBackDown: "/assets/pip/10_sitting_back_down.png",
  idleAlt: "/assets/pip/11_sitting_idle_alternate.png",
  happy: "/assets/pip/12_happy_waving.png"
};

const pipStatusText: Record<PipState, string> = {
  idle: "Ready when you are.",
  listening: "I'm listening.",
  standingUp: "Let's take a look.",
  thinking: "Let me think that through.",
  explaining: "Here's what I'd suggest.",
  speaking: "Let's work through this.",
  holdingDocument: "I'll check the details.",
  reassuring: "You're on the right track.",
  conversing: "Tell me more.",
  sittingBackDown: "I'm here if you need me.",
  idleAlt: "Ready for your next question.",
  happy: "Nice, that's sorted."
};

function logPipStateChange(previousState: PipState, nextState: PipState, trigger: PipTrigger) {
  console.debug("[PipMascot]", {
    previousState,
    nextState,
    trigger,
    timestamp: new Date().toISOString()
  });
}

export function PipAdvisorMascot({
  externalState,
  trigger = "default",
  reducedMotion = false
}: {
  externalState?: PipState;
  trigger?: PipTrigger;
  reducedMotion?: boolean;
}) {
  const [state, setState] = useState<PipState>(externalState ?? "idle");
  const previousState = useRef<PipState>("idle");

  const updateState = (next: PipState, stateTrigger: PipTrigger) => {
    previousState.current = state;
    setState(next);
    logPipStateChange(state, next, stateTrigger);
  };

  useEffect(() => {
    if (externalState) {
      updateState(externalState, trigger);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalState, trigger]);

  const animationClass = useMemo(() => {
    if (reducedMotion) return "";
    if (state === "idle" || state === "idleAlt") return "pip-breathe";
    if (state === "listening") return "pip-listen";
    if (state === "thinking") return "pip-think";
    if (state === "explaining" || state === "speaking") return "pip-speak";
    if (state === "reassuring" || state === "happy") return "pip-bounce";
    return "pip-transition";
  }, [state, reducedMotion]);

  return (
    <section className="pip-mascot-card" aria-label="Pip tax advisory companion">
      <div className="pip-stage">
        <img
          className={`pip-sprite ${animationClass}`}
          src={pipAssets[state]}
          alt={`Pip mascot state: ${state}`}
          onError={() => updateState("idle", "default")}
        />
      </div>

      <div className="pip-status" aria-live="polite">
        {pipStatusText[state]}
      </div>
    </section>
  );
}

/*
Suggested CSS:

.pip-mascot-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background: #FFF6E6;
  border-radius: 24px;
  padding: 1rem;
}

.pip-stage {
  width: min(280px, 45vw);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}

.pip-sprite {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pip-status {
  color: #0D1B2A;
  font-weight: 600;
  background: rgba(167, 227, 193, 0.25);
  border-radius: 999px;
  padding: 0.5rem 0.875rem;
}

@keyframes pipBreathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.015); }
}

@keyframes pipListen {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-2px) rotate(-1deg); }
}

@keyframes pipThink {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes pipSpeak {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

@keyframes pipBounce {
  0%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
}

.pip-breathe { animation: pipBreathe 3.8s ease-in-out infinite; }
.pip-listen { animation: pipListen 2s ease-in-out infinite; }
.pip-think { animation: pipThink 1.2s ease-in-out infinite; }
.pip-speak { animation: pipSpeak 1.1s ease-in-out infinite; }
.pip-bounce { animation: pipBounce 0.9s ease-out 1; }
.pip-transition { transition: transform 240ms ease, opacity 240ms ease; }

@media (prefers-reduced-motion: reduce) {
  .pip-sprite {
    animation: none !important;
    transition: none !important;
  }
}
*/
