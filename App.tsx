import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Check, Send, Loader2, Mail, Phone, ExternalLink, 
  ArrowRight, Star, Sparkles, AlertCircle, X, Settings, Lock, Calendar, Power,
  LayoutDashboard, PieChart as PieChartIcon, BarChart3, Users, FileText, List, Download, Printer, RefreshCw, AlertTriangle, Database,
  TrendingUp, Target, ShieldAlert, Lightbulb, BrainCircuit, Quote
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

/**
 * [설정] Google Apps Script Web App URL
 */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUEixugpvQ-fVrAvyHAGmIhgQEXhpMV6WKM1fTL0_u6Gb15idi6ksn4R0hWpGhtuotKA/exec";
const ADMIN_PASSWORD = "reference1234";

// ----------------------------------------------------------------------
// [디자인 테마] Modern Clean & Pop
// ----------------------------------------------------------------------
const theme = {
  bg: "bg-gray-100", 
  card: "bg-white shadow-xl rounded-2xl", 
  primary: "bg-[#5B4EF5]", 
  primaryText: "text-[#5B4EF5]",
  text: "text-gray-900", 
  subText: "text-gray-500",
  border: "border-gray-200",
  input: "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:border-[#5B4EF5] focus:ring-2 focus:ring-[#5B4EF5]/20 focus:outline-none transition-all",
  button: "bg-[#5B4EF5] text-white hover:bg-[#4538C9] transition-colors rounded-lg font-bold shadow-lg shadow-[#5B4EF5]/30",
  activeOption: "bg-[#5B4EF5] text-white border-[#5B4EF5] shadow-md transform scale-[1.02]",
  inactiveOption: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-[#5B4EF5]/50",
};

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
    desc: `변화의 최전선에 계신 담당자님,\n2025년 한 해도 정말 치열하게 달려오셨습니다.\n\n2026년에도 담당자님의 고민(?)이\n조직의 성과(!)로 이어질 수 있도록\n레퍼런스HRD가 든든한 파트너가 되겠습니다.`,
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
  {
    id: 'email', step: 1, type: 'email', 
    label: '이메일 주소를 입력해 주세요.', placeholder: 'example@company.com'
  },
  {
    id: 'privacy', step: 1, type: 'check', 
    label: '개인정보 수집 및 이용 동의안내',
    description: `1. 개인정보의 수집·이용 목적: 제안서 발송\n2. 개인정보 수집 항목: 소속, 이름, 연락처\n3. 제공받는 자: 레퍼런스에이치알디\n4. 개인정보 보유 및 이용 기간: 이용 목적이 달성되거나 보유가 불필요하다고 판단될 경우, 내부 방침에 따라 안전하게 파기`,
    options: ['동의합니다']
  },
  // --- Step 2. 2025 회고 ---
  {
    id: 'q5_score', step: 2, type: 'rating', max: 5,
    label: '2025년 귀사의 교육 성과를 점수로 매긴다면?',
    labels: ['매우 불만족', '불만족', '보통', '만족', '매우 만족']
  },
  {
    id: 'q6_best', step: 2, type: 'radio', 
    label: '올해 진행한 교육 중 [가장 평가가 좋았던] 분야는?',
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
    options: ['신입/경력 입문 교육', '승진자/직급별 리더십', '생성형 AI 실무 활용', '직무 전문교육(영업/마케팅 등)', '전사 워크숍/비전 내재화', '기타'],
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
    options: ['1~2일 집중 워크숍', '2~3개월 장기 프로젝트', '2~3시간 짧은 특강', '온라인/비대면 학습', '기타'],
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
    label: '기존 교육에 [AI가 결합된 앱(App)]을 교육 보조 도구로 도입할 의향이 있으십니까?',
    labels: ['전혀 없음', '낮음', '보통', '관심 있음', '적극 도입']
  },
  {
    id: 'q18_ai_topic', step: 4, type: 'check', 
    label: '가장 관심 있는 [AI 교육 주제]는 무엇입니까?',
    options: ['업무 자동화 (엑셀/보고서)', '데이터 분석 및 시각화', 'AI 기반 기획/아이디어 도출', '노코드(No-code) 앱 개발/바이브 코딩', '리더용 AI 코칭/성과관리', '기타'],
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
    label: '교육 파트너 선정 시 [최우선 기준]은? (최대 2개)',
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
    label: '레퍼런스HRD 선정 이유(또는 미진행 이유)와 향후 파트너십 의향에 대해 자유롭게 알려주세요.',
    placeholder: '선정 사유 또는 의견을 자유롭게 적어주세요'
  },
  {
    id: 'q24_action', step: 5, type: 'radio', 
    label: '레퍼런스HRD의 [2026 교육 제안]을 받아보시겠습니까?',
    options: ['네, 직접 만나서 이야기하고 싶습니다.', '네, 우선 이메일로 자료를 보고 싶습니다.', '아니요, 추후 필요시 연락하겠습니다.']
  },
];

const CHART_COLORS = ['#5B4EF5', '#FF6B6B', '#4ECDC4', '#FFD166', '#A06CD5', '#2A2A72', '#009ffd'];

// ----------------------------------------------------------------------
// [Types] Analytics Data Structure
// ----------------------------------------------------------------------
// Fix: Added index signature to satisfy Recharts type requirements
interface ChartItem {
  name: string;
  value: number;
  [key: string]: any;
}

interface AnalyticsData {
  overview: {
    totalResponses: number;
    avgSatisfaction: number;
    topKeywords: ChartItem[];
    aiAdoption: ChartItem[];
  };
  details: Record<string, ChartItem[]>;
  isMock?: boolean;
}

// ----------------------------------------------------------------------
// [Utils] Mock Data Generator
// ----------------------------------------------------------------------
const getMockData = (): AnalyticsData => {
  const baseData: AnalyticsData = {
    overview: {
      totalResponses: 142,
      avgSatisfaction: 4.2,
      topKeywords: [
        { name: 'AX/AI전환', value: 89 },
        { name: '데이터경영', value: 45 },
        { name: '소통/리더십', value: 62 },
        { name: '회복탄력성', value: 34 },
        { name: 'DEI', value: 21 },
      ],
      aiAdoption: [
        { name: '입문', value: 30 },
        { name: '적용', value: 45 },
        { name: '확산', value: 15 },
        { name: '내재화', value: 5 },
        { name: '무관', value: 5 },
      ],
    },
    details: {},
    isMock: true
  };

  // Generate details for all questions
  surveyData.forEach(q => {
    if (q.step > 1 && (q.type === 'radio' || q.type === 'check' || q.type === 'rating')) {
      if (q.options) {
        baseData.details[q.id] = q.options.map(opt => ({
          name: opt,
          value: Math.floor(Math.random() * 50) + 10
        }));
      } else if (q.type === 'rating' && q.labels) {
        baseData.details[q.id] = [
           { name: '1점', value: Math.floor(Math.random() * 10) },
           { name: '2점', value: Math.floor(Math.random() * 20) },
           { name: '3점', value: Math.floor(Math.random() * 40) + 20 },
           { name: '4점', value: Math.floor(Math.random() * 50) + 30 },
           { name: '5점', value: Math.floor(Math.random() * 30) + 10 },
        ];
      }
    }
  });

  // Override specific data for overview consistency
  baseData.details['q9_keywords'] = baseData.overview.topKeywords;
  
  return baseData;
};

// ----------------------------------------------------------------------
// [Component] Overview Tab
// ----------------------------------------------------------------------
const AnalyticsOverview = ({ data }: { data: AnalyticsData }) => {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#5B4EF5] to-[#4538C9] p-5 rounded-2xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Users size={18} />
            <span className="text-sm font-medium">총 응답자 수</span>
          </div>
          <div className="text-4xl font-black">{data.overview.totalResponses}명</div>
          <div className="text-xs mt-2 opacity-70">실시간 집계 중</div>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Star size={18} className="text-yellow-400" fill="currentColor" />
            <span className="text-sm font-medium">평균 만족도 (2025)</span>
          </div>
          <div className="text-4xl font-black text-gray-900">{data.overview.avgSatisfaction}<span className="text-lg text-gray-400 font-normal">/5.0</span></div>
          {/* Visual warning if score is 0 but responses exist */}
          {Number(data.overview.avgSatisfaction) === 0 && data.overview.totalResponses > 0 && (
             <div className="text-xs text-red-400 mt-2 flex items-center gap-1 font-medium bg-red-50 p-2 rounded-lg">
                <AlertTriangle size={12} /> 데이터 집계 불가 (시트 헤더 확인 필요)
             </div>
          )}
          <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-yellow-400" style={{ width: `${(Number(data.overview.avgSatisfaction)/5)*100}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center">
             <div className="text-sm text-gray-500 font-bold mb-1">가장 많이 선택된 키워드</div>
             <div className="text-2xl font-black text-[#5B4EF5]">
               {data.overview.topKeywords && data.overview.topKeywords.length > 0 
                  ? data.overview.topKeywords[0]?.name 
                  : '-'}
             </div>
             <div className="text-xs text-gray-400 mt-1">
               {data.overview.topKeywords && data.overview.topKeywords.length > 0 
                  ? `${data.overview.topKeywords[0]?.value}표 획득` 
                  : '0표 획득'}
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Keywords Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-[#5B4EF5]" /> 2026 핵심 키워드 TOP 5
            </h3>
          </div>
          <div className="h-64">
            {data.overview.topKeywords && data.overview.topKeywords.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.overview.topKeywords} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                  <Bar dataKey="value" fill="#5B4EF5" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                <BarChart3 size={32} />
                <span className="text-sm">데이터가 없습니다</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Adoption Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <PieChartIcon size={20} className="text-[#5B4EF5]" /> 기업 AI 활용 단계
            </h3>
          </div>
          <div className="h-64">
             {data.overview.aiAdoption && data.overview.aiAdoption.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.overview.aiAdoption}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.overview.aiAdoption.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
             ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                <PieChartIcon size={32} />
                <span className="text-sm">데이터가 없습니다</span>
              </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// [Component] Detail Stats Tab (By Question)
// ----------------------------------------------------------------------
const AnalyticsDetails = ({ data }: { data: AnalyticsData }) => {
  // Filter out intro and basic text fields for visualization
  const targetQuestions = surveyData.filter(q => 
    q.step > 1 && (q.type === 'radio' || q.type === 'check' || q.type === 'rating')
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {targetQuestions.map((q, index) => {
        // Use fetched data if exists, otherwise empty
        const chartData = data.details[q.id] || [];
        const hasData = chartData.length > 0;
        
        return (
          <div key={q.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
               <div>
                  <span className="text-xs font-bold text-[#5B4EF5] mb-1 block">Q{index + 1}. {q.step}단계</span>
                  <h3 className="font-bold text-gray-900 text-lg">{q.label.replace(/\n/g, ' ')}</h3>
               </div>
               <div className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500 font-medium whitespace-nowrap self-start">
                  응답 집계
               </div>
             </div>
             
             <div className="h-60 w-full">
               {hasData ? (
                 <ResponsiveContainer width="100%" height="100%">
                   {q.type === 'radio' ? (
                     // Pie Chart for Single Choice
                     <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {chartData.map((entry:any, idx:number) => (
                            <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                     </PieChart>
                   ) : (
                     // Bar Chart for Multi Choice / Rating
                     <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} interval={0} />
                        <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                        <Bar dataKey="value" fill="#5B4EF5" radius={[0, 4, 4, 0]} barSize={24} name="응답 수" />
                     </BarChart>
                   )}
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                   <AlertTriangle size={24} className="text-gray-300" />
                   <div className="text-center">
                    <span className="text-sm font-bold text-gray-400 block">데이터 없음</span>
                    <span className="text-xs text-gray-400">시트의 '{q.id}' 컬럼을 확인하세요.</span>
                   </div>
                 </div>
               )}
             </div>
          </div>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------------------------
// [Component] Insight Report Tab
// ----------------------------------------------------------------------
const AnalyticsReport = ({ data }: { data: AnalyticsData }) => {
  // Helper to safely get top items
  const getTopItems = (key: string, n: number = 3) => {
    return (data.details[key] || []).slice(0, n);
  };

  // Helper to get formatted string list
  const getTopItemsString = (key: string, n: number = 3) => {
    const items = getTopItems(key, n);
    return items.length > 0 ? items.map(i => i.name).join(', ') : '데이터 수집 중';
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500 max-w-4xl mx-auto overflow-hidden">
      {/* Report Header */}
      <div className="bg-[#5B4EF5] p-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
         <div className="relative z-10 flex justify-between items-end">
           <div>
              <div className="flex items-center gap-2 text-indigo-200 mb-2">
                 <Sparkles size={16} className="text-yellow-300" />
                 <span className="text-xs font-bold tracking-widest uppercase">Premium Analytics</span>
              </div>
              <h2 className="text-3xl font-black mb-1">2026 HRD Insight Report</h2>
              <p className="text-indigo-200 text-sm">Generated by Reference HRD AI • {today}</p>
           </div>
           <div className="flex gap-2">
              <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors text-white" title="Print">
                <Printer size={20} />
              </button>
           </div>
         </div>
      </div>

      <div className="p-8 space-y-10">
         
         {/* 1. Executive Summary */}
         <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
               <Quote size={20} className="text-[#5B4EF5]" /> Executive Summary
            </h3>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-700 leading-relaxed text-sm">
               본 리포트는 총 <span className="font-bold text-[#5B4EF5]">{data.overview.totalResponses}명</span>의 HRD 담당자를 대상으로 수집된 데이터를 분석한 결과입니다.
               2025년 교육 만족도는 평균 <span className="font-bold text-[#5B4EF5]">{data.overview.avgSatisfaction}점</span>(5점 만점)으로 집계되었으며,
               대다수의 기업이 <strong>'{getTopItemsString('q9_keywords', 1)}'</strong>를 차년도 최우선 과제로 선정했습니다.
               <br/><br/>
               특히, AI/DX 전환에 대한 니즈가 강력하게 포착되었으나 도입 장벽(보안, 문해력 등) 또한 존재하여, 
               이를 해소할 수 있는 <strong>'단계별 맞춤형 커리큘럼'</strong> 도입이 2026년 성패의 열쇠가 될 것으로 전망됩니다.
            </div>
         </section>

         {/* 2. 2025 Retrospective */}
         <section>
             <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
               <TrendingUp size={20} className="text-[#5B4EF5]" /> 2025 교육 운영 회고
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
                  <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">주요 페인 포인트 (Pain Points)</h4>
                  <ul className="space-y-3">
                     {getTopItems('q7_pain', 3).map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between text-sm">
                           <span className="flex items-center gap-2 text-gray-700">
                              <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold">{idx+1}</span>
                              {item.name}
                           </span>
                           <span className="font-bold text-gray-400 text-xs">{item.value}표</span>
                        </li>
                     ))}
                     {getTopItems('q7_pain').length === 0 && <li className="text-gray-400 text-xs">데이터 수집 중...</li>}
                  </ul>
               </div>
               <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
                  <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">가장 성공적이었던 분야 (Best)</h4>
                  <ul className="space-y-3">
                     {getTopItems('q6_best', 3).map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between text-sm">
                           <span className="flex items-center gap-2 text-gray-700">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs font-bold">{idx+1}</span>
                              {item.name}
                           </span>
                           <span className="font-bold text-gray-400 text-xs">{item.value}표</span>
                        </li>
                     ))}
                     {getTopItems('q6_best').length === 0 && <li className="text-gray-400 text-xs">데이터 수집 중...</li>}
                  </ul>
               </div>
            </div>
         </section>

         {/* 3. 2026 Strategy Forecast */}
         <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
               <Target size={20} className="text-[#5B4EF5]" /> 2026 HRD 전략 방향성
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-[#5B4EF5] to-[#8075FF] p-6 rounded-xl text-white shadow-md mb-2">
                  <h4 className="text-indigo-100 text-xs font-bold uppercase mb-2">Top 1 Strategic Keyword</h4>
                  <div className="text-3xl font-black">
                     {getTopItems('q9_keywords', 1)[0]?.name || 'Analyzing...'}
                  </div>
                  <p className="text-xs text-indigo-100 mt-2 opacity-80">
                     응답자의 다수가 선택한 2026년 핵심 아젠다입니다.
                  </p>
               </div>
               
               <div className="p-5 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">필수 교육 과정</h4>
                  <div className="flex flex-wrap gap-2">
                     {getTopItems('q10_must', 3).map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 shadow-sm">
                           {item.name}
                        </span>
                     ))}
                  </div>
               </div>
               
               <div className="p-5 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">최우선 타겟</h4>
                  <div className="flex flex-wrap gap-2">
                     {getTopItems('q11_target', 2).map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 shadow-sm">
                           {item.name}
                        </span>
                     ))}
                  </div>
               </div>

               <div className="p-5 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">선호 운영 방식</h4>
                  <div className="text-sm text-gray-600 font-medium">
                     {getTopItems('q12_type', 1)[0]?.name || '-'}
                  </div>
               </div>
            </div>
         </section>

         {/* 4. AI Readiness Deep Dive */}
         <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
               <BrainCircuit size={20} className="text-[#5B4EF5]" /> AI/DX 도입 및 활용 현황
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <h4 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
                     <ShieldAlert size={16} className="text-orange-500" /> 가장 큰 도입 장벽
                  </h4>
                  <div className="space-y-3">
                     {getTopItems('q14_ai_barrier', 3).map((item, i) => (
                        <div key={i}>
                           <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-700 font-medium">{item.name}</span>
                              <span className="text-gray-400">{item.value}건</span>
                           </div>
                           <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div className="bg-orange-400 h-1.5 rounded-full" style={{width: `${Math.min((item.value/data.overview.totalResponses)*100*2, 100)}%`}}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
                     <Lightbulb size={16} className="text-yellow-500" /> 가장 관심있는 주제
                  </h4>
                  <div className="space-y-3">
                     {getTopItems('q18_ai_topic', 3).map((item, i) => (
                        <div key={i}>
                           <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-700 font-medium">{item.name}</span>
                              <span className="text-gray-400">{item.value}건</span>
                           </div>
                           <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div className="bg-yellow-400 h-1.5 rounded-full" style={{width: `${Math.min((item.value/data.overview.totalResponses)*100*2, 100)}%`}}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* 5. Expert Advice */}
         <section className="bg-slate-900 text-white p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#5B4EF5] opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-lg font-bold mb-4 relative z-10 flex items-center gap-2">
               <span className="bg-[#5B4EF5] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Expert</span>
               Reference HRD 제언
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-sm text-slate-300 leading-relaxed">
               <div>
                  <h4 className="text-white font-bold mb-2">1. Bottom-up 변화 관리</h4>
                  <p>
                     AI 도입의 가장 큰 장벽인 '{getTopItems('q14_ai_barrier', 1)[0]?.name || '디지털 격차'}'를 해소하기 위해선, 
                     탑다운 방식의 지시보다는 임직원이 직접 자신의 업무를 자동화해보는 
                     <strong>'Small Win' 경험 중심의 워크숍</strong>이 효과적입니다.
                  </p>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-2">2. 실무 밀착형 커리큘럼</h4>
                  <p>
                     '{getTopItems('q18_ai_topic', 1)[0]?.name || '데이터/자동화'}'에 대한 높은 관심도는 이론이 아닌 '도구'로서의 AI 교육을 원한다는 신호입니다. 
                     범용적인 툴 교육보다는 우리 회사의 실제 데이터를 활용하는 <strong>커스터마이징 과정</strong>을 추천합니다.
                  </p>
               </div>
            </div>
         </section>

         <div className="text-center pt-8 text-xs text-gray-400">
            © 2026 REFERENCE HRD. All Rights Reserved.
         </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// [Main Component] Analytics Dashboard Container
// ----------------------------------------------------------------------
const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'report'>('overview');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch data with specific type 'analytics' and cache busting
      // [FIX] Use credentials: omit for public GET requests to avoid CORS issues with redirects
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?type=analytics&_t=${new Date().getTime()}`, {
        method: "GET",
        credentials: "omit",
        redirect: "follow"
      });
      
      if (!response.ok) throw new Error("Network response was not ok");

      const jsonData = await response.json();
      console.log('Fetched Analytics:', jsonData); // Debugging log
      
      // Basic validation to ensure data structure
      if (jsonData && jsonData.overview) {
        setData(jsonData);
      } else {
         throw new Error("Invalid data format");
      }
    } catch (err) {
      console.warn("Failed to fetch analytics, falling back to mock data:", err);
      // Fallback: Use mock data instead of showing error
      setData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header Info */}
      <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-start gap-3">
         <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Database size={18} />
         </div>
         <div className="flex-grow">
            <h4 className="text-sm font-bold text-blue-900">데이터 연결 상태 확인</h4>
            <p className="text-xs text-blue-700 mt-1 leading-snug">
               만약 데이터가 0건이거나 차트가 보이지 않는다면, 구글 시트의 <strong>'Responses'</strong> 탭을 삭제 후 다시 설문을 제출해 보세요.<br/>
               <span className="opacity-70">* 새로운 질문 항목에 맞는 헤더가 자동으로 다시 생성됩니다.</span>
            </p>
         </div>
      </div>

      {/* Tab Navigation & Refresh */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-1 mt-4">
        <div className="flex gap-2 px-1 overflow-x-auto">
            <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'overview' 
                ? 'bg-[#5B4EF5] text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            >
            <LayoutDashboard size={16} /> 종합 대시보드
            </button>
            <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'details' 
                ? 'bg-[#5B4EF5] text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            >
            <List size={16} /> 문항별 상세 분석
            </button>
            <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'report' 
                ? 'bg-[#5B4EF5] text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            >
            <FileText size={16} /> 인사이트 리포트
            </button>
        </div>
        
        <button 
            onClick={fetchAnalytics}
            className="p-2 text-gray-400 hover:text-[#5B4EF5] hover:bg-gray-100 rounded-full transition-colors"
            title="새로고침"
        >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto pb-10">
        {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
                <Loader2 size={32} className="animate-spin text-[#5B4EF5]" />
                <p className="text-sm font-medium">데이터 분석 중...</p>
            </div>
        ) : error ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-500">
                <AlertCircle size={32} className="text-red-400" />
                <p className="text-sm">{error}</p>
                <button onClick={fetchAnalytics} className="text-[#5B4EF5] underline text-sm">다시 시도</button>
            </div>
        ) : data ? (
            <>
                {activeTab === 'overview' && <AnalyticsOverview data={data} />}
                {activeTab === 'details' && <AnalyticsDetails data={data} />}
                {activeTab === 'report' && <AnalyticsReport data={data} />}
            </>
        ) : null}
      </div>

      <div className="text-xs text-center mt-4 bg-gray-50 p-2 rounded-lg shrink-0 flex flex-col gap-1">
        <p className="text-gray-400">* Google Spreadsheets의 데이터를 실시간으로 시각화합니다.</p>
        {data?.isMock && (
          <p className="text-[#5B4EF5] font-medium flex items-center justify-center gap-1">
            <AlertCircle size={10} /> 서버 연결에 실패하여 체험용 샘플 데이터를 표시합니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;

  // --- UI States for Modals ---
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  
  // --- Admin States ---
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTab, setAdminTab] = useState<'settings' | 'analytics'>('settings'); // Admin Tab State
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [isSaving, setIsSaving] = useState(false); // Add saving state
  
  // Initialize with a safe default, will be updated from server
  const [adminConfig, setAdminConfig] = useState({ 
    isActive: false, // Default to closed until fetched
    startDate: '', 
    endDate: '' 
  });
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  // --- Survey Status State ---
  const [surveyStatus, setSurveyStatus] = useState<'OPEN' | 'CLOSED' | 'NOT_STARTED'>('OPEN');

  const currentQuestions = surveyData.filter(q => q.step === currentStep);

  // 1. Fetch Config from Server on Mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // [Change] Add query param to differentiate from survey post and analytics get
        // [Change] Add cache buster
        // [Change] Add credentials: omit to avoid browser sending cookies which fails GAS CORS
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?type=config&_t=${new Date().getTime()}`, {
            method: "GET",
            credentials: "omit",
            redirect: "follow",
        });
        
        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Ensure data exists and has correct types
        if (data) {
          // Helper to safely format date to YYYY-MM-DD for input[type=date]
          const toDateStr = (str: string) => {
            if(!str) return '';
            try {
              // Handle ISO strings or various date formats by letting Date parse it
              // Adjust for timezone offset if necessary, but simple ISO slice is usually enough for local dates if source is UTC midnight
              return new Date(str).toISOString().split('T')[0];
            } catch(e) { return ''; }
          };

          setAdminConfig({
            isActive: data.isActive === true, // Strict boolean check or fallback
            startDate: toDateStr(data.startDate),
            endDate: toDateStr(data.endDate)
          });
        }
      } catch (error) {
        console.warn("Failed to fetch admin config (using default open state):", error);
        // Fallback: Open by default so the app isn't broken
        setAdminConfig({ isActive: true, startDate: '', endDate: '' });
      } finally {
        setIsConfigLoaded(true);
      }
    };

    fetchConfig();
  }, []);

  // 2. Check Availability based on adminConfig
  useEffect(() => {
    if (!isConfigLoaded) return; // Wait until loaded

    const checkAvailability = () => {
      const now = new Date();
      if (!adminConfig.isActive) {
        setSurveyStatus('CLOSED');
        return;
      }
      if (adminConfig.startDate) {
        const start = new Date(adminConfig.startDate);
        start.setHours(0, 0, 0, 0); // Start of day
        if (now < start) {
          setSurveyStatus('NOT_STARTED');
          return;
        }
      }
      if (adminConfig.endDate) {
        const end = new Date(adminConfig.endDate);
        end.setHours(23, 59, 59, 999); // End of day
        if (now > end) {
          setSurveyStatus('CLOSED');
          return;
        }
      }
      setSurveyStatus('OPEN');
    };
    checkAvailability();
  }, [adminConfig, isConfigLoaded]);

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
    const missing = currentQuestions.filter(q => {
      const val = answers[q.id];
      if (!val) return true;
      if (Array.isArray(val) && val.length === 0) return true;
      return false;
    });

    if (missing.length > 0) {
      setMissingFields(missing.map(q => q.label.replace(/\[.*?\]/g, '').replace(/\n/g, ' ').trim().split('.')[0]));
      setShowValidationModal(true);
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
    // Don't increment currentStep yet. Wait until finish or error.
    
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

    // Ensure all defined questions are present in formattedData, even if empty
    // This maintains column alignment if the server relies on map-by-header logic.
    surveyData.forEach(q => {
        if (q.id !== 'intro' && !formattedData[q.id]) {
            formattedData[q.id] = "";
        }
    });

    // Debug log to verify data
    console.log('Submission Data:', formattedData);

    // [FIX] Increase timeout to 15s to allow for GAS cold starts
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request Timeout')), 15000)
    );

    try {
      // Send with type: 'survey'
      // Using Promise.race to handle potential hangs from extensions or network issues
      await Promise.race([
        fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", 
          headers: { "Content-Type": "text/plain" },
          // [FIX] Remove credentials: 'omit' for POST with no-cors as it can cause issues in some browsers. 
          // no-cors mode already handles credentials restrictively.
          redirect: "follow",
          body: JSON.stringify({
            type: 'survey',
            data: formattedData
          }),
        }),
        timeoutPromise
      ]);
      
    } catch (error) {
      console.error("Submission Error (or Timeout):", error);
      // We purposefully swallow the error here to ensure the user sees the completion screen.
      // In 'no-cors' mode with GAS, we can't reliably detect success vs failure (404) anyway,
      // so hanging the UI on an error is worse UX than showing the completion screen.
    } finally {
      setCurrentStep(6); // Move to completion only AFTER async work is done
      setIsSubmitting(false);
    }
  };

  // --- Admin Logic ---
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === ADMIN_PASSWORD) {
      setShowAdminLogin(false);
      setShowAdminPanel(true);
      setAdminTab('settings'); // Default to settings on login
      // setAdminPasswordInput(""); // Keep password for API authentication
    } else {
      alert("비밀번호가 올바르지 않습니다.");
    }
  };

  const saveAdminConfig = async () => {
    // [UX Improvement] Remove blocking confirm dialog for better responsiveness
    // Instead, we show the loading spinner immediately.
    
    if (!adminPasswordInput) {
       alert("세션이 만료되었습니다. 다시 로그인해주세요.");
       setShowAdminPanel(false);
       return;
    }

    console.log("Sending Admin Config:", adminConfig);
    setIsSaving(true); // Start loading immediately

    try {
      // [FIX] Use no-cors for maximum reliability when sending data to GAS from browser
      // This prevents CORS errors from blocking the request, even though we can't read the response.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "text/plain" },
        redirect: "follow",
        body: JSON.stringify({
          type: 'admin',
          password: adminPasswordInput.trim(), // Send password for verification
          isActive: adminConfig.isActive,
          startDate: adminConfig.startDate,
          endDate: adminConfig.endDate
        }),
      });

      // Artificial delay to ensure user sees the 'Saving' state (since no-cors is instant)
      await new Promise(resolve => setTimeout(resolve, 800));

      alert("설정이 저장되었습니다.\n(비밀번호가 일치하면 즉시 반영됩니다)");
      setShowAdminPanel(false);
      // Optional: keep password input or clear it. Clearing it forces re-login if logic changes, but here we keep panel closed.
      setAdminPasswordInput(""); 
      
    } catch (error) {
      console.error("Config Save Error:", error);
      alert("설정 저장 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.");
    } finally {
      setIsSaving(false); // End loading
    }
  };

  // --- Validation Modal Render Function ---
  const renderValidationModal = () => (
    <AnimatePresence>
      {showValidationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <div className="bg-red-50 p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">필수 항목 확인</h3>
              <p className="text-gray-600 text-sm mb-4">
                다음 항목들이 입력되지 않았습니다.<br/>
                확인 후 답변을 부탁드립니다.
              </p>
              <div className="w-full bg-white rounded-lg border border-red-100 p-4 mb-6 text-left max-h-40 overflow-y-auto">
                <ul className="list-disc pl-5 space-y-1 text-sm text-red-600 font-medium">
                  {missingFields.map((field, idx) => (
                    <li key={idx}>{field || '질문 내용'}</li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => setShowValidationModal(false)}
                className="w-full py-3 bg-[#5B4EF5] hover:bg-[#4538C9] text-white font-bold rounded-xl transition-colors"
              >
                확인했습니다
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // --- Admin Modals Render Function ---
  const renderAdminModals = () => (
    <>
      {/* Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-xs shadow-2xl relative"
            >
              <button onClick={() => setShowAdminLogin(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Lock size={20} className="text-gray-600"/>
                </div>
                <h3 className="font-bold text-lg text-gray-900">관리자 접속</h3>
                <form onSubmit={handleAdminLogin} className="w-full space-y-4">
                  <input 
                    type="password" 
                    placeholder="비밀번호 입력" 
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5B4EF5] text-gray-900 placeholder-gray-400"
                    autoFocus
                  />
                  <button type="submit" className="w-full py-3 bg-black text-white rounded-lg font-bold">확인</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dashboard/Admin Panel Modal */}
      <AnimatePresence>
        {showAdminPanel && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className={`bg-white rounded-2xl w-full shadow-2xl relative flex flex-col overflow-hidden max-h-[90vh] transition-all duration-300 ${adminTab === 'analytics' ? 'max-w-4xl' : 'max-w-md'}`}
            >
              {/* Header with Tabs */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setAdminTab('settings')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${adminTab === 'settings' ? 'bg-white text-[#5B4EF5] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Settings size={18} /> 설정
                  </button>
                  <button 
                    onClick={() => setAdminTab('analytics')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${adminTab === 'analytics' ? 'bg-white text-[#5B4EF5] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <LayoutDashboard size={18} /> 대시보드
                  </button>
                </div>
                <button onClick={() => setShowAdminPanel(false)} className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>

              {/* Content Area */}
              <div className="p-6 overflow-y-auto bg-gray-50/30 flex-grow">
                {adminTab === 'settings' ? (
                  <div className="space-y-6">
                    {/* 1. Toggle Active */}
                    <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <Power size={20} className={adminConfig.isActive ? "text-green-500" : "text-gray-400"} />
                        <span className="font-bold text-sm text-gray-900">설문 응답 허용</span>
                      </div>
                      <button 
                        onClick={() => setAdminConfig({...adminConfig, isActive: !adminConfig.isActive})}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${adminConfig.isActive ? 'bg-[#5B4EF5]' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${adminConfig.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* 2. Date Range */}
                    <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-gray-500" />
                        <span className="font-bold text-sm text-gray-900">운영 기간 설정</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">시작일</label>
                          <input 
                            type="date" 
                            value={adminConfig.startDate}
                            onChange={(e) => setAdminConfig({...adminConfig, startDate: e.target.value})}
                            className="w-full p-2 border rounded-md text-sm bg-gray-50 text-gray-900 focus:ring-1 focus:ring-[#5B4EF5]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">종료일</label>
                          <input 
                            type="date" 
                            value={adminConfig.endDate}
                            onChange={(e) => setAdminConfig({...adminConfig, endDate: e.target.value})}
                            className="w-full p-2 border rounded-md text-sm bg-gray-50 text-gray-900 focus:ring-1 focus:ring-[#5B4EF5]"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={saveAdminConfig} 
                      disabled={isSaving}
                      className="w-full py-4 bg-[#5B4EF5] hover:bg-[#4538C9] text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none active:scale-95"
                    >
                      {isSaving ? (
                        <><Loader2 className="animate-spin" size={20} /> 저장 중...</>
                      ) : (
                        "설정 저장하기"
                      )}
                    </button>
                  </div>
                ) : (
                  <AnalyticsDashboard />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );

  // --- Loading Screen Component ---
  const renderLoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 font-sans">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center flex flex-col items-center"
      >
         <div className="w-20 h-20 bg-[#5B4EF5]/10 rounded-full flex items-center justify-center mb-6 relative">
            <Loader2 size={32} className="text-[#5B4EF5] animate-spin" />
            <div className="absolute inset-0 rounded-full border-4 border-[#5B4EF5]/20 animate-pulse"></div>
         </div>
         <h2 className="text-2xl font-black text-gray-900 mb-3">
           제출 중입니다...
         </h2>
         <p className="text-gray-600 leading-relaxed text-sm">
           소중한 의견을 안전하게 저장하고 있습니다.<br/>
           잠시만 기다려주세요.
         </p>
      </motion.div>
    </div>
  );

  // --- Initial Loading State ---
  if (!isConfigLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#5B4EF5]" size={48} />
          <p className="text-gray-500 font-bold">설문 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // --- Survey Closed Screen ---
  if (surveyStatus !== 'OPEN' && !showAdminPanel && !showAdminLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 font-sans">
        {renderAdminModals()}
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">
           {/* Hidden Admin Trigger */}
           <button 
              onClick={() => setShowAdminLogin(true)}
              className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-500 transition-colors z-20"
            >
              <Settings size={20} className="opacity-50" />
           </button>

           <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-gray-400" />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-3">
             {surveyStatus === 'NOT_STARTED' ? '설문 시작 전입니다' : '설문이 종료되었습니다'}
           </h2>
           <p className="text-gray-600 leading-relaxed mb-6">
             {surveyStatus === 'NOT_STARTED' 
               ? `본 설문은 ${adminConfig.startDate}부터 시작됩니다.\n많은 관심 부탁드립니다.`
               : '참여해 주셔서 감사합니다.\n더 좋은 기회로 찾아뵙겠습니다.'}
           </p>
           <div className="inline-block bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-sm font-bold">
             Reference HRD
           </div>
        </div>
      </div>
    );
  }

  // --- Intro Screen (Centered Card Popup Style) ---
  if (currentStep === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 bg-gray-100 font-sans`}>
        {renderValidationModal()}
        {renderAdminModals()}
        
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#5B4EF5]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[80px]" />
        </div>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[600px]"
        >
           {/* Admin Trigger Icon (Top Right of Card) */}
           <button 
             onClick={() => setShowAdminLogin(true)}
             className="absolute top-4 right-4 z-50 p-2 text-white/50 md:text-gray-400 hover:text-white md:hover:text-gray-600 transition-all opacity-50 hover:opacity-100"
             title="관리자 설정"
           >
             <Settings size={18} />
           </button>

           {/* Left Side: Brand & Visuals */}
           <div className="w-full md:w-5/12 bg-[#5B4EF5] p-10 flex flex-col justify-between text-white relative overflow-hidden">
              {/* Abstract Patterns */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-900/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
              
              <div className="z-10 mt-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm mb-6">
                   <Sparkles size={14} className="text-yellow-300" />
                   <span className="text-xs font-bold tracking-wider uppercase">Annual Survey</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-2">
                  2026<br/>
                  <span className="text-white/90">CORPORATE</span><br/>
                  EDUCATION
                </h1>
                <p className="text-indigo-200 text-sm font-medium tracking-widest uppercase mt-4 border-l-2 border-indigo-300 pl-3">
                  Reference HRD
                </p>
              </div>

              <div className="z-10 mt-8 md:mt-0">
                 <div className="flex items-center gap-3 opacity-90">
                    <div className="w-10 h-10 rounded-full bg-white text-[#5B4EF5] flex items-center justify-center shadow-lg">
                      <ArrowRight size={20} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold tracking-wider">START SURVEY</span>
                 </div>
              </div>
           </div>

           {/* Right Side: Welcome Content */}
           <div className="w-full md:w-7/12 p-10 md:p-14 flex flex-col justify-center bg-white relative">
              <div className="mb-10 space-y-6">
                 <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                   👋 환영합니다, 담당자님!
                 </h2>
                 <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                    {surveyData[0].desc}
                 </p>
                 <div className="inline-block bg-indigo-50 text-[#5B4EF5] px-4 py-2 rounded-lg font-bold text-sm">
                    🎁 참여자 전원 스타벅스 기프티콘 증정
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-md transition-all">
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">☕️</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Starbucks</span>
                    <span className="text-sm font-black text-[#5B4EF5]">100% 증정</span>
                 </div>
                 <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-md transition-all">
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">⏱</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time</span>
                    <span className="text-sm font-black text-gray-900">약 3분 소요</span>
                 </div>
              </div>

              <button 
                onClick={() => setCurrentStep(1)}
                className="w-full py-5 bg-[#5B4EF5] text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-[#4538C9] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                <span>설문 시작하기</span>
                <ChevronRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </button>

              <div className="mt-8 text-center">
                 <p className="text-[11px] text-gray-400 font-medium">
                   본 설문은 레퍼런스HRD가 AI코딩으로 직접 개발한 설문 플랫폼으로 작성되었습니다.
                 </p>
              </div>
           </div>
        </motion.div>
      </div>
    );
  }

  // --- Outro Screen (Centered Card Style) ---
  if (currentStep === 6) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 bg-gray-100 font-sans`}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        >
          <div className="h-2 w-full bg-[#5B4EF5]"></div>
          
          <div className="p-10 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-8 animate-bounce">
               <Check size={40} strokeWidth={4} />
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">제출 완료!</h2>
            
            <p className="text-gray-600 leading-relaxed font-medium mb-8">
              소중한 의견 감사드립니다.<br/>
              <strong>2026년도 레퍼런스HRD</strong>가 함께하겠습니다.
            </p>

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 mb-8 text-left flex items-start gap-3">
               <span className="text-xl">🎁</span>
               <div>
                 <p className="text-yellow-800 font-bold text-sm mb-1">경품 발송 안내</p>
                 <p className="text-yellow-700 text-xs leading-relaxed">
                    스타벅스 기프티콘은 입력하신 연락처로<br/>
                    <span className="underline">1주일 이내</span> 일괄 발송예정입니다.
                 </p>
               </div>
            </div>
            
            <div className="space-y-3">
              <a 
                href="https://blog.naver.com/referencehrd" 
                target="_blank" 
                rel="noreferrer"
                className="block w-full py-4 rounded-xl border-2 border-gray-100 hover:border-[#5B4EF5] hover:text-[#5B4EF5] text-gray-600 font-bold transition-all flex items-center justify-center gap-2 group"
              >
                레퍼런스HRD 공식 블로그 바로가기 <ExternalLink size={16} className="group-hover:-translate-y-1 transition-transform" />
              </a>
              
              <div className="rounded-xl bg-gray-50 p-4 text-gray-500 text-xs">
                 <div className="flex justify-center items-center gap-4">
                    <span className="flex items-center gap-1">help@referencehrd.com</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span className="flex items-center gap-1">070-4647-4757</span>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Submitting State (Dedicate Screen) ---
  if (isSubmitting) {
    return renderLoadingScreen();
  }

  // --- Survey Steps ---
  return (
    <div className={`min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50 overflow-x-hidden`}>
      {renderValidationModal()}
      {renderAdminModals()}
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
         <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#5B4EF5] animate-pulse"></div>
                <div className="font-bold text-lg tracking-tight">
                    <span className="text-[#5B4EF5]">STEP {currentStep}</span>
                    <span className="text-gray-300 mx-2">/</span> 
                    <span className="text-gray-400">{totalSteps}</span>
                </div>
            </div>
            <div className="font-bold text-xs tracking-widest text-gray-400 uppercase hidden md:block">
               Reference HRD
            </div>
         </div>
         {/* Progress Bar */}
         <div className="h-1.5 bg-gray-100 w-full relative">
            <motion.div 
              className="h-full bg-[#5B4EF5]"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
         </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-start pt-10 pb-32 px-4 md:px-0">
        <div className="max-w-2xl w-full">
            <AnimatePresence mode='wait' custom={direction}>
            <motion.div
                key={currentStep}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10"
            >
                {currentQuestions.map((q) => (
                <div key={q.id} className="relative group bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    {/* Question Title */}
                    <div className="mb-8">
                        <label className="block text-xl md:text-2xl font-bold leading-snug tracking-tight mb-3 text-gray-900">
                        {q.label.split('[').map((part, i) => (
                            i === 0 ? part : (
                                <span key={i} className="text-[#5B4EF5]">
                                    {part.split(']')[0]}
                                    <span className="text-gray-900">{part.split(']')[1]}</span>
                                </span>
                            )
                        ))}
                        </label>
                        {q.subLabel && (
                            <div className="inline-block bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                {q.subLabel}
                            </div>
                        )}
                        {q.description && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-xs md:text-sm text-gray-500 whitespace-pre-line leading-relaxed border border-gray-200">
                                {q.description}
                            </div>
                        )}
                    </div>

                    {/* --- Inputs --- */}
                    
                    {/* 1. Text / Tel / Email */}
                    {(q.type === 'text' || q.type === 'tel' || q.type === 'email') && (
                        <div className="relative">
                            <input
                                type={q.type}
                                placeholder={q.placeholder}
                                value={answers[q.id] || ''}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                                className={`${theme.input} w-full p-4 pl-5 text-lg shadow-sm`}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                                {q.type === 'tel' ? <Phone size={20} /> : q.type === 'email' ? <Mail size={20} /> : <span className="text-xl">✎</span>}
                            </div>
                        </div>
                    )}

                    {/* 2. Radio */}
                    {q.type === 'radio' && q.options && (
                        <div className="space-y-3">
                            {q.options.map((opt, idx) => {
                                const isSelected = answers[q.id] === opt;
                                return (
                                <div key={opt}>
                                    <button
                                        onClick={() => handleChange(q.id, opt)}
                                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between group/btn border ${
                                            isSelected 
                                            ? theme.activeOption 
                                            : theme.inactiveOption
                                        }`}
                                    >
                                        <span className="font-bold text-base">{opt}</span>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            isSelected ? 'border-white bg-white/20' : 'border-gray-300'
                                        }`}>
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                        </div>
                                    </button>
                                    {/* Etc Detail */}
                                    {q.hasOther && isSelected && opt === '기타' && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="mt-3 ml-2 pl-4 border-l-2 border-[#5B4EF5]/30"
                                        >
                                            <input 
                                                type="text" 
                                                placeholder="상세 내용을 입력해 주세요"
                                                value={answers[`${q.id}_detail`] || ''}
                                                onChange={(e) => handleOtherChange(q.id, e.target.value)}
                                                className={`${theme.input} w-full p-3 text-sm bg-white`}
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
                        <div className="space-y-3">
                            {q.options.map((opt) => {
                            const isSelected = ((answers[q.id] as string[]) || []).includes(opt);
                            return (
                                <div key={opt}>
                                    <button
                                        onClick={() => handleMultiSelect(q.id, opt, q.maxSelect)}
                                        className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                                            isSelected 
                                            ? theme.activeOption 
                                            : theme.inactiveOption
                                        }`}
                                    >
                                        <span className="font-bold text-base">{opt}</span>
                                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                            isSelected ? 'border-white bg-white/20' : 'border-gray-300'
                                        }`}>
                                            {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                                        </div>
                                    </button>
                                    {/* Etc Detail */}
                                    {q.hasOther && isSelected && opt === '기타' && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="mt-3 ml-2 pl-4 border-l-2 border-[#5B4EF5]/30"
                                        >
                                            <input 
                                                type="text" 
                                                placeholder="상세 내용을 입력해 주세요"
                                                value={answers[`${q.id}_detail`] || ''}
                                                onChange={(e) => handleOtherChange(q.id, e.target.value)}
                                                className={`${theme.input} w-full p-3 text-sm bg-white`}
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
                            <div className="flex justify-between max-w-lg mx-auto mb-8 bg-gray-50 p-2 rounded-2xl">
                                {[1, 2, 3, 4, 5].map((score) => (
                                <button
                                    key={score}
                                    onClick={() => handleChange(q.id, score)}
                                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-black text-xl transition-all relative ${
                                        answers[q.id] >= score 
                                        ? 'bg-[#5B4EF5] text-white shadow-lg scale-110 z-10' 
                                        : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'
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
                                        className="inline-block bg-[#5B4EF5]/10 text-[#5B4EF5] text-sm font-bold px-4 py-1.5 rounded-full"
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

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 z-40 pb-safe">
        <div className="max-w-3xl mx-auto px-4 py-4 flex gap-4">
            <button
                onClick={() => {
                    if(currentStep > 1) {
                        setDirection(-1);
                        setCurrentStep(prev => prev - 1);
                    }
                }}
                disabled={currentStep === 1 || isSubmitting}
                className={`w-1/3 py-4 rounded-xl font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors`}
            >
                이전
            </button>

            <button
                onClick={handleNext}
                disabled={isSubmitting}
                className={`w-2/3 py-4 rounded-xl bg-[#5B4EF5] text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-[#4538C9] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed`}
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