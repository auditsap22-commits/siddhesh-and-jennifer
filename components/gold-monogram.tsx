const GOLD_TEXTURE = "/decoration/gold.png"

export function GoldMonogram({
  src,
  alt,
  className = "",
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div
      className={className}
      role="img"
      aria-label={alt}
      style={{
        backgroundImage: `url("${GOLD_TEXTURE}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        WebkitMaskImage: `url("${encodeURI(src)}")`,
        maskImage: `url("${encodeURI(src)}")`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  )
}
