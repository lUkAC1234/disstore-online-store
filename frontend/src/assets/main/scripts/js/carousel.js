document.addEventListener("DOMContentLoaded", () => {
    var $bottomSlide = null; // Slide whose content gets 'extracted' and placed
    var $bottomSlideContent = null;

    function initializeSwiper(swiperClass, navigationButtons, paginationElement, breakpoints) {
        return new Swiper(swiperClass, {
            slidesPerView: 4,
            grabCursor: true,
            loop: true,
            roundLengths: true,
            navigation: {
                nextEl: navigationButtons.next,
                prevEl: navigationButtons.prev,
            },
            pagination: {
                el: paginationElement,
                clickable: true,
            },
            breakpoints: breakpoints,
        });
    }

    const commonBreakpoints = {
        0: {
            slidesPerView: 1,
            spaceBetween: 10,
        },

        500: {
            slidesPerView: 1.5,
            spaceBetween: 10,
        },
        600: {
            slidesPerView: 2,
            spaceBetween: 15,
        },
        900: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1300: {
            slidesPerView: 4,
            spaceBetween: 25,
        }
    };

    const mySwipernewclothes = initializeSwiper(
        ".mySwiper-new-clothes",
        { next: ".loop-button-new-clothes-next", prev: ".loop-button-new-clothes-prev" },
        ".swiper-pagination",
        commonBreakpoints
    );

    const mySwipertopselling = initializeSwiper(
        ".mySwiper-top-selling",
        { next: ".loop-button-top-selling-next", prev: ".loop-button-top-selling-prev" },
        ".swiper-pagination",
        commonBreakpoints
    );

    // FEEDBACKS SLIDER
    const mySwiperfeedbacks = new Swiper('.mySwiper-feedbacks', {
        slidesPerView: 5,
        initialSlide: 0,
        grabCursor: true,
        loop: true,
        roundLengths: true,
        speed: 600,
        navigation: {
            nextEl: '.loop-button-feedbacks-next',
            prevEl: '.loop-button-feedbacks-prev',
        },
    
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 10,
            },

            480: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            800: {
                slidesPerView: 3,
                spaceBetween: 15,
            },
            1300: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
            2000: {
                slidesPerView: 5,
                spaceBetween: 25,
            },
        },
    });
});
