import { useState } from 'react'
import {
    searchMedication,
    getAllMedications,
    MEDICATION_DISCLAIMER
} from '../lib/ai/medicationData'
import {
    Pill,
    Search,
    AlertTriangle,
    Info,
    AlertCircle,
    Ban,
    Zap,
    ChevronDown,
    ChevronUp,
    X
} from 'lucide-react'

export default function MedicationCheck() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedMed, setSelectedMed] = useState(null)
    const [showDisclaimer, setShowDisclaimer] = useState(true)

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchTerm.trim()) {
            setSearchResults([])
            return
        }
        const results = searchMedication(searchTerm)
        setSearchResults(results)
        setSelectedMed(null)
    }

    const handleInputChange = (value) => {
        setSearchTerm(value)
        if (value.trim()) {
            const results = searchMedication(value)
            setSearchResults(results)
        } else {
            setSearchResults([])
        }
    }

    const allMedications = getAllMedications()

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                        <Pill className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Tra cứu thuốc OTC</h1>
                        <p className="text-dark-400">Tìm hiểu thông tin thuốc không kê đơn</p>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            {showDisclaimer && (
                <div className="glass-card p-4 border-warning-500/30 bg-warning-500/5 relative">
                    <button
                        onClick={() => setShowDisclaimer(false)}
                        className="absolute top-3 right-3 text-dark-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-start gap-3 pr-8">
                        <AlertTriangle className="w-5 h-5 text-warning-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-dark-300 whitespace-pre-line">
                            {MEDICATION_DISCLAIMER}
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="glass-card p-6">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="input-field pl-12 pr-24"
                        placeholder="Tìm kiếm thuốc... VD: Paracetamol, ibuprofen, vitamin C"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm"
                    >
                        Tìm kiếm
                    </button>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && !selectedMed && (
                    <div className="mt-4 space-y-2">
                        <p className="text-sm text-dark-400">
                            Tìm thấy {searchResults.length} kết quả
                        </p>
                        {searchResults.map((med) => (
                            <button
                                key={med.id}
                                onClick={() => setSelectedMed(med)}
                                className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl 
                           border border-white/10 hover:border-primary-500/30 
                           transition-all duration-200"
                            >
                                <h3 className="font-semibold text-white">{med.name}</h3>
                                <p className="text-sm text-dark-400">{med.category}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {med.otherNames.slice(0, 3).map((name, i) => (
                                        <span key={i} className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {searchTerm && searchResults.length === 0 && (
                    <div className="mt-4 text-center text-dark-400 py-8">
                        <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Không tìm thấy thuốc "{searchTerm}"</p>
                        <p className="text-sm mt-1">Thử tìm với tên khác</p>
                    </div>
                )}
            </div>

            {/* Selected Medication Detail */}
            {selectedMed && (
                <div className="glass-card p-6 animate-slide-up">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">{selectedMed.name}</h2>
                            <p className="text-primary-400">{selectedMed.category}</p>
                        </div>
                        <button
                            onClick={() => setSelectedMed(null)}
                            className="text-dark-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Other Names */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {selectedMed.otherNames.map((name, i) => (
                            <span key={i} className="text-sm px-3 py-1 bg-white/10 text-dark-300 rounded-full">
                                {name}
                            </span>
                        ))}
                    </div>

                    {/* General Use */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary-400" />
                            Công dụng chung
                        </h3>
                        <p className="text-dark-300">{selectedMed.generalUse}</p>
                    </div>

                    {/* When Not to Use */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <Ban className="w-5 h-5 text-danger-400" />
                            Không dùng khi
                        </h3>
                        <ul className="space-y-2">
                            {selectedMed.whenNotToUse.map((item, i) => (
                                <li key={i} className="text-dark-300 text-sm flex items-start gap-2">
                                    <span className="w-2 h-2 rounded-full bg-danger-400 mt-1.5 flex-shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Interactions */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-warning-400" />
                            Tương tác thuốc
                        </h3>
                        <ul className="space-y-2">
                            {selectedMed.interactions.map((item, i) => (
                                <li key={i} className="text-dark-300 text-sm flex items-start gap-2">
                                    <span className="w-2 h-2 rounded-full bg-warning-400 mt-1.5 flex-shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Side Effects */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-purple-400" />
                            Tác dụng phụ thường gặp
                        </h3>
                        <ul className="space-y-2">
                            {selectedMed.commonSideEffects.map((item, i) => (
                                <li key={i} className="text-dark-300 text-sm flex items-start gap-2">
                                    <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Important Notes */}
                    {selectedMed.importantNotes && (
                        <div className="p-4 bg-warning-500/10 border border-warning-500/30 rounded-xl">
                            <p className="text-warning-400 text-sm">{selectedMed.importantNotes}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Browse All Medications */}
            {!searchTerm && !selectedMed && (
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Danh mục thuốc OTC phổ biến</h2>
                    <div className="grid gap-3">
                        {allMedications.map((med) => (
                            <button
                                key={med.id}
                                onClick={() => setSelectedMed(med)}
                                className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl 
                           border border-white/10 hover:border-primary-500/30 
                           transition-all duration-200 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                                            {med.name}
                                        </h3>
                                        <p className="text-sm text-dark-400">{med.category}</p>
                                    </div>
                                    <ChevronDown className="w-5 h-5 text-dark-400 group-hover:text-primary-400" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
