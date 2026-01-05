import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Menu, X, ChevronRight, Activity, Globe, Zap, Shield, 
  MapPin, Wind, Crosshair, Layers, AlertTriangle, Battery, Wifi
} from 'lucide-react';

const COLORS = {
  bg: '#051024',
  orange: '#FF6B00',
  cyan: '#00BFFF',
  white: '#FFFFFF',
  grey: '#E0E0E0',
  glass: 'rgba(5, 16, 36, 0.75)',
};

// 复杂背景组件
const ComplexBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    const connectionDistance = 150;
    const mouseDistance = 200;

    let mouse = { x: null, y: null };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx*dx + dy*dy);
          if (distance < mouseDistance && distance > 50) {
            const force = (mouseDistance - distance) / mouseDistance;
            this.x += dx * 0.01 * force;
            this.y += dy * 0.01 * force;
          }
        }
      }

      draw() {
        ctx.fillStyle = COLORS.cyan;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx*dx + dy*dy);
          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 191, 255, ${1 - distance/connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        
        if (mouse.x != null) {
          let dx = p.x - mouse.x;
          let dy = p.y - mouse.y;
          let distance = Math.sqrt(dx*dx + dy*dy);
          if (distance < mouseDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 107, 0, ${(1 - distance/mouseDistance) * 0.8})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#051024] via-[#081a3b] to-[#020812]" />
      <div className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%2300BFFF' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />
      <motion.svg 
        className="absolute w-full h-full opacity-10"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <motion.path 
          d="M0,800 Q500,600 1000,800"
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth="2"
          animate={{ d: ["M0,800 Q500,700 1000,800", "M0,800 Q500,900 1000,800", "M0,800 Q500,700 1000,800"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
};

// 导航栏
const Navbar = ({ setPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: '方舟基地', id: 'ark' },
    { label: '飞行器', id: 'drone' },
    { label: '每日影像', id: 'daily' },
    { label: '预约', id: 'reserve' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full z-50 border-b border-white/10 backdrop-blur-md"
      style={{ backgroundColor: COLORS.glass }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer group" 
          onClick={() => setPage('home')}
        >
          <img 
            src="/白色logo.png" 
            alt="FARFLY" 
            className="h-12 w-auto group-hover:glow-box-orange transition-all duration-300"
          />
        </div>

        <div className="hidden md:flex space-x-12">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => item.id !== 'daily' && item.id !== 'reserve' ? setPage(item.id) : null}
              className="text-sm tracking-widest text-gray-300 hover:text-orange-500 relative group transition-colors duration-300 sub-tech-font font-bold uppercase"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_#FF6B00]"></span>
            </button>
          ))}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#051024] border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if(item.id !== 'daily' && item.id !== 'reserve') setPage(item.id);
                    setIsOpen(false);
                  }}
                  className="text-left text-gray-300 hover:text-orange-500 py-2 border-l-2 border-transparent hover:border-orange-500 pl-4 transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// 首屏
const HeroSection = ({ setPage }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <motion.div 
        style={{ y: y1 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full border border-white/5 opacity-30 animate-[spin_60s_linear_infinite] pointer-events-none z-0"
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/20"></div>
        <div className="absolute inset-[15%] rounded-full border border-white/5"></div>
        <div className="absolute inset-[30%] rounded-full border border-orange-500/10"></div>
      </motion.div>

      <div className="absolute top-24 left-6 md:left-12 hidden md:block">
        <div className="w-1 h-20 bg-gradient-to-b from-orange-500 to-transparent"></div>
        <p className="text-[10px] text-orange-500 font-mono mt-2 tracking-widest">SYSTEM READY</p>
      </div>
      <div className="absolute bottom-24 right-6 md:right-12 hidden md:block text-right">
        <div className="w-1 h-20 bg-gradient-to-t from-cyan-500 to-transparent ml-auto"></div>
        <p className="text-[10px] text-cyan-500 font-mono mt-2 tracking-widest">GRID LOCKED</p>
      </div>

      <div className="z-10 max-w-5xl mx-auto px-6 w-full flex flex-col items-center text-center relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#FF6B00]"></span>
            <span className="text-orange-500 tracking-[0.5em] text-xs md:text-sm uppercase font-bold border-b border-orange-500/30 pb-1">Project Farfly</span>
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#FF6B00]"></span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-none tech-font tracking-tighter relative">
            <span className="relative z-10">远蜓未来</span>
            <span className="absolute top-0 left-0 w-full h-full text-cyan-500/10 blur-sm select-none -z-10 animate-pulse">远蜓未来</span>
          </h1>

          <h2 className="text-xl md:text-2xl text-gray-400 mb-10 font-light sub-tech-font tracking-[0.3em] uppercase">
            存在即探索 <span className="text-cyan-500 mx-2">//</span> EXISTENCE IS EXPLORATION
          </h2>
          
          <div className="flex justify-center space-x-12 mb-12 text-[10px] text-gray-500 font-mono hidden md:flex">
            <div>
              <span className="block text-cyan-400">COORDS</span>
              34.0522 N, 118.2437 W
            </div>
            <div>
              <span className="block text-orange-400">STATUS</span>
              OPTIMAL
            </div>
            <div>
              <span className="block text-white">LINK</span>
              ESTABLISHED
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 justify-center items-center">
            <button className="w-48 py-4 bg-orange-500 text-white font-bold uppercase tracking-wider hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_40px_rgba(255,107,0,0.7)] hover:-translate-y-1">
              预约飞行
            </button>
            <button 
              onClick={() => setPage('ark')}
              className="w-48 py-4 bg-transparent border border-white/30 text-white font-bold uppercase tracking-wider hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-900/10 hover:shadow-[0_0_20px_rgba(0,191,255,0.3)] transition-all backdrop-blur-sm"
            >
              探索基地
            </button>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cyan-500/50 flex flex-col items-center"
      >
        <span className="text-[10px] tracking-[0.3em] mb-2">SCROLL TO EXPLORE</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500 to-transparent"></div>
      </motion.div>
    </section>
  );
};

// 方舟区块
const SectionArk = ({ setPage }) => {
  return (
    <section className="relative py-32 bg-black/20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative group cursor-pointer" onClick={() => setPage('ark')}>
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative aspect-video bg-[#0a162e] rounded-lg overflow-hidden border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center bg-[url('/方舟效果图.jpg')] bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#051024] to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <div className="flex items-center text-cyan-400 mb-2">
                <Globe className="w-4 h-4 mr-2" />
                <span className="text-xs tracking-widest">SECTOR 01</span>
              </div>
              <h3 className="text-3xl font-bold text-white tech-font">ARK BASE // 方舟</h3>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-4xl text-white font-bold mb-6 tech-font">方舟基地</h2>
          <h3 className="text-xl text-orange-500 mb-6 sub-tech-font tracking-wide border-l-4 border-orange-500 pl-4">
            路面科研站与生命家园
          </h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            深埋于地下的自循环生态系统，不仅是科研的前哨站，更是人类未来的诺亚方舟。
            拥有完全独立的能源与水循环系统，在任何极端环境下保障生命延续。
          </p>
          <button 
            onClick={() => setPage('ark')}
            className="flex items-center text-white hover:text-orange-500 transition-colors group"
          >
            <span className="mr-2 uppercase tracking-widest font-bold text-sm">了解更多</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

// 飞行器区块
const SectionDrone = ({ setPage }) => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-[#051024] to-[#020812]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-4xl text-white font-bold mb-6 tech-font">信使飞行器</h2>
          <h3 className="text-xl text-cyan-400 mb-6 sub-tech-font tracking-wide border-l-4 border-cyan-400 pl-4">
            感官延伸与机动节点
          </h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            轻伴系列"信使"不仅仅是交通工具，它是你的第二双眼睛。
            集成了超高精度传感器阵列，支持神经链路协同，让你在方舟之外也能身临其境。
          </p>
          <button 
            onClick={() => setPage('drone')}
            className="flex items-center text-white hover:text-cyan-400 transition-colors group"
          >
            <span className="mr-2 uppercase tracking-widest font-bold text-sm">了解更多</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="order-1 md:order-2 relative group cursor-pointer" onClick={() => setPage('drone')}>
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative aspect-video bg-[#0a162e] rounded-lg overflow-hidden border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center bg-[url('/飞行器效果图.jpg')] bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#051024] to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <div className="flex items-center text-orange-500 mb-2">
                <Wind className="w-4 h-4 mr-2" />
                <span className="text-xs tracking-widest">UNIT: MESSENGER</span>
              </div>
              <h3 className="text-3xl font-bold text-white tech-font">MESSENGER // 信使</h3>
            </div>
            <div className="absolute top-4 right-4 flex flex-col space-y-1 items-end">
              <div className="w-16 h-1 bg-orange-500/50 animate-pulse"></div>
              <div className="w-10 h-1 bg-cyan-500/50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 每日影像区块
const SectionDaily = () => {
  return (
    <section className="py-24 border-y border-white/5 bg-[#030a17]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl text-white tech-font flex items-center">
            <span className="w-3 h-8 bg-orange-500 mr-4"></span>
            每日影像日志
          </h2>
          <div className="flex items-center text-orange-500">
            <Activity className="w-5 h-5 mr-2 animate-pulse" />
            <span className="font-mono text-sm">UPLINK ACTIVE</span>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 p-2 rounded-xl relative overflow-hidden group">
          <div className="aspect-[21/9] bg-gray-800 relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"></div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
            <div className="absolute top-0 left-0 w-full h-full p-8 flex flex-col justify-between font-mono text-xs md:text-sm text-cyan-300/80">
              <div className="flex justify-between">
                <span>LOG: #8921-A</span>
                <span>CAM-04 [EXTERIOR]</span>
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
                <Crosshair className="w-24 h-24" strokeWidth={0.5} />
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white text-lg mb-1">2030.12.23 | 14:00 PM</p>
                  <p className="text-orange-500">COORDS: 42.102, -73.221</p>
                </div>
                <div className="max-w-md text-right hidden md:block">
                  <p className="text-gray-300">
                    {'>'} 基地外围检测到异常电磁波动。<br/>
                    {'>'} 夕阳折射率正常。空气质量优。<br/>
                    {'>'} 正在同步至中央数据库...
                  </p>
                </div>
              </div>
            </div>
            
            <div className="absolute right-0 bottom-20 w-32 h-16 opacity-50 flex items-end space-x-1 px-4">
              {[...Array(10)].map((_,i) => (
                <motion.div 
                  key={i} 
                  className="w-1 bg-orange-500"
                  animate={{ height: [10, Math.random() * 50 + 10, 10] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 页脚
const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8 text-sm relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="space-y-6">
          <img 
            src="/白色logo.png" 
            alt="FARFLY" 
            className="h-8 w-auto"
          />
          <p className="text-gray-500 leading-relaxed">
            致力于构建一体化科技生态系统。以方舟为基石，以信使为触手，重新定义人类生存与探索的边界。
          </p>
          <div className="flex items-center space-x-2 text-green-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-xs tracking-wider font-mono">SYSTEM NORMAL</span>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider">核心基地</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-orange-500 cursor-pointer transition-colors">概览</li>
            <li className="hover:text-orange-500 cursor-pointer transition-colors">能源自持系统</li>
            <li className="hover:text-orange-500 cursor-pointer transition-colors">预约参观</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider">轻伴飞行器</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">信使概览</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">协同作业演示</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">申请试飞</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider">协议</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-white cursor-pointer transition-colors">关于溯源计划</li>
            <li className="hover:text-white cursor-pointer transition-colors">招贤纳士</li>
            <li className="hover:text-white cursor-pointer transition-colors">隐私政策</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-16 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
        &copy; 2030 FARFLY FUTURE INC. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};

// 方舟详情页
const ArkPage = ({ setPage }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="min-h-screen bg-[#02050a] relative z-20"
    >
      <div className="sticky top-0 z-50 bg-[#051024]/90 backdrop-blur border-b border-white/10 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-white font-bold tech-font text-xl">
          <Globe className="text-orange-500" />
          <span>ARK BASE // DETAIL</span>
        </div>
        <button 
          onClick={() => setPage('home')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <span className="mr-2 text-xs uppercase">Back to Surface</span>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative h-[60vh] overflow-hidden border-b border-orange-500/30">
        <div className="absolute inset-0 bg-[url('/方舟夜晚效果图.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#02050a] via-[#051024]/80 to-transparent"></div>
        
        <div className="absolute inset-0 p-8 border-[20px] border-transparent pointer-events-none">
          <div className="w-full h-full border border-white/20 relative">
            <div className="absolute top-0 left-0 border-t-2 border-l-2 border-orange-500 w-8 h-8"></div>
            <div className="absolute top-0 right-0 border-t-2 border-r-2 border-orange-500 w-8 h-8"></div>
            <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-orange-500 w-8 h-8"></div>
            <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-orange-500 w-8 h-8"></div>
            
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-32 flex flex-col justify-between">
              {[...Array(10)].map((_,i) => <div key={i} className="w-2 h-[1px] bg-white/50"></div>)}
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-6 md:left-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white tech-font mb-4">SECTOR 01</h1>
          <p className="text-cyan-400 font-mono tracking-widest text-lg">DEPTH: -1200M // PRESSURE: 120ATM</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl text-white font-bold mb-6 tech-font flex items-center">
              <Shield className="w-6 h-6 text-orange-500 mr-3" />
              生态闭环系统
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg mb-6">
              方舟核心采用第三代光合作用模拟发生器，配合水循环净化矩阵，实现了超过 <span className="text-orange-500 font-bold text-2xl">98%</span> 的物质闭环率。
              这意味着在完全切断外部补给的情况下，基地可独立维持 500 人生活 50 年。
            </p>
            <div className="flex space-x-4 font-mono text-sm text-cyan-300">
              <div className="border border-cyan-500/30 px-3 py-1 bg-cyan-500/10">O2 LEVEL: 21%</div>
              <div className="border border-cyan-500/30 px-3 py-1 bg-cyan-500/10">HUMIDITY: 45%</div>
            </div>
          </div>
          <div className="relative h-64 bg-gray-900 rounded-lg border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/方舟闭环系统.jpg')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 w-full bg-black/50 p-2 text-center text-xs text-gray-500 font-mono">
              SYSTEM SCHEMATIC V.3.0
            </div>
          </div>
        </div>

        <h3 className="text-2xl text-white font-bold mb-8 pl-4 border-l-4 border-orange-500">核心功能分区</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { title: '能源核心', img: '/基地内部能源1.jpg', param: 'OUTPUT: 5GW' },
            { title: '生态农场', img: '/基地内部农场2.jpg', param: 'YIELD: 12T/DAY' },
            { title: '居住舱段', img: '/基地内部居住3.jpg', param: 'CAPACITY: 500' },
          ].map((item, idx) => (
            <div key={idx} className="group relative h-80 rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500 transition-all duration-300">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${item.img})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 transition-all duration-300 group-hover:bottom-4">
                <h4 className="text-2xl font-bold text-white mb-1">{item.title}</h4>
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all">
                  <p className="text-orange-500 font-mono text-sm mt-2">{item.param}</p>
                  <p className="text-gray-400 text-xs mt-1">点击查看详细蓝图 {'>'}{'>'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <button className="px-10 py-4 bg-orange-500 text-white font-bold uppercase tracking-widest rounded-sm hover:bg-orange-600 hover:shadow-[0_0_20px_#FF6B00] transition-all active:scale-95">
            预约参观
          </button>
          <button 
            onClick={() => setPage('drone')}
            className="px-8 py-3 bg-transparent border border-orange-500/50 text-orange-500 font-bold uppercase tracking-widest hover:bg-orange-500/10 hover:text-white transition-all glow-orange"
          >
            了解配套飞行器
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// 飞行器详情页
const DronePage = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState('commute');
  const [activeThumb, setActiveThumb] = useState(-1); // -1 表示默认主图
  
  const droneImages = [
    { title: '仿生蜻蜓翼结构', url: '/飞行器细节图1.jpg' },
    { title: '核心反应堆单元', url: '/飞行器细节图2.jpg' },
    { title: '喷射口&推力器', url: '/飞行器细节图3(1).jpg' }
  ];
  
  const mainImageUrl = activeThumb === -1 ? '/飞行器细节图1.jpg' : droneImages[activeThumb].url;
  const mainImageTitle = activeThumb === -1 ? '仿生蜻蜓翼结构' : droneImages[activeThumb].title;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen bg-[#051024] relative z-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit.png')] opacity-10 pointer-events-none"></div>

      <div className="relative z-50 flex justify-between items-center p-6 border-b border-cyan-500/20 bg-[#051024]/80 backdrop-blur">
        <div className="flex items-center space-x-2">
          <Wind className="text-cyan-400" />
          <h1 className="text-2xl font-bold text-white tech-font">MESSENGER <span className="text-cyan-500">//</span> SYSTEM</h1>
        </div>
        <button onClick={() => setPage('home')} className="text-gray-400 hover:text-white">
          <X />
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 space-y-8">
          
          <div className="relative aspect-video rounded-xl overflow-hidden border border-cyan-500/30 bg-black group">
            <motion.div 
              key={mainImageUrl}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${mainImageUrl}')` }}
            ></motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#051024] to-transparent opacity-80"></div>
            
            <div className="absolute bottom-6 left-6">
              <p className="text-cyan-400 text-xs font-mono mb-1">VIEW MODE: {mainImageTitle}</p>
              <h2 className="text-4xl text-white font-bold tech-font">{mainImageTitle}</h2>
            </div>

            <div className="absolute bottom-6 right-6 flex space-x-2">
              {droneImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveThumb(activeThumb === idx ? -1 : idx)}
                  className={`w-16 h-10 border rounded overflow-hidden transition-all ${
                    activeThumb === idx 
                      ? 'border-cyan-400 shadow-[0_0_10px_rgba(0,191,255,0.5)]' 
                      : 'border-white/20 bg-black/50 hover:border-white'
                  }`}
                >
                  <img src={img.url} className={`w-full h-full object-cover ${activeThumb === idx ? 'opacity-100' : 'opacity-70'}`} alt={img.title} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0a1529] border border-white/10 p-6 rounded-xl relative overflow-hidden">
            <h3 className="text-white font-bold mb-6 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-orange-500" />
              系统架构解析
            </h3>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center text-center text-xs font-mono text-gray-400 mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10"></div>
                
                {['唤醒 (Wake)', '预订 (Book)', '飞行 (Fly)', '降落 (Land)'].map((step, i) => (
                  <div key={i} className="bg-[#051024] px-2 relative group">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full mx-auto mb-2 shadow-[0_0_8px_#00BFFF] group-hover:scale-150 transition-transform"></div>
                    <span className="group-hover:text-white transition-colors">{step}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 text-center mt-8">
                <div className="p-3 bg-cyan-900/10 border border-cyan-500/20 rounded">
                  <span className="text-cyan-400 font-bold block mb-1">OriginOS</span>
                  <span className="text-[10px] text-gray-500">交互层</span>
                </div>
                <div className="p-3 bg-blue-900/10 border border-blue-500/20 rounded">
                  <span className="text-blue-400 font-bold block mb-1">Cloud Brain</span>
                  <span className="text-[10px] text-gray-500">调度层</span>
                </div>
                <div className="p-3 bg-orange-900/10 border border-orange-500/20 rounded">
                  <span className="text-orange-400 font-bold block mb-1">Hardware</span>
                  <span className="text-[10px] text-gray-500">执行层</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col h-full bg-black rounded-xl overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(0,191,255,0.1)]">
          <div className="bg-[#0f1d36] p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">HUD 模拟器</h3>
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] text-red-400 font-mono">LIVE FEED</span>
            </div>
          </div>

          <div className="flex flex-1">
            <div className="w-16 bg-[#081226] border-r border-white/10 flex flex-col items-center py-4 space-y-6">
              <button 
                onClick={() => setActiveTab('commute')}
                className={`p-2 rounded transition-colors ${activeTab === 'commute' ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-white'}`}
              >
                <Zap className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActiveTab('sightseeing')}
                className={`p-2 rounded transition-colors ${activeTab === 'sightseeing' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-white'}`}
              >
                <MapPin className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActiveTab('emergency')}
                className={`p-2 rounded transition-colors ${activeTab === 'emergency' ? 'bg-red-500/20 text-red-400' : 'text-gray-500 hover:text-white'}`}
              >
                <AlertTriangle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 relative bg-gray-900 overflow-hidden">
              <div className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${activeTab === 'emergency' ? 'grayscale contrast-125' : ''}`} 
                   style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop')" }}>
              </div>
              
              <div className="scanlines"></div>

              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                
                <div className="flex justify-between font-mono text-xs">
                  <div className={`px-2 py-1 bg-black/50 backdrop-blur rounded border ${
                    activeTab === 'commute' ? 'border-green-500 text-green-400' :
                    activeTab === 'sightseeing' ? 'border-amber-500 text-amber-400' :
                    'border-red-500 text-red-500'
                  }`}>
                    MODE: {activeTab.toUpperCase()}
                  </div>
                  <div className="flex space-x-4 text-white">
                    <span className="flex items-center"><Battery className="w-3 h-3 mr-1"/> 84%</span>
                    <span className="flex items-center"><Wifi className="w-3 h-3 mr-1"/> 5G+</span>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none">
                  
                  {activeTab === 'commute' && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-green-400 text-center">
                      <div className="border border-green-500/30 w-64 h-32 rounded-lg flex items-center justify-center bg-green-900/10 backdrop-blur-sm">
                        <div>
                          <p className="text-2xl font-bold font-mono">08:45 AM</p>
                          <p className="text-xs tracking-widest">ETA: 12 MINS</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-1 h-8 bg-green-500/50"></div>
                        <div className="w-1 h-12 bg-green-500"></div>
                        <div className="w-1 h-8 bg-green-500/50"></div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'sightseeing' && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-amber-400 absolute top-1/4 right-1/4">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-amber-500 mt-2 mr-2 animate-ping"></div>
                        <div className="bg-black/60 border-l-2 border-amber-500 p-2 backdrop-blur-md max-w-[150px]">
                          <h4 className="text-xs font-bold text-white">ANCIENT TOWER</h4>
                          <p className="text-[10px] text-gray-300 leading-tight mt-1">
                            建于21世纪初，历史地标遗迹。
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'emergency' && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="w-full h-full border-4 border-red-500/50 flex items-center justify-center relative">
                      <div className="bg-red-900/80 text-white px-6 py-4 rounded border border-red-500 animate-pulse text-center">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                        <h2 className="text-xl font-bold uppercase tracking-widest">Warning</h2>
                        <p className="text-xs font-mono mt-1">OBSTACLE DETECTED</p>
                        <p className="text-xs font-mono">REROUTING...</p>
                      </div>
                      <svg className="absolute inset-0 w-full h-full opacity-50">
                        <path d="M100,300 Q200,100 400,300" fill="none" stroke="red" strokeWidth="2" strokeDasharray="5,5" />
                      </svg>
                    </motion.div>
                  )}

                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-white/70">
                  <div>
                    ALT: 450M<br/>
                    SPD: 120KM/H
                  </div>
                  <div className="text-center">
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-cyan-500"></div>
                    </div>
                    <span className="text-cyan-400">THRUST</span>
                  </div>
                  <div className="text-right">
                    WIND: NW 12<br/>
                    TEMP: 24°C
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// 主应用组件
const App = () => {
  const [page, setPage] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#051024] flex items-center justify-center flex-col">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-t-4 border-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-cyan-500 rounded-full animate-[spin_1s_linear_infinite_reverse]"></div>
        </div>
        <h1 className="text-white font-mono tracking-[0.5em] text-sm animate-pulse">INITIALIZING FARFLY...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans text-gray-200 selection:bg-orange-500 selection:text-white">
      <ComplexBackground />
      
      <AnimatePresence mode="wait">
        {page === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar setPage={setPage} />
            <HeroSection setPage={setPage} />
            <SectionArk setPage={setPage} />
            <SectionDrone setPage={setPage} />
            <SectionDaily />
            <Footer />
          </motion.div>
        )}

        {page === 'ark' && (
          <ArkPage key="ark" setPage={setPage} />
        )}

        {page === 'drone' && (
          <DronePage key="drone" setPage={setPage} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
