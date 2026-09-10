let countdownTimer = null;

document.addEventListener('DOMContentLoaded', () => {
	initMenu();
	initMenuLinks();
	initAnchorScroll();
	initCountdown();
	initMap();
	initGallery();
	initAos();
	initGuestFormFields();
	initGuestSwiper();
	initTimingTabs();
});


// =====================================================
// МЕНЮ
// =====================================================

function initMenu() {

	const menu = document.querySelector('.menu');
	const menuBtn = document.querySelector('.main__btn');
	const closeBtn = document.querySelector('.menu__close');

	if (!menu || !menuBtn) return;

	let isMenuOpen = false;
	let lockedScrollY = 0;
	let isRestoringScroll = false;

	function preventScroll(e) {

		if (!isMenuOpen) return;

		if (menu.contains(e.target)) return;

		e.preventDefault();

	}

	function preventKeyboardScroll(e) {

		if (!isMenuOpen) return;

		if (e.key === 'Escape') {
			closeMenu();
			return;
		}

		if (menu.contains(document.activeElement)) return;

		const scrollKeys = [
			'ArrowUp',
			'ArrowDown',
			'PageUp',
			'PageDown',
			'Home',
			'End',
			' '
		];

		if (scrollKeys.includes(e.key)) {
			e.preventDefault();
		}

	}

	function keepScrollPosition() {

		if (!isMenuOpen || isRestoringScroll) return;

		if (Math.abs(window.scrollY - lockedScrollY) < 1) return;

		isRestoringScroll = true;

		window.scrollTo({
			top: lockedScrollY,
			left: 0,
			behavior: 'auto'
		});

		requestAnimationFrame(() => {
			isRestoringScroll = false;
		});

	}

	function lockScroll() {

		lockedScrollY = window.scrollY;

		window.addEventListener('wheel', preventScroll, {
			passive: false
		});

		window.addEventListener('touchmove', preventScroll, {
			passive: false
		});

		window.addEventListener('scroll', keepScrollPosition, {
			passive: true
		});

		document.addEventListener(
			'keydown',
			preventKeyboardScroll
		);

	}

	function unlockScroll() {

		window.removeEventListener(
			'wheel',
			preventScroll
		);

		window.removeEventListener(
			'touchmove',
			preventScroll
		);

		window.removeEventListener(
			'scroll',
			keepScrollPosition
		);

		document.removeEventListener(
			'keydown',
			preventKeyboardScroll
		);

	}

	function openMenu() {

		if (isMenuOpen) return;

		isMenuOpen = true;

		menu.classList.add('active');
		menuBtn.classList.add('active');

		lockScroll();

	}

	function closeMenu() {

		if (!isMenuOpen) return;

		isMenuOpen = false;

		menu.classList.remove('active');
		menuBtn.classList.remove('active');

		unlockScroll();

	}

	menuBtn.addEventListener('click', e => {

		e.preventDefault();

		if (isMenuOpen) {
			closeMenu();
		} else {
			openMenu();
		}

	});

	if (closeBtn) {

		closeBtn.addEventListener('click', e => {

			e.preventDefault();

			closeMenu();

		});

	}

	window.openMenu = openMenu;
	window.closeMenu = closeMenu;

}


// =====================================================
// ССЫЛКИ В МЕНЮ
// =====================================================

function initMenuLinks() {

	const links = document.querySelectorAll(
		'.menu a.go_to'
	);

	if (!links.length) return;

	links.forEach(link => {

		link.addEventListener('click', () => {

			if (window.closeMenu) {
				window.closeMenu();
			}

		});

	});

}


// =====================================================
// ПЛАВНЫЙ СКРОЛЛ
// =====================================================

function initAnchorScroll() {

	document.querySelectorAll('.go_to').forEach(link => {

		link.addEventListener('click', e => {

			if (
				link.classList.contains('timing__map-link')
			) {
				return;
			}

			const href = link.getAttribute('href');

			if (
				!href ||
				!href.startsWith('#') ||
				href === '#'
			) {
				return;
			}

			const target = document.querySelector(href);

			if (!target) return;

			e.preventDefault();

			if (window.closeMenu) {
				window.closeMenu();
			}

			requestAnimationFrame(() => {

				const targetPosition =
					target.getBoundingClientRect().top +
					window.pageYOffset -
					100;

				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});

			});

		});

	});

}


// =====================================================
// ТАЙМЕР
// =====================================================

function initCountdown() {

	const days = document.getElementById('days');
	const hours = document.getElementById('hours');
	const minutes = document.getElementById('minutes');
	const seconds = document.getElementById('seconds');

	if (!days || !hours || !minutes || !seconds) return;

	const targetDate =
		new Date('2026-10-19T00:00:00').getTime();

	function updateTimer() {

		const distance =
			targetDate - Date.now();

		if (distance <= 0) {

			days.textContent = '00';
			hours.textContent = '00';
			minutes.textContent = '00';
			seconds.textContent = '00';

			destroyCountdown();

			return;

		}

		const d = Math.floor(
			distance /
			(1000 * 60 * 60 * 24)
		);

		const h = Math.floor(
			(
				distance %
				(1000 * 60 * 60 * 24)
			) /
			(1000 * 60 * 60)
		);

		const m = Math.floor(
			(
				distance %
				(1000 * 60 * 60)
			) /
			(1000 * 60)
		);

		const s = Math.floor(
			(
				distance %
				(1000 * 60)
			) /
			1000
		);

		days.textContent =
			String(d).padStart(2, '0');

		hours.textContent =
			String(h).padStart(2, '0');

		minutes.textContent =
			String(m).padStart(2, '0');

		seconds.textContent =
			String(s).padStart(2, '0');

	}

	updateTimer();

	destroyCountdown();

	countdownTimer = setInterval(
		updateTimer,
		1000
	);

}


function destroyCountdown() {

	if (countdownTimer !== null) {

		clearInterval(countdownTimer);

		countdownTimer = null;

	}

}


// =====================================================
// GUEST SWIPER
// =====================================================

function initGuestSwiper() {

	const swiperElement =
		document.querySelector(
			'.guest-select-swiper'
		);

	if (!swiperElement) return;

	if (typeof Swiper === 'undefined') {

		console.warn(
			'Swiper не подключен'
		);

		return;

	}

	const forms =
		document.querySelectorAll(
			'.guest__content'
		);

	const slides =
		swiperElement.querySelectorAll(
			'.guest-select-swiper__slide'
		);

	const nextButton =
		document.querySelector(
			'.guest-select-swiper__next'
		);

	const prevButton =
		document.querySelector(
			'.guest-select-swiper__prev'
		);

	if (!forms.length || !slides.length) return;

	function setActiveGuest(index) {

		forms.forEach(
			(form, formIndex) => {

				form.classList.toggle(
					'active',
					formIndex === index
				);

			}
		);

		slides.forEach(
			(slide, slideIndex) => {

				slide.classList.toggle(
					'active',
					slideIndex === index
				);

			}
		);

	}

	const guestSwiper =
		new Swiper(swiperElement, {

			slidesPerView: 'auto',
			spaceBetween: 4,
			speed: 500,
			allowTouchMove: true,
			watchOverflow: true,
			freeMode: true,

			on: {

				init() {

					setActiveGuest(0);

					requestAnimationFrame(
						() => {
							updateArrows();
						}
					);

				},

				setTranslate() {
					updateArrows();
				},

				resize() {
					updateArrows();
				},

				update() {
					updateArrows();
				}

			}

		});

	slides.forEach((slide, index) => {

		slide.addEventListener(
			'click',
			() => {

				setActiveGuest(index);

			}
		);

	});

	function getScrollStep() {

		return Math.max(
			swiperElement.clientWidth * 0.8,
			120
		);

	}

	function moveSlider(direction) {

		const current =
			guestSwiper.getTranslate();

		const min =
			guestSwiper.minTranslate();

		const max =
			guestSwiper.maxTranslate();

		const step =
			getScrollStep();

		let target =
			current +
			direction * step;

		if (target > min) {
			target = min;
		}

		if (target < max) {
			target = max;
		}

		guestSwiper.translateTo(
			target,
			500,
			true,
			true
		);

		setTimeout(() => {
			updateArrows();
		}, 520);

	}

	if (nextButton) {

		nextButton.addEventListener(
			'click',
			e => {

				e.preventDefault();

				moveSlider(-1);

			}
		);

	}

	if (prevButton) {

		prevButton.addEventListener(
			'click',
			e => {

				e.preventDefault();

				moveSlider(1);

			}
		);

	}

	function updateArrows() {

		if (
			!guestSwiper ||
			guestSwiper.destroyed
		) {
			return;
		}

		const current =
			guestSwiper.getTranslate();

		const min =
			guestSwiper.minTranslate();

		const max =
			guestSwiper.maxTranslate();

		const tolerance = 1;

		const isBeginning =
			current >=
			min - tolerance;

		const isEnd =
			current <=
			max + tolerance;

		const noOverflow =
			Math.abs(min - max) <=
			tolerance;

		if (prevButton) {

			const disabled =
				isBeginning ||
				noOverflow;

			prevButton.classList.toggle(
				'disabled',
				disabled
			);

			prevButton.disabled =
				disabled;

		}

		if (nextButton) {

			const disabled =
				isEnd ||
				noOverflow;

			nextButton.classList.toggle(
				'disabled',
				disabled
			);

			nextButton.disabled =
				disabled;

		}

	}

	window.addEventListener(
		'resize',
		() => {

			guestSwiper.update();

			updateArrows();

		}
	);

}


// =====================================================
// GUEST FORM FIELDS
// =====================================================

function initGuestFormFields() {

	const forms =
		document.querySelectorAll(
			'.guest__content'
		);

	if (!forms.length) return;

	forms.forEach(
		(form, guestIndex) => {

			const guestNumber =
				guestIndex + 1;

			form
				.querySelectorAll(
					'input[type="text"]'
				)
				.forEach(
					(input, index) => {

						const field =
							input.dataset.field ||
							'name';

						input.name =
							`guest-${guestNumber}-${field}`;

						if (!input.id) {

							input.id =
								`guest-${guestNumber}-${field}-${index + 1}`;

						}

					}
				);

			form
				.querySelectorAll(
					'textarea'
				)
				.forEach(
					(textarea, index) => {

						const field =
							textarea.dataset.field;

						if (!field) return;

						textarea.name =
							`guest-${guestNumber}-${field}`;

						if (!textarea.id) {

							textarea.id =
								`guest-${guestNumber}-${field}-${index + 1}`;

						}

					}
				);

			form
				.querySelectorAll(
					'input[type="radio"]'
				)
				.forEach(
					(input, index) => {

						const field =
							input.dataset.field;

						if (!field) return;

						input.name =
							`guest-${guestNumber}-${field}`;

						if (
							!input.value ||
							input.value === 'on'
						) {

							input.value =
								input.dataset.value ||
								`option-${index + 1}`;

						}

						if (!input.id) {

							const safeValue =
								input.value
									.toString()
									.toLowerCase()
									.replace(
										/\s+/g,
										'-'
									)
									.replace(
										/[^a-z0-9а-яё_-]/gi,
										''
									);

							input.id =
								`guest-${guestNumber}-${field}-${safeValue}`;

						}

						const label =
							input.closest('label');

						if (label) {

							label.setAttribute(
								'for',
								input.id
							);

						}

					}
				);

			form
				.querySelectorAll(
					'input[type="checkbox"]'
				)
				.forEach(
					(input, index) => {

						const field =
							input.dataset.field;

						if (!field) return;

						if (
							input.dataset.multiple ===
							'true'
						) {

							input.name =
								`guest-${guestNumber}-${field}[]`;

						} else {

							input.name =
								`guest-${guestNumber}-${field}`;

						}

						if (
							!input.value ||
							input.value === 'on'
						) {

							input.value =
								input.dataset.value ||
								`option-${index + 1}`;

						}

						if (!input.id) {

							const safeValue =
								input.value
									.toString()
									.toLowerCase()
									.replace(
										/\s+/g,
										'-'
									)
									.replace(
										/[^a-z0-9а-яё_-]/gi,
										''
									);

							input.id =
								`guest-${guestNumber}-${field}-${safeValue}`;

						}

						const label =
							input.closest('label');

						if (label) {

							label.setAttribute(
								'for',
								input.id
							);

						}

					}
				);

		}
	);

}


// =====================================================
// MAP
// =====================================================

async function initMap() {

	const section =
		document.querySelector('.map');

	if (!section) return;

	const mapElement =
		section.querySelector(
			'#map-canvas'
		);

	const buttons = [
		...section.querySelectorAll(
			'.map__tab'
		)
	];

	const infos = [
		...section.querySelectorAll(
			'.map__info'
		)
	];

	if (
		!mapElement ||
		!buttons.length ||
		!infos.length
	) {
		return;
	}

	if (typeof ymaps3 === 'undefined') {

		console.warn(
			'Yandex Maps JS API v3 не подключён'
		);

		return;

	}

	await ymaps3.ready;

	const {
		YMap,
		YMapDefaultSchemeLayer,
		YMapDefaultFeaturesLayer,
		YMapMarker
	} = ymaps3;

	const locations =
		infos.map(
			(info, index) => ({
				index,
				coordinates: [
					Number(info.dataset.lng),
					Number(info.dataset.lat)
				],
				content: info.innerHTML
			})
		);

	const map = new YMap(
		mapElement,
		{
			location: {
				center:
					locations[0]
						.coordinates,
				zoom: 15
			},
			behaviors: [
				'drag',
				'pinchZoom'
			]
		}
	);

	map.addChild(
		new YMapDefaultSchemeLayer({})
	);

	map.addChild(
		new YMapDefaultFeaturesLayer({})
	);

	const markers = [];

	locations.forEach(
		(location, index) => {

			const markerElement =
				document.createElement(
					'div'
				);

			markerElement.className =
				'map-marker';

			if (index === 0) {

				markerElement.classList.add(
					'active'
				);

			}

			markerElement.innerHTML = `
				<button class="map-marker__icon" type="button">
					<img src="${index === 0 ? 'img/heart-active.svg' : 'img/heart.svg'}" alt="">
				</button>

				<div class="map-marker__info">
					${location.content}
				</div>
			`;

			const marker =
				new YMapMarker(
					{
						coordinates:
							location.coordinates
					},
					markerElement
				);

			const markerButton =
				markerElement.querySelector(
					'.map-marker__icon'
				);

			markerButton.addEventListener(
				'click',
				() => {

					setActiveLocation(
						index
					);

				}
			);

			map.addChild(marker);

			markers.push({
				marker,
				element:
					markerElement
			});

		}
	);

	function setActiveLocation(index) {

		const location =
			locations[index];

		if (!location) return;

		buttons.forEach(
			(button, buttonIndex) => {

				button.classList.toggle(
					'active',
					buttonIndex === index
				);

			}
		);

		markers.forEach(
			(
				markerData,
				markerIndex
			) => {

				const active =
					markerIndex === index;

				markerData.element
					.classList.toggle(
						'active',
						active
					);

				const image =
					markerData.element
						.querySelector(
							'img'
						);

				if (image) {

					image.src =
						active
							? 'img/heart-active.svg'
							: 'img/heart.svg';

				}

			}
		);

		map.setLocation({
			center:
				location.coordinates,
			zoom: 15,
			duration: 500
		});

	}

	buttons.forEach(
		(button, index) => {

			button.addEventListener(
				'click',
				() => {

					setActiveLocation(
						index
					);

				}
			);

		}
	);

	const timingLinks =
		document.querySelectorAll(
			'.timing__map-link[data-location]'
		);

	timingLinks.forEach(link => {

		link.addEventListener(
			'click',
			e => {

				e.preventDefault();

				const index =
					Number(
						link.dataset.location
					);

				if (!locations[index]) {
					return;
				}

				setActiveLocation(index);

				const scrollTop =
					section
						.getBoundingClientRect()
						.top +
					window.pageYOffset -
					100;

				window.scrollTo({
					top: scrollTop,
					behavior: 'smooth'
				});

			}
		);

	});

	setActiveLocation(0);

}


// =====================================================
// GALLERY
// =====================================================

function initGallery() {

	const slider =
		document.querySelector(
			'.swiper-gallery'
		);

	if (!slider) return;

	if (typeof Swiper === 'undefined') {

		console.warn(
			'Swiper не подключен'
		);

		return;

	}

	new Swiper(slider, {

		slidesPerView: 1,
		spaceBetween: 0,
		speed: 700,

		navigation: {

			nextEl:
				'.swiper-button-next',

			prevEl:
				'.swiper-button-prev'

		},

		breakpoints: {

			320: {

				spaceBetween: 0,
				slidesPerView: 1

			},

			568: {

				slidesPerView: 1,
				spaceBetween: 0

			},

			768: {

				slidesPerView: 1

			},

			1200: {

				slidesPerView: 1

			}

		}

	});

	if (
		typeof GLightbox !==
		'undefined'
	) {

		GLightbox({

			selector: '.glightbox',
			touchNavigation: true,
			loop: true,
			openEffect: 'zoom',
			closeEffect: 'fade'

		});

	}

}


// =====================================================
// AOS
// =====================================================

function initAos() {

	if (
		typeof AOS ===
		'undefined'
	) {
		return;
	}

	AOS.init({

		duration: 900,
		once: true,
		offset: 80

	});

}


// =====================================================
// TIMING TABS
// =====================================================

function initTimingTabs() {

	const tabs =
		document.querySelectorAll(
			'.timing__tabs button'
		);

	const areas =
		document.querySelectorAll(
			'.timing__area'
		);

	if (
		!tabs.length ||
		!areas.length
	) {
		return;
	}

	tabs.forEach(
		(tab, index) => {

			tab.addEventListener(
				'click',
				() => {

					tabs.forEach(
						item => {

							item.classList.remove(
								'active'
							);

						}
					);

					areas.forEach(
						area => {

							area.classList.remove(
								'active'
							);

						}
					);

					tab.classList.add(
						'active'
					);

					if (areas[index]) {

						areas[index]
							.classList.add(
								'active'
							);

					}

				}
			);

		}
	);

}