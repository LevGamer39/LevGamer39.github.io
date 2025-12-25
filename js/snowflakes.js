const IS_NEW_YEAR_MODE = true; 
if (IS_NEW_YEAR_MODE) {
	const snowCanvas = document.createElement('canvas');
	snowCanvas.id = 'snow-canvas';
	snowCanvas.style.position = 'fixed';
	snowCanvas.style.top = '0';
	snowCanvas.style.left = '0';
	snowCanvas.style.width = '100%';
	snowCanvas.style.height = '100%';
	snowCanvas.style.pointerEvents = 'none';
	snowCanvas.style.zIndex = '9998'; 
	document.body.appendChild(snowCanvas);

	const ctx = snowCanvas.getContext('2d');

	let width = window.innerWidth;
	let height = window.innerHeight;
	let flakes = [];
	let animationFrameId;

	// Настройки снега
	const settings = {
		count: 150,           // Количество снежинок
		minSize: 1,           // Минимальный размер
		maxSize: 4,           // Максимальный размер (для "пушистости")
		minSpeed: 0.5,        // Минимальная скорость падения
		maxSpeed: 2.5,        // Максимальная скорость
		color: '255, 255, 255' // Цвет (RGB)
	};
	window.addEventListener('resize', () => {
		width = window.innerWidth;
		height = window.innerHeight;
		snowCanvas.width = width;
		snowCanvas.height = height;
	});


	snowCanvas.width = width;
	snowCanvas.height = height;

	class Snowflake {
		constructor(initY = null) {
			this.reset(initY);
		}

		reset(initY = null) {
			this.x = Math.random() * width;
			this.y = initY !== null ? initY : -10;
			this.size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
			this.speed = Math.random() * (settings.maxSpeed - settings.minSpeed) + settings.minSpeed;
			this.opacity = Math.random() * 0.5 + 0.1;
			this.sway = Math.random() * 0.05 + 0.01;
			this.step = Math.random() * Math.PI * 2;
		}

		update() {
			this.y += this.speed;
			this.step += this.sway;
			this.x += Math.sin(this.step) * 0.5;

			if (this.y > height) {
				this.reset();
			}
			
			if (this.x > width) this.x = 0;
			if (this.x < 0) this.x = width;
		}

		draw() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${settings.color}, ${this.opacity})`;
			ctx.fill();
			ctx.closePath();
		}
	}

	function initSnowflakes() {
		flakes = [];
		for (let i = 0; i < settings.count; i++) {
			flakes.push(new Snowflake(Math.random() * height));
		}
	}

	function animate() {
		ctx.clearRect(0, 0, width, height);

		flakes.forEach(flake => {
			flake.update();
			flake.draw();
		});

		animationFrameId = requestAnimationFrame(animate);
	}

	function startSnowStream() {
		if (!animationFrameId) {
			snowCanvas.style.display = 'block';
			animate();
		}
	}

	function stopSnowStream() {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
			ctx.clearRect(0, 0, width, height);
			snowCanvas.style.display = 'none';
		}
	}

	function createSnowSwitch() {
		const footer = document.querySelector('.footer');
		if (!footer) {
			setTimeout(createSnowSwitch, 1000);
			return;
		}

		if (document.querySelector('.footer-snow-switch')) return;
		
		const switchStyles = document.createElement('style');
		switchStyles.textContent = `
			.footer-snow-switch {
				display: inline-flex;
				align-items: center;
				gap: 8px;
				cursor: pointer;
				padding: 8px 16px;
				border-radius: 20px;
				background: rgba(14, 20, 26, 0.9);
				border: 1px solid rgba(77, 163, 255, 0.3);
				margin-left: 15px;
				transition: all 0.3s ease;
				font-family: "Styrene A Web", sans-serif;
				font-size: 14px;
				color: #A8A8A8;
				user-select: none;
			}
			.footer-snow-switch:hover {
				background: rgba(14, 20, 26, 0.95);
				border-color: rgba(77, 163, 255, 0.5);
				transform: translateY(-2px);
			}
			.footer-snow-switch.active {
				background: rgba(77, 163, 255, 0.15);
				border-color: rgba(77, 163, 255, 0.6);
				color: #4DA3FF;
			}
			.snow-switch-icon {
				font-size: 16px;
			}
		`;
		document.head.appendChild(switchStyles);
		
		const snowSwitch = document.createElement('div');
		snowSwitch.className = 'footer-snow-switch active';
		snowSwitch.innerHTML = `
			<span class="snow-switch-icon">❄️</span>
			<span class="snow-switch-label">Выключить снег</span>
		`;
		
		snowSwitch.addEventListener('click', function() {
			const isEnabled = localStorage.getItem('snowEnabled') !== 'false';
			
			if (isEnabled) {
				stopSnowStream();
				this.innerHTML = `
					<span class="snow-switch-icon">☃️</span>
					<span class="snow-switch-label">Включить снег</span>
				`;
				this.classList.remove('active');
				localStorage.setItem('snowEnabled', 'false');
			} else {
				startSnowStream();
				this.innerHTML = `
					<span class="snow-switch-icon">❄️</span>
					<span class="snow-switch-label">Выключить снег</span>
				`;
				this.classList.add('active');
				localStorage.setItem('snowEnabled', 'true');
			}
		});
		
		footer.appendChild(snowSwitch);
	}

	function initSnow() {
		initSnowflakes();
		createSnowSwitch();
		
		const snowEnabled = localStorage.getItem('snowEnabled');
		
		if (snowEnabled === 'false') {
			const switchBtn = document.querySelector('.footer-snow-switch');
			if (switchBtn) {
				switchBtn.click();
			}
			stopSnowStream();
		} else {
			startSnowStream();
		}
		
		window.snowSystem = {
			setCount: (n) => {
				settings.count = n;
				initSnowflakes();
				return `Количество снежинок изменено на ${n}`;
			},
			setColor: (rgb) => {
				settings.color = rgb;
				return `Цвет изменен на rgb(${rgb})`;
			},
			toggle: () => {
				document.querySelector('.footer-snow-switch')?.click();
			}
		};
	}

	// Запуск
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initSnow);
	} else {
		initSnow();
	}
}