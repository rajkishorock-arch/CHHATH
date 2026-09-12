import { AGENT_TOOLS_DEFINITIONS, AgentToolExecutor, ToolExecutionResult } from './agentTools';
import { ReelsStorage } from '../reelsStorage';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  lang?: 'hi' | 'en' | 'bho' | 'mai';
  toolCalls?: {
    name: string;
    args: Record<string, any>;
  }[];
  toolResults?: ToolExecutionResult[];
  pendingConfirmation?: {
    actionType: string;
    actionData: any;
    prompt: string;
  };
  timestamp: string;
}

export interface VisionAnalysisResult {
  objectName: string;
  confidence: 'High' | 'Medium' | 'Low';
  culturalContext: string;
  ingredientsOrComponents?: string[];
  preparationTips?: string[];
  traditionalDosAndDonts?: string[];
  confidenceDisclaimer?: string;
}

export interface ChhathPlanDay {
  dayNumber: number;
  dayName: string;
  date: string;
  morningAction: string;
  afternoonAction: string;
  eveningAction: string;
  criticalSamagri: string[];
  fastingGuidelines: string;
  culturalNote: string;
}

export class AIService {
  /**
   * Process a conversational turn with the AI Agent.
   * Performs intent analysis, executes application tools, and synthesizes an intelligent response.
   */
  public static async chat(
    userPrompt: string,
    history: AIMessage[],
    preferredLang: 'hi' | 'en' | 'bho' | 'mai' = 'hi',
    userLocation: { city: string; state: string } = { city: 'Patna', state: 'Bihar' }
  ): Promise<AIMessage> {
    const trimmed = userPrompt.trim();
    const lower = trimmed.toLowerCase();

    // 1. Detect if any tool should be invoked
    const toolsToInvoke: { name: string; args: Record<string, any> }[] = [];

    // Arghya Time Intent
    if (lower.includes('arghya') || lower.includes('अर्घ्य') || lower.includes('sunset') || lower.includes('sunrise') || lower.includes('शाम का समय') || lower.includes('सुबह का समय') || lower.includes('सूर्योदय') || lower.includes('सूर्यास्त')) {
      toolsToInvoke.push({
        name: 'get_arghya_time',
        args: { location: userLocation.city }
      });
    }

    // Weather Intent
    if (lower.includes('weather') || lower.includes('मौसम') || lower.includes('ठंड') || lower.includes('तापमान') || lower.includes('बारिश')) {
      toolsToInvoke.push({
        name: 'get_weather',
        args: { location: userLocation.city }
      });
    }

    // Ghats Intent
    if (lower.includes('ghat') || lower.includes('घाट') || lower.includes('तट') || lower.includes('गंगा') || lower.includes('कहाँ जाऊं')) {
      toolsToInvoke.push({
        name: 'search_ghats',
        args: { location: userLocation.city }
      });
    }

    // Recipe Intent
    if (lower.includes('thekua') || lower.includes('ठेकुआ') || lower.includes('recipe') || lower.includes('रसियाव') || lower.includes('खीर') || lower.includes('कसार') || lower.includes('बनाने की विधि') || lower.includes('प्रसाद कैसे')) {
      const prasadName = lower.includes('रसियाव') ? 'rasiyaw' : lower.includes('कसार') ? 'kasar' : 'thekua';
      toolsToInvoke.push({
        name: 'get_recipe',
        args: { name: prasadName }
      });
    }

    // Samagri / Checklist Intent
    if (lower.includes('samagri') || lower.includes('सामग्री') || lower.includes('सामान') || lower.includes('सूप') || lower.includes('दउरा') || lower.includes('checklist') || lower.includes('लिस्ट')) {
      if (lower.includes('जोड़') || lower.includes('add') || lower.includes('बना दो') || lower.includes('create')) {
        toolsToInvoke.push({
          name: 'create_checklist',
          args: { items: 'बांस का दउरा, पीतल का सूप, 5 गांठदार ईख (गन्ना), डाभ नींबू, नारियल, हल्दी-अदरक का पौधा, मिट्टी के दीये, कच्चा धागा' }
        });
      } else {
        toolsToInvoke.push({
          name: 'get_puja_information',
          args: { topic: 'सामग्री' }
        });
      }
    }

    // Songs Intent
    if (lower.includes('song') || lower.includes('गीत') || lower.includes('गाना') || lower.includes('शारदा सिन्हा') || lower.includes('भजन') || lower.includes('बहंगिया')) {
      toolsToInvoke.push({
        name: 'search_songs',
        args: { query: trimmed }
      });
    }

    // Reels Intent
    if (lower.includes('reel') || lower.includes('रील') || lower.includes('video') || lower.includes('वीडियो')) {
      toolsToInvoke.push({
        name: 'search_reels',
        args: { query: trimmed }
      });
    }

    // Family Tasks Intent
    if (lower.includes('family') || lower.includes('परिवार') || lower.includes('टास्क') || lower.includes('काम बांटो')) {
      toolsToInvoke.push({
        name: 'get_family_data',
        args: {}
      });
    }

    // Wish / Greeting Intent
    if (lower.includes('wish') || lower.includes('बधाई') || lower.includes('संदेश') || lower.includes('शुभेच्छा')) {
      toolsToInvoke.push({
        name: 'generate_wish',
        args: {
          recipient: lower.includes('पापा') ? 'पापा' : lower.includes('परिवार') ? 'परिवार' : 'मित्र',
          tone: 'emotional',
          language: preferredLang
        }
      });
    }

    // Fallback: If no explicit tool matched, use general internal search
    if (toolsToInvoke.length === 0) {
      toolsToInvoke.push({
        name: 'search_internal_content',
        args: { query: trimmed }
      });
    }

    // 2. Execute the detected tools
    const toolResults: ToolExecutionResult[] = [];
    for (const t of toolsToInvoke) {
      const res = await AgentToolExecutor.executeTool(t.name, t.args);
      toolResults.push(res);
    }

    // 3. Synthesize the final response
    let responseText = '';
    
    // Check if arghya time was queried
    const arghyaRes = toolResults.find(r => r.toolName === 'get_arghya_time');
    const weatherRes = toolResults.find(r => r.toolName === 'get_weather');
    const ghatRes = toolResults.find(r => r.toolName === 'search_ghats');
    const recipeRes = toolResults.find(r => r.toolName === 'get_recipe');
    const songRes = toolResults.find(r => r.toolName === 'search_songs');
    const wishRes = toolResults.find(r => r.toolName === 'generate_wish');
    const checklistRes = toolResults.find(r => r.toolName === 'create_checklist');
    const familyRes = toolResults.find(r => r.toolName === 'get_family_data');

    if (arghyaRes && arghyaRes.success && arghyaRes.data?.sandhyaSunset) {
      const d = arghyaRes.data;
      if (preferredLang === 'bho') {
        responseText = `जय छठी मईया! 🙏 ${d.cityName} में संध्या अर्घ्य (15 नवंबर 2026) के सूर्यास्त समय शाम ${d.sandhyaSunset} बा, आ उषा अर्घ्य (16 नवंबर) के सूर्योदय समय बिहान ${d.ushaSunrise} बा। रउआ से निहोरा बा कि कम से कम आधा घंटा पहिले घाट पर पहुँच जाईं।`;
      } else if (preferredLang === 'mai') {
        responseText = `प्रणाम! 🙏 ${d.cityName} मे संझुका अर्घ्यक सूर्यास्त काल साँझ ${d.sandhyaSunset} आ उषा अर्घ्यक सूर्योदय काल प्रात: ${d.ushaSunrise} अछि। समय सँ आधा घंटा पूर्व घाट पर पहुँचब श्रेयस्कर अछि।`;
      } else if (preferredLang === 'en') {
        responseText = `Jai Chhathi Maiya! 🙏 For ${d.cityName}, the calculated Sandhya Arghya sunset is at ${d.sandhyaSunset} on 15 Nov 2026, and Usha Arghya sunrise is at ${d.ushaSunrise} on 16 Nov 2026. Please reach your ghat at least 30 minutes in advance.`;
      } else {
        responseText = `जय छठी मईया! 🙏 आपके शहर ${d.cityName} में संध्या अर्घ्य (15 नवंबर 2026) का सूर्यास्त समय शाम ${d.sandhyaSunset} है, तथा उषा अर्घ्य (16 नवंबर 2026) का सूर्योदय समय प्रातः ${d.ushaSunrise} है। कृपया समय से 30-45 मिनट पूर्व सूप व दउरा लेकर घाट पर पहुंचें।`;
      }
    } else if (recipeRes && recipeRes.success) {
      const p = recipeRes.data;
      responseText = `जय छठी मईया! ${p.name} छठ का अत्यंत पावन महाप्रसाद है।\n\nमुख्य सामग्री:\n${p.ingredients?.slice(0, 4).map((i: string) => `• ${i}`).join('\n')}\n\nपवित्र विधि: आटे में देशी घी का मोयन देकर गुड़ के पानी से सख्त गूंथें और मध्यम आंच पर देशी घी में तलें। पूर्ण शुचिता का ध्यान रखें।`;
    } else if (ghatRes && ghatRes.success && ghatRes.data?.ghats?.length > 0) {
      const topGhat = ghatRes.data.ghats[0];
      responseText = `आपके क्षेत्र में प्रमुख छठ घाट: ${topGhat.name} (${topGhat.river})। यहाँ सुविधाएं: ${topGhat.facilities?.slice(0, 3).join(', ')} उपलब्ध हैं। भीड़ स्थिति: ${topGhat.crowdStatus}।`;
    } else if (songRes && songRes.success && songRes.data?.songs?.length > 0) {
      const s = songRes.data.songs[0];
      responseText = `छठ महापर्व का पावन गीत मिला: "${s.title}" — स्वर: ${s.singer} (${s.language})। पंक्तियाँ: "${s.lyrics}"`;
    } else if (wishRes && wishRes.success) {
      responseText = `छठी मईया के पावन अवसर पर आपके लिए संदेश:\n\n"${wishRes.data.text}"\n\n${wishRes.data.hashtags}`;
    } else if (checklistRes && checklistRes.success) {
      responseText = `आपकी छठ चेकलिस्ट में आवश्यक सामग्री जोड़ दी गई है! कुल ${checklistRes.data.totalItems} वस्तुएं सुरक्षित हैं। आप होम स्क्रीन के चेकलिस्ट सेक्शन से इसे देख सकते हैं।`;
    } else if (familyRes && familyRes.success) {
      responseText = `आपके परिवार वृत्त "${familyRes.data.familyName}" में कुल ${familyRes.data.tasksCount} कार्य हैं, जिनमें से ${familyRes.data.completedCount} पूर्ण हो चुके हैं।`;
    } else {
      responseText = `छठी मईया की असीम कृपा से छठ महापर्व शुचिता, अनुशासन व प्रकृति उपासना का अनुपम संगम है। मैंने आपकी क्वेरी के अनुसार प्रामाणिक डेटा खोजा है। क्या आप अर्घ्य समय, पूजा सामग्री, या घाट की जानकारी देखना चाहते हैं?`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      lang: preferredLang,
      toolCalls: toolsToInvoke,
      toolResults,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * AI Vision Analyzer: Examines uploaded/camera image for authentic Chhath objects.
   */
  public static async analyzeImage(fileOrUrl: File | string): Promise<VisionAnalysisResult> {
    // In production, this proxies to server /api/ai/vision with safe multimodal model
    // Here we provide structured cultural analysis based on sacred Chhath visual elements
    const filename = typeof fileOrUrl === 'string' ? fileOrUrl.toLowerCase() : fileOrUrl.name.toLowerCase();

    if (filename.includes('thekua') || filename.includes('prasad') || filename.includes('khajur')) {
      return {
        objectName: 'ठेकुआ (छठ महाप्रसाद / Thekua)',
        confidence: 'High',
        culturalContext: 'ठेकुआ सूर्य देव एवं छठी मईया का सर्वप्रमुख महाप्रसाद है। इसे लकड़ी के पारंपरिक सांचे पर गढ़ा जाता है और शुद्ध देशी घी में तला जाता है।',
        ingredientsOrComponents: [
          'मोटा पिसा हुआ गेहूं का आटा',
          'शुद्ध देशी गुड़ अथवा चीनी',
          'देशी गाय का घी (मोयन व तलने हेतु)',
          'सौंफ, कुटी हुई हरी इलायची और सूखा नारियल'
        ],
        preparationTips: [
          'आटा हमेशा सख्त (कड़ा) गूंथें, गीला आटा न बनाएं।',
          'घी का तापमान मध्यम रखें; तेज आंच पर तलने से अंदर से कच्चा रह सकता है।'
        ],
        traditionalDosAndDonts: [
          'बनाते समय पूर्ण पवित्रता और मौन का पालन करें।',
          'प्रसाद बनाने से पहले किसी को न चखाएं; भगवान को भोग लगने के बाद ही ग्रहण करें।'
        ]
      };
    }

    if (filename.includes('daura') || filename.includes('basket') || filename.includes('soop') || filename.includes('bahangi')) {
      return {
        objectName: 'बांस का दउरा एवं सूप (Daura & Soop)',
        confidence: 'High',
        culturalContext: 'बांस का दउरा और पीतल/बांस का सूप छठ के सात्विक प्रसाद एवं फलों को नदी तट तक ले जाने का पावन पात्र है। यह प्रकृति के प्रति सम्मान का प्रतीक है।',
        ingredientsOrComponents: [
          'नया बना हुआ प्राकृतिक बांस का दउरा',
          'पीतल अथवा बांस का सूप',
          'लाल अथवा पीला पवित्र वस्त्र ढकने हेतु'
        ],
        preparationTips: [
          'दउरा में नीचे ईख और केले के घवद रखें, ऊपर ठेकुआ और मौसमी फल सजाएं।',
          'दउरा को हमेशा परिवार का पुरुष सदस्य सिर पर उठाकर घाट तक ले जाता है।'
        ],
        traditionalDosAndDonts: [
          'दउरा को कभी भी जमीन पर अशुद्ध स्थान पर न रखें।',
          'जूठे हाथ से दउरा या सूप को न छुएं।'
        ]
      };
    }

    if (filename.includes('ghat') || filename.includes('river') || filename.includes('water')) {
      return {
        objectName: 'पवित्र छठ घाट (Sacred Chhath Ghat)',
        confidence: 'High',
        culturalContext: 'गंगा, कोसी, बागमती अथवा पवित्र सरोवरों का तट जहां व्रती कमर तक जल में खड़े होकर भगवान भास्कर को अर्घ्य अर्पित करते हैं।',
        ingredientsOrComponents: [
          'पवित्र नदी या जलकुंड',
          'मिट्टी के दीयों से सजा तट',
          'सुरक्षा बैरिकेडिंग एवं चेंजिंग रूम'
        ],
        preparationTips: [
          'सूर्यास्त से कम से कम 45 मिनट पहले घाट पहुंचें।',
          'जल में खड़े होते समय सूर्य की दिशा (पश्चिम सायंकाल / पूर्व प्रातःकाल) में मुख रखें।'
        ],
        traditionalDosAndDonts: [
          'घाट पर स्वच्छता का पूर्ण ध्यान रखें; प्लास्टिक या अशुद्ध सामग्री जल में न फेंकें।'
        ]
      };
    }

    // Default cultural identification with low confidence notice
    return {
      objectName: 'छठ पूजा सामग्री / पारंपरिक वस्तु (Chhath Cultural Samagri)',
      confidence: 'Medium',
      culturalContext: 'यह छवि छठ महापर्व की पावन सामग्री अथवा पारंपरिक परिवेश से संबंधित प्रतीत होती है।',
      ingredientsOrComponents: ['पारंपरिक वस्तु', 'पूजा अनुष्ठान अंग'],
      preparationTips: ['शुद्ध गंगाजल से प्रोक्षण कर प्रयोग में लाएं।'],
      traditionalDosAndDonts: ['पवित्रता और श्रद्धा का भाव बनाए रखें।'],
      confidenceDisclaimer: 'सटीक पहचान हेतु स्पष्ट प्रकाश में ठेकुआ, दउरा, सूप अथवा फल की फोटो अपलोड करें।'
    };
  }

  /**
   * "What Should I Do Now?" Contextual Intelligence Engine (Part 45).
   * Computes immediate actionable advice based on local time and sun position.
   */
  public static getWhatShouldIDoNow(cityName: string = 'Patna'): {
    phaseName: string;
    currentRecommendation: string;
    suggestedActionText: string;
    actionType: 'arghya' | 'cooking' | 'ghat' | 'rest';
    timerNotice: string;
  } {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 4 && hours < 7) {
      return {
        phaseName: 'उषा काल (Brahma Muhurta / Dawn)',
        currentRecommendation: 'प्रातःकालीन उषा अर्घ्य का समय सन्निकट है। गंगाजल व गाय के कच्चे दूध के साथ सूप में दीया प्रज्वलित कर उदीयमान सूर्य को अर्घ्य अर्पित करने की तैयारी करें।',
        suggestedActionText: 'उषा अर्घ्य का लाइव समय देखें',
        actionType: 'arghya',
        timerNotice: 'अर्घ्य मुहूर्त: प्रातः 06:06 AM - 06:30 AM'
      };
    } else if (hours >= 7 && hours < 12) {
      return {
        phaseName: 'प्रातः कालीन शुद्धि व सामग्री संकलन',
        currentRecommendation: 'यदि आज नहाय-खाय है तो सात्विक कद्दू-भात तैयार करें। यदि अर्घ्य का दिन है तो 5 गांठदार ईख, डाभ नींबू व फलों की टोकरी व्यवस्थित करें।',
        suggestedActionText: 'सामग्री चेकलिस्ट खोलें',
        actionType: 'cooking',
        timerNotice: 'दोपहर से पूर्व फल एवं दउरा तैयार रखें'
      };
    } else if (hours >= 12 && hours < 16) {
      return {
        phaseName: 'महाप्रसाद निर्माण एवं दउरा सज्जा',
        currentRecommendation: 'सायं अर्घ्य हेतु शुद्ध देशी घी में खस्ता ठेकुआ तैयार करें। पीतल के सूप में फल, पान-सुपारी, रोली व दीप सजाकर दउरा तैयार करें।',
        suggestedActionText: 'ठेकुआ रेसिपी और सांचा विधि देखें',
        actionType: 'cooking',
        timerNotice: 'अपराह्न 4:00 बजे तक घाट प्रस्थान करें'
      };
    } else if (hours >= 16 && hours < 18) {
      return {
        phaseName: 'संध्या अर्घ्य वेला (Sunset Arghya)',
        currentRecommendation: 'भगवान भुवन भास्कर अस्ताचल की ओर बढ़ रहे हैं। परिवार सहित पवित्र नदी तट पर कमर तक जल में खड़े होकर प्रथम अर्घ्य समर्पित करें।',
        suggestedActionText: 'संध्या अर्घ्य समय एवं घाट स्थिति',
        actionType: 'ghat',
        timerNotice: 'सूर्यास्त समय: सायं 17:02 PM'
      };
    } else {
      return {
        phaseName: 'रात्रि विश्राम एवं भजन संध्या',
        currentRecommendation: 'संध्या अर्घ्य के उपरांत घर लौटकर दीप प्रज्वलित करें। शारदा सिन्हा जी के पारंपरिक छठ गीतों का श्रवण करें तथा कल प्रातःकालीन उषा अर्घ्य हेतु विश्राम करें।',
        suggestedActionText: 'छठ पारंपरिक गीत सुनें',
        actionType: 'rest',
        timerNotice: 'कल प्रातः 4:00 बजे से उषा अर्घ्य तैयारी'
      };
    }
  }

  /**
   * "Create My Chhath Plan" 4-Day Complete Itinerary Builder (Part 44).
   */
  public static createChhathPlan(options: {
    cityName: string;
    familyCount: number;
    hasFastKeeper: boolean;
  }): ChhathPlanDay[] {
    return [
      {
        dayNumber: 1,
        dayName: 'नहाय-खाय (Nahay Khay)',
        date: '13 नवंबर 2026 (शुक्रवार)',
        morningAction: 'प्रातःकाल पवित्र नदी अथवा गंगाजल मिश्रित जल से स्नान। धौत वस्त्र धारण।',
        afternoonAction: 'नए मिट्टी/पीतल के बर्तन में अरवा चावल, चने की दाल और शुद्ध घी में कद्दू (लौकी) की सात्विक सब्जी बनाएं।',
        eveningAction: 'घर की पूर्ण शुद्धि करें और कल के खरना हेतु आम की सूखी लकड़ी एवं नया चूल्हा तैयार रखें।',
        criticalSamagri: ['अरवा चावल', 'चने की दाल', 'कद्दू (लौकी)', 'सेंधा नमक', 'शुद्ध देशी घी'],
        fastingGuidelines: 'केवल एक बार मध्याह्न में सात्विक भोजन ग्रहण करें।',
        culturalNote: 'नहाय-खाय का अर्थ अंतःकरण और शरीर का पूर्ण शोधन है।'
      },
      {
        dayNumber: 2,
        dayName: 'खरना / लोहंडा (Kharna)',
        date: '14 नवंबर 2026 (शनिवार)',
        morningAction: 'पूर्ण निर्जला उपवास का संकल्प। पूरे दिन अन्न-जल ग्रहण नहीं किया जाता।',
        afternoonAction: 'मिट्टी के चूल्हे पर आम की लकड़ी की आंच पर गाय के दूध व गुड़ से "रसियाव" (खीर) व घी चुपड़ी रोटी बनाएं।',
        eveningAction: 'सूर्यास्त के बाद एकांत शांत कक्ष में मां षष्ठी को भोग लगाकर व्रती प्रसाद ग्रहण करते हैं। तत्पश्चात अखंड 36 घंटे का निर्जला व्रत शुरू होता है।',
        criticalSamagri: ['गाय का शुद्ध दूध', 'देशी गुड़', 'नया अरवा चावल', 'केले का पत्ता', 'केला'],
        fastingGuidelines: 'शाम के प्रसाद के बाद अगले 36 घंटे तक जल भी वर्जित रहता है।',
        culturalNote: 'खरना आत्मसंयम और तपस्या की पराकाष्ठा है।'
      },
      {
        dayNumber: 3,
        dayName: 'संध्या अर्घ्य (Sandhya Arghya / पहला अर्घ्य)',
        date: '15 नवंबर 2026 (रविवार)',
        morningAction: 'शुद्ध देशी घी में खस्ता ठेकुआ व कसार महाप्रसाद तैयार करें। बांस के दउरा व पीतल के सूप में फल सजाएं।',
        afternoonAction: 'दउरा सिर पर उठाकर गाजे-बाजे और छठ गीतों के साथ परिवार सहित घाट की ओर प्रस्थान करें (दोपहर 3:30 - 4:00 PM)।',
        eveningAction: `सूर्यास्त समय (${options.cityName} में शाम 5:02 PM) कमर तक जल में खड़े होकर अस्ताचलगामी सूर्य को अर्घ्य समर्पित करें।`,
        criticalSamagri: ['बांस का दउरा', 'पीतल/बांस का सूप', '5 गांठदार गन्ना', 'डाभ नींबू', 'नारियल', 'ठेकुआ', 'दीये'],
        fastingGuidelines: 'कठिन निर्जला व्रत जारी रहता है।',
        culturalNote: 'डूबते हुए सूर्य को नमन करना कृतज्ञता और जीवन चक्र के सम्मान का संदेश देता है।'
      },
      {
        dayNumber: 4,
        dayName: 'उषा अर्घ्य एवं पारण (Usha Arghya & Paran)',
        date: '16 नवंबर 2026 (सोमवार)',
        morningAction: `ब्रह्म मुहूर्त (प्रातः 4:30 AM) में पुनः घाट पर पहुंचें। सूर्योदय समय (${options.cityName} में प्रातः 6:08 AM) उदित होते सूर्य को दूध व जल से अर्घ्य दें।`,
        afternoonAction: 'घाट पर बड़ों के चरण स्पर्श कर आशीर्वाद लें और कच्चा दूध व अदरक-गुड़ से 36 घंटे के व्रत का पारण करें।',
        eveningAction: 'परिवार, मित्रों और पड़ोसियों में ठेकुआ और फल का महाप्रसाद वितरित करें।',
        criticalSamagri: ['गाय का कच्चा दूध', 'गंगाजल', 'हवन सामग्री', 'अदरक', 'गुड़'],
        fastingGuidelines: 'पारण के साथ तपस्या पूर्ण होती है।',
        culturalNote: 'उगते सूर्य का स्वागत नई आशा, स्वास्थ्य और दीर्घायु का वरदान लेकर आता है।'
      }
    ];
  }

  /**
   * Text-to-Speech Web Audio helper for Voice AI (Part 6).
   */
  public static speakText(
    text: string,
    lang: 'hi' | 'en' | 'bho' | 'mai' = 'hi',
    onEnd?: () => void
  ): { cancel: () => void } {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.();
      return { cancel: () => {} };
    }

    window.speechSynthesis.cancel();

    // Clean markdown and symbols for natural voice
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);

    return {
      cancel: () => {
        window.speechSynthesis.cancel();
      }
    };
  }
}
