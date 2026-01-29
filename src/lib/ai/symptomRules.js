// Symptom Analysis Rules - Rule-based AI for health risk assessment
// ⚠️ This is for reference purposes only - NOT medical advice

export const symptomCategories = {
    fever: {
        keywords: ['sốt', 'nóng', 'nhiệt độ cao', 'fever', 'nóng người', 'sốt cao'],
        followUpQuestions: [
            'Nhiệt độ cơ thể hiện tại là bao nhiêu độ C?',
            'Bạn có các triệu chứng kèm theo như ho, đau họng, sổ mũi không?',
            'Triệu chứng đã kéo dài bao lâu rồi?'
        ]
    },
    headache: {
        keywords: ['đau đầu', 'nhức đầu', 'đau nửa đầu', 'headache', 'migraine'],
        followUpQuestions: [
            'Cơn đau đầu mức độ từ 1-10 là bao nhiêu?',
            'Bạn có buồn nôn, nhạy cảm với ánh sáng không?',
            'Đau đầu xuất hiện từ khi nào?'
        ]
    },
    stomach: {
        keywords: ['đau bụng', 'đau dạ dày', 'buồn nôn', 'tiêu chảy', 'táo bón', 'khó tiêu'],
        followUpQuestions: [
            'Vị trí đau bụng cụ thể ở đâu (trên, dưới, bên trái/phải)?',
            'Bạn có tiêu chảy hoặc nôn mửa không?',
            'Bạn có ăn gì lạ gần đây không?'
        ]
    },
    respiratory: {
        keywords: ['ho', 'khó thở', 'đau họng', 'viêm họng', 'sổ mũi', 'nghẹt mũi', 'cảm cúm'],
        followUpQuestions: [
            'Ho có đờm không? Đờm màu gì?',
            'Bạn có khó thở khi nằm hoặc khi gắng sức không?',
            'Triệu chứng đã kéo dài bao lâu?'
        ]
    },
    fatigue: {
        keywords: ['mệt mỏi', 'uể oải', 'kiệt sức', 'không có năng lượng', 'yếu', 'suy nhược'],
        followUpQuestions: [
            'Bạn ngủ đủ giấc không (7-8 tiếng/đêm)?',
            'Mức độ mệt mỏi từ 1-10 là bao nhiêu?',
            'Tình trạng này kéo dài bao lâu rồi?'
        ]
    },
    chest: {
        keywords: ['đau ngực', 'tức ngực', 'khó thở', 'tim đập nhanh', 'hồi hộp'],
        followUpQuestions: [
            'Cơn đau có lan ra cánh tay trái, cổ hoặc hàm không?',
            'Đau tăng khi gắng sức hay khi nghỉ ngơi?',
            'Bạn có đổ mồ hôi lạnh kèm theo không?'
        ]
    },
    skin: {
        keywords: ['mẩn ngứa', 'nổi mề đay', 'dị ứng da', 'phát ban', 'ngứa', 'sưng'],
        followUpQuestions: [
            'Vùng da bị ảnh hưởng ở đâu?',
            'Bạn có tiếp xúc với chất gì lạ gần đây không?',
            'Có kèm theo sốt hoặc khó thở không?'
        ]
    },
    muscle: {
        keywords: ['đau cơ', 'đau khớp', 'đau lưng', 'cứng khớp', 'nhức mỏi', 'căng cơ'],
        followUpQuestions: [
            'Vị trí đau cụ thể ở đâu?',
            'Có sưng đỏ hoặc nóng ở vùng đau không?',
            'Đau có liên quan đến hoạt động thể chất gần đây không?'
        ]
    }
}

// Analyze symptoms and determine risk level
export const analyzeSymptoms = (symptoms, answers) => {
    const analysisResult = {
        riskLevel: 'low',
        possibleConditions: [],
        recommendations: [],
        medicationGroups: [],
        whenToSeeDoctor: [],
        warnings: []
    }

    const symptomsLower = symptoms.toLowerCase()

    // Check for high-risk symptoms first
    if (checkHighRiskSymptoms(symptomsLower, answers)) {
        analysisResult.riskLevel = 'high'
        analysisResult.warnings.push('⚠️ Các triệu chứng bạn mô tả có thể cần được khám ngay')
        analysisResult.whenToSeeDoctor.push('Nên đến cơ sở y tế trong vòng 24 giờ')
        analysisResult.whenToSeeDoctor.push('Nếu triệu chứng nặng, gọi cấp cứu 115')
        return analysisResult
    }

    // Check for fever
    if (containsKeywords(symptomsLower, symptomCategories.fever.keywords)) {
        const temp = parseTemperature(answers)
        if (temp >= 39.5) {
            analysisResult.riskLevel = 'high'
            analysisResult.possibleConditions.push('Sốt cao - cần theo dõi cẩn thận')
            analysisResult.medicationGroups.push('Thuốc hạ sốt (Paracetamol)')
            analysisResult.whenToSeeDoctor.push('Sốt trên 39.5°C kéo dài hơn 2 ngày')
        } else if (temp >= 38) {
            analysisResult.riskLevel = 'medium'
            analysisResult.possibleConditions.push('Sốt vừa - có thể do nhiễm trùng')
            analysisResult.medicationGroups.push('Thuốc hạ sốt (Paracetamol)')
        } else {
            analysisResult.possibleConditions.push('Sốt nhẹ - theo dõi tại nhà')
        }
        analysisResult.recommendations.push('Uống nhiều nước')
        analysisResult.recommendations.push('Nghỉ ngơi đầy đủ')
        analysisResult.recommendations.push('Chườm mát nếu sốt cao')
    }

    // Check for headache
    if (containsKeywords(symptomsLower, symptomCategories.headache.keywords)) {
        const severity = parseSeverity(answers)
        if (severity >= 8) {
            analysisResult.riskLevel = Math.max(analysisResult.riskLevel === 'high' ? 3 : analysisResult.riskLevel === 'medium' ? 2 : 1, 2) === 3 ? 'high' : 'medium'
            analysisResult.possibleConditions.push('Đau đầu dữ dội - cần kiểm tra')
            analysisResult.whenToSeeDoctor.push('Đau đầu dữ dội đột ngột')
        } else {
            analysisResult.possibleConditions.push('Đau đầu thông thường')
        }
        analysisResult.medicationGroups.push('Thuốc giảm đau (Paracetamol, Ibuprofen)')
        analysisResult.recommendations.push('Nghỉ ngơi trong phòng tối, yên tĩnh')
        analysisResult.recommendations.push('Uống đủ nước')
    }

    // Check for stomach issues
    if (containsKeywords(symptomsLower, symptomCategories.stomach.keywords)) {
        if (symptomsLower.includes('tiêu chảy') || symptomsLower.includes('nôn')) {
            analysisResult.riskLevel = compareRisk(analysisResult.riskLevel, 'medium')
            analysisResult.possibleConditions.push('Rối loạn tiêu hóa')
            analysisResult.whenToSeeDoctor.push('Tiêu chảy/nôn kéo dài hơn 2 ngày')
            analysisResult.whenToSeeDoctor.push('Có dấu hiệu mất nước nghiêm trọng')
        } else {
            analysisResult.possibleConditions.push('Khó chịu dạ dày')
        }
        analysisResult.medicationGroups.push('Thuốc kháng acid, bảo vệ dạ dày')
        analysisResult.medicationGroups.push('Men vi sinh (nếu tiêu chảy)')
        analysisResult.recommendations.push('Ăn thức ăn nhẹ, dễ tiêu')
        analysisResult.recommendations.push('Tránh đồ cay, chua, nhiều dầu mỡ')
        analysisResult.recommendations.push('Bổ sung nước và điện giải')
    }

    // Check for respiratory symptoms
    if (containsKeywords(symptomsLower, symptomCategories.respiratory.keywords)) {
        if (symptomsLower.includes('khó thở')) {
            analysisResult.riskLevel = 'medium'
            analysisResult.whenToSeeDoctor.push('Khó thở nghiêm trọng hoặc tăng dần')
        }
        analysisResult.possibleConditions.push('Triệu chứng đường hô hấp')
        analysisResult.medicationGroups.push('Thuốc ho (nếu ho)')
        analysisResult.medicationGroups.push('Thuốc giảm nghẹt mũi (nếu sổ mũi)')
        analysisResult.medicationGroups.push('Viên ngậm họng (nếu đau họng)')
        analysisResult.recommendations.push('Giữ ấm cổ họng')
        analysisResult.recommendations.push('Uống nước ấm với mật ong')
        analysisResult.recommendations.push('Tránh khói bụi, không khí lạnh')
    }

    // Check for chest symptoms - always high priority
    if (containsKeywords(symptomsLower, symptomCategories.chest.keywords)) {
        analysisResult.riskLevel = 'high'
        analysisResult.possibleConditions.push('Triệu chứng vùng ngực - cần đánh giá')
        analysisResult.warnings.push('⚠️ Đau ngực cần được đánh giá y tế')
        analysisResult.whenToSeeDoctor.push('Đau ngực lan ra cánh tay, cổ, hàm')
        analysisResult.whenToSeeDoctor.push('Khó thở kèm đau ngực')
        analysisResult.whenToSeeDoctor.push('Đau ngực khi gắng sức')
    }

    // Check for fatigue
    if (containsKeywords(symptomsLower, symptomCategories.fatigue.keywords)) {
        analysisResult.possibleConditions.push('Mệt mỏi - nhiều nguyên nhân có thể')
        analysisResult.recommendations.push('Đảm bảo ngủ đủ 7-8 tiếng/đêm')
        analysisResult.recommendations.push('Bổ sung vitamin và khoáng chất')
        analysisResult.recommendations.push('Tập thể dục nhẹ nhàng đều đặn')
        analysisResult.whenToSeeDoctor.push('Mệt mỏi kéo dài hơn 2 tuần không cải thiện')
    }

    // Check for skin issues
    if (containsKeywords(symptomsLower, symptomCategories.skin.keywords)) {
        if (symptomsLower.includes('sưng') && symptomsLower.includes('khó thở')) {
            analysisResult.riskLevel = 'high'
            analysisResult.warnings.push('⚠️ Có thể là phản ứng dị ứng nghiêm trọng')
            analysisResult.whenToSeeDoctor.push('Sưng mặt/họng kèm khó thở - CẤP CỨU')
        } else {
            analysisResult.possibleConditions.push('Phản ứng da')
            analysisResult.medicationGroups.push('Thuốc kháng histamine (chống dị ứng)')
            analysisResult.medicationGroups.push('Kem bôi dị ứng/ngứa')
        }
        analysisResult.recommendations.push('Tránh tiếp xúc với chất nghi ngờ gây dị ứng')
        analysisResult.recommendations.push('Không gãi vùng da bị ảnh hưởng')
    }

    // Default recommendations
    if (analysisResult.recommendations.length === 0) {
        analysisResult.recommendations.push('Theo dõi triệu chứng')
        analysisResult.recommendations.push('Nghỉ ngơi đầy đủ')
        analysisResult.recommendations.push('Uống đủ nước')
    }

    if (analysisResult.whenToSeeDoctor.length === 0) {
        analysisResult.whenToSeeDoctor.push('Triệu chứng không cải thiện sau 3-5 ngày')
        analysisResult.whenToSeeDoctor.push('Triệu chứng trở nên nghiêm trọng hơn')
    }

    return analysisResult
}

// Helper functions
function containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()))
}

function checkHighRiskSymptoms(symptoms, answers) {
    const highRiskIndicators = [
        'đau ngực dữ dội',
        'khó thở nghiêm trọng',
        'mất ý thức',
        'co giật',
        'chảy máu nhiều',
        'đau đầu đột ngột dữ dội',
        'yếu liệt nửa người',
        'nói khó',
        'sốt trên 40'
    ]

    return highRiskIndicators.some(indicator => symptoms.includes(indicator))
}

function parseTemperature(answers) {
    if (!answers || answers.length === 0) return 37
    const tempAnswer = answers[0]
    const match = tempAnswer.match(/(\d+\.?\d*)/)
    return match ? parseFloat(match[1]) : 37
}

function parseSeverity(answers) {
    if (!answers || answers.length === 0) return 5
    for (const answer of answers) {
        const match = answer.match(/(\d+)/)
        if (match) {
            const num = parseInt(match[1])
            if (num >= 1 && num <= 10) return num
        }
    }
    return 5
}

function compareRisk(current, newRisk) {
    const order = { low: 1, medium: 2, high: 3 }
    return order[newRisk] > order[current] ? newRisk : current
}

// Detect symptom category from text
export const detectSymptomCategory = (text) => {
    const textLower = text.toLowerCase()
    const detectedCategories = []

    for (const [category, data] of Object.entries(symptomCategories)) {
        if (containsKeywords(textLower, data.keywords)) {
            detectedCategories.push({
                category,
                questions: data.followUpQuestions
            })
        }
    }

    return detectedCategories
}

// Get follow-up questions based on symptoms
export const getFollowUpQuestions = (symptoms) => {
    const categories = detectSymptomCategory(symptoms)
    const questions = []

    categories.slice(0, 2).forEach(cat => {
        questions.push(...cat.questions.slice(0, 2))
    })

    // Limit to 3 questions
    return questions.slice(0, 3)
}
