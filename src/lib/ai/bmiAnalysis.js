// BMI Analysis and Recommendations
// Reference: WHO BMI Classification

export const BMI_CATEGORIES = {
    severelyUnderweight: { min: 0, max: 16, label: 'Thiếu cân nghiêm trọng', color: 'danger', riskLevel: 'high' },
    underweight: { min: 16, max: 18.5, label: 'Thiếu cân', color: 'warning', riskLevel: 'medium' },
    normal: { min: 18.5, max: 24.9, label: 'Bình thường', color: 'success', riskLevel: 'low' },
    overweight: { min: 25, max: 29.9, label: 'Thừa cân', color: 'warning', riskLevel: 'medium' },
    obeseClass1: { min: 30, max: 34.9, label: 'Béo phì độ I', color: 'danger', riskLevel: 'medium' },
    obeseClass2: { min: 35, max: 39.9, label: 'Béo phì độ II', color: 'danger', riskLevel: 'high' },
    obeseClass3: { min: 40, max: 100, label: 'Béo phì độ III', color: 'danger', riskLevel: 'high' }
}

// Calculate BMI
export const calculateBMI = (weightKg, heightCm) => {
    if (!weightKg || !heightCm || heightCm <= 0) return null
    const heightM = heightCm / 100
    const bmi = weightKg / (heightM * heightM)
    return Math.round(bmi * 10) / 10
}

// Get BMI category
export const getBMICategory = (bmi) => {
    if (!bmi) return null

    for (const [key, category] of Object.entries(BMI_CATEGORIES)) {
        if (bmi >= category.min && bmi < category.max) {
            return { key, ...category }
        }
    }

    return BMI_CATEGORIES.normal
}

// Calculate ideal weight range
export const getIdealWeightRange = (heightCm) => {
    if (!heightCm) return null
    const heightM = heightCm / 100

    return {
        min: Math.round(18.5 * heightM * heightM * 10) / 10,
        max: Math.round(24.9 * heightM * heightM * 10) / 10
    }
}

// Analyze BMI trends
export const analyzeBMITrend = (metricsHistory) => {
    if (!metricsHistory || metricsHistory.length < 2) {
        return {
            trend: 'insufficient_data',
            message: 'Cần ít nhất 2 lần đo để phân tích xu hướng',
            recommendations: ['Tiếp tục cập nhật cân nặng định kỳ']
        }
    }

    const sortedMetrics = [...metricsHistory].sort(
        (a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)
    )

    const recentMetrics = sortedMetrics.slice(-7) // Last 7 records
    const firstRecord = recentMetrics[0]
    const lastRecord = recentMetrics[recentMetrics.length - 1]

    const weightChange = lastRecord.weight_kg - firstRecord.weight_kg
    const bmiChange = lastRecord.bmi - firstRecord.bmi
    const daysDiff = (new Date(lastRecord.recorded_at) - new Date(firstRecord.recorded_at)) / (1000 * 60 * 60 * 24)

    const analysis = {
        weightChange: Math.round(weightChange * 10) / 10,
        bmiChange: Math.round(bmiChange * 10) / 10,
        periodDays: Math.round(daysDiff),
        trend: 'stable',
        message: '',
        recommendations: [],
        alertLevel: 'low'
    }

    // Analyze weight change
    if (weightChange > 2 && daysDiff <= 30) {
        analysis.trend = 'increasing'
        analysis.alertLevel = 'medium'
        analysis.message = `Cân nặng tăng ${analysis.weightChange}kg trong ${analysis.periodDays} ngày`
        analysis.recommendations.push('Theo dõi chế độ ăn uống')
        analysis.recommendations.push('Tăng cường vận động')
        analysis.recommendations.push('Kiểm tra lại sau 1 tuần')
    } else if (weightChange < -2 && daysDiff <= 30) {
        analysis.trend = 'decreasing'
        analysis.alertLevel = 'medium'
        analysis.message = `Cân nặng giảm ${Math.abs(analysis.weightChange)}kg trong ${analysis.periodDays} ngày`
        analysis.recommendations.push('Đảm bảo ăn đủ dinh dưỡng')
        analysis.recommendations.push('Tham khảo ý kiến bác sĩ nếu giảm cân không chủ đích')
    } else if (weightChange > 5 && daysDiff <= 30) {
        analysis.trend = 'rapid_increase'
        analysis.alertLevel = 'high'
        analysis.message = `⚠️ Cân nặng tăng nhanh ${analysis.weightChange}kg trong ${analysis.periodDays} ngày`
        analysis.recommendations.push('Nên tham khảo ý kiến bác sĩ')
        analysis.recommendations.push('Kiểm tra chế độ ăn và hoạt động')
    } else if (weightChange < -5 && daysDiff <= 30) {
        analysis.trend = 'rapid_decrease'
        analysis.alertLevel = 'high'
        analysis.message = `⚠️ Cân nặng giảm nhanh ${Math.abs(analysis.weightChange)}kg trong ${analysis.periodDays} ngày`
        analysis.recommendations.push('Nên đến cơ sở y tế để kiểm tra')
        analysis.recommendations.push('Theo dõi chế độ dinh dưỡng')
    } else {
        analysis.trend = 'stable'
        analysis.message = 'Cân nặng ổn định'
        analysis.recommendations.push('Duy trì lối sống lành mạnh')
        analysis.recommendations.push('Tiếp tục theo dõi định kỳ')
    }

    // Add BMI-specific recommendations
    const currentCategory = getBMICategory(lastRecord.bmi)
    if (currentCategory) {
        if (currentCategory.riskLevel === 'high') {
            analysis.alertLevel = 'high'
            analysis.recommendations.push(`BMI hiện tại: ${lastRecord.bmi} (${currentCategory.label})`)
            analysis.recommendations.push('Nên tham khảo ý kiến chuyên gia dinh dưỡng')
        } else if (currentCategory.riskLevel === 'medium') {
            analysis.recommendations.push(`BMI hiện tại: ${lastRecord.bmi} (${currentCategory.label})`)
        }
    }

    return analysis
}

// Get BMI recommendations
export const getBMIRecommendations = (bmi) => {
    const category = getBMICategory(bmi)
    if (!category) return []

    const recommendations = {
        severelyUnderweight: [
            'Tăng cường bổ sung dinh dưỡng',
            'Ăn nhiều bữa nhỏ trong ngày',
            'Bổ sung thực phẩm giàu calo lành mạnh',
            'Nên tham khảo ý kiến bác sĩ/chuyên gia dinh dưỡng'
        ],
        underweight: [
            'Tăng khẩu phần ăn hợp lý',
            'Bổ sung protein và carbohydrate',
            'Tập luyện để tăng cơ bắp',
            'Đảm bảo ngủ đủ giấc'
        ],
        normal: [
            'Duy trì chế độ ăn uống cân bằng',
            'Tập thể dục đều đặn 30 phút/ngày',
            'Uống đủ nước (2-3 lít/ngày)',
            'Kiểm tra sức khỏe định kỳ'
        ],
        overweight: [
            'Giảm khẩu phần ăn hợp lý',
            'Hạn chế đường và tinh bột',
            'Tăng cường rau xanh và chất xơ',
            'Tập thể dục ít nhất 45 phút/ngày'
        ],
        obeseClass1: [
            'Xây dựng kế hoạch giảm cân an toàn',
            'Tham khảo ý kiến chuyên gia dinh dưỡng',
            'Tập luyện đều đặn với cường độ phù hợp',
            'Theo dõi cân nặng hàng tuần'
        ],
        obeseClass2: [
            'Nên tham khảo ý kiến bác sĩ',
            'Xây dựng chế độ ăn kiêng có hướng dẫn',
            'Bắt đầu với các bài tập nhẹ nhàng',
            'Kiểm tra sức khỏe tim mạch'
        ],
        obeseClass3: [
            'Cần được tư vấn y tế chuyên sâu',
            'Có thể cần can thiệp y khoa',
            'Theo dõi các chỉ số sức khỏe thường xuyên',
            'Tìm hiểu các giải pháp điều trị béo phì'
        ]
    }

    return recommendations[category.key] || recommendations.normal
}

// Format BMI for display
export const formatBMI = (bmi) => {
    if (!bmi) return '--'
    return bmi.toFixed(1)
}

// Get BMI color class
export const getBMIColorClass = (bmi) => {
    const category = getBMICategory(bmi)
    if (!category) return 'text-dark-400'

    const colorMap = {
        success: 'text-success-400',
        warning: 'text-warning-400',
        danger: 'text-danger-400'
    }

    return colorMap[category.color] || 'text-dark-400'
}
