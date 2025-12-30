import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Send, Loader2, Mail, Phone, ExternalLink, ArrowRight, Star } from 'lucide-react';

/**
 * [설정] Google Apps Script Web App URL
 */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUV4WQcHRfhMq8tL6UHGbzxj_tMc3RPjq9ryxRxKVCbM-0VVxIlCM-lmEDNUS9SuHOUg/exec";

// ----------------------------------------------------------------------
// [설문 데이터] 총 24문항
// ----------------------------------------------------------------------
const surveyData = [
  // --- Intro ---
  {
    id: 'intro',
    type: 'intro',
    step: 0,
    title: '2026\nCORPORATE\nEDUCATION\nINSIGHTS', 
    desc: `변화의 최전선에 계신 담당자님,\n2025년 한 해도 정말 치열하게 달려오셨습니다.\n\n다가오는 2026년, 담당자님의 고민(?)이\n조직의 성과(!)로 바뀔 수 있도록\n레퍼런스HRD가 데이터 기반의 해답을 함께 찾겠습니다.`,
  },
  // --- Step 1. 기본 정보 ---
  {
    id: 'name', step: 1, type: 'text', 
    label: '담당자님 성함을 입력해 주세요.', placeholder: '성함을 입력하세요'
  },
  {
    id: 'company', step: 1, type: 'text', 
    label: '소속된 회사명과 부서를 알려주세요.', placeholder: '회사명 / 부서명'
  },
  {
    id: 'position', step: 1, type: 'radio', 
    label: '직급을 선택해 주세요.',
    options: ['사원~대리급', '과장~차장급', '팀장/부장급', '임원/경영진', '기타'],
    hasOther: true
  },
  {
    id: 'phone', step: 1, type: 'tel', 
    label: '기프티콘을 수령하실 연락처를 입력해 주세요.', placeholder: '010-1234-5678 (숫자만 입력)'
  },
  // --- Step 2. 2025 회고 ---
  {
    id: 'q5_score', step: 2, type: 'rating', max: 5,
    label: '2025년 귀사의 교육 만족도를 점수로 매긴다면?',
    labels: ['매우 불만족', '불만족', '보통', '만족', '매우 만족']
  },
  {
    id: 'q6_best', step: 2, type: 'radio', 
    label: '올해 진행한 교육 중 [가장 반응이 좋았던] 분야는?',
    options: ['온보딩(신입/경력)', '리더십/코칭', '직무 스킬', '조직문화/팀빌딩', 'AI/DX 역량', '기타'],
    hasOther: true
  },
  {
    id: 'q7_pain', step: 2, type: 'check', 
    label: '교육 운영 시 가장 힘들었던 [현실적인 고민]은 무엇입니까?',
    subLabel: '복수 선택 가능',
    options: ['교육생 참여 저조/무관심', '현업 적용 실패(변화 없음)', '강사 전문성/트렌드 부족', '예산 삭감 및 인프라 부족', '효과 측정의 어려움', '기타'],
    hasOther: true
  },
  {
    id: 'q8_method', step: 2, type: 'radio', 
    label: '올해 주로 활용한 교육 운영 방식은?',
    options: ['오프라인 집체 교육 위주', '온라인/이러닝 위주', '하이브리드 (병행)', '마이크로 러닝 (숏폼 등)', '기타'],
    hasOther: true
  },
  // --- Step 3. 2026 전략 ---
  {
    id: 'q9_keywords', step: 3, type: 'check', maxSelect: 3,
    label: '2026년 가장 중요하게 여기는 [핵심 키워드] 3가지는?',
    subLabel: '최대 3개 선택',
    options: ['AX/AI전환', '데이터경영', '회복탄력성', '휴먼스킬/소통', '성과관리', 'DEI(다양성)', '수평적문화', '글로벌역량', '기타'],
    hasOther: true
  },
  {
    id: 'q10_must', step: 3, type: 'check', 
    label: '내년에 [반드시 진행해야 하는] 필수 교육 과정은?',
    options: ['신입/경력 입문 교육', '승진자/직급별 리더십', '생성형 AI 실무 활용', '직무 전문성(영업/마케팅 등)', '전사 워크숍/비전 내재화', '기타'],
    hasOther: true
  },
  {
    id: 'q11_target', step: 3, type: 'check', 
    label: '2026년 교육의 [최우선 타겟]은 누구입니까?',
    options: ['전 임직원', '신규 입사자', '팀장 및 부서장 (리더)', '핵심 인재 (Hi-Po)', '저성과자/직무전환자', '기타'],
    hasOther: true
  },
  {
    id: 'q12_type', step: 3, type: 'radio', 
    label: '선호하는 교육 형태는 무엇입니까?',
    options: ['1~2일 집중 워크숍', '2~3개월 장기 프로젝트', '2~4시간 짧은 특강', '온라인/비대면 학습', '기타'],
    hasOther: true
  },
  // --- Step 4. AI & DX 수용도 진단 ---
  {
    id: 'q13_ai_level', step: 4, type: 'radio', 
    label: '귀사의 현재 [AI 활용 수준]은 어느 정도입니까?',
    options: ['입문 (개인적으로 사용)', '적용 (일부 부서 활용)', '확산 (전사 도입/교육 중)', '내재화 (자체 모델/자동화)', '무관 (사용 제한/금지)']
  },
  {
    id: 'q14_ai_barrier', step: 4, type: 'check', 
    label: 'AI 교육 도입 시 [가장 큰 장벽]은 무엇입니까?',
    options: ['임직원의 디지털 문해력 격차', '보안 문제 및 데이터 유출 우려', '실무와 동떨어진 이론 위주', '적절한 강사/커리큘럼 부재', '기타'],
    hasOther: true
  },
  { 
    id: 'q15_hackathon', step: 4, type: 'radio', 
    label: '임직원이 직접 결과물을 만드는 [사내 AI 해커톤] 계획이 있으십니까?',
    options: ['계획 있음 (운영 파트너 필요)', '관심 있음 (기획 노하우 부족)', '계획 없으나 제안 받아보고 싶음', '계획 없음']
  },
  { 
    id: 'q16_leader_ai', step: 4, type: 'radio', 
    label: '경영진/리더 대상 [AI 인사이트 교육]이 필요하다고 느끼십니까?',
    options: ['매우 시급함 (Top-Down 변화 필요)', '필요함 (리더 이해도 제고)', '보통 (실무자 우선)', '불필요']
  },
  {
    id: 'q17_app_adopt', step: 4, type: 'rating', max: 5,
    label: '기존 교육에 [실습용 AI 앱(App)]을 보조 도구로 도입할 의향이 있으십니까?',
    labels: ['전혀 없음', '낮음', '보통', '관심 있음', '적극 도입']
  },
  {
    id: 'q18_ai_topic', step: 4, type: 'check', 
    label: '가장 관심 있는 [AI 교육 주제]는 무엇입니까?',
    options: ['업무 자동화 (엑셀/보고서)', '데이터 분석 및 시각화', 'AI 기반 기획/아이디어 도출', '노코드(No-code) 앱 개발', '리더용 AI 코칭/성과관리', '기타'],
    hasOther: true
  },
  // --- Step 5. 예산 및 파트너십 ---
  {
    id: 'q19_budget', step: 5, type: 'radio', 
    label: '2026년 교육 예산 규모의 변동 예상은?',
    options: ['확대 (적극 투자)', '전년 수준 유지', '축소 (비용 절감)', '미정']
  },
  {
    id: 'q20_criteria', step: 5, type: 'check', maxSelect: 2,
    label: '파트너 선정 시 [최우선 기준]은? (최대 2개)',
    subLabel: '최대 2개 선택',
    options: ['맞춤형 커스터마이징 역량', '성과 측정 및 리포팅 시스템', '레퍼런스 및 강사 인지도', '합리적인 비용(가성비)', '기타'],
    hasOther: true
  },
  {
    id: 'q21_timing', step: 5, type: 'radio', 
    label: '본격적인 교육 시작(또는 업체 미팅) 시기는?',
    options: ['1월 ~ 2월 (연초 즉시)', '3월 ~ 4월 (상반기 중)', '5월 이후 (하반기)', '수시 진행']
  },
  {
    id: 'q22_experience', step: 5, type: 'radio',
    label: '올해 [레퍼런스HRD]와 교육을 진행한 경험이 있으신가요?',
    options: ['네, 진행했습니다.', '아니요, 아직 진행해보지 못했습니다.']
  },
  {
    id: 'q23_exp_reason', step: 5, type: 'text',
    label: '선정 이유(또는 미진행 이유)와 향후 파트너십 의향을 자유롭게 들려주세요.',
    placeholder: '선정 사유 또는 의견을 자유롭게 적어주세요'
  },
  {
    id: 'q24_action', step: 5, type: 'radio', 
    label: '레퍼런스HRD의 [2026 AI 교육 제안서]를 받아보시겠습니까?',
    options: ['네, 방문 미팅을 원합니다.', '네, 이메일로 자료를 보고 싶습니다.', '아니요, 추후 필요시 연락하겠습니다.']
  },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;

  const currentQuestions = surveyData.filter(q => q.step === currentStep);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // --- Handlers ---
  const handleChange = (id: string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleMultiSelect = (id: string, option: string, maxSelect?: number) => {
    const current = (answers[id] as string[]) || [];
    let updated;
    if (current.includes(option)) {
      updated = current.filter(item => item !== option);
    } else {
      if (maxSelect && current.length >= maxSelect) {
        alert(`최대 ${maxSelect}개까지 선택 가능합니다.`);
        return;
      }
      updated = [...current, option];
    }
    setAnswers(prev => ({ ...prev, [id]: updated }));
  };

  const handleOtherChange = (id: string, text: string) => {
    setAnswers(prev => ({ ...prev, [`${id}_detail`]: text }));
  };

  const handleNext = async () => {
    // Basic validation
    const missing = currentQuestions.find(q => {
      const val = answers[q.id];
      if (!val) return true;
      if (Array.isArray(val) && val.length === 0) return true;
      return false;
    });

    if (missing) {
      alert('모든 항목에 답변해 주세요.');
      return;
    }

    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Data formatting
    const formattedData: Record<string, string> = {};
    Object.keys(answers).forEach(key => {
        if (key.endsWith('_detail')) return;
        let value = answers[key];
        const detail = answers[`${key}_detail`];
        
        if (Array.isArray(value)) {
            if (value.includes('기타') && detail) {
                value = value.map((v: string) => v === '기타' ? `기타(${detail})` : v);
            }
            formattedData[key] = value.join(', ');
        } else {
            if (value === '기타' && detail) {
                formattedData[key] = `기타(${detail})`;
            } else {
                formattedData[key] = value;
            }
        }
    });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(formattedData),
      });
      setCurrentStep(6);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Intro Screen (Leather Folder Style) ---
  if (currentStep === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 bg-desk font-sans overflow-hidden relative`}>
        
        {/* Binder/Folder Container */}
        <motion.div 
          initial={{ rotateX: 20, opacity: 0, scale: 0.9 }}
          animate={{ rotateX: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: 'spring' }}
          className="max-w-4xl w-full bg-[#1a1a1a] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3)] flex flex-col md:flex-row overflow-hidden border border-gray-700 relative"
        >
           {/* Spine Highlight */}
           <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-gray-700 to-gray-900 z-20 md:block hidden"></div>

           {/* Left Cover (Leather texture dark) */}
           <div className="w-full md:w-5/12 bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] p-10 flex flex-col justify-between relative border-r border-gray-800">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
              
              <div className="z-10 mt-8">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.4)] flex items-center justify-center mb-6 border border-gray-600">
                    <ArrowRight className="text-red-500 w-8 h-8 drop-shadow-[0_0_5px_rgba(226,62,42,0.8)]" strokeWidth={3} />
                 </div>
                 <h1 className="text-4xl font-bold text-gray-200 tracking-tight leading-tight mb-2 text-engraved">
                    2026<br/>
                    <span className="text-red-500 text-shadow-none drop-shadow-[0_0_8px_rgba(226,62,42,0.5)]">CORPORATE</span><br/>
                    EDUCATION
                 </h1>
                 <p className="text-gray-500 text-sm font-medium tracking-widest uppercase mt-4 text-pressed">Reference HRD</p>
              </div>

              <div className="z-10">
                 <div className="inline-block px-3 py-1 bg-black/40 rounded-full border border-white/10 text-xs font-semibold text-gray-400">
                    CONFIDENTIAL SURVEY
                 </div>
              </div>
           </div>

           {/* Right Paper (Paper texture) */}
           <div className="w-full md:w-7/12 paper-texture p-10 flex flex-col justify-center relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-black/10 to-transparent"></div>
              
              <div className="mb-8 space-y-4">
                 <p className="text-gray-700 leading-relaxed font-serif text-lg border-l-4 border-red-500 pl-4 py-1 italic">
                    {surveyData[0].desc}
                 </p>
                 <p className="text-sm font-bold text-red-600 mt-4 uppercase tracking-wide flex items-center gap-2">
                    <Star size={16} fill="currentColor" /> 참여자 전원 스타벅스 기프티콘 증정
                 </p>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => setCurrentStep(1)}
                className="group relative w-full py-5 rounded-lg glossy-red text-white font-bold text-lg uppercase tracking-widest transition-all active:scale-[0.99] flex items-center justify-center gap-3"
              >
                <span className="drop-shadow-md">설문 시작하기</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-inner group-hover:bg-white/30 transition-colors">
                  <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </div>
              </button>

              <div className="mt-8 flex items-center justify-center gap-6 text-gray-400">
                 <div className="flex flex-col items-center">
                    <span className="text-2xl mb-1 drop-shadow-sm">🎁</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Starbucks</span>
                 </div>
                 <div className="w-px h-8 bg-gray-300"></div>
                 <div className="flex flex-col items-center">
                    <span className="text-2xl mb-1 drop-shadow-sm">⏱</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">3 Minutes</span>
                 </div>
              </div>

              <div className="mt-8 text-[10px] text-gray-400 text-center leading-relaxed">
                  <p>본 설문은 레퍼런스HRD가 AI코딩으로 직접 개발한 설문 플랫폼으로 만들어졌습니다.</p>
                  <p className="mt-1 font-mono">© 2026 REFERENCE HRD. All Rights Reserved.</p>
              </div>
           </div>
        </motion.div>
      </div>
    );
  }

  // --- Outro Screen ---
  if (currentStep === 6) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 bg-desk font-sans`}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full paper-texture rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.4)_inset] relative overflow-hidden"
        >
          {/* Metal Top Bar */}
          <div className="h-16 metal-gradient border-b border-gray-300 flex items-center justify-center shadow-sm">
             <div className="w-20 h-1 bg-gray-300 rounded-full shadow-inner"></div>
          </div>
          
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-b from-green-500 to-green-600 shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.4)] mb-8 border border-green-700">
               <Check size={40} className="text-white drop-shadow-md" strokeWidth={4} />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-engraved tracking-tight">제출 완료</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 shadow-inner">
               <p className="text-yellow-800 font-medium text-sm">
                 🎁 기프티콘은 1주일 이내<br/>입력하신 연락처로 발송됩니다.
               </p>
            </div>

            <p className="text-gray-600 leading-relaxed font-medium mb-8">
              소중한 의견 감사드립니다.<br/>
              <strong>레퍼런스HRD</strong>가 함께하겠습니다.
            </p>
            
            <div className="space-y-3">
              <a 
                href="https://blog.naver.com/referencehrd" 
                target="_blank" 
                rel="noreferrer"
                className="block w-full py-4 rounded-lg btn-neutral text-gray-700 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
              >
                블로그 바로가기 <ExternalLink size={16} />
              </a>
              
              <div className="rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 p-4 text-white shadow-inner border border-gray-700">
                 <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Contact</div>
                 <div className="flex justify-between items-center text-sm font-medium">
                    <span className="flex items-center gap-2"><Mail size={14} className="text-red-500"/> help@referencehrd.com</span>
                    <span className="w-px h-4 bg-gray-700"></span>
                    <span className="flex items-center gap-2"><Phone size={14} className="text-red-500"/> 070-4647-4757</span>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Survey Steps ---
  return (
    <div className={`min-h-screen flex flex-col font-sans text-gray-800 bg-desk overflow-x-hidden`}>
      
      {/* Metallic Header */}
      <div className="sticky top-0 z-50 metal-gradient border-b border-gray-400 shadow-lg">
         <div className="max-w-3xl mx-auto px-6 py-3 flex justify-between items-center">
            {/* LED Indicator Panel */}
            <div className="flex items-center gap-3 bg-black/10 rounded-full px-3 py-1 shadow-inner border border-white/40">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)] animate-pulse"></div>
                <span className="text-xs font-bold text-gray-600 font-mono tracking-widest">REC</span>
            </div>
            
            <div className="font-bold text-xs tracking-widest text-gray-500 shadow-emboss">
               REFERENCE HRD
            </div>
         </div>
         {/* Trough Progress Bar */}
         <div className="h-2 bg-gray-300 w-full relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
            <motion.div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {/* Gloss effect on progress bar */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/40"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/20"></div>
            </motion.div>
         </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-start pt-8 pb-32 px-4 md:px-0">
        <div className="max-w-2xl w-full">
            {/* Paper Container */}
            <div className="paper-texture rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.5)_inset] p-8 md:p-12 min-h-[60vh] relative border-t-4 border-gray-200">
                
                {/* Step Counter Badge */}
                <div className="absolute top-6 right-8">
                     <span className="text-6xl font-black text-gray-200 select-none drop-shadow-sm font-serif italic">
                         {currentStep}
                     </span>
                </div>

                <AnimatePresence mode='wait' custom={direction}>
                <motion.div
                    key={currentStep}
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-10 relative z-10"
                >
                    {currentQuestions.map((q) => (
                    <div key={q.id} className="relative group">
                        {/* Question Title */}
                        <div className="mb-8 pr-12">
                            <label className="block text-xl md:text-2xl font-bold leading-tight tracking-tight mb-3 text-gray-800 text-engraved">
                            {q.label.split('[').map((part, i) => (
                                i === 0 ? part : (
                                    <span key={i} className="inline-block text-red-700 font-extrabold px-1 relative">
                                        {part.split(']')[0]}
                                        <span className="text-gray-800 font-bold">{part.split(']')[1]}</span>
                                    </span>
                                )
                            ))}
                            </label>
                            {q.subLabel && (
                                <div className="inline-block bg-gray-200 border border-gray-300 rounded px-2 py-0.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider shadow-sm">
                                    {q.subLabel}
                                </div>
                            )}
                        </div>

                        {/* --- Inputs --- */}
                        
                        {/* 1. Text / Tel */}
                        {(q.type === 'text' || q.type === 'tel') && (
                            <div className="relative">
                                <input
                                    type={q.type}
                                    placeholder={q.placeholder}
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleChange(q.id, e.target.value)}
                                    className="w-full p-4 text-lg font-medium rounded-lg input-inset text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                                    {q.type === 'tel' ? <Phone size={20} /> : <span className="text-xl">✎</span>}
                                </div>
                            </div>
                        )}

                        {/* 2. Radio */}
                        {q.type === 'radio' && q.options && (
                            <div className="grid gap-3">
                                {q.options.map((opt, idx) => {
                                    const isSelected = answers[q.id] === opt;
                                    return (
                                    <div key={opt}>
                                        <button
                                            onClick={() => handleChange(q.id, opt)}
                                            className={`w-full p-4 rounded-lg text-left transition-all flex items-center justify-between group/btn relative overflow-hidden ${
                                                isSelected 
                                                ? 'btn-pressed text-red-700 font-bold' 
                                                : 'btn-neutral text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="relative z-10 text-base">{opt}</span>
                                            {/* Physical Switch/Radio Indicator */}
                                            <div className={`w-6 h-6 rounded-full border shadow-inner flex items-center justify-center transition-all ${
                                                isSelected 
                                                ? 'bg-red-500 border-red-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]' 
                                                : 'bg-gray-200 border-gray-300'
                                            }`}>
                                                {isSelected && <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"></div>}
                                            </div>
                                        </button>
                                        
                                        {/* Etc Detail */}
                                        {q.hasOther && isSelected && opt === '기타' && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                className="mt-2 ml-4"
                                            >
                                                <input 
                                                    type="text" 
                                                    placeholder="내용을 입력해 주세요"
                                                    value={answers[`${q.id}_detail`] || ''}
                                                    onChange={(e) => handleOtherChange(q.id, e.target.value)}
                                                    className="w-full p-3 text-sm rounded-md input-inset focus:outline-none"
                                                    autoFocus
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                )})}
                            </div>
                        )}

                        {/* 3. Checkbox */}
                        {q.type === 'check' && q.options && (
                            <div className="grid gap-3">
                                {q.options.map((opt) => {
                                const isSelected = ((answers[q.id] as string[]) || []).includes(opt);
                                return (
                                    <div key={opt}>
                                        <button
                                            onClick={() => handleMultiSelect(q.id, opt, q.maxSelect)}
                                            className={`w-full p-4 rounded-lg transition-all flex items-center justify-between shadow-sm active:translate-y-[1px] ${
                                                isSelected 
                                                ? 'btn-pressed ring-1 ring-red-400 text-red-800' 
                                                : 'btn-neutral text-gray-700'
                                            }`}
                                        >
                                            <span className="font-bold text-base">{opt}</span>
                                            {/* Physical Square Checkbox */}
                                            <div className={`w-6 h-6 rounded border transition-all flex items-center justify-center shadow-inner ${
                                                isSelected 
                                                ? 'bg-gradient-to-b from-red-500 to-red-600 border-red-700' 
                                                : 'bg-gray-100 border-gray-300'
                                            }`}>
                                                {isSelected && <Check size={14} className="text-white drop-shadow-md" strokeWidth={4} />}
                                            </div>
                                        </button>
                                        {/* Etc Detail */}
                                        {q.hasOther && isSelected && opt === '기타' && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                className="mt-2"
                                            >
                                                <input 
                                                    type="text" 
                                                    placeholder="내용을 입력해 주세요"
                                                    value={answers[`${q.id}_detail`] || ''}
                                                    onChange={(e) => handleOtherChange(q.id, e.target.value)}
                                                    className="w-full p-3 text-sm rounded-md input-inset focus:outline-none"
                                                    autoFocus
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                );
                                })}
                            </div>
                        )}

                        {/* 4. Rating */}
                        {q.type === 'rating' && q.labels && (
                            <div className="py-6">
                                <div className="flex justify-between max-w-lg mx-auto mb-8 bg-gray-200/50 p-2 rounded-xl shadow-inner border border-white/40">
                                    {[1, 2, 3, 4, 5].map((score) => (
                                    <button
                                        key={score}
                                        onClick={() => handleChange(q.id, score)}
                                        className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center font-black text-xl transition-all relative ${
                                            answers[q.id] >= score 
                                            ? 'glossy-red text-white z-10 scale-105' 
                                            : 'btn-neutral text-gray-400 hover:text-gray-600 z-0'
                                        }`}
                                    >
                                        {score}
                                    </button>
                                    ))}
                                </div>
                                
                                <div className="text-center h-8">
                                    {answers[q.id] && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="inline-block bg-white border border-gray-200 text-red-600 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm"
                                        >
                                            {q.labels[answers[q.id]-1]}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    ))}
                </motion.div>
                </AnimatePresence>
            </div>
        </div>
      </div>

      {/* Footer Navigation Panel (Metallic) */}
      <div className="fixed bottom-0 left-0 w-full metal-dark border-t border-gray-600 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex gap-4">
            <button
                onClick={() => {
                    if(currentStep > 1) {
                        setDirection(-1);
                        setCurrentStep(prev => prev - 1);
                    }
                }}
                disabled={currentStep === 1 || isSubmitting}
                className={`w-1/3 py-4 rounded-lg font-bold uppercase tracking-widest text-sm shadow-lg transition-all active:scale-[0.98] ${
                    currentStep === 1 
                    ? 'opacity-40 cursor-not-allowed bg-gray-700 text-gray-500 border border-gray-600' 
                    : 'metal-gradient text-gray-700 border border-white/50 active:shadow-inner'
                }`}
            >
                이전
            </button>

            <button
                onClick={handleNext}
                disabled={isSubmitting}
                className={`w-2/3 py-4 rounded-lg font-bold text-base uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] active:translate-y-[1px] ${
                    isSubmitting 
                    ? 'bg-gray-600 text-gray-400 cursor-wait' 
                    : 'glossy-red text-white border border-red-800'
                }`}
            >
                {isSubmitting ? (
                <><Loader2 className="animate-spin" /> 제출 중...</>
                ) : currentStep === totalSteps ? (
                <><Send size={20} /> 설문 제출하기</>
                ) : (
                <>다음 <ChevronRight size={20} strokeWidth={3} /></>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}