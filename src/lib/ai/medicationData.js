// OTC Medication Database - For reference only
// ⚠️ This is NOT medical advice. Always consult a healthcare professional.

export const medicationDatabase = {
    // Pain relievers / Fever reducers
    paracetamol: {
        name: 'Paracetamol (Acetaminophen)',
        otherNames: ['Tylenol', 'Panadol', 'Efferalgan', 'Hapacol'],
        category: 'Thuốc giảm đau, hạ sốt',
        generalUse: 'Giảm đau nhẹ đến vừa, hạ sốt. Thường dùng cho đau đầu, đau răng, đau cơ, sốt do cảm cúm.',
        whenNotToUse: [
            'Dị ứng với paracetamol',
            'Bệnh gan nặng',
            'Nghiện rượu (sử dụng cẩn thận)'
        ],
        interactions: [
            'Rượu - tăng nguy cơ tổn thương gan',
            'Warfarin - có thể tăng tác dụng chống đông',
            'Thuốc chống động kinh - có thể giảm tác dụng paracetamol'
        ],
        commonSideEffects: [
            'Hiếm khi gây tác dụng phụ khi dùng đúng liều',
            'Phát ban da (hiếm)',
            'Tổn thương gan nếu quá liều'
        ],
        importantNotes: '⚠️ Không dùng quá liều khuyến cáo. Kiểm tra thành phần thuốc kết hợp để tránh uống trùng.'
    },

    ibuprofen: {
        name: 'Ibuprofen',
        otherNames: ['Advil', 'Nurofen', 'Brufen', 'Alaxan'],
        category: 'Thuốc giảm đau, kháng viêm không steroid (NSAID)',
        generalUse: 'Giảm đau, hạ sốt, kháng viêm. Dùng cho đau đầu, đau răng, đau cơ, đau bụng kinh, viêm khớp nhẹ.',
        whenNotToUse: [
            'Viêm loét dạ dày hoặc xuất huyết tiêu hóa',
            'Suy thận nặng',
            'Dị ứng với aspirin hoặc NSAID khác',
            'Tam cá nguyệt thứ 3 của thai kỳ',
            'Sau phẫu thuật bắc cầu mạch vành'
        ],
        interactions: [
            'Aspirin - tăng nguy cơ xuất huyết',
            'Thuốc chống đông - tăng nguy cơ chảy máu',
            'Thuốc huyết áp - có thể giảm tác dụng',
            'Lithium - tăng nồng độ lithium trong máu'
        ],
        commonSideEffects: [
            'Đau dạ dày, khó tiêu',
            'Buồn nôn',
            'Chóng mặt',
            'Phát ban da'
        ],
        importantNotes: '⚠️ Nên uống sau bữa ăn để giảm kích ứng dạ dày. Không dùng dài ngày mà không có ý kiến bác sĩ.'
    },

    // Antihistamines
    cetirizine: {
        name: 'Cetirizine',
        otherNames: ['Zyrtec', 'Cetimed', 'Allercet'],
        category: 'Thuốc kháng histamine, chống dị ứng',
        generalUse: 'Điều trị triệu chứng dị ứng: ngứa, hắt hơi, sổ mũi, mề đay, viêm mũi dị ứng.',
        whenNotToUse: [
            'Dị ứng với cetirizine hoặc các thuốc nhóm piperazine',
            'Suy thận nặng (cần giảm liều)',
            'Thận trọng ở người cao tuổi'
        ],
        interactions: [
            'Rượu - tăng tác dụng an thần',
            'Thuốc an thần khác - tăng buồn ngủ',
            'Theophylline - có thể giảm thải trừ cetirizine'
        ],
        commonSideEffects: [
            'Buồn ngủ (ít hơn các thuốc thế hệ cũ)',
            'Khô miệng',
            'Đau đầu',
            'Mệt mỏi'
        ],
        importantNotes: '⚠️ Thận trọng khi lái xe hoặc vận hành máy móc.'
    },

    loratadine: {
        name: 'Loratadine',
        otherNames: ['Claritin', 'Clarityne', 'Lorastad'],
        category: 'Thuốc kháng histamine, chống dị ứng',
        generalUse: 'Giảm triệu chứng dị ứng theo mùa và dị ứng da: ngứa, hắt hơi, chảy nước mũi, mề đay.',
        whenNotToUse: [
            'Dị ứng với loratadine',
            'Suy gan nặng'
        ],
        interactions: [
            'Ketoconazole - tăng nồng độ loratadine',
            'Erythromycin - tăng nồng độ loratadine',
            'Các thuốc ức chế CYP3A4'
        ],
        commonSideEffects: [
            'Đau đầu',
            'Mệt mỏi',
            'Khô miệng',
            'Buồn ngủ (ít gặp)'
        ],
        importantNotes: 'Loratadine ít gây buồn ngủ, phù hợp dùng ban ngày.'
    },

    // Cough medicines
    dextromethorphan: {
        name: 'Dextromethorphan',
        otherNames: ['Robitussin DM', 'Atussin', 'Thuốc ho DM'],
        category: 'Thuốc ức chế ho',
        generalUse: 'Giảm ho khan, ho không có đờm. Thường dùng trong cảm lạnh.',
        whenNotToUse: [
            'Ho có đờm (cần khạc đờm ra)',
            'Đang dùng thuốc MAOI',
            'Trẻ dưới 4 tuổi'
        ],
        interactions: [
            'Thuốc MAOI - nguy cơ hội chứng serotonin',
            'Thuốc chống trầm cảm SSRI - tăng nguy cơ hội chứng serotonin',
            'Quinidine - tăng nồng độ dextromethorphan'
        ],
        commonSideEffects: [
            'Chóng mặt',
            'Buồn ngủ',
            'Buồn nôn',
            'Đau dạ dày'
        ],
        importantNotes: '⚠️ Không dùng cho ho có đờm. Ho là phản xạ bảo vệ cơ thể.'
    },

    // Digestive
    omeprazole: {
        name: 'Omeprazole',
        otherNames: ['Losec', 'Prilosec', 'Nexium (esomeprazole)'],
        category: 'Thuốc ức chế bơm proton (PPI)',
        generalUse: 'Giảm tiết acid dạ dày, điều trị trào ngược dạ dày thực quản, viêm loét dạ dày.',
        whenNotToUse: [
            'Dị ứng với omeprazole hoặc PPI khác',
            'Thận trọng khi dùng dài ngày'
        ],
        interactions: [
            'Clopidogrel - giảm tác dụng chống đông',
            'Methotrexate - tăng nồng độ methotrexate',
            'Thuốc kháng HIV - thay đổi hấp thu'
        ],
        commonSideEffects: [
            'Đau đầu',
            'Buồn nôn, đau bụng',
            'Tiêu chảy hoặc táo bón',
            'Đầy hơi'
        ],
        importantNotes: '⚠️ Không nên dùng dài hơn 14 ngày mà không có ý kiến bác sĩ.'
    },

    // Probiotics
    probiotics: {
        name: 'Men vi sinh (Probiotics)',
        otherNames: ['Bioflora', 'Antibio Pro', 'Enterogermina', 'Lactobacillus'],
        category: 'Thực phẩm chức năng / Men vi sinh',
        generalUse: 'Hỗ trợ cân bằng hệ vi sinh đường ruột, giảm tiêu chảy, hỗ trợ tiêu hóa.',
        whenNotToUse: [
            'Suy giảm miễn dịch nghiêm trọng',
            'Đang dùng thuốc ức chế miễn dịch (thận trọng)'
        ],
        interactions: [
            'Kháng sinh - kháng sinh có thể giết vi khuẩn có lợi, nên uống cách xa',
            'Thuốc kháng nấm - có thể ảnh hưởng đến men vi sinh'
        ],
        commonSideEffects: [
            'Đầy hơi nhẹ (thường thoáng qua)',
            'Đau bụng nhẹ ban đầu'
        ],
        importantNotes: 'Nên uống cách kháng sinh ít nhất 2 giờ.'
    },

    // Vitamins
    vitaminC: {
        name: 'Vitamin C (Acid ascorbic)',
        otherNames: ['Ascorbic acid', 'Redoxon', 'Vitamin C effervescent'],
        category: 'Vitamin',
        generalUse: 'Tăng cường sức đề kháng, hỗ trợ miễn dịch, chống oxy hóa, hỗ trợ làm lành vết thương.',
        whenNotToUse: [
            'Sỏi thận do oxalate (dùng liều cao thận trọng)',
            'Thiếu G6PD (liều cao)'
        ],
        interactions: [
            'Nhôm (thuốc dạ dày) - tăng hấp thu nhôm',
            'Aspirin liều cao - giảm nồng độ vitamin C',
            'Warfarin - có thể giảm tác dụng chống đông (liều cao)'
        ],
        commonSideEffects: [
            'Buồn nôn, tiêu chảy (liều cao)',
            'Đau dạ dày',
            'Sỏi thận (dùng liều cao kéo dài)'
        ],
        importantNotes: 'Liều khuyến cáo hàng ngày: 65-90mg. Giới hạn tối đa: 2000mg/ngày.'
    },

    // Nasal decongestant
    pseudoephedrine: {
        name: 'Pseudoephedrine',
        otherNames: ['Sudafed', 'Actifed', 'Decolgen'],
        category: 'Thuốc thông mũi',
        generalUse: 'Giảm nghẹt mũi, sung huyết mũi do cảm lạnh, viêm xoang, dị ứng.',
        whenNotToUse: [
            'Tăng huyết áp không kiểm soát',
            'Bệnh tim mạch nặng',
            'Glaucoma góc đóng',
            'U tuyến tiền liệt',
            'Đang dùng MAOI'
        ],
        interactions: [
            'Thuốc MAOI - tăng huyết áp nghiêm trọng',
            'Thuốc tăng huyết áp - giảm tác dụng thuốc',
            'Caffeine - tăng tác dụng kích thích'
        ],
        commonSideEffects: [
            'Mất ngủ',
            'Bồn chồn, lo lắng',
            'Tăng nhịp tim',
            'Khô miệng'
        ],
        importantNotes: '⚠️ Không dùng quá 7 ngày liên tục. Thận trọng với người cao huyết áp.'
    }
}

// Search medication by name
export const searchMedication = (searchTerm) => {
    const term = searchTerm.toLowerCase().trim()
    const results = []

    for (const [key, med] of Object.entries(medicationDatabase)) {
        const nameMatch = med.name.toLowerCase().includes(term)
        const otherNameMatch = med.otherNames.some(name =>
            name.toLowerCase().includes(term)
        )
        const categoryMatch = med.category.toLowerCase().includes(term)

        if (nameMatch || otherNameMatch || categoryMatch) {
            results.push({ id: key, ...med })
        }
    }

    return results
}

// Get medication by ID
export const getMedicationById = (id) => {
    return medicationDatabase[id] ? { id, ...medicationDatabase[id] } : null
}

// Get all medications
export const getAllMedications = () => {
    return Object.entries(medicationDatabase).map(([id, med]) => ({
        id,
        ...med
    }))
}

// Get medications by category
export const getMedicationsByCategory = (category) => {
    return Object.entries(medicationDatabase)
        .filter(([_, med]) => med.category.toLowerCase().includes(category.toLowerCase()))
        .map(([id, med]) => ({ id, ...med }))
}

// Medical disclaimer for medication info
export const MEDICATION_DISCLAIMER = `
⚠️ THÔNG TIN QUAN TRỌNG

Thông tin thuốc được cung cấp chỉ mang tính chất THAM KHẢO.
Ứng dụng KHÔNG kê đơn thuốc và KHÔNG đưa ra liều lượng.

✅ Luôn đọc kỹ hướng dẫn sử dụng trước khi dùng
✅ Tham khảo ý kiến dược sĩ hoặc bác sĩ
✅ Thông báo cho bác sĩ về tất cả thuốc đang dùng
✅ Không tự ý kết hợp nhiều loại thuốc

Nếu có triệu chứng nghiêm trọng, hãy đến cơ sở y tế ngay.
`
