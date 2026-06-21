import React from 'react';

/**
 * Tributo AdvisorCharacter, an original, emotive SVG mascot for the citizen
 * surface (inspired by a friendly tax-document sprite, built from scratch so it
 * can actually act). Eyes blink, brows emote, arms gesture, and the mouth
 * lip-syncs while speaking. Pose is driven by real backend SSE events
 * (see guidelines/advisor-state-spec.md), never timers. Calm spring motion,
 * signal-green glow only on live modes, fully degrades under reduced-motion.
 *
 * Exposed as `AdvisorAvatar` for API compatibility.
 */
const NAVY = '#27324C', CREAM = '#ECE7DA', CREAM_HI = '#F5F2E9', MINT = '#A6E0BF', MINT_SH = '#7FCBA0';

function config(mode) {
  const M = {
    idle:        { eye:'open',   brow:'calm',    mouth:'smile', front:6,    back:-4,  glow:0,   gaze:[0,0],  blink:true },
    done:        { eye:'happy',  brow:'happy',   mouth:'smile', front:-34,  back:-4,  glow:0,   gaze:[0,0] },
    listening:   { eye:'wide',   brow:'raised',  mouth:'smile', front:-96,  back:-4,  glow:1,   gaze:[0,1.5],blink:true },
    shielding:   { eye:'closed', brow:'calm',    mouth:'flat',  front:-128, back:128, glow:0.3, gaze:[0,0],  shield:true },
    thinking:    { eye:'open',   brow:'think',   mouth:'o',     front:-120, back:-4,  glow:0,   gaze:[-2,-3.5], dots:true },
    researching: { eye:'open',   brow:'calm',    mouth:'small', front:-58,  back:-4,  glow:0,   gaze:[0,1],  scan:true, doc:true },
    consolidating:{eye:'open',   brow:'calm',    mouth:'smile', front:-54,  back:-4,  glow:0.45,gaze:[0,0],  blink:true },
    handingOver: { eye:'happy',  brow:'happy',   mouth:'smile', front:-50,  back:-4,  glow:0,   gaze:[0,0],  handoff:true },
    speaking:    { eye:'happy',  brow:'happy',   mouth:'talk',  front:-60,  back:-4,  glow:1,   gaze:[0,0] },
    error:       { eye:'open',   brow:'concern', mouth:'frown', front:6,    back:-4,  glow:0,   gaze:[0,2] },
  };
  return M[mode] || M.idle;
}

function Brow({ side, type }) {
  const cx = side === 'l' ? 104 : 136, cy = 127;
  const t = {
    calm:    { l:[0,0],   r:[0,0] },
    raised:  { l:[0,-4],  r:[0,-4] },
    happy:   { l:[-12,-3],r:[12,-3] },
    think:   { l:[-15,-7],r:[5,0] },
    concern: { l:[17,3],  r:[-17,3] },
  }[type][side];
  return <rect x={cx-8} y={cy-2} width="16" height="4" rx="2" fill={NAVY}
    style={{ transform:`translate(${t[0]*0+0}px, ${t[1]}px) rotate(${t[0]}deg)`, transformOrigin:`${cx}px ${cy}px`, transition:'transform var(--dur-4) var(--ease-spring)' }} />;
}

function Eye({ side, type, gaze, blink }) {
  const cx = side === 'l' ? 105 : 135, cy = 142;
  const common = { transition:'all var(--dur-4) var(--ease-out)' };
  if (type === 'happy' || type === 'closed') {
    const d = type === 'happy'
      ? `M${cx-6},${cy+1} Q${cx},${cy-6} ${cx+6},${cy+1}`
      : `M${cx-6},${cy-1} Q${cx},${cy+4} ${cx+6},${cy-1}`;
    return <path d={d} fill="none" stroke={NAVY} strokeWidth="3.6" strokeLinecap="round" style={common} />;
  }
  const rx = type === 'wide' ? 6 : 5.4, ry = type === 'wide' ? 8 : 7;
  const g = (
    <g style={{ transform:`translate(${gaze[0]}px, ${gaze[1]}px)`, transition:'transform var(--dur-4) var(--ease-out)' }}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={NAVY} />
      <circle cx={cx-1.6} cy={cy-2.4} r="1.5" fill="#fff" opacity="0.9" />
    </g>
  );
  if (!blink) return g;
  return <g style={{ animation:'tributo-blink 4.6s var(--ease-in-out) infinite', transformOrigin:`${cx}px ${cy}px` }}>{g}</g>;
}

function Mouth({ type, talkLevel }) {
  const cx = 120, cy = 170;
  if (type === 'smile') return <path d={`M${cx-15},${cy-2} Q${cx},${cy+11} ${cx+15},${cy-2}`} fill="none" stroke={NAVY} strokeWidth="3.6" strokeLinecap="round" style={{transition:'all var(--dur-4)'}} />;
  if (type === 'frown') return <path d={`M${cx-13},${cy+5} Q${cx},${cy-6} ${cx+13},${cy+5}`} fill="none" stroke={NAVY} strokeWidth="3.6" strokeLinecap="round" />;
  if (type === 'flat') return <line x1={cx-12} y1={cy} x2={cx+12} y2={cy} stroke={NAVY} strokeWidth="3.6" strokeLinecap="round" />;
  if (type === 'small') return <path d={`M${cx-9},${cy-1} Q${cx},${cy+6} ${cx+9},${cy-1}`} fill="none" stroke={NAVY} strokeWidth="3.4" strokeLinecap="round" />;
  if (type === 'o') return <ellipse cx={cx} cy={cy+1} rx="5" ry="6.5" fill={NAVY} />;
  // talk, lip-syncs with talkLevel
  const ry = 3 + Math.max(0, Math.min(1, talkLevel)) * 8;
  return <g><ellipse cx={cx} cy={cy} rx="9" ry={ry} fill={NAVY} /><ellipse cx={cx} cy={cy+ry*0.28} rx="5" ry={ry*0.4} fill="#7E3B4A" opacity="0.6" /></g>;
}

function Arm({ shoulder, angle, hand, back }) {
  const [sx, sy] = shoulder;
  return (
    <g style={{ transform:`rotate(${angle}deg)`, transformOrigin:`${sx}px ${sy}px`, transition:'transform var(--dur-4) var(--ease-spring)' }}>
      <path d={`M${sx},${sy} q${back?-10:10},26 ${back?-2:2},46`} fill="none" stroke={NAVY} strokeWidth="10.5" strokeLinecap="round" />
      {hand && <circle cx={sx+(back?-2:2)} cy={sy+46} r="6.5" fill={NAVY} />}
    </g>
  );
}

export function AdvisorAvatar({ mode = 'idle', size = 240, talkLevel = 0.5, status, style = {}, ...rest }) {
  const c = config(mode);
  const glowOpacity = c.glow;
  const bob = mode === 'idle' || mode === 'done' ? 'tributo-breathe 4s var(--ease-in-out) infinite'
    : mode === 'speaking' ? 'tributo-breathe 1.1s var(--ease-in-out) infinite'
    : mode === 'thinking' ? 'tributo-sway 3.4s var(--ease-in-out) infinite'
    : mode === 'listening' ? 'tributo-breathe 2.4s var(--ease-in-out) infinite'
    : 'tributo-breathe 3.4s var(--ease-in-out) infinite';

  const status_ = status || {
    idle:'Your advisor is ready.', listening:'Listening…',
    shielding:'Removing personal details before anything is sent.',
    thinking:'Planning how to answer your question.',
    researching:'Researching your question across trusted sources.',
    consolidating:'Gathering sources and confirming the figures.',
    handingOver:"Let's get you a human, handing over now.", speaking:'Answering now.',
    done:'Done. The source is open on the right.',
    error:"Something went wrong, your answer wasn't sent anywhere.",
  }[mode];

  return (
    <div style={{ display:'inline-flex', flexDirection:'column', alignItems:'center', ...style }} {...rest}>
      <div style={{ position:'relative', width:size, height:size }}>
        {glowOpacity > 0 && (
          <span aria-hidden="true" style={{
            position:'absolute', left:'50%', top:'52%', width:'72%', height:'72%', transform:'translate(-50%,-50%)',
            borderRadius:'50%', background:`radial-gradient(circle, rgba(34,194,129,${0.28*glowOpacity}) 0%, rgba(34,194,129,0) 64%)`,
            animation:'tributo-pulse-glow 1.9s ease-out infinite',
          }} />
        )}
        <svg viewBox="0 0 240 300" width={size} height={size} role="img" aria-label={status_}
          style={{ overflow:'visible', filter:'drop-shadow(0 16px 20px rgba(13,33,67,0.14))' }}>
          {/* ground shadow */}
          <ellipse cx="120" cy="276" rx="58" ry="11" fill="#0D2143" opacity="0.10" />

          <g style={{ animation:bob, transformOrigin:'120px 276px' }}>
            {/* back arm */}
            <Arm shoulder={[74,156]} angle={c.back} hand={false} back />

            {/* body / document */}
            <rect x="66" y="84" width="108" height="150" rx="26" fill={CREAM} />
            <rect x="66" y="84" width="108" height="60" rx="26" fill={CREAM_HI} opacity="0.6" />
            {/* folded corner */}
            <path d="M150 84 L174 84 L174 108 Z" fill={MINT} />
            <path d="M150 84 L150 108 L174 108 Z" fill={MINT_SH} opacity="0.85" />

            {/* face */}
            <g>
              <Brow side="l" type={c.brow} />
              <Brow side="r" type={c.brow} />
              <g style={c.scan ? { animation:'tributo-scan 1.5s var(--ease-in-out) infinite' } : undefined}>
                <Eye side="l" type={c.eye} gaze={c.gaze} blink={c.blink} />
                <Eye side="r" type={c.eye} gaze={c.gaze} blink={c.blink} />
              </g>
              <Mouth type={c.mouth} talkLevel={talkLevel} />
            </g>

            {/* satchel strap + bag */}
            <path d="M80 158 L166 212" stroke={NAVY} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.92" />
            <rect x="150" y="190" width="36" height="32" rx="9" fill={NAVY} />
            <rect x="150" y="190" width="36" height="12" rx="6" fill="#1B2438" />
            <circle cx="168" cy="208" r="3.4" fill={MINT} />

            {/* front arm */}
            <Arm shoulder={[166,156]} angle={c.front} hand />

            {/* researching: little held document */}
            {c.doc && (
              <g style={{ animation:'tributo-fade var(--dur-3) var(--ease-out)' }}>
                <rect x="150" y="150" width="30" height="38" rx="4" fill="#fff" stroke="#D9D3C4" strokeWidth="1.5" transform="rotate(8 165 169)" />
                <line x1="156" y1="160" x2="174" y2="162" stroke="#C7C0AE" strokeWidth="2" transform="rotate(8 165 169)" />
                <line x1="155" y1="167" x2="173" y2="169" stroke="#C7C0AE" strokeWidth="2" transform="rotate(8 165 169)" />
                <line x1="154" y1="174" x2="168" y2="176" stroke="#C7C0AE" strokeWidth="2" transform="rotate(8 165 169)" />
              </g>
            )}

            {/* thinking dots */}
            {c.dots && (
              <g>
                {[0,1,2].map(i => (
                  <circle key={i} cx={150+i*13} cy={68-i*2} r="4" fill={NAVY}
                    style={{ animation:`tributo-thinkdot 1.3s var(--ease-in-out) ${i*0.18}s infinite` }} />
                ))}
              </g>
            )}

            {/* shield sweep */}
            {c.shield && (
              <g>
                <path d="M120 96 C150 104 158 120 158 150 C158 186 142 206 120 214 C98 206 82 186 82 150 C82 120 90 104 120 96 Z"
                  fill="none" stroke={MINT_SH} strokeWidth="3" opacity="0.7"
                  style={{ animation:'tributo-fade var(--dur-3) var(--ease-out)' }} />
                <clipPath id="bodyClip"><rect x="66" y="84" width="108" height="150" rx="26" /></clipPath>
                <rect x="40" y="84" width="60" height="150" fill="rgba(166,224,191,0.55)" clipPath="url(#bodyClip)"
                  style={{ animation:'tributo-shield-sweep 1.1s var(--ease-in-out) infinite' }} />
              </g>
            )}

            {/* handoff: friendly "→ human" badge */}
            {c.handoff && (
              <g style={{ animation:'tributo-rise var(--dur-4) var(--ease-out) both' }} transform="translate(184 150)">
                <rect x="-6" y="-16" width="58" height="34" rx="17" fill="#fff" stroke="#E3DDD1" strokeWidth="1.5" />
                <circle cx="10" cy="-2" r="6" fill="none" stroke={NAVY} strokeWidth="2.4" />
                <path d="M1 12 a9 9 0 0 1 18 0" fill="none" stroke={NAVY} strokeWidth="2.4" strokeLinecap="round" />
                <path d="M26 1 h16 m-6 -5 l6 5 l-6 5" fill="none" stroke="#0C8B57" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </g>
        </svg>
      </div>
      <span role="status" aria-live="polite" className="tributo-sr-only">{status_}</span>
    </div>
  );
}
