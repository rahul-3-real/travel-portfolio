// Variables
let controller;
let slideScene;
let pageScene;
let detailScene;
const mouse = document.querySelector(".cursor");
const mouseText = mouse.querySelector(".cursor-text");
const burger = document.querySelector(".burger");

// Functions
const animateSlides = () => {
  controller = new ScrollMagic.Controller();

  const sliders = document.querySelectorAll(".slide");
  const header = document.querySelector(".header");

  sliders.forEach((slide, index, slides) => {
    const image = slide.querySelector("img");
    const revealImg = slide.querySelector(".reveal-img");
    const revealTxt = slide.querySelector(".reveal-text");

    // GSAP
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slideTl.fromTo(header, { y: "-100%" }, { y: "0%" }, "+=1");
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" }, "-=0.5");
    slideTl.fromTo(image, { scale: 2 }, { scale: 1 }, "-=1");
    slideTl.fromTo(revealTxt, { x: "0%" }, { x: "100%" });

    // SCENE
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      .addTo(controller);

    // New Animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");

    // New Scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
};

const detailAnimation = () => {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector(".detail-image");
    slideTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });

    detailSecne = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addTo(controller);
  });
};

const pageTransition = () => {
  barba.init({
    views: [
      {
        namespace: "index",
        beforeEnter() {
          animateSlides();
        },
        beforeLeave() {
          slideScene.destroy();
          pageScene.destroy();
          controller.destroy();
        },
      },
      {
        namespace: "fashion",
        beforeEnter() {
          detailAnimation();
        },
        beforeLeave() {
          controller.destroy();
          detailScene.destroy();
        },
      },
      {
        namespace: "forest",
        beforeEnter() {
          detailAnimation();
        },
        beforeLeave() {
          controller.destroy();
          detailScene.destroy();
        },
      },
      {
        namespace: "hike",
        beforeEnter() {
          detailAnimation();
        },
        beforeLeave() {
          controller.destroy();
          detailScene.destroy();
        },
      },
    ],
    transitions: [
      {
        leave({ current, next }) {
          let done = this.async();
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
          tl.fromTo(
            ".swipe",
            0.75,
            { x: "-100%" },
            { x: "0%", onComplete: done },
            "-=0.5"
          );
        },
        enter({ current, next }) {
          let done = this.async();
          window.scrollTo(0, 0);
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          tl.fromTo(
            ".swipe",
            0.75,
            { x: "0%" },
            { x: "100%", stagger: 0.25, onComplete: done }
          );
          tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
          tl.fromTo(
            ".header",
            1,
            { y: "-100%" },
            { y: "0%", ease: "power2.inOut" },
            "-=1.5"
          );
        },
      },
    ],
  });
};

const cursor = (e) => {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
};

const activeCursor = (e) => {
  const item = e.target;
  if (item.classList.contains("logo") || item.classList.contains("burger")) {
    mouse.classList.add("active-nav-cursor");
  } else {
    mouse.classList.remove("active-nav-cursor");
  }

  if (item.classList.contains("explore")) {
    mouse.classList.add("active-btn-cursor");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseText.innerHTML = `<i class="fal fa-long-arrow-right"></i>`;
  } else {
    mouse.classList.remove("active-btn-cursor");
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouseText.innerHTML = "";
  }
};

const toggleNav = (e) => {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".burger .line-1", 0.5, {
      rotate: "45",
      y: 5,
      background: "#17181a",
    });
    gsap.to(".burger .line-2", 0.5, {
      rotate: "-45",
      y: -5,
      background: "#17181a",
    });
    gsap.to(".logo", 0.5, { color: "#17181a" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    gsap.to(".cursor", 0.5, { borderColor: "transparent" });
    document.body.classList.add("overflow-hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".burger .line-1", 0.5, {
      rotate: "0",
      y: 0,
      background: "#ffffff",
    });
    gsap.to(".burger .line-2", 0.5, {
      rotate: "0",
      y: 0,
      background: "#ffffff",
    });
    gsap.to(".logo", 0.5, { color: "#ffffff" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    gsap.to(".cursor", 0.5, { borderColor: "#ffffff" });
    document.body.classList.remove("overflow-hide");
  }
};

// Events
pageTransition();
burger.addEventListener("click", toggleNav);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
