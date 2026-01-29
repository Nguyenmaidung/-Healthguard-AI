import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
    User,
    Calendar,
    Scale,
    Ruler,
    Heart,
    AlertTriangle,
    Save,
    Trash2,
    Loader2,
    Check,
    Plus,
    X
} from 'lucide-react'

export default function Profile() {
    const { profile, updateProfile, deleteAccount, isGuest } = useAuth()
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        date_of_birth: '',
        gender: '',
        height_cm: '',
        medical_history: [],
        family_history: [],
        allergies: []
    })
    const [newMedicalHistory, setNewMedicalHistory] = useState('')
    const [newFamilyHistory, setNewFamilyHistory] = useState('')
    const [newAllergy, setNewAllergy] = useState('')

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                date_of_birth: profile.date_of_birth || '',
                gender: profile.gender || '',
                height_cm: profile.height_cm || '',
                medical_history: profile.medical_history || [],
                family_history: profile.family_history || [],
                allergies: profile.allergies || []
            })
        }
    }, [profile])

    const handleSave = async () => {
        setLoading(true)
        try {
            await updateProfile(formData)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount()
        } catch (error) {
            console.error('Error deleting account:', error)
        }
    }

    const addToList = (field, value, setValue) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }))
            setValue('')
        }
    }

    const removeFromList = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }

    const calculateAge = (dob) => {
        if (!dob) return null
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Hồ sơ sức khỏe</h1>
                        <p className="text-dark-400">Quản lý thông tin cá nhân và lịch sử y tế</p>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Thông tin cơ bản</h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                            className="input-field"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            Ngày sinh
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                            <input
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                                className="input-field pl-12"
                            />
                        </div>
                        {formData.date_of_birth && (
                            <p className="text-sm text-dark-500 mt-1">
                                {calculateAge(formData.date_of_birth)} tuổi
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            Giới tính
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                            className="input-field"
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                            Chiều cao (cm)
                        </label>
                        <div className="relative">
                            <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                            <input
                                type="number"
                                value={formData.height_cm}
                                onChange={(e) => setFormData(prev => ({ ...prev, height_cm: e.target.value }))}
                                className="input-field pl-12"
                                placeholder="170"
                                min="50"
                                max="250"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical History */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Tiền sử bệnh</h2>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newMedicalHistory}
                        onChange={(e) => setNewMedicalHistory(e.target.value)}
                        className="input-field flex-1"
                        placeholder="VD: Tiểu đường, Cao huyết áp..."
                        onKeyPress={(e) => e.key === 'Enter' && addToList('medical_history', newMedicalHistory, setNewMedicalHistory)}
                    />
                    <button
                        onClick={() => addToList('medical_history', newMedicalHistory, setNewMedicalHistory)}
                        className="btn-secondary px-4"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {formData.medical_history.map((item, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                        >
                            {item}
                            <button onClick={() => removeFromList('medical_history', index)}>
                                <X className="w-4 h-4 hover:text-white" />
                            </button>
                        </span>
                    ))}
                    {formData.medical_history.length === 0 && (
                        <p className="text-dark-500 text-sm">Chưa có thông tin</p>
                    )}
                </div>
            </div>

            {/* Family History */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Tiền sử bệnh gia đình</h2>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newFamilyHistory}
                        onChange={(e) => setNewFamilyHistory(e.target.value)}
                        className="input-field flex-1"
                        placeholder="VD: Ung thư, Bệnh tim mạch..."
                        onKeyPress={(e) => e.key === 'Enter' && addToList('family_history', newFamilyHistory, setNewFamilyHistory)}
                    />
                    <button
                        onClick={() => addToList('family_history', newFamilyHistory, setNewFamilyHistory)}
                        className="btn-secondary px-4"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {formData.family_history.map((item, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                        >
                            {item}
                            <button onClick={() => removeFromList('family_history', index)}>
                                <X className="w-4 h-4 hover:text-white" />
                            </button>
                        </span>
                    ))}
                    {formData.family_history.length === 0 && (
                        <p className="text-dark-500 text-sm">Chưa có thông tin</p>
                    )}
                </div>
            </div>

            {/* Allergies */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning-400" />
                    Dị ứng
                </h2>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        className="input-field flex-1"
                        placeholder="VD: Penicillin, Hải sản..."
                        onKeyPress={(e) => e.key === 'Enter' && addToList('allergies', newAllergy, setNewAllergy)}
                    />
                    <button
                        onClick={() => addToList('allergies', newAllergy, setNewAllergy)}
                        className="btn-secondary px-4"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((item, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-danger-500/20 text-danger-400 rounded-full text-sm"
                        >
                            {item}
                            <button onClick={() => removeFromList('allergies', index)}>
                                <X className="w-4 h-4 hover:text-white" />
                            </button>
                        </span>
                    ))}
                    {formData.allergies.length === 0 && (
                        <p className="text-dark-500 text-sm">Chưa có thông tin</p>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang lưu...
                        </>
                    ) : saved ? (
                        <>
                            <Check className="w-5 h-5" />
                            Đã lưu
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Lưu thay đổi
                        </>
                    )}
                </button>

                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-danger-400 hover:text-danger-300 flex items-center gap-2 text-sm"
                >
                    <Trash2 className="w-4 h-4" />
                    Xóa tài khoản
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card p-6 max-w-md w-full animate-slide-up">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger-500/20 flex items-center justify-center">
                                <Trash2 className="w-8 h-8 text-danger-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Xóa tài khoản?</h3>
                            <p className="text-dark-400 mb-6">
                                Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="btn-danger flex-1"
                                >
                                    Xóa vĩnh viễn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
