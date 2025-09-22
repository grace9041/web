// ===== Global Variables =====
let currentSlide = 0;
let isScrolling = false;
let mobileMenuOpen = false;

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function getElementOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
}

function isElementInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold &&
        rect.left <= windowWidth * (1 - threshold) &&
        rect.right >= windowWidth * threshold
    );
}

// ===== Navigation Functions =====
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenuOpen) {
                    toggleMobileMenu();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenuOpen && !navMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
                toggleMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenuOpen = !mobileMenuOpen;
        mobileMenu.classList.toggle('is-active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    }
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                scrollToSection(targetId.substring(1));
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = getElementOffset(section).top - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = getElementOffset(section).top - navbarHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    }, 10));
}

// ===== About Section - Story Slider =====
function initStorySlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Auto-advance slides
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Calculate new slide index
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function currentSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Set new current slide
    currentSlide = n - 1;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// ===== Products Section =====
function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Product Modal Functions
function openProductModal(productId) {
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;
    
    // Product data
    const productData = {
        'still-500ml': {
            title: 'AquaPure 생수 500ml',
            image: 'assets/images/product-still-500ml.jpg',
            description: '일상에서 언제든 즐길 수 있는 순수한 생수입니다.',
            features: [
                'pH 7.4의 약알칼리성',
                '천연 미네랄 120mg/L 함유',
                '휴대용 500ml 용량',
                '100% 재활용 가능 패키징'
            ],
            minerals: {
                calcium: '32mg/L',
                magnesium: '8mg/L',
                sodium: '12mg/L',
                potassium: '4mg/L'
            },
            usage: '운동, 업무, 일상 수분 보충에 적합'
        },
        'still-1l': {
            title: 'AquaPure 생수 1L',
            image: 'assets/images/product-still-1l.jpg',
            description: '가정에서 편리하게 사용할 수 있는 대용량 생수입니다.',
            features: [
                'pH 7.4의 약알칼리성',
                '천연 미네랄 120mg/L 함유',
                '가정용 1L 대용량',
                '경제적인 선택'
            ],
            minerals: {
                calcium: '32mg/L',
                magnesium: '8mg/L',
                sodium: '12mg/L',
                potassium: '4mg/L'
            },
            usage: '가정, 사무실에서의 대용량 수분 공급'
        },
        'sparkling-330ml': {
            title: 'AquaPure 스파클링 330ml',
            image: 'assets/images/product-sparkling-330ml.jpg',
            description: '식사와 함께 즐기는 우아한 스파클링 워터입니다.',
            features: [
                '천연 탄산 함유',
                '미세한 기포감',
                '식사와 완벽한 조화',
                '프리미엄 유리병 포장'
            ],
            minerals: {
                calcium: '35mg/L',
                magnesium: '10mg/L',
                sodium: '15mg/L',
                bicarbonate: '180mg/L'
            },
            usage: '식사, 파티, 특별한 순간에 적합'
        },
        'lemon-500ml': {
            title: 'AquaPure 레몬 500ml',
            image: 'assets/images/product-lemon-500ml.jpg',
            description: '상쾌한 레몬 향이 더해진 활력 충전 워터입니다.',
            features: [
                '천연 레몬 추출물',
                '무설탕, 무칼로리',
                '상쾌한 향과 맛',
                '운동 후 최적'
            ],
            minerals: {
                calcium: '30mg/L',
                magnesium: '7mg/L',
                sodium: '10mg/L',
                vitamin_c: '20mg/L'
            },
            usage: '운동, 피로 회복, 리프레시에 적합'
        },
        'glass-750ml': {
            title: 'AquaPure 프리미엄 750ml',
            image: 'assets/images/product-glass-750ml.jpg',
            description: '특별한 순간을 위한 프리미엄 유리병 워터입니다.',
            features: [
                '최고급 유리병 패키징',
                '프리미엄 미네랄 함량',
                '선물용으로 완벽',
                '특별한 순간을 위한 선택'
            ],
            minerals: {
                calcium: '40mg/L',
                magnesium: '12mg/L',
                sodium: '8mg/L',
                potassium: '6mg/L'
            },
            usage: '선물, 특별한 식사, 프리미엄 다이닝'
        },
        'sparkling-750ml': {
            title: 'AquaPure 스파클링 프리미엄 750ml',
            image: 'assets/images/product-sparkling-750ml.jpg',
            description: '특별한 축하의 순간을 위한 프리미엄 스파클링입니다.',
            features: [
                '한정판 프리미엄 에디션',
                '세밀한 천연 탄산',
                '럭셔리 패키징',
                '특별한 순간을 위한 완벽한 선택'
            ],
            minerals: {
                calcium: '42mg/L',
                magnesium: '14mg/L',
                sodium: '18mg/L',
                bicarbonate: '220mg/L'
            },
            usage: '축하 파티, 기념일, 프리미엄 이벤트'
        }
    };
    
    const product = productData[productId];
    if (!product) return;
    
    modalBody.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-modal-info">
                <h2>${product.title}</h2>
                <p class="product-modal-desc">${product.description}</p>
                
                <div class="product-modal-features">
                    <h3>주요 특징</h3>
                    <ul>
                        ${product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="product-modal-minerals">
                    <h3>미네랄 성분</h3>
                    <div class="minerals-grid">
                        ${Object.entries(product.minerals).map(([key, value]) => `
                            <div class="mineral-item">
                                <span class="mineral-name">${key.replace('_', ' ').toUpperCase()}</span>
                                <span class="mineral-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="product-modal-usage">
                    <h3>추천 사용</h3>
                    <p>${product.usage}</p>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ===== Source & Quality Section =====
function initCountAnimation() {
    const counters = document.querySelectorAll('.data-value, .stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, duration / steps);
    };
    
    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function startCountAnimation() {
    // This function is called when the page loads
    // The actual animation is triggered by intersection observer
}

function toggleCertInfo(certId) {
    const certInfo = document.getElementById(`cert-${certId}`);
    const allCertInfos = document.querySelectorAll('.cert-info');
    
    // Close all other cert infos
    allCertInfos.forEach(info => {
        if (info.id !== `cert-${certId}`) {
            info.classList.remove('active');
        }
    });
    
    // Toggle current cert info
    if (certInfo) {
        certInfo.classList.toggle('active');
    }
}

// ===== Experience Section =====
function showTipDetail(tipType) {
    const modal = document.getElementById('tip-modal');
    const modalBody = document.getElementById('tip-modal-body');
    
    if (!modal || !modalBody) return;
    
    const tipData = {
        cocktail: {
            title: '프리미엄 칵테일 레시피',
            content: `
                <h3>AquaPure 스파클링 모히토</h3>
                <div class="recipe-ingredients">
                    <h4>재료:</h4>
                    <ul>
                        <li>AquaPure 스파클링 워터 200ml</li>
                        <li>신선한 민트 잎 8-10장</li>
                        <li>라임 1/2개</li>
                        <li>설탕 1티스푼 (선택사항)</li>
                        <li>얼음</li>
                    </ul>
                </div>
                <div class="recipe-steps">
                    <h4>만드는 법:</h4>
                    <ol>
                        <li>유리잔에 민트 잎과 라임을 넣고 살짝 으깹니다.</li>
                        <li>설탕을 넣고 잘 섞어줍니다.</li>
                        <li>얼음을 가득 채웁니다.</li>
                        <li>AquaPure 스파클링 워터를 천천히 부어줍니다.</li>
                        <li>민트 잎으로 장식하고 서빙합니다.</li>
                    </ol>
                </div>
                <p class="recipe-tip"><strong>팁:</strong> 미세한 기포가 민트의 향을 더욱 깔끔하게 만들어줍니다.</p>
            `
        },
        cooking: {
            title: '요리 활용 팁',
            content: `
                <h3>완벽한 차와 커피를 위한 물 선택</h3>
                <div class="cooking-tips">
                    <div class="tip-section">
                        <h4>차 우리기</h4>
                        <ul>
                            <li>녹차: AquaPure 생수를 70-80°C로 데워 사용</li>
                            <li>홍차: 95-100°C의 뜨거운 물로 3-5분 우림</li>
                            <li>허브차: 끓는 물에 5-7분 우려 깊은 맛 추출</li>
                        </ul>
                    </div>
                    <div class="tip-section">
                        <h4>커피 추출</h4>
                        <ul>
                            <li>드립 커피: 균형잡힌 미네랄이 산미와 단맛을 조화롭게</li>
                            <li>에스프레소: 부드러운 크레마 형성에 도움</li>
                            <li>콜드브루: 12-24시간 추출 시 깔끔한 맛</li>
                        </ul>
                    </div>
                    <div class="tip-section">
                        <h4>요리 응용</h4>
                        <ul>
                            <li>밥 짓기: 쌀의 단맛을 살려주는 순수한 물</li>
                            <li>국물 요리: 재료 본연의 맛을 돋보이게</li>
                            <li>제빵: 반죽의 질감을 부드럽게</li>
                        </ul>
                    </div>
                </div>
            `
        },
        beauty: {
            title: '뷰티 케어 활용법',
            content: `
                <h3>미네랄 워터로 피부 건강 챙기기</h3>
                <div class="beauty-tips">
                    <div class="tip-section">
                        <h4>내부 수분 공급</h4>
                        <ul>
                            <li>기상 후 첫 물 한 잔으로 신진대사 활성화</li>
                            <li>하루 8잔 이상 꾸준한 수분 섭취</li>
                            <li>식사 30분 전 물 마시기로 소화 돕기</li>
                        </ul>
                    </div>
                    <div class="tip-section">
                        <h4>외부 스킨케어</h4>
                        <ul>
                            <li>미스트: 스프레이 병에 담아 수시로 분사</li>
                            <li>팩: 압축 마스크에 적셔 10분간 사용</li>
                            <li>토너: 화장솜에 적셔 부드럽게 닦아내기</li>
                        </ul>
                    </div>
                    <div class="tip-section">
                        <h4>주의사항</h4>
                        <ul>
                            <li>개인 피부 타입에 맞는 사용법 확인</li>
                            <li>알레르기 반응 시 사용 중단</li>
                            <li>깨끗한 용기 사용으로 위생 관리</li>
                        </ul>
                    </div>
                </div>
            `
        }
    };
    
    const tip = tipData[tipType];
    if (!tip) return;
    
    modalBody.innerHTML = `
        <div class="tip-modal-content">
            <h2>${tip.title}</h2>
            ${tip.content}
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeTipModal() {
    const modal = document.getElementById('tip-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ===== Parallax Effect =====
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-layer');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 10));
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!fieldValue) {
                isValid = false;
                errorMessage = '이름을 입력해주세요.';
            } else if (fieldValue.length < 2) {
                isValid = false;
                errorMessage = '이름은 2글자 이상 입력해주세요.';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!fieldValue) {
                isValid = false;
                errorMessage = '이메일을 입력해주세요.';
            } else if (!emailRegex.test(fieldValue)) {
                isValid = false;
                errorMessage = '올바른 이메일 형식을 입력해주세요.';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[0-9-+\s()]+$/;
            if (fieldValue && !phoneRegex.test(fieldValue)) {
                isValid = false;
                errorMessage = '올바른 전화번호 형식을 입력해주세요.';
            }
            break;
            
        case 'message':
            if (!fieldValue) {
                isValid = false;
                errorMessage = '문의 내용을 입력해주세요.';
            } else if (fieldValue.length < 10) {
                isValid = false;
                errorMessage = '문의 내용은 10글자 이상 입력해주세요.';
            }
            break;
            
        case 'privacy':
            if (!field.checked) {
                isValid = false;
                errorMessage = '개인정보 처리방침에 동의해주세요.';
            }
            break;
    }
    
    if (errorElement) {
        if (isValid) {
            errorElement.classList.remove('show');
            field.classList.remove('error');
        } else {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            field.classList.add('error');
        }
    }
    
    return isValid;
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.classList.remove('show');
        field.classList.remove('error');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    // Validate all fields
    let isFormValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        return;
    }
    
    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Show success message
        showSuccessMessage('문의가 성공적으로 전송되었습니다!');
        
        // In a real application, you would send the form data to a server
        // Example:
        // const formData = new FormData(form);
        // fetch('/api/contact', {
        //     method: 'POST',
        //     body: formData
        // }).then(response => {
        //     // Handle response
        // });
        
    }, 2000);
}

function showSuccessMessage(message) {
    const successElement = document.getElementById('success-message');
    if (successElement) {
        successElement.querySelector('span').textContent = message;
        successElement.classList.add('show');
        
        setTimeout(() => {
            successElement.classList.remove('show');
        }, 5000);
    }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initIntersectionObserver() {
    // This function sets up intersection observers for various animations
    // It's called during page initialization
}

// ===== Touch Events for Mobile =====
function initTouchEvents() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    // Swipe functionality for gallery
    const gallery = document.getElementById('lifestyle-gallery');
    if (gallery) {
        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        gallery.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleGallerySwipe();
        }, { passive: true });
    }
    
    // Swipe functionality for story slider
    const storySlider = document.getElementById('story-slider');
    if (storySlider) {
        storySlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        storySlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSliderSwipe();
        }, { passive: true });
    }
    
    function handleGallerySwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Only process horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            // Add swipe functionality for gallery if needed
            console.log('Gallery swipe detected:', deltaX > 0 ? 'right' : 'left');
        }
    }
    
    function handleSliderSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Only process horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                changeSlide(-1); // Swipe right, go to previous slide
            } else {
                changeSlide(1); // Swipe left, go to next slide
            }
        }
    }
}

// ===== Performance Optimization =====
function optimizeImages() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

function preloadCriticalImages() {
    // Preload hero and above-the-fold images
    const criticalImages = [
        'assets/images/hero-background.jpg',
        'assets/images/about-origin.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ===== Event Listeners =====
function addGlobalEventListeners() {
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeProductModal();
            closeTipModal();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            closeTipModal();
        }
    });
    
    // Handle form validation styles
    document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = `
            .form-group input.error,
            .form-group textarea.error,
            .form-group select.error {
                border-color: #dc3545;
            }
            
            .product-modal-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                align-items: start;
            }
            
            .product-modal-image img {
                width: 100%;
                border-radius: 8px;
            }
            
            .product-modal-features ul {
                list-style: none;
                padding: 0;
            }
            
            .product-modal-features li {
                padding: 0.5rem 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .product-modal-features i {
                color: var(--accent-green);
            }
            
            .minerals-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .mineral-item {
                background: var(--soft-gray);
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
            }
            
            .mineral-name {
                display: block;
                font-weight: 600;
                color: var(--primary-blue);
                margin-bottom: 0.5rem;
            }
            
            .mineral-value {
                font-size: 1.2rem;
                font-weight: 700;
                color: var(--accent-green);
            }
            
            .tip-modal-content h3 {
                color: var(--primary-blue);
                margin: 2rem 0 1rem 0;
            }
            
            .tip-modal-content h4 {
                color: var(--accent-green);
                margin: 1.5rem 0 0.5rem 0;
            }
            
            .recipe-ingredients,
            .recipe-steps,
            .cooking-tips,
            .beauty-tips {
                margin: 1.5rem 0;
            }
            
            .recipe-tip {
                background: var(--soft-gray);
                padding: 1rem;
                border-radius: 8px;
                margin-top: 1.5rem;
            }
            
            .tip-section {
                margin: 1.5rem 0;
                padding: 1rem;
                background: var(--soft-gray);
                border-radius: 8px;
            }
            
            @media (max-width: 768px) {
                .product-modal-content {
                    grid-template-columns: 1fr;
                }
                
                .minerals-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    });
}

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    initStorySlider();
    initProductFilters();
    initContactForm();
    initParallax();
    initScrollAnimations();
    initIntersectionObserver();
    initTouchEvents();
    addGlobalEventListeners();
    
    // Optimize performance
    optimizeImages();
    preloadCriticalImages();
    
    // Start counting animations when elements are in view
    initCountAnimation();
    
    console.log('AquaPure website initialized successfully!');
});

// ===== Utility Functions for External Use =====
window.scrollToSection = scrollToSection;
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.showTipDetail = showTipDetail;
window.closeTipModal = closeTipModal;
window.toggleCertInfo = toggleCertInfo;
