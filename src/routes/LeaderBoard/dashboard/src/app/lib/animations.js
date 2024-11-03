import gsap from "gsap"

export const animatePageIn = () => {
  const overlay = document.getElementById("horizontal-overlay")

  if (overlay) {
    const tl = gsap.timeline()

    tl.set(overlay, {
      xPercent: -100,
      opacity: 1,
    }).to(overlay, {
      xPercent: 0,
      duration: 1.2,
      ease: "power4.out",
    }).to(overlay, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(overlay, { xPercent: 100 })
      },
    })
  }
}

export const animatePageOut = (prevPathname, onComplete) => {
  const overlay = document.getElementById("horizontal-overlay")

  if (overlay) {
    const tl = gsap.timeline()

    tl.set(overlay, {
      xPercent: 100,
      opacity: 1,
    }).to(overlay, {
      xPercent: 0,
      duration: 1.2,
      ease: "power4.in",
    }).to(overlay, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        if (onComplete) onComplete()
      },
    })
  }
}
