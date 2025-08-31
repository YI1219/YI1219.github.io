// 动态粒子网络背景特效
class ParticleNetwork {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.mouseTrail = [];
    this.maxParticles = 50;
    this.maxDistance = 150;
    this.init();
  }

  init() {
    this.createCanvas();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'particles-bg';
    this.ctx = this.canvas.getContext('2d');
    
    this.resizeCanvas();
    document.body.appendChild(this.canvas);
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      
      // 创建鼠标轨迹
      this.mouseTrail.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
      
      // 限制轨迹长度
      if (this.mouseTrail.length > 10) {
        this.mouseTrail.shift();
      }
    });
  }

  updateParticles() {
    this.particles.forEach(particle => {
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 边界检测
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }
      
      // 确保粒子在画布内
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    });
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制背景渐变 - 淡化版本
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    gradient.addColorStop(1, 'rgba(118, 75, 162, 0.3)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制粒子
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    // 绘制连线
    this.drawConnections();
    
    // 绘制鼠标轨迹
    this.drawMouseTrail();
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.maxDistance) {
          const opacity = 1 - (distance / this.maxDistance);
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
    
    // 鼠标与粒子的连线
    this.particles.forEach(particle => {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.maxDistance) {
        const opacity = 1 - (distance / this.maxDistance);
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouse.x, this.mouse.y);
        this.ctx.lineTo(particle.x, particle.y);
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    });
  }

  drawMouseTrail() {
    // 绘制鼠标轨迹
    this.mouseTrail.forEach((point, index) => {
      const age = Date.now() - point.timestamp;
      const opacity = Math.max(0, 1 - age / 1000);
      
      if (opacity > 0) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
        this.ctx.fill();
      }
    });
    
    // 绘制鼠标当前位置
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, 4, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fill();
    
    // 鼠标光晕效果
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, 20, 0, Math.PI * 2);
    const gradient = this.ctx.createRadialGradient(
      this.mouse.x, this.mouse.y, 0,
      this.mouse.x, this.mouse.y, 20
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }

  animate() {
    this.updateParticles();
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }
}

// 页面加载完成后初始化粒子网络
document.addEventListener('DOMContentLoaded', () => {
  new ParticleNetwork();
});
