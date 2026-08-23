'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from 'motion/react';
import { useSiteConfig } from '@/hooks/use-site-config';
import { parseWeddingDate } from '@/lib/wedding-date';
import { anastasiaScript } from '@/lib/fonts';
import { InviteParticles } from '@/components/loader/InviteParticles';
import './envelope-invite.css';

interface HeroProps {
  onOpen: () => void;
  onTransitionStart?: () => void;
  visible: boolean;
  enterFromLoading?: boolean;
}

const DECO = {
  tl: '/decoration/left-top-decoration.png',
  tr: '/decoration/right-top-decoration.png',
  bl: '/decoration/left-bottom-decoration.png',
  br: '/decoration/right-bottom-decoration.png',
  names: '/decoration/couple.png',
  monogram: '/decoration/monogram-new.png',
} as const;

const FOREST_PARTICLES = ['#093327', '#0a3121', '#c5a059', '#d2917a'] as const;

function CornerOrnament({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path
        d="M54 3H20.5C9.6 3 3 9.6 3 20.5V54"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M54 8H23C12.8 8 8 12.8 8 23V54"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.72"
      />
      <circle cx="19" cy="19" r="1.55" fill="currentColor" />
      <path
        d="M14.5 19.5c2.4-5 5.2-7.6 9.8-9.6"
        stroke="currentColor"
        strokeWidth="0.7"
      />
    </svg>
  );
}

const focusLiftEase: Transition = { duration: 1.15, ease: [0.22, 1, 0.36, 1] };
const revealEntryEase: Transition = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
const buttonEntryEase: Transition = { duration: 0.95, ease: [0.16, 1, 0.3, 1] };

type EnvelopePhase =
  | 'idle'
  | 'seal-press'
  | 'seal-break'
  | 'flap-open'
  | 'rising'
  | 'revealed'
  | 'cta';

function getFocusLiftPhase(phase: EnvelopePhase): 'idle' | 'opening' | 'revealed' | 'cta' {
  if (phase === 'idle') return 'idle';
  if (
    phase === 'seal-press' ||
    phase === 'seal-break' ||
    phase === 'flap-open' ||
    phase === 'rising'
  ) {
    return 'opening';
  }
  if (phase === 'revealed') return 'revealed';
  return 'cta';
}

const letterEmergenceEase: Transition = { duration: 2.85, ease: [0.08, 1, 0.2, 1] };
const flapEase: Transition = { duration: 1.1, ease: [0.65, 0, 0.35, 1] };
const envelopeEase: Transition = { duration: 0.85, ease: [0.22, 1, 0.36, 1] };
const inviteExitEase: Transition = { duration: 1.75, ease: [0.22, 1, 0.36, 1] };
const inviteEnterEase: Transition = { duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 0.06 };
const letterExitEase: Transition = { duration: 1.35, ease: [0.16, 1, 0.3, 1] };
const INVITE_EXIT_MS = 1850;

export const Hero: React.FC<HeroProps> = ({
  onOpen,
  onTransitionStart,
  visible,
  enterFromLoading = false,
}) => {
  const siteConfig = useSiteConfig();
  const reduceMotion = useReducedMotion();
  const openedRef = useRef(false);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<EnvelopePhase>('idle');
  const [liveMessage, setLiveMessage] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const groomName = siteConfig.couple.groomNickname;
  const brideName = siteConfig.couple.brideNickname;
  const coupleNames = `${groomName} & ${brideName}`;
  const monogramSrc = DECO.monogram;

  const letterDateNumeric = useMemo(() => {
    const parsed = parseWeddingDate(siteConfig.ceremony.date ?? siteConfig.wedding.date);
    const wedding = new Date(`${parsed.month} ${parsed.day}, ${parsed.year}`);
    if (Number.isNaN(wedding.getTime())) {
      const monthDate = new Date(`${parsed.month} 1, ${parsed.year}`);
      const month = Number.isNaN(monthDate.getTime())
        ? '00'
        : String(monthDate.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.day).padStart(2, '0');
      const year = String(parsed.year).slice(-2);
      return `${month} | ${day} | ${year}`;
    }
    const month = String(wedding.getMonth() + 1).padStart(2, '0');
    const day = String(wedding.getDate()).padStart(2, '0');
    const year = String(wedding.getFullYear()).slice(-2);
    return `${month} | ${day} | ${year}`;
  }, [siteConfig.ceremony.date, siteConfig.wedding.date]);

  const weddingDateGhost = useMemo(() => {
    const [month, day, year] = letterDateNumeric.split(' | ');
    return { month, day, year };
  }, [letterDateNumeric]);

  const daysToGo = useMemo(() => {
    const parsed = parseWeddingDate(siteConfig.wedding.date);
    const wedding = new Date(`${parsed.month} ${parsed.day}, ${parsed.year}`);
    if (Number.isNaN(wedding.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    wedding.setHours(0, 0, 0, 0);

    const diff = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }, [siteConfig.wedding.date]);

  const daysToGoLabel =
    daysToGo === null
      ? null
      : daysToGo === 1
        ? '1 day to go'
        : `${daysToGo} days to go`;

  const flapIsOpen =
    phase === 'flap-open' ||
    phase === 'rising' ||
    phase === 'revealed' ||
    phase === 'cta';

  const contentsVisible =
    phase === 'rising' ||
    phase === 'revealed' ||
    phase === 'cta';

  const sealGone =
    phase === 'seal-break' ||
    phase === 'flap-open' ||
    phase === 'rising' ||
    phase === 'revealed' ||
    phase === 'cta';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      openedRef.current = false;
      setPhase('idle');
      setLiveMessage('');
      setIsExiting(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || isExiting) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [visible, isExiting]);

  useEffect(() => {
    if (phase === 'cta') {
      enterBtnRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  const handleEnterInvitation = useCallback(async () => {
    if (isExiting || phase !== 'cta') return;

    setIsExiting(true);
    setLiveMessage('Opening your invitation.');
    onTransitionStart?.();

    if (reduceMotion) {
      onOpen();
      return;
    }

    await wait(INVITE_EXIT_MS);
    onOpen();
  }, [isExiting, onOpen, onTransitionStart, phase, reduceMotion]);

  const runOpenSequence = useCallback(async () => {
    if (reduceMotion) {
      setPhase('cta');
      setLiveMessage('Invitation opened.');
      return;
    }

    setLiveMessage('Pressing seal.');
    setPhase('seal-press');
    await wait(180);

    setLiveMessage('Breaking seal.');
    setPhase('seal-break');
    await wait(320);

    setLiveMessage('Opening envelope.');
    setPhase('flap-open');
    await wait(1100);

    setLiveMessage('Invitation rising.');
    setPhase('rising');
    await wait(2850);

    setPhase('revealed');
    await wait(650);

    setPhase('cta');
    setLiveMessage('Invitation ready.');
  }, [reduceMotion]);

  const handleSealClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (openedRef.current || phase !== 'idle') return;
      openedRef.current = true;
      void runOpenSequence();
    },
    [phase, runOpenSequence]
  );

  /* Keep envelope tilt on Y only — parent rotateX breaks the flap hinge in 3D */
  const envelopeVariants: Variants = {
    idle: { rotateX: 0, rotateY: -2, scale: 1, y: 0 },
    press: { rotateX: 0, rotateY: -2, scale: 0.988, y: 1 },
    opening: { rotateX: 0, rotateY: 0, scale: 1.012, y: 3 },
    open: { rotateX: 0, rotateY: 0, scale: 1, y: 6 },
  };

  /* Match reference sample: single flap, rotateX(180deg) positive, origin top center */
  const flapVariants: Variants = {
    closed: { rotateX: 0 },
    open: { rotateX: 180 },
  };

  const sealVariants: Variants = {
    idle: { scale: 1, opacity: 1, rotate: 0, y: 0 },
    press: { scale: 0.94, opacity: 1, rotate: 0, y: 2 },
    break: { scale: 0.2, opacity: 0, rotate: 12, y: -4 },
  };

  /*
    Letter is anchored at the pocket floor and slides upward through the lip.
    Positive y = inside; negative y = above pocket.
  */
  const letterVariants: Variants = {
    hidden: { y: '6%', scale: 0.86, opacity: 1, rotate: -0.5 },
    rising: { y: '-12%', scale: 1, opacity: 1, rotate: 0 },
    out: { y: '-12%', scale: 1, opacity: 1, rotate: 0 },
    exitPortal: {
      y: '-122%',
      scale: 2.75,
      opacity: 1,
      rotate: 0,
      zIndex: 48,
    },
  };

  const revealCopyContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.16, delayChildren: 0.1 },
    },
    exit: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const revealCopyItemVariants: Variants = {
    hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: revealEntryEase,
    },
    exit: {
      opacity: 0,
      y: 28,
      filter: 'blur(6px)',
      transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
    },
  };

  const buttonRevealVariants: Variants = {
    hidden: { opacity: 0, y: 28, x: '-50%', scale: 0.92, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      x: '-50%',
      scale: 1,
      filter: 'blur(0px)',
      transition: buttonEntryEase,
    },
    exit: {
      opacity: 0,
      y: 36,
      x: '-50%',
      scale: 0.9,
      filter: 'blur(6px)',
      transition: { duration: 0.36, ease: [0.4, 0, 1, 1] },
    },
  };

  const focusLiftVariants: Variants = {
    idle: { y: 'clamp(3.75rem, 9dvh, 5.25rem)' },
    opening: { y: 'clamp(3.75rem, 9dvh, 5.25rem)' },
    revealed: { y: 'clamp(3.75rem, 9dvh, 5.25rem)' },
    cta: { y: 'clamp(3.75rem, 9dvh, 5.25rem)' },
  };

  const daysToGoVariants: Variants = {
    hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { ...revealEntryEase, delay: 0.05 },
    },
    exit: { opacity: 0, y: -12, scale: 0.94, filter: 'blur(4px)' },
  };

  if (!mounted) return null;

  const letterState =
    phase === 'idle' ||
    phase === 'seal-press' ||
    phase === 'seal-break' ||
    phase === 'flap-open'
      ? 'hidden'
      : phase === 'rising'
        ? 'rising'
        : 'out';

  const envelopeState =
    phase === 'idle'
      ? 'idle'
      : phase === 'seal-press' || phase === 'seal-break' || phase === 'flap-open'
        ? 'press'
        : phase === 'rising'
          ? 'opening'
          : 'open';

  const sealState =
    phase === 'idle' ? 'idle' : phase === 'seal-press' ? 'press' : 'break';

  return (
    <motion.div
      className={`env-invite-screen ${visible ? '' : 'is-hidden'}`}
      data-phase={isExiting ? 'exiting' : phase}
      aria-hidden={!visible}
      initial={
        enterFromLoading && !reduceMotion
          ? { opacity: 0, scale: 1.04, y: 12, filter: 'blur(10px)' }
          : false
      }
      animate={
        isExiting
          ? {
              opacity: 0,
              scale: 1.08,
              y: '-4%',
              filter: 'blur(16px)',
            }
          : {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)',
            }
      }
      transition={
        isExiting ? inviteExitEase : enterFromLoading ? inviteEnterEase : { duration: 0.01 }
      }
      style={{
        pointerEvents: isExiting ? 'none' : undefined,
        transformOrigin: '50% 38%',
      }}
    >
      {!reduceMotion && (
        <div className="env-invite-particles pointer-events-none" aria-hidden="true">
          <InviteParticles count={28} palette={FOREST_PARTICLES} />
        </div>
      )}

      <div className="env-invite-bg-glow pointer-events-none" aria-hidden="true" />

      <div className="env-invite-frame" aria-hidden="true">
        <CornerOrnament className="env-invite-corner env-invite-corner--tl" />
        <CornerOrnament className="env-invite-corner env-invite-corner--tr" />
        <CornerOrnament className="env-invite-corner env-invite-corner--bl" />
        <CornerOrnament className="env-invite-corner env-invite-corner--br" />
      </div>

      <div className="env-invite-deco env-invite-deco--tl pointer-events-none" aria-hidden="true">
        <Image
          src={DECO.tl}
          alt=""
          width={1138}
          height={1172}
          priority
          sizes="(max-width: 768px) 52vw, 280px"
        />
      </div>
      {/* <div className="env-invite-deco env-invite-deco--tr pointer-events-none" aria-hidden="true">
        <Image
          src={DECO.tr}
          alt=""
          width={1283}
          height={1226}
          priority
          sizes="(max-width: 768px) 50vw, 260px"
        />
      </div> */}
      {/* <div className="env-invite-deco env-invite-deco--bl pointer-events-none" aria-hidden="true">
        <Image src={DECO.bl} alt="" width={1115} height={1411} sizes="(max-width: 768px) 50vw, 260px" />
      </div> */}
      <div className="env-invite-deco env-invite-deco--br pointer-events-none" aria-hidden="true">
        <Image src={DECO.br} alt="" width={988} height={1487} sizes="(max-width: 768px) 52vw, 280px" />
      </div>

      <div className="env-invite-ghost-date pointer-events-none select-none" aria-hidden="true">
        <span className="env-invite-ghost-date-part">{weddingDateGhost.month}</span>
        <span className="env-invite-ghost-date-sep" aria-hidden="true" />
        <span className="env-invite-ghost-date-part">{weddingDateGhost.day}</span>
        <span className="env-invite-ghost-date-sep" aria-hidden="true" />
        <span className="env-invite-ghost-date-part">{weddingDateGhost.year}</span>
      </div>

      {isExiting && !reduceMotion && (
        <>
          <motion.div
            className="env-invite-exit-ring"
            aria-hidden="true"
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{ scale: 3.2, opacity: [0, 0.55, 0] }}
            transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1], times: [0, 0.32, 1] }}
          />
          <motion.div
            className="env-invite-exit-bloom"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{ opacity: [0, 0.92, 0.65, 0], scale: [0.35, 1.15, 1.45, 1.65] }}
            transition={{
              duration: 1.55,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.28, 0.62, 1],
              delay: 0.08,
            }}
          />
          <motion.div
            className="env-invite-exit-shimmer"
            aria-hidden="true"
            initial={{ x: '-130%', opacity: 0 }}
            animate={{ x: '130%', opacity: [0, 0.75, 0] }}
            transition={{ duration: 1.15, ease: 'easeInOut', delay: 0.18 }}
          />
          <motion.div
            className="env-invite-exit-curtain env-invite-exit-curtain--left"
            aria-hidden="true"
            initial={{ x: '-105%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.div
            className="env-invite-exit-curtain env-invite-exit-curtain--right"
            aria-hidden="true"
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: [0.65, 0, 0.35, 1] }}
          />
        </>
      )}

      <p className="env-invite-live" aria-live="polite">
        {liveMessage}
      </p>

      <div className="env-invite-stage">
        <div className="env-invite-cluster">
          <motion.div
            className="env-invite-focus"
            variants={focusLiftVariants}
            initial="idle"
            animate={getFocusLiftPhase(phase)}
            transition={reduceMotion ? { duration: 0.01 } : focusLiftEase}
          >
          <motion.div
            className="env-invite-scene"
            animate={
              isExiting
                ? { opacity: 0, scale: 0.9, filter: 'blur(10px)' }
                : { opacity: 1, scale: 1, filter: 'blur(0px)' }
            }
            transition={
              isExiting
                ? { duration: 1.05, delay: 0.62, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.01 }
            }
          >
          <div className="env-invite-ground-shadow" aria-hidden="true" />
          <div className="env-invite-ground-contact" aria-hidden="true" />

          <div className="env-invite-envelope">
            {/* Flap behind body when open — rendered first in paint order */}
            <div className="env-invite-flap-shadow" aria-hidden="true" />
            <motion.div
              className="env-invite-flap"
              variants={flapVariants}
              initial="closed"
              animate={flapIsOpen ? 'open' : 'closed'}
              transition={flapEase}
              style={{ transformOrigin: 'top center' }}
              aria-hidden="true"
            />

            <motion.div
              className="env-invite-envelope-body"
              variants={envelopeVariants}
              initial="idle"
              animate={envelopeState}
              transition={envelopeEase}
            >
              {/* Back panel */}
              <div className="env-invite-back" aria-hidden="true" />

              {/* Interior shadow — only visible once contents rise */}
              <div className="env-invite-interior" aria-hidden="true" />

              {/* Contents — clipped inside pocket */}
              <div className="env-invite-contents-clip" aria-hidden={!contentsVisible}>
              <div className="env-invite-contents">
                <div className="env-invite-emerge-stack">
                  <motion.div
                    className="env-invite-letter"
                    variants={letterVariants}
                    initial="hidden"
                    animate={isExiting ? 'exitPortal' : letterState}
                    transition={
                      isExiting
                        ? { ...letterExitEase, delay: 0.06 }
                        : letterState === 'rising'
                          ? {
                              ...letterEmergenceEase,
                              opacity: { duration: 0 },
                            }
                          : { duration: 0.01 }
                    }
                  >
                    <div className="env-invite-letter-frame" aria-hidden="true" />
                    <div className="env-invite-letter-inner">
                      <span className="env-invite-letter-label">Save the Date</span>
                      <span className="env-invite-letter-date">{letterDateNumeric}</span>
                      <span className="env-invite-letter-invited">You are Invited</span>
                      <div
                        className="env-invite-letter-names"
                        role="img"
                        aria-label={coupleNames}
                      >
                        <Image
                          src={DECO.names}
                          alt={coupleNames}
                          width={1672}
                          height={941}
                          sizes="220px"
                        />
                      </div>
                      <span className="env-invite-letter-verse-title">
                        Two Become One
                      </span>
                      <span className="env-invite-letter-verse">
                        Written By God. Perfected In His Timing.
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* 3. Closed front skin — solid cover, hides when open */}
            <div className="env-invite-front-closed" aria-hidden="true">
              <div className="env-invite-fold env-invite-fold--tl" />
              <div className="env-invite-fold env-invite-fold--bl" />
              <div className="env-invite-fold env-invite-fold--br" />
              <div className="env-invite-fold env-invite-fold--b" />
              <svg
                className="env-invite-creases"
                viewBox="0 0 460 297"
                preserveAspectRatio="none"
              >
                <line x1="0" y1="0" x2="230" y2="172" />
                <line x1="460" y1="0" x2="230" y2="172" />
                <line x1="0" y1="297" x2="230" y2="172" />
                <line x1="460" y1="297" x2="230" y2="172" />
              </svg>
            </div>

            {/* Front pocket — solid panel + side folds, ALWAYS above contents */}
            <div className="env-invite-pocket" aria-hidden="true">
              <div className="env-invite-pocket-front" />
              <div className="env-invite-pocket-left" />
              <div className="env-invite-pocket-right" />
            </div>

            <div className="env-invite-hinge" aria-hidden="true" />
            </motion.div>

            {/* Wax seal — centered on flap junction */}
            <div
              className="env-invite-seal-wrap"
              style={{
                display: sealGone && phase !== 'seal-break' ? 'none' : undefined,
              }}
            >
              <motion.button
                type="button"
                className="env-invite-seal-btn"
                variants={sealVariants}
                initial="idle"
                animate={sealState}
                transition={
                  sealState === 'break'
                    ? { duration: 0.28, ease: 'easeIn' }
                    : { duration: 0.16, ease: 'easeOut' }
                }
                onClick={handleSealClick}
                disabled={phase !== 'idle'}
                aria-label="Break the wax seal to open the invitation"
              >
                <Image
                  src={monogramSrc}
                  alt=""
                  width={1024}
                  height={1536}
                  className="env-invite-seal-img"
                  priority
                  sizes="96px"
                />
              </motion.button>
            </div>

            {phase === 'seal-break' && !reduceMotion && (
              <>
                <motion.span
                  className="env-invite-seal-shard"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: -28, y: -30, opacity: 0, scale: 0.35 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  aria-hidden="true"
                />
                <motion.span
                  className="env-invite-seal-shard"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: 30, y: 18, opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.38, ease: 'easeOut' }}
                  aria-hidden="true"
                />
                <motion.span
                  className="env-invite-seal-shard"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: 14, y: -24, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        </motion.div>

          <p className="env-invite-hint">
            Tap the Seal to Open
          </p>

          {daysToGoLabel && (
            <motion.p
              className="env-invite-days-to-go"
              variants={daysToGoVariants}
              initial="hidden"
              animate={
                isExiting
                  ? 'exit'
                  : phase === 'revealed' || phase === 'cta'
                    ? 'visible'
                    : 'hidden'
              }
              transition={
                isExiting
                  ? { duration: 0.42, ease: [0.4, 0, 1, 1] }
                  : reduceMotion
                    ? { duration: 0.01 }
                    : { ...revealEntryEase, delay: 0.05 }
              }
            >
              {daysToGoLabel}
            </motion.p>
          )}

          </motion.div>
        </div>
      </div>

      <motion.div
        className="env-invite-reveal-copy"
        variants={revealCopyContainerVariants}
        initial="hidden"
        animate={
          isExiting
            ? 'exit'
            : phase === 'revealed' || phase === 'cta'
              ? 'visible'
              : 'hidden'
        }
      >
        <motion.h2 variants={revealCopyItemVariants}>
          We can't wait to celebrate with you!
        </motion.h2>
        <motion.span
          className={`script ${anastasiaScript.className}`}
          variants={revealCopyItemVariants}
        >
          With love, {groomName} & {brideName}
        </motion.span>
      </motion.div>

      <motion.button
        ref={enterBtnRef}
        type="button"
        className="env-invite-enter-btn"
        variants={buttonRevealVariants}
        initial="hidden"
        animate={
          isExiting
            ? 'exit'
            : phase === 'cta'
              ? 'visible'
              : 'hidden'
        }
        whileHover={
          phase === 'cta' && !isExiting && !reduceMotion
            ? { y: -2, x: '-50%', scale: 1.02 }
            : undefined
        }
        whileTap={
          phase === 'cta' && !isExiting && !reduceMotion
            ? { y: 0, x: '-50%', scale: 0.98 }
            : undefined
        }
        onClick={handleEnterInvitation}
        disabled={phase !== 'cta' || isExiting}
      >
        View the Invitation
      </motion.button>
    </motion.div>
  );
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
