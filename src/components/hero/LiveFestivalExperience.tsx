import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Calendar, Sparkles, CheckCircle2, ArrowRight, Sun, Check, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';

interface LiveFestivalExperienceProps {
  onNavigate?: (tab: string) => void;
  overrideDate?: Date | string;
}

export interface FestivalStateData {
  stateKey: 'pre-chhath' | 'nahay-khay' | 'kharna' | 'sandhya-arghya' | 'usha-arghya' | 'post-chhath';
  title: string;
  badge: string;
  dateStr: string;
  desc: string;
  countdownLabel: string;
  nextMilestoneTitle: string;
  nextMilestoneDate: string;
  nextMilestoneTab: string;
  nextMilestoneUrl: string;
  primaryCtaText: string;
  primaryCtaTab: string;
  primaryCtaUrl: string;
  checklistTitle: string;
  checklist: string[];
  activeStep: number; // 0: Pre, 1: Nahay Khay, 2: Kharna, 3: Sandhya, 4: Usha, 5: Post
}

// IST Date & Time boundary helper
export const calculateChhathStatus = (
  nowInput?: Date | string,
  lang: Language = 'hi'
): {
  stateData: FestivalStateData;
  targetMs: number;
  nowMs: number;
} => {
  const now = nowInput ? new Date(nowInput) : new Date();
  const nowMs = now.getTime();

  // 2026 Chhath Milestones in IST (Asia/Kolkata +05:30)
  const datesIST = {
    nahayKhayStart: new Date('2026-11-13T00:00:00+05:30').getTime(),
    kharnaStart: new Date('2026-11-14T00:00:00+05:30').getTime(),
    sandhyaArghyaStart: new Date('2026-11-15T00:00:00+05:30').getTime(),
    ushaArghyaStart: new Date('2026-11-16T00:00:00+05:30').getTime(),
    completionStart: new Date('2026-11-17T00:00:00+05:30').getTime(),
  };

  let stateKey: FestivalStateData['stateKey'] = 'pre-chhath';
  let targetMs = datesIST.nahayKhayStart;
  let activeStep = 0;

  if (nowMs >= datesIST.completionStart) {
    stateKey = 'post-chhath';
    targetMs = 0;
    activeStep = 5;
  } else if (nowMs >= datesIST.ushaArghyaStart) {
    stateKey = 'usha-arghya';
    targetMs = datesIST.completionStart;
    activeStep = 4;
  } else if (nowMs >= datesIST.sandhyaArghyaStart) {
    stateKey = 'sandhya-arghya';
    targetMs = datesIST.ushaArghyaStart;
    activeStep = 3;
  } else if (nowMs >= datesIST.kharnaStart) {
    stateKey = 'kharna';
    targetMs = datesIST.sandhyaArghyaStart;
    activeStep = 2;
  } else if (nowMs >= datesIST.nahayKhayStart) {
    stateKey = 'nahay-khay';
    targetMs = datesIST.kharnaStart;
    activeStep = 1;
  }

  // Multilingual content mapping
  const contentMap: Record<Language, Record<FestivalStateData['stateKey'], Omit<FestivalStateData, 'stateKey' | 'activeStep'>>> = {
    hi: {
      'pre-chhath': {
        title: "छठ महापर्व शुरू होने में",
        badge: "आगामी महापर्व 2026",
        dateStr: "13 नवंबर — 16 नवंबर 2026",
        desc: "चार दिवसीय सूर्य षष्ठी महापर्व की तैयारी शुरू हो चुकी है। पहला दिन नहाय-खाय 13 नवंबर को है।",
        countdownLabel: "छठ महापर्व शुरू होने में",
        nextMilestoneTitle: "नहाय-खाय (पहला दिन)",
        nextMilestoneDate: "13 नवंबर 2026 (शुक्रवार)",
        nextMilestoneTab: "chhath-puja-vidhi",
        nextMilestoneUrl: "/CHHATH/chhath-puja-vidhi/",
        primaryCtaText: "पूजा विधि देखें",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "आज की तैयारी:",
        checklist: [
          "पूजा सामग्री की जांच सूची तैयार करें",
          "गेहूं धोकर पूर्ण पवित्रता से सुखाएं",
          "बांस के सूप व दउरा व्यवस्थित करें"
        ]
      },
      'nahay-khay': {
        title: "आज नहाय-खाय है",
        badge: "🔴 आज का पावन दिवस • दिन 1",
        dateStr: "13 नवंबर 2026 (शुक्रवार)",
        desc: "पवित्र स्नान और सात्विक कद्दू-भात के आहार के साथ चार दिवसीय महापर्व का शुभारंभ।",
        countdownLabel: "खरना पूजा तक समय",
        nextMilestoneTitle: "खरना पूजा (दूसरा दिन)",
        nextMilestoneDate: "14 नवंबर 2026 (शनिवार)",
        nextMilestoneTab: "chhath-puja-vidhi",
        nextMilestoneUrl: "/CHHATH/chhath-puja-vidhi/",
        primaryCtaText: "आज क्या करें",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "आज क्या करें:",
        checklist: [
          "स्नान और सात्त्विक भोजन (कद्दू-भात) की तैयारी",
          "पूजा की आवश्यक सामग्री व्यवस्थित करें",
          "अगले दिन खरना की तैयारी करें"
        ]
      },
      'kharna': {
        title: "आज खरना है",
        badge: "🔴 आज का पावन दिवस • दिन 2",
        dateStr: "14 नवंबर 2026 (शनिवार)",
        desc: "दिनभर निर्जला उपवास के बाद सायंकाल गुड़ की रसियाव खीर-रोटी का प्रसाद ग्रहण व 36 घंटे का अखंड व्रत प्रारंभ।",
        countdownLabel: "संध्या अर्घ्य तक समय",
        nextMilestoneTitle: "संध्या अर्घ्य (तीसरा दिन)",
        nextMilestoneDate: "15 नवंबर 2026 (रविवार)",
        nextMilestoneTab: "chhath-arghya-time-2026",
        nextMilestoneUrl: "/CHHATH/chhath-arghya-time-2026/",
        primaryCtaText: "खरना नियम देखें",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "आज क्या करें:",
        checklist: [
          "खरना प्रसाद (गुड़ रसियाव) की तैयारी",
          "पूजा सामग्री तैयार रखें",
          "अगले दिन संध्या अर्घ्य की तैयारी"
        ]
      },
      'sandhya-arghya': {
        title: "आज संध्या अर्घ्य है",
        badge: "🔴 आज का पावन दिवस • दिन 3",
        dateStr: "15 नवंबर 2026 (रविवार)",
        desc: "सूप-दउरा सजाकर पवित्र घाट पर अस्ताचलगामी (डूबते) भगवान सूर्य नारायण को पहला अर्घ्य समर्पित करें।",
        countdownLabel: "उषा अर्घ्य तक समय",
        nextMilestoneTitle: "उषा अर्घ्य व पारण (चौथा दिन)",
        nextMilestoneDate: "16 नवंबर 2026 (सोमवार)",
        nextMilestoneTab: "chhath-arghya-time-2026",
        nextMilestoneUrl: "/CHHATH/chhath-arghya-time-2026/",
        primaryCtaText: "अर्घ्य समय देखें",
        primaryCtaTab: "chhath-arghya-time-2026",
        primaryCtaUrl: "/CHHATH/chhath-arghya-time-2026/",
        checklistTitle: "आज क्या करें:",
        checklist: [
          "सूप/दउरा तैयार करें",
          "घाट के लिए समय से निकलें",
          "सूर्यास्त के समय अर्घ्य दें"
        ]
      },
      'usha-arghya': {
        title: "आज उषा अर्घ्य और पारण है",
        badge: "🔴 आज का पावन दिवस • दिन 4",
        dateStr: "16 नवंबर 2026 (सोमवार)",
        desc: "भोर में उदित होते सूर्य को अंतिम अर्घ्य अर्पित कर 36 घंटे के अखंड निर्जला व्रत का पारण व प्रसाद वितरण।",
        countdownLabel: "पारण व समापन तक समय",
        nextMilestoneTitle: "महाप्रसाद वितरण एवं पारण",
        nextMilestoneDate: "16 नवंबर 2026 (सोमवार)",
        nextMilestoneTab: "thekua-recipe",
        nextMilestoneUrl: "/CHHATH/thekua-recipe/",
        primaryCtaText: "उषा अर्घ्य समय देखें",
        primaryCtaTab: "chhath-arghya-time-2026",
        primaryCtaUrl: "/CHHATH/chhath-arghya-time-2026/",
        checklistTitle: "आज क्या करें:",
        checklist: [
          "सुबह भोर में घाट पर जाएँ",
          "उगते सूर्य को अर्घ्य दें",
          "पारण की तैयारी करें"
        ]
      },
      'post-chhath': {
        title: "छठ महापर्व 2026 संपन्न",
        badge: "✨ पावन महापर्व संपन्न",
        dateStr: "13 — 16 नवंबर 2026",
        desc: "छठी मैया और भगवान भास्कर की कृपा से छठ महापर्व 2026 सफलतापूर्वक संपन्न हुआ। अगले छठ महापर्व की तैयारी जल्द शुरू होगी।",
        countdownLabel: "महापर्व 2026 संपन्न",
        nextMilestoneTitle: "छठ महापर्व 2027",
        nextMilestoneDate: "कार्तिक मास 2027",
        nextMilestoneTab: "home",
        nextMilestoneUrl: "/CHHATH/",
        primaryCtaText: "छठ गीत सुनें",
        primaryCtaTab: "chhath-puja-geet",
        primaryCtaUrl: "/CHHATH/chhath-puja-geet/",
        checklistTitle: "कृतज्ञता संदेश:",
        checklist: [
          "जय छठी मैया 🙏",
          "सूर्य नारायणाय नमः",
          "समस्त व्रतियों का कल्याण हो"
        ]
      }
    },
    en: {
      'pre-chhath': {
        title: "Countdown to Chhath Mahaparv",
        badge: "Upcoming Festival 2026",
        dateStr: "13 Nov — 16 Nov 2026",
        desc: "Preparations for the 4-day Sun Festival have begun. Day 1 Nahay-Khay is on 13 November.",
        countdownLabel: "Time until Chhath Begins",
        nextMilestoneTitle: "Nahay Khay (Day 1)",
        nextMilestoneDate: "13 November 2026 (Friday)",
        nextMilestoneTab: "chhath-puja-vidhi",
        nextMilestoneUrl: "/CHHATH/chhath-puja-vidhi/",
        primaryCtaText: "View Puja Vidhi",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "Today's Checklist:",
        checklist: [
          "Prepare Puja Samagri checklist",
          "Wash wheat with complete sanctity",
          "Organize bamboo winnows and baskets"
        ]
      },
      'nahay-khay': {
        title: "Today is Nahay Khay",
        badge: "🔴 Sacred Day • Day 1",
        dateStr: "13 November 2026 (Friday)",
        desc: "Holy bath and satvik kaddu-bhat feast mark the commencement of the 4-day festival.",
        countdownLabel: "Time until Kharna Puja",
        nextMilestoneTitle: "Kharna Puja (Day 2)",
        nextMilestoneDate: "14 November 2026 (Saturday)",
        nextMilestoneTab: "chhath-puja-vidhi",
        nextMilestoneUrl: "/CHHATH/chhath-puja-vidhi/",
        primaryCtaText: "What to do Today",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "Today's Actions:",
        checklist: [
          "Holy bath and satvik Kaddu-Bhat meal",
          "Organize essential puja materials",
          "Prepare for tomorrow's Kharna"
        ]
      },
      'kharna': {
        title: "Today is Kharna",
        badge: "🔴 Sacred Day • Day 2",
        dateStr: "14 November 2026 (Saturday)",
        desc: "Daylong waterless fast followed by evening jaggery kheer prasad and commencement of 36h fast.",
        countdownLabel: "Time until Sandhya Arghya",
        nextMilestoneTitle: "Sandhya Arghya (Day 3)",
        nextMilestoneDate: "15 November 2026 (Sunday)",
        nextMilestoneTab: "chhath-arghya-time-2026",
        nextMilestoneUrl: "/CHHATH/chhath-arghya-time-2026/",
        primaryCtaText: "Kharna Rules",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "Today's Actions:",
        checklist: [
          "Prepare Kharna Rasiyaw prasad",
          "Keep offerings ready",
          "Prepare for tomorrow's Sunset Arghya"
        ]
      },
      'sandhya-arghya': {
        title: "Today is Sandhya Arghya",
        badge: "🔴 Sacred Day • Day 3",
        dateStr: "15 November 2026 (Sunday)",
        desc: "Decorate baskets and offer the first Arghya to the setting Sun at riverbanks.",
        countdownLabel: "Time until Usha Arghya",
        nextMilestoneTitle: "Usha Arghya & Paran (Day 4)",
        nextMilestoneDate: "16 November 2026 (Monday)",
        nextMilestoneTab: "chhath-arghya-time-2026",
        nextMilestoneUrl: "/CHHATH/chhath-arghya-time-2026/",
        primaryCtaText: "Check Arghya Time",
        primaryCtaTab: "chhath-arghya-time-2026",
        primaryCtaUrl: "/CHHATH/chhath-arghya-time-2026/",
        checklistTitle: "Today's Actions:",
        checklist: [
          "Prepare bamboo winnows & baskets",
          "Depart for ghat on time",
          "Offer Arghya at sunset"
        ]
      },
      'usha-arghya': {
        title: "Today is Usha Arghya & Paran",
        badge: "🔴 Sacred Day • Day 4",
        dateStr: "16 November 2026 (Monday)",
        desc: "Offer final Arghya to the rising Sun at dawn and conclude the 36h fast.",
        countdownLabel: "Time until Conclusion",
        nextMilestoneTitle: "Prasad Distribution & Paran",
        nextMilestoneDate: "16 November 2026 (Monday)",
        nextMilestoneTab: "thekua-recipe",
        nextMilestoneUrl: "/CHHATH/thekua-recipe/",
        primaryCtaText: "Check Sunrise Time",
        primaryCtaTab: "chhath-arghya-time-2026",
        primaryCtaUrl: "/CHHATH/chhath-arghya-time-2026/",
        checklistTitle: "Today's Actions:",
        checklist: [
          "Reach river ghat at dawn",
          "Offer Arghya to rising Sun",
          "Prepare for fast conclusion (Paran)"
        ]
      },
      'post-chhath': {
        title: "Chhath Mahaparv 2026 Concluded",
        badge: "✨ Festival Concluded",
        dateStr: "13 — 16 November 2026",
        desc: "With the grace of Chhathi Maiya and Lord Surya, Mahaparv 2026 concluded peacefully.",
        countdownLabel: "Mahaparv 2026 Completed",
        nextMilestoneTitle: "Chhath Mahaparv 2027",
        nextMilestoneDate: "Kartik Month 2027",
        nextMilestoneTab: "home",
        nextMilestoneUrl: "/CHHATH/",
        primaryCtaText: "Listen to Songs",
        primaryCtaTab: "chhath-puja-geet",
        primaryCtaUrl: "/CHHATH/chhath-puja-geet/",
        checklistTitle: "Gratitude Message:",
        checklist: [
          "Jai Chhathi Maiya 🙏",
          "Surya Narayanaya Namah",
          "Blessings for all devotees"
        ]
      }
    },
    bho: {
      // Fallback cleanly to hi with Bhojpuri nuances where active
      'pre-chhath': {
        title: "छठ पूजा के उल्टी गिनती",
        badge: "आवे वाला छठ परब 2026",
        dateStr: "13 नवंबर — 16 नवंबर 2026",
        desc: "चार दिने के पावन छठ बरत के तइयारी सुरू हो गइल बा। नहाय-खाय 13 नवंबर के बा।",
        countdownLabel: "छठ बरत सुरू होखे में",
        nextMilestoneTitle: "नहाय-खाय (पहिलका दिन)",
        nextMilestoneDate: "13 नवंबर 2026 (शुक)",
        nextMilestoneTab: "chhath-puja-vidhi",
        nextMilestoneUrl: "/CHHATH/chhath-puja-vidhi/",
        primaryCtaText: "पूजा बिधि देखीं",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "आज के तइयारी:",
        checklist: [
          "पूजा सामान के सूची तइयार करीं",
          "गेहूं धो के सुद्धता से सुखाईं",
          "सूप आ दउरा सहेज के रखीं"
        ]
      },
      'nahay-khay': {
        title: "आज नहाय-खाय बा",
        badge: "🔴 आज के पावन दिन • दिन 1",
        dateStr: "13 नवंबर 2026 (शुक)",
        desc: "पावन असनान आ सात्विक कद्दू-भात खा के महापर्व के सुरुआत।",
        countdownLabel: "खरना तक के समय",
        nextMilestoneTitle: "खरना पूजा (दूसरका दिन)",
        nextMilestoneDate: "14 नवंबर 2026 (सनीचर)",
        nextMilestoneTab: "chhath-puja-vidhi",
        nextMilestoneUrl: "/CHHATH/chhath-puja-vidhi/",
        primaryCtaText: "आज का करीं",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "आज का करीं:",
        checklist: [
          "असनान आ सात्त्विक भोजन (कद्दू-भात) के तइयारी",
          "पूजा के जरूरी सामान सहेजीं",
          "अगिला दिन खरना के तइयारी करीं"
        ]
      },
      'kharna': {
        title: "आज खरना बा",
        badge: "🔴 आज के पावन दिन • दिन 2",
        dateStr: "14 नवंबर 2026 (सनीचर)",
        desc: "दिन भर निरजला रहला के बाद सांझ के गुड़ के रसियाव प्रसाद खा के 36h बरत सुरू।",
        countdownLabel: "सँझिया अरघ तक समय",
        nextMilestoneTitle: "सँझिया अरघ (तीसरका दिन)",
        nextMilestoneDate: "15 नवंबर 2026 (इतवार)",
        nextMilestoneTab: "chhath-arghya-time-2026",
        nextMilestoneUrl: "/CHHATH/chhath-arghya-time-2026/",
        primaryCtaText: "खरना नेम देखीं",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "आज का करीं:",
        checklist: [
          "खरना परसाद (रसियाव) के तइयारी",
          "पूजा सामान तइयार रखीं",
          "अगिला दिन सँझिया अरघ के तइयारी"
        ]
      },
      'sandhya-arghya': {
        title: "आज सँझिया अरघ बा",
        badge: "🔴 आज के पावन दिन • दिन 3",
        dateStr: "15 नवंबर 2026 (इतवार)",
        desc: "सूप-दउरा सजा के घाट पर डूबत सुरुज गोसांईं के अरघ अर्पित करीं।",
        countdownLabel: "भोरहरिया अरघ तक समय",
        nextMilestoneTitle: "भोरहरिया अरघ आ पारन (चौथा दिन)",
        nextMilestoneDate: "16 नवंबर 2026 (सोमार)",
        nextMilestoneTab: "chhath-arghya-time-2026",
        nextMilestoneUrl: "/CHHATH/chhath-arghya-time-2026/",
        primaryCtaText: "अरघ के समय देखीं",
        primaryCtaTab: "chhath-arghya-time-2026",
        primaryCtaUrl: "/CHHATH/chhath-arghya-time-2026/",
        checklistTitle: "आज का करीं:",
        checklist: [
          "सूप आ दउरा तइयार करीं",
          "घाट खातिर समय से निकलीं",
          "सुरुज डूबते घरी अरघ दीं"
        ]
      },
      'usha-arghya': {
        title: "आज भोरहरिया अरघ आ पारन बा",
        badge: "🔴 आज के पावन दिन • दिन 4",
        dateStr: "16 नवंबर 2026 (सोमार)",
        desc: "भोर में उगत सुरुज के अरघ दे के 36 घंटा के निरजला बरत के पारन कइल जाला।",
        countdownLabel: "पारन तक के समय",
        nextMilestoneTitle: "महापरसाद आ पारन",
        nextMilestoneDate: "16 नवंबर 2026 (सोमार)",
        nextMilestoneTab: "thekua-recipe",
        nextMilestoneUrl: "/CHHATH/thekua-recipe/",
        primaryCtaText: "भोरहरिया अरघ समय",
        primaryCtaTab: "chhath-arghya-time-2026",
        primaryCtaUrl: "/CHHATH/chhath-arghya-time-2026/",
        checklistTitle: "आज का करीं:",
        checklist: [
          "बिहान भोर में घाट पर जाईं",
          "उगत सुरुज के अरघ दीं",
          "पारन के तइयारी करीं"
        ]
      },
      'post-chhath': {
        title: "छठ महापर्व 2026 पूरा भइल",
        badge: "✨ महापर्व पूरा भइल",
        dateStr: "13 — 16 नवंबर 2026",
        desc: "छठी मइया के किरपा से महापर्व 2026 नीमन से पूरा भइल।",
        countdownLabel: "महापर्व 2026 पूरा भइल",
        nextMilestoneTitle: "छठ महापर्व 2027",
        nextMilestoneDate: "कार्तिक 2027",
        nextMilestoneTab: "home",
        nextMilestoneUrl: "/CHHATH/",
        primaryCtaText: "छठ गीत सुनीं",
        primaryCtaTab: "chhath-puja-geet",
        primaryCtaUrl: "/CHHATH/chhath-puja-geet/",
        checklistTitle: "नेह संदेश:",
        checklist: [
          "जय छठी मइया 🙏",
          "सुरुज गोसांईं के गोड़ लागीं",
          "सबके कल्याण होखौ"
        ]
      }
    },
    mai: {
      // Fallback cleanly to hi with Maithili nuances
      'pre-chhath': {
        title: "छठि महापर्वक उल्टी गिनती",
        badge: "आगामी महापर्व 2026",
        dateStr: "13 नवं — 16 नवं 2026",
        desc: "चारि दिवसीय छठि महापर्वक तैयारी प्रारंभ भऽ गेल अछि। नहाय-खाय 13 नवंबर केँ अछि।",
        countdownLabel: "छठि महापर्व प्रारंभ होए में",
        nextMilestoneTitle: "नहाय-खाय (प्रथम दिवस)",
        nextMilestoneDate: "13 नवंबर 2026 (शुक्र)",
        nextMilestoneTab: "chhath-puja-vidhi",
        nextMilestoneUrl: "/CHHATH/chhath-puja-vidhi/",
        primaryCtaText: "पूजा विधि देखू",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "अजुक तैयारी:",
        checklist: [
          "पूजा सामग्री सूची तैयार करू",
          "गहुम धो कऽ पवित्रता सं सुखाउ",
          "सूप ओ दउरा सज़ाउ"
        ]
      },
      'nahay-khay': {
        title: "अजुक दिन नहाय-खाय अछि",
        badge: "🔴 पावन दिवस • दिवस 1",
        dateStr: "13 नवंबर 2026 (शुक्र)",
        desc: "पवित्र स्नान ओ सात्विक कद्दू-भात केर संग महापर्वक शुभारंभ।",
        countdownLabel: "खरना धरि समय",
        nextMilestoneTitle: "खरना पूजा (द्वितीय दिवस)",
        nextMilestoneDate: "14 नवंबर 2026 (शनि)",
        nextMilestoneTab: "chhath-puja-vidhi",
        nextMilestoneUrl: "/CHHATH/chhath-puja-vidhi/",
        primaryCtaText: "अजुक कार्य जानू",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "अजुक कार्य:",
        checklist: [
          "स्नान ओ सात्त्विक आहार (कद्दू-भात) तैयारी",
          "आवश्यक पूजा सामग्री सज़ाउ",
          "काल्हिक खरनाक तैयारी करू"
        ]
      },
      'kharna': {
        title: "अजुक दिन खरना अछि",
        badge: "🔴 पावन दिवस • दिवस 2",
        dateStr: "14 नवंबर 2026 (शनि)",
        desc: "दिन भरि निर्जला उपवास ओ साँझक रसियाव प्रसाद् ग्रहण कऽ 36h व्रत प्रारंभ।",
        countdownLabel: "साँझक अर्घ्य धरि समय",
        nextMilestoneTitle: "साँझक अर्घ्य (तृतीय दिवस)",
        nextMilestoneDate: "15 नवंबर 2026 (रवि)",
        nextMilestoneTab: "chhath-arghya-time-2026",
        nextMilestoneUrl: "/CHHATH/chhath-arghya-time-2026/",
        primaryCtaText: "खरना नियम देखू",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "अजुक कार्य:",
        checklist: [
          "खरना प्रसाद (रसियाव) तैयारी",
          "पूजा सामग्री तैयार राखू",
          "काल्हिक अर्घ्यक तैयारी"
        ]
      },
      'sandhya-arghya': {
        title: "अजुक दिन साँझक अर्घ्य अछि",
        badge: "🔴 पावन दिवस • दिवस 3",
        dateStr: "15 नवंबर 2026 (रवि)",
        desc: "सूप-दउरा लऽ घाटे पर अस्ताचलगामी सूर्यकेँ पहिल अर्घ्य अर्पित करू।",
        countdownLabel: "प्रात: अर्घ्य धरि समय",
        nextMilestoneTitle: "प्रात: अर्घ्य ओ पारण (चतुर्थ दिवस)",
        nextMilestoneDate: "16 नवंबर 2026 (सोम)",
        nextMilestoneTab: "chhath-arghya-time-2026",
        nextMilestoneUrl: "/CHHATH/chhath-arghya-time-2026/",
        primaryCtaText: "अर्घ्य समय देखू",
        primaryCtaTab: "chhath-arghya-time-2026",
        primaryCtaUrl: "/CHHATH/chhath-arghya-time-2026/",
        checklistTitle: "अजुक कार्य:",
        checklist: [
          "सूप ओ दउरा सज़ाउ",
          "समय पर घाट लेल निकलू",
          "सूर्यास्तक समय अर्घ्य दिअ"
        ]
      },
      'usha-arghya': {
        title: "अजुक दिन प्रात: अर्घ्य ओ पारण अछि",
        badge: "🔴 पावन दिवस • दिवस 4",
        dateStr: "16 नवंबर 2026 (सोम)",
        desc: "भोर में उदित सूर्यकेँ अंतिम अर्घ्य दऽ 36 घंटाक व्रतक पारण करू।",
        countdownLabel: "पारण धरि समय",
        nextMilestoneTitle: "महाप्रसाद वितरण ओ पारण",
        nextMilestoneDate: "16 नवंबर 2026 (सोम)",
        nextMilestoneTab: "thekua-recipe",
        nextMilestoneUrl: "/CHHATH/thekua-recipe/",
        primaryCtaText: "प्रात: अर्घ्य समय",
        primaryCtaTab: "chhath-arghya-time-2026",
        primaryCtaUrl: "/CHHATH/chhath-arghya-time-2026/",
        checklistTitle: "अजुक कार्य:",
        checklist: [
          "प्रातः भोर में घाट पर जाउ",
          "उदित सूर्यकेँ अर्घ्य दिअ",
          "पारणक तैयारी करू"
        ]
      },
      'post-chhath': {
        title: "छठि महापर्व 2026 संपन्न",
        badge: "✨ महापर्व संपन्न",
        dateStr: "13 — 16 नवंबर 2026",
        desc: "छठी मइया ओ सूर्य देवक अनुग्रह सं महापर्व 2026 संपन्न भेल।",
        countdownLabel: "महापर्व 2026 संपन्न",
        nextMilestoneTitle: "छठि महापर्व 2027",
        nextMilestoneDate: "कार्तिक 2027",
        nextMilestoneTab: "home",
        nextMilestoneUrl: "/CHHATH/",
        primaryCtaText: "छठि गीत सुनू",
        primaryCtaTab: "chhath-puja-geet",
        primaryCtaUrl: "/CHHATH/chhath-puja-geet/",
        checklistTitle: "कृतज्ञता संदेश:",
        checklist: [
          "जय छठी मइया 🙏",
          "सूर्य नारायणाय नमः",
          "समस्त व्रती लोकनिक कल्याण होअए"
        ]
      }
    },
    mag: {
      'pre-chhath': {
        title: "छठ महापर्व शुरू होवे में",
        badge: "आवे वाला महापर्व 2026",
        dateStr: "13 नवंबर — 16 नवंबर 2026",
        desc: "चार दिन के छठ पूजा के तैयारी शुरू हो गेल हे। नहाय-खाय 13 नवंबर के हे।",
        countdownLabel: "छठ महापर्व शुरू होवे में",
        nextMilestoneTitle: "नहाय-खाय (पहिलका दिन)",
        nextMilestoneDate: "13 नवंबर 2026 (शुक)",
        nextMilestoneTab: "chhath-puja-vidhi",
        nextMilestoneUrl: "/CHHATH/chhath-puja-vidhi/",
        primaryCtaText: "पूजा विधि देखी",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "आज के तैयारी:",
        checklist: [
          "पूजा सामग्री के लिस्ट बनाईं",
          "गेहूं धो के पवित्रता से सुखाईं",
          "सूप आ दउरा सहेजीं"
        ]
      },
      'nahay-khay': {
        title: "आज नहाय-खाय हे",
        badge: "🔴 आज के पावन दिन • दिन 1",
        dateStr: "13 नवंबर 2026 (शुक)",
        desc: "पावन स्नान आ सात्विक कद्दू-भात के संगे महापर्व के शुरुआत।",
        countdownLabel: "खरना तक के समय",
        nextMilestoneTitle: "खरना पूजा (दूसरका दिन)",
        nextMilestoneDate: "14 नवंबर 2026 (शनि)",
        nextMilestoneTab: "chhath-puja-vidhi",
        nextMilestoneUrl: "/CHHATH/chhath-puja-vidhi/",
        primaryCtaText: "आज का करीं",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "आज का करीं:",
        checklist: [
          "स्नान व सात्त्विक कद्दू-भात के तैयारी",
          "पूजा के जरूरी सामान रखीं",
          "काल्ह खरना के तैयारी करीं"
        ]
      },
      'kharna': {
        title: "आज खरना हे",
        badge: "🔴 आज के पावन दिन • दिन 2",
        dateStr: "14 नवंबर 2026 (शनि)",
        desc: "दिन भर निर्जला रहला के बाद शाम में रसियाव खीर-रोटी प्रसाद आ 36h व्रत शुरू।",
        countdownLabel: "संध्या अर्घ्य तक समय",
        nextMilestoneTitle: "संध्या अर्घ्य (तीसरका दिन)",
        nextMilestoneDate: "15 नवंबर 2026 (इतवार)",
        nextMilestoneTab: "chhath-arghya-time-2026",
        nextMilestoneUrl: "/CHHATH/chhath-arghya-time-2026/",
        primaryCtaText: "खरना नियम देखीं",
        primaryCtaTab: "chhath-puja-vidhi",
        primaryCtaUrl: "/CHHATH/chhath-puja-vidhi/",
        checklistTitle: "आज का करीं:",
        checklist: [
          "खरना प्रसाद (रसियाव) के तैयारी",
          "पूजा सामान तैयार रखीं",
          "काल्ह संध्या अर्घ्य के तैयारी"
        ]
      },
      'sandhya-arghya': {
        title: "आज संध्या अर्घ्य हे",
        badge: "🔴 आज के पावन दिन • दिन 3",
        dateStr: "15 नवंबर 2026 (इतवार)",
        desc: "सूप-दउरा सजा के घाट पर डूबते सूर्य देव के पहला अर्घ्य समर्पित करीं।",
        countdownLabel: "उषा अर्घ्य तक समय",
        nextMilestoneTitle: "उषा अर्घ्य व पारण (चौथा दिन)",
        nextMilestoneDate: "16 नवंबर 2026 (सोमार)",
        nextMilestoneTab: "chhath-arghya-time-2026",
        nextMilestoneUrl: "/CHHATH/chhath-arghya-time-2026/",
        primaryCtaText: "अर्घ्य समय देखीं",
        primaryCtaTab: "chhath-arghya-time-2026",
        primaryCtaUrl: "/CHHATH/chhath-arghya-time-2026/",
        checklistTitle: "आज का करीं:",
        checklist: [
          "सूप व दउरा तैयार करीं",
          "घाट खातिर समय से निकलीं",
          "सूर्यास्त के समय अर्घ्य दीं"
        ]
      },
      'usha-arghya': {
        title: "आज उषा अर्घ्य व पारण हे",
        badge: "🔴 आज के पावन दिन • दिन 4",
        dateStr: "16 नवंबर 2026 (सोमार)",
        desc: "भोर में उगते सूर्य के अर्घ्य दे के 36 घंटा के निर्जला व्रत के पारण।",
        countdownLabel: "पारण तक के समय",
        nextMilestoneTitle: "महाप्रसाद व पारण",
        nextMilestoneDate: "16 नवंबर 2026 (सोमार)",
        nextMilestoneTab: "thekua-recipe",
        nextMilestoneUrl: "/CHHATH/thekua-recipe/",
        primaryCtaText: "उषा अर्घ्य समय",
        primaryCtaTab: "chhath-arghya-time-2026",
        primaryCtaUrl: "/CHHATH/chhath-arghya-time-2026/",
        checklistTitle: "आज का करीं:",
        checklist: [
          "सुबह भोर में घाट पर जाईं",
          "उगते सूर्य के अर्घ्य दीं",
          "पारण के तैयारी करीं"
        ]
      },
      'post-chhath': {
        title: "छठ महापर्व 2026 संपन्न",
        badge: "✨ महापर्व संपन्न",
        dateStr: "13 — 16 नवंबर 2026",
        desc: "छठी मईया व सूर्य देव के कृपा से महापर्व 2026 संपन्न भेल।",
        countdownLabel: "महापर्व 2026 संपन्न",
        nextMilestoneTitle: "छठ महापर्व 2027",
        nextMilestoneDate: "कार्तिक 2027",
        nextMilestoneTab: "home",
        nextMilestoneUrl: "/CHHATH/",
        primaryCtaText: "छठ गीत सुनीं",
        primaryCtaTab: "chhath-puja-geet",
        primaryCtaUrl: "/CHHATH/chhath-puja-geet/",
        checklistTitle: "कृतज्ञता संदेश:",
        checklist: [
          "जय छठी मईया 🙏",
          "सूर्य नारायणाय नमः",
          "सबके कल्याण होए"
        ]
      }
    }
  };

  const selectedDict = contentMap[lang] || contentMap.hi;
  const currentData = selectedDict[stateKey];

  return {
    stateData: {
      stateKey,
      activeStep,
      ...currentData
    },
    targetMs,
    nowMs
  };
};

export const LiveFestivalExperience: React.FC<LiveFestivalExperienceProps> = ({
  onNavigate,
  overrideDate
}) => {
  const { language } = useLanguage();

  const [nowMs, setNowMs] = useState<number>(() => {
    return overrideDate ? new Date(overrideDate).getTime() : Date.now();
  });

  useEffect(() => {
    // If overrideDate is provided, don't tick so tests remain 100% deterministic
    if (overrideDate) return;

    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [overrideDate]);

  const currentDateObj = useMemo(() => {
    return overrideDate ? new Date(overrideDate) : new Date(nowMs);
  }, [overrideDate, nowMs]);

  const { stateData, targetMs } = useMemo(() => {
    return calculateChhathStatus(currentDateObj, language);
  }, [currentDateObj, language]);

  // Compute countdown digits
  const diff = Math.max(0, targetMs - nowMs);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const stepsList = [
    { num: 1, title: 'नहाय-खाय', date: '13 नवं' },
    { num: 2, title: 'खरना', date: '14 नवं' },
    { num: 3, title: 'संध्या अर्घ्य', date: '15 नवं' },
    { num: 4, title: 'उषा अर्घ्य', date: '16 नवं' },
  ];

  const handleCtaClick = (e: React.MouseEvent, tab: string, url: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(tab);
      if (typeof window !== 'undefined' && window.history) {
        try {
          window.history.pushState(null, '', url);
        } catch {
          // ignore
        }
      }
    }
  };

  return (
    <div className="royal-card-luxury rounded-3xl p-5 sm:p-8 shadow-2xl border border-amber-400/50 w-full max-w-5xl mx-auto backdrop-blur-2xl relative overflow-hidden text-stone-900 dark:text-stone-100 font-mukta space-y-6">
      
      {/* Auspicious Corner Emblems */}
      <div className="absolute top-2.5 left-3 text-amber-400/40 text-xs font-serif select-none pointer-events-none" aria-hidden="true">卐</div>
      <div className="absolute top-2.5 right-3 text-amber-400/40 text-xs font-serif select-none pointer-events-none" aria-hidden="true">卐</div>

      {/* 1. Header: "आज क्या है — छठ महापर्व 2026" */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/25">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>{stateData.badge}</span>
            </span>
          </div>
          <h2 className="font-rozha text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-amber-100 tracking-tight">
            आज क्या है — {stateData.title}
          </h2>
          <div className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>{stateData.dateStr}</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <a
          href={stateData.primaryCtaUrl}
          onClick={(e) => handleCtaClick(e, stateData.primaryCtaTab, stateData.primaryCtaUrl)}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 text-decoration-none"
        >
          <span>{stateData.primaryCtaText}</span>
          <ArrowRight className="w-4 h-4 text-stone-950" />
        </a>
      </div>

      {/* 2. 4-Day Progress Steps Bar */}
      <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-500/25 space-y-2">
        <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
          <span className="uppercase tracking-wider">महापर्व प्रगति चक्र (4-Day Festival Progress)</span>
          <span className="text-[11px] text-stone-400">
            {stateData.activeStep === 0 ? 'प्रारंभ होने वाला है' : stateData.activeStep > 4 ? 'संपन्न' : `चरण ${stateData.activeStep} / 4`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stepsList.map((step) => {
            const isCompleted = stateData.activeStep > step.num;
            const isActive = stateData.activeStep === step.num;

            return (
              <div
                key={step.num}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/20 border-amber-400 ring-2 ring-amber-400/50 text-amber-200 font-bold shadow-md'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span>दिन {step.num}</span>
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <span className="text-[10px] opacity-70">{step.date}</span>
                  )}
                </div>

                <div className="text-xs font-bold truncate">
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Middle Section Grid: Countdown Digits & Next Event & Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Live Countdown Pod (7 Cols on desktop) */}
        <div className="md:col-span-7 p-5 rounded-2xl bg-stone-950/90 border border-amber-500/30 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {stateData.countdownLabel}
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-500/80 uppercase">
              IST (Asia/Kolkata)
            </span>
          </div>

          {stateData.stateKey === 'post-chhath' ? (
            <div className="py-6 text-center space-y-2">
              <div className="text-4xl">🌅</div>
              <h3 className="font-rozha text-xl font-bold text-amber-300">
                छठ महापर्व 2026 सफलतापूर्वक संपन्न हुआ!
              </h3>
              <p className="text-xs text-stone-300">
                भगवान भुवन भास्कर और छठी मैया की कृपा समस्त व्रतियों व श्रद्धालुओं पर बनी रहे।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 text-center py-2">
              {/* Days */}
              <div className="p-3 rounded-xl bg-stone-900 border border-amber-500/30">
                <span className="font-rozha text-3xl sm:text-4xl font-black text-amber-300 block">
                  {String(days).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">दिन</span>
              </div>

              {/* Hours */}
              <div className="p-3 rounded-xl bg-stone-900 border border-amber-500/30">
                <span className="font-rozha text-3xl sm:text-4xl font-black text-amber-300 block">
                  {String(hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">घंटे</span>
              </div>

              {/* Minutes */}
              <div className="p-3 rounded-xl bg-stone-900 border border-amber-500/30">
                <span className="font-rozha text-3xl sm:text-4xl font-black text-amber-300 block">
                  {String(minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">मिनट</span>
              </div>

              {/* Seconds */}
              <div className="p-3 rounded-xl bg-stone-900 border border-amber-500/30">
                <span className="font-rozha text-3xl sm:text-4xl font-black text-amber-300 block">
                  {String(seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-stone-400 block uppercase">सेकंड</span>
              </div>
            </div>
          )}

          {/* Description line */}
          <p className="text-xs text-stone-300 border-t border-amber-500/15 pt-2 leading-relaxed">
            {stateData.desc}
          </p>
        </div>

        {/* Right Column: Next Event Card & Checklist (5 Cols on desktop) */}
        <div className="md:col-span-5 flex flex-col justify-between gap-4">
          
          {/* Next Event Card */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>अगला महत्वपूर्ण चरण</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20">
                आगामी
              </span>
            </div>

            <div className="font-rozha text-lg font-bold text-stone-900 dark:text-amber-100">
              {stateData.nextMilestoneTitle}
            </div>

            <div className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              {stateData.nextMilestoneDate}
            </div>

            <a
              href={stateData.nextMilestoneUrl}
              onClick={(e) => handleCtaClick(e, stateData.nextMilestoneTab, stateData.nextMilestoneUrl)}
              className="pt-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 text-decoration-none"
            >
              <span>विवरण देखें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Actionable Today Checklist */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-500/20 space-y-2">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 border-b border-amber-500/15 pb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{stateData.checklistTitle}</span>
            </div>

            <ul className="space-y-1.5 text-xs text-stone-300 pl-0 list-none mb-0">
              {stateData.checklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
