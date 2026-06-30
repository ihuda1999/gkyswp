/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Package, MapPin, Camera, AlertCircle, Upload, ShieldAlert, X, ChevronDown, Check } from 'lucide-react';
import { ITEM_CATEGORIES, STORE_ZONES, ZONE_TABLES } from '../mockData';
import { LostItem, UserRole } from '../types';

interface ReportFormProps {
  currentUser: { name: string; role: UserRole };
  onSubmit: (item: Omit<LostItem, 'id' | 'createdAt' | 'status' | 'logs' | 'handovers' | 'claimant' | 'matchedFeatures'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ReportForm({ currentUser, onSubmit, onCancel, isSubmitting = false }: ReportFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(ITEM_CATEGORIES[0]);
  const [zone, setZone] = useState(STORE_ZONES[0]);
  const [table, setTable] = useState('');
  const [description, setDescription] = useState('');
  const [isHighValue, setIsHighValue] = useState(false);
  
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showZoneSheet, setShowZoneSheet] = useState(false);
  const [showTableSuggestions, setShowTableSuggestions] = useState(false);
  
  const availableTables = ZONE_TABLES[zone] || [];
  const filteredTables = availableTables.filter(t => t.toLowerCase().includes(table.toLowerCase()));

  // Use a ref to detect clicks outside the autocomplete to close it
  const tableRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setShowTableSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const [overallPhoto, setOverallPhoto] = useState<string | null>(null);
  const [detailPhoto, setDetailPhoto] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'overall' | 'detail') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'overall') setOverallPhoto(event.target?.result as string);
        else setDetailPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked, name:", name, "overallPhoto:", !!overallPhoto, "detailPhoto:", !!detailPhoto);
    if (!name.trim()) {
       alert('请输入物品名称');
       return;
    }
    if (!overallPhoto || !detailPhoto) {
       alert('请上传照片');
       return;
    }
    
    console.log("Submitting item...", name);
    onSubmit({
      name: name.trim(),
      category,
      foundTime: new Date().toISOString(),
      foundLocation: { zone, table: table.trim() || '无特定桌号' },
      description: description.trim(),
      overallPhoto,
      detailPhoto,
      finderName: currentUser.name,
      isHighValue
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
      
      {/* 1. Basic Info */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-red-500 rounded-full shadow-sm"></div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            物品基本信息
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="group relative">
            <label className="block text-sm font-semibold text-slate-700 mb-2">物品名称 <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                placeholder="例如：华为Mate60 Pro"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-slate-900 placeholder-slate-400 transition-all duration-300 shadow-sm"
              />
            </div>
          </div>

          <div className="group relative">
            <label className="block text-sm font-semibold text-slate-700 mb-3">物品类别 <span className="text-red-500">*</span></label>
            <div 
              className="relative cursor-pointer"
              onClick={() => setShowCategorySheet(true)}
            >
              <div className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 flex items-center justify-between hover:bg-slate-100 transition-colors shadow-sm">
                <span className="font-medium">{category}</span>
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* High Value Toggle (Modern Switch) */}
        <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
            isHighValue 
              ? 'border-red-500 bg-red-50/40 shadow-inner' 
              : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
          }`}>
          <label className="relative flex items-center p-5 cursor-pointer">
            <div className="flex-1 flex items-center gap-4">
               <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 ${isHighValue ? 'bg-red-100' : 'bg-slate-100'}`}>
                 <ShieldAlert className={`w-6 h-6 ${isHighValue ? 'text-red-600' : 'text-slate-400'}`} />
               </div>
               <div>
                  <h4 className={`text-base font-bold ${isHighValue ? 'text-red-700' : 'text-slate-900'}`}>标记为贵重物品</h4>
                  <p className="text-sm text-slate-500 mt-0.5">预估物品金额大于500，将通知主管确认流程。</p>
               </div>
            </div>
            
            <div className="relative ml-4 inline-flex items-center">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isHighValue}
                onChange={(e) => setIsHighValue(e.target.checked)}
              />
              <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
            </div>
          </label>
        </div>
      </section>

      {/* 2. Location */}
      <section className="space-y-6 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-red-500 rounded-full shadow-sm"></div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            发现地点及特征
          </h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">区域 <span className="text-red-500">*</span></label>
            <div 
              className="relative cursor-pointer"
              onClick={() => setShowZoneSheet(true)}
            >
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <div className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 flex items-center justify-between hover:bg-slate-100 transition-colors shadow-sm">
                <span className="font-medium">{zone}</span>
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2 relative" ref={tableRef}>
            <label className="block text-sm font-semibold text-slate-700">桌号</label>
            <input
              type="text"
              placeholder="如：朝食"
              value={table}
              onChange={(e) => {
                setTable(e.target.value);
                setShowTableSuggestions(true);
              }}
              onFocus={() => setShowTableSuggestions(true)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-slate-900 placeholder-slate-400 transition-all duration-300 shadow-sm"
            />
            {showTableSuggestions && table.trim() !== '' && filteredTables.length > 0 && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredTables.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTable(t);
                      setShowTableSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 font-medium transition-colors border-b border-slate-50 last:border-0"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">外观特征描述 <span className="text-red-500">*</span></label>
          <textarea
            required
            rows={3}
            placeholder="详细描述物品颜色、材质、品牌、划痕等明显特征，越详细越容易比对..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-slate-900 placeholder-slate-400 transition-all duration-300 resize-none shadow-sm"
          />
        </div>
      </section>

      {/* 3. Photos */}
      <section className="space-y-6 pt-8 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-5 bg-red-500 rounded-full shadow-sm"></div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              物品照片上传
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">必填项</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Overall Photo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
               <label className="block text-sm font-semibold text-slate-700">整体外观图</label>
               {overallPhoto && <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md"><Check className="w-3.5 h-3.5"/>已上传</span>}
            </div>
            
            {overallPhoto ? (
              <div className="relative w-full aspect-square sm:aspect-video rounded-2xl overflow-hidden bg-slate-100 group border border-slate-200 shadow-sm">
                <img referrerPolicy="no-referrer" src={overallPhoto} alt="Overall View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setOverallPhoto(null)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors border border-white/20"
                  >
                    <X className="w-4 h-4" /> 重新上传
                  </button>
                </div>
              </div>
            ) : (
              <label className="w-full aspect-square sm:aspect-video border-2 border-dashed border-slate-300 hover:border-red-500 hover:bg-red-50/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-all duration-300 group shadow-sm p-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 border border-slate-100 shrink-0">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-red-500 transition-colors" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-red-600 transition-colors text-center px-1 mb-1 leading-tight">拍摄或上传整体图</span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium text-center px-1 leading-tight">支持 JPG, PNG</span>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'overall')} className="hidden" />
              </label>
            )}
          </div>

          {/* Detail Photo */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
               <label className="block text-sm font-semibold text-slate-700">特征细节图</label>
               {detailPhoto && <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md"><Check className="w-3.5 h-3.5"/>已上传</span>}
            </div>
            {detailPhoto ? (
              <div className="relative w-full aspect-square sm:aspect-video rounded-2xl overflow-hidden bg-slate-100 group border border-slate-200 shadow-sm">
                <img referrerPolicy="no-referrer" src={detailPhoto} alt="Detail View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setDetailPhoto(null)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors border border-white/20"
                  >
                    <X className="w-4 h-4" /> 重新上传
                  </button>
                </div>
              </div>
            ) : (
              <label className="w-full aspect-square sm:aspect-video border-2 border-dashed border-slate-300 hover:border-red-500 hover:bg-red-50/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-all duration-300 group shadow-sm p-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 border border-slate-100 shrink-0">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-red-500 transition-colors" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-red-600 transition-colors text-center px-1 mb-1 leading-tight">拍摄或上传细节图</span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium text-center px-1 leading-tight">划痕、品牌Logo等</span>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'detail')} className="hidden" />
              </label>
            )}
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="pt-8 mt-10 border-t border-slate-100 flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-auto px-10 py-4 text-base font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 ${
            overallPhoto && detailPhoto && !isSubmitting
              ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5'
              : isSubmitting 
                ? 'bg-red-400 text-white cursor-wait'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
          }`}
        >
          {isSubmitting ? (
            <>
               <span className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
               提交中...
            </>
          ) : (
            <>
               <AlertCircle className="w-5 h-5" />
               提交通知前台
            </>
          )}
        </button>
      </div>

      {/* Category Bottom Sheet */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${showCategorySheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCategorySheet(false)}></div>
        <div className={`absolute bottom-0 inset-x-0 bg-white rounded-t-3xl transition-transform duration-300 transform ${showCategorySheet ? 'translate-y-0' : 'translate-y-full'} shadow-2xl`}>
           <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-lg font-bold text-slate-900">选择物品类别</h4>
              <button type="button" onClick={() => setShowCategorySheet(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"><X className="w-5 h-5"/></button>
           </div>
           <div className="max-h-[60vh] overflow-y-auto p-5 pb-10 space-y-2.5">
              {ITEM_CATEGORIES.map(cat => (
                 <button 
                   type="button" 
                   key={cat} 
                   onClick={() => { setCategory(cat); setShowCategorySheet(false); }} 
                   className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${category === cat ? 'bg-red-50 text-red-600 ring-2 ring-red-500/20' : 'text-slate-700 bg-slate-50 hover:bg-slate-100'}`}
                 >
                    <div className="flex items-center justify-between">
                      <span>{cat}</span>
                      {category === cat && <Check className="w-5 h-5" />}
                    </div>
                 </button>
              ))}
           </div>
        </div>
      </div>

      {/* Zone Bottom Sheet */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${showZoneSheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowZoneSheet(false)}></div>
        <div className={`absolute bottom-0 inset-x-0 bg-white rounded-t-3xl transition-transform duration-300 transform ${showZoneSheet ? 'translate-y-0' : 'translate-y-full'} shadow-2xl`}>
           <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-lg font-bold text-slate-900">选择拾获区域</h4>
              <button type="button" onClick={() => setShowZoneSheet(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"><X className="w-5 h-5"/></button>
           </div>
           <div className="max-h-[60vh] overflow-y-auto p-5 pb-10 space-y-2.5">
              {STORE_ZONES.map(z => (
                 <button 
                   type="button" 
                   key={z} 
                   onClick={() => { setZone(z); setTable(''); setShowZoneSheet(false); }} 
                   className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all ${zone === z ? 'bg-red-50 text-red-600 ring-2 ring-red-500/20' : 'text-slate-700 bg-slate-50 hover:bg-slate-100'}`}
                 >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <MapPin className={`w-5 h-5 ${zone === z ? 'text-red-500' : 'text-slate-400'}`} />
                         <span>{z}</span>
                      </div>
                      {zone === z && <Check className="w-5 h-5" />}
                    </div>
                 </button>
              ))}
           </div>
        </div>
      </div>
    </form>
  );
}
