'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Cormorant_Garamond } from 'next/font/google';
import { useSiteConfig } from '@/hooks/use-site-config';
import './loading-screen.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

interface LoadingScreenProps {
  onComplete: () => void;
  onFadeStart?: () => void;
}

const TOTAL_DURATION_MS = 9000;
const MESSAGE_HOLD_MS = TOTAL_DURATION_MS / 4;
const FADE_OUT_MS = 950;
const entryEase = [0.22, 1, 0.36, 1] as const;
const rollerEase = [0.16, 1, 0.3, 1] as const;
const ROLLER_TRANSITION_MS = 720;
const STATUS_LINE_HEIGHT_REM = 1.65;

const LOADING_MESSAGES = [
  'Preparing your invitation',
  'Gathering your memories',
  'Sealing with care',
  'Your invitation awaits',
] as const;

const DECO = {
  tl: '/decoration/left-top-decoration.png',
  // tr: '/decoration/right-top-decoration.png',
  // bl: '/decoration/left-bottom-decoration.png',
  br: '/decoration/right-bottom-decoration.png',
  monogram: '/monogram/monog.png',
  names: '/decoration/couple.png',
} as const;

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

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  onFadeStart,
}) => {
  const reduceMotion = useReducedMotion();
  const siteConfig = useSiteConfig();
  const ceremonyDate = siteConfig.ceremony.date ?? siteConfig.wedding.date;
  const ceremonyDay = siteConfig.ceremony.day;
  const ceremonyTime = siteConfig.ceremony.time ?? siteConfig.wedding.time;
  const ceremonyLocation =
    siteConfig.ceremony.location && siteConfig.ceremony.location !== 'TBA'
      ? siteConfig.ceremony.location
      : siteConfig.ceremony.venue && siteConfig.ceremony.venue !== 'TBA'
        ? siteConfig.ceremony.venue
        : siteConfig.wedding.venue;
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100));
    }, 40);

    const messageInterval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % LOADING_MESSAGES.length);
    }, MESSAGE_HOLD_MS);

    const completeTimer = setTimeout(() => {
      setProgress(100);
      onFadeStart?.();
      setFadeOut(true);
      setTimeout(onComplete, FADE_OUT_MS);
    }, TOTAL_DURATION_MS);

    return () => {
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete, onFadeStart]);

  const textDelay = reduceMotion ? 0 : 0.4;

  return (
    <motion.div
      className={`loading-screen fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-none h-dvh max-h-dvh w-screen ${cormorant.className}`}
      aria-live="polite"
      aria-busy={!fadeOut}
      aria-label="Loading invitation"
      initial={false}
      animate={
        fadeOut
          ? {
              opacity: 0,
              scale: reduceMotion ? 1 : 1.012,
              filter: reduceMotion ? 'blur(0px)' : 'blur(6px)',
            }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{
        duration: reduceMotion ? 0.2 : FADE_OUT_MS / 1000,
        ease: entryEase,
      }}
      style={{ pointerEvents: fadeOut ? 'none' : 'auto' }}
    >
      <motion.article
        className="loading-screen__card"
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.05, ease: entryEase }}
      >
        <div className="loading-screen__washes" aria-hidden="true" />

        <motion.div
          className="loading-screen__deco loading-screen__deco--tl"
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, x: -16, y: -16 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.1, ease: entryEase, delay: reduceMotion ? 0 : 0.1 }}
        >
          <Image
            src={DECO.tl}
            alt=""
            width={1138}
            height={1172}
            priority
            sizes="(max-width: 768px) 52vw, 280px"
          />
        </motion.div>
        {/* <motion.div
          className="loading-screen__deco loading-screen__deco--tr"
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, x: 16, y: -16 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.1, ease: entryEase, delay: reduceMotion ? 0 : 0.16 }}
        >
          <Image
            src={DECO.tr}
            alt=""
            width={1283}
            height={1226}
            priority
            sizes="(max-width: 768px) 50vw, 260px"
          />
        </motion.div> */}
        {/* <motion.div
          className="loading-screen__deco loading-screen__deco--bl"
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, x: -16, y: 16 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.1, ease: entryEase, delay: reduceMotion ? 0 : 0.22 }}
        >
          <Image
            src={DECO.bl}
            alt=""
            width={1115}
            height={1411}
            sizes="(max-width: 768px) 50vw, 260px"
          />
        </motion.div> */}
        <motion.div
          className="loading-screen__deco loading-screen__deco--br"
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, x: 16, y: 16 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.1, ease: entryEase, delay: reduceMotion ? 0 : 0.28 }}
        >
          <Image
            src={DECO.br}
            alt=""
            width={988}
            height={1487}
            sizes="(max-width: 768px) 52vw, 280px"
          />
        </motion.div>

        <div className="loading-screen__frame" aria-hidden="true">
          <CornerOrnament className="loading-screen__corner loading-screen__corner--tl" />
          <CornerOrnament className="loading-screen__corner loading-screen__corner--tr" />
          <CornerOrnament className="loading-screen__corner loading-screen__corner--bl" />
          <CornerOrnament className="loading-screen__corner loading-screen__corner--br" />
        </div>

        <motion.div
          className="loading-screen__monogram"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: entryEase, delay: textDelay }}
        >
          <Image
            src={DECO.monogram}
            alt="Jennifer and Siddhesh monogram"
            width={289}
            height={382}
            priority
            sizes="(max-width: 768px) 32vw, 140px"
          />
        </motion.div>

        <div className="loading-screen__panel">
          <motion.p
            className="loading-screen__eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: entryEase, delay: textDelay + 0.08 }}
          >
            Together with their families
            <br />
            we joyfully invite you to
            <br />
            celebrate the wedding of
          </motion.p>

          <motion.div
            className="loading-screen__names"
            role="img"
            aria-label="Siddhesh and Jennifer"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: entryEase, delay: textDelay + 0.16 }}
          >
            <Image
              src={DECO.names}
              alt="Siddhesh and Jennifer"
              width={1536}
              height={1024}
              priority
              sizes="(max-width: 768px) 68vw, 320px"
            />
          </motion.div>

          <motion.div
            className="loading-screen__details"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: entryEase, delay: textDelay + 0.22 }}
          >
            {(ceremonyDay || ceremonyDate) && (
              <p className="loading-screen__date">
                {[ceremonyDay, ceremonyDate].filter(Boolean).join(' · ')}
              </p>
            )}
            {ceremonyTime ? (
              <p className="loading-screen__time">{ceremonyTime}</p>
            ) : null}
            {ceremonyLocation ? (
              <p className="loading-screen__location">{ceremonyLocation}</p>
            ) : null}
          </motion.div>

          <motion.p
            className="loading-screen__journey"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: entryEase, delay: textDelay + 0.3 }}
          >
            As they begin their journey together
            <br />
            before <strong>our Lord.</strong>
          </motion.p>

          <motion.p
            className="loading-screen__closing"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: entryEase, delay: textDelay + 0.42 }}
          >
            We can&apos;t wait to celebrate this special day with you!
          </motion.p>

          <div className="loading-screen__footer">
            <motion.div
              className="loading-screen__status"
              aria-live="polite"
              aria-atomic="true"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: entryEase, delay: textDelay + 0.58 }}
            >
              <motion.div
                className="loading-screen__status-roller"
                animate={{ y: `-${messageIndex * STATUS_LINE_HEIGHT_REM}rem` }}
                transition={
                  reduceMotion
                    ? { duration: 0.01 }
                    : { duration: ROLLER_TRANSITION_MS / 1000, ease: rollerEase }
                }
              >
                {LOADING_MESSAGES.map((message) => (
                  <p key={message} className="loading-screen__status-line">
                    {message}
                  </p>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="loading-screen__track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              aria-label="Loading progress"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, ease: entryEase, delay: textDelay + 0.62 }}
            >
              <div
                className="loading-screen__bar"
                style={{ width: `${progress}%` }}
              />
            </motion.div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
};
