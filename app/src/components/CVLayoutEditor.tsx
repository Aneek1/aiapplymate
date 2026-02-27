import { useState, useEffect } from 'react';
import { X, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface CVTemplate {
  name: string;
  layout: 'modern' | 'classic' | 'minimal';
  columns: 'single' | 'two';
  headerStyle: 'centered' | 'left' | 'compact';
  colorScheme: 'blue' | 'green' | 'purple' | 'gray';
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'relaxed';
}

const defaultTemplates: CVTemplate[] = [
  {
    name: 'Modern Two-Column',
    layout: 'modern',
    columns: 'two',
    headerStyle: 'centered',
    colorScheme: 'blue',
    fontSize: 'medium',
    spacing: 'normal'
  },
  {
    name: 'Classic Single Column',
    layout: 'classic',
    columns: 'single',
    headerStyle: 'left',
    colorScheme: 'green',
    fontSize: 'medium',
    spacing: 'normal'
  },
  {
    name: 'Minimal Clean',
    layout: 'minimal',
    columns: 'single',
    headerStyle: 'compact',
    colorScheme: 'gray',
    fontSize: 'small',
    spacing: 'compact'
  }
];

interface CVLayoutEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: CVTemplate) => void;
  currentTemplate?: CVTemplate;
  formData: any;
  result: any;
}

export default function CVLayoutEditor({ isOpen, onClose, onSave, currentTemplate, formData, result }: CVLayoutEditorProps) {
  const { resolvedMode } = useTheme();
  const dark = resolvedMode === 'dark';
  
  const [template, setTemplate] = useState<CVTemplate>(currentTemplate || defaultTemplates[0]);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const colorSchemes = {
    blue: { primary: '#3b82f6', secondary: '#1e40af', accent: '#dbeafe' },
    green: { primary: '#10b981', secondary: '#047857', accent: '#d1fae5' },
    purple: { primary: '#8b5cf6', secondary: '#6d28d9', accent: '#ede9fe' },
    gray: { primary: '#6b7280', secondary: '#374151', accent: '#f3f4f6' }
  };

  const generatePreview = async () => {
    setLoading(true);
    try {
      // This would call a new API endpoint to generate preview HTML
      // For now, we'll create a simple preview
      const colors = colorSchemes[template.colorScheme];
      const fontSizeMap = { small: '9pt', medium: '10pt', large: '11pt' };
      const spacingMap = { compact: '20px', normal: '25px', relaxed: '30px' };
      
      const previewHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; margin: 20px; background: white; color: #1e293b; }
            .header { text-align: ${template.headerStyle === 'centered' ? 'center' : 'left'}; margin-bottom: ${spacingMap[template.spacing]}; }
            .name { font-size: 24pt; font-weight: 800; color: #0f172a; margin: 0; }
            .title { font-size: 14pt; color: #64748b; margin: 5px 0; }
            .contact { font-size: 9pt; color: #64748b; margin-top: 10px; }
            .main-content { display: ${template.columns === 'two' ? 'flex' : 'block'}; gap: 30px; }
            .left-column { flex: 2; }
            .right-column { flex: 1; }
            .section { margin-bottom: ${spacingMap[template.spacing]}; }
            .section-title { font-size: 12pt; font-weight: 700; color: ${colors.primary}; border-bottom: 2px solid ${colors.primary}; padding-bottom: 4px; margin-bottom: 8px; text-transform: uppercase; }
            .content { font-size: ${fontSizeMap[template.fontSize]}; line-height: 1.5; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">${formData.name || 'Your Name'}</div>
            <div class="title">${formData.jobTitle || 'Software Engineer'}</div>
            <div class="contact">${formData.email} | ${formData.phone} | ${formData.location}</div>
          </div>
          <div class="main-content">
            <div class="left-column">
              <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="content">Experienced professional with expertise in software development and problem-solving.</div>
              </div>
              <div class="section">
                <div class="section-title">Experience</div>
                <div class="content">${result?.tailoredResume?.substring(0, 200) || 'Experience details...'}</div>
              </div>
            </div>
            ${template.columns === 'two' ? `
            <div class="right-column">
              <div class="section">
                <div class="section-title">Skills</div>
                <div class="content">JavaScript, React, Node.js, TypeScript, Python</div>
              </div>
              <div class="section">
                <div class="section-title">Education</div>
                <div class="content">Bachelor of Science in Computer Science</div>
              </div>
            </div>
            ` : ''}
          </div>
        </body>
        </html>
      `;
      
      setPreview(previewHTML);
    } catch (error) {
      console.error('Preview generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generatePreview();
    }
  }, [isOpen, template]);

  const handleSave = () => {
    onSave(template);
    onClose();
  };

  const handleReset = () => {
    setTemplate(currentTemplate || defaultTemplates[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${dark ? 'bg-slate-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Edit CV Layout</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`flex h-[calc(90vh-80px)] ${dark ? 'bg-slate-800' : 'bg-white'}`}>
          {/* Controls Panel */}
          <div className={`w-80 p-6 border-r overflow-y-auto ${dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
            <div className="space-y-6">
              {/* Quick Templates */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Quick Templates</label>
                <div className="space-y-2">
                  {defaultTemplates.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setTemplate(t)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        template.name === t.name
                          ? dark ? 'bg-primary/20 border-primary text-primary' : 'bg-primary/10 border-primary text-primary'
                          : dark ? 'border-slate-600 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="font-medium">{t.name}</div>
                      <div className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t.columns === 'two' ? 'Two-column' : 'Single column'} • {t.layout}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization Options */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Customize</label>
                
                {/* Layout Style */}
                <div className="mb-4">
                  <label className={`block text-xs font-medium mb-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Layout Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['modern', 'classic', 'minimal'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setTemplate({ ...template, layout: style })}
                        className={`p-2 rounded text-xs font-medium transition-all ${
                          template.layout === style
                            ? dark ? 'bg-primary text-white' : 'bg-primary text-white'
                            : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Columns */}
                <div className="mb-4">
                  <label className={`block text-xs font-medium mb-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Columns</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['single', 'two'] as const).map((cols) => (
                      <button
                        key={cols}
                        onClick={() => setTemplate({ ...template, columns: cols })}
                        className={`p-2 rounded text-xs font-medium transition-all ${
                          template.columns === cols
                            ? dark ? 'bg-primary text-white' : 'bg-primary text-white'
                            : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {cols === 'two' ? 'Two Columns' : 'Single Column'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Header Style */}
                <div className="mb-4">
                  <label className={`block text-xs font-medium mb-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Header Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['centered', 'left', 'compact'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setTemplate({ ...template, headerStyle: style })}
                        className={`p-2 rounded text-xs font-medium transition-all ${
                          template.headerStyle === style
                            ? dark ? 'bg-primary text-white' : 'bg-primary text-white'
                            : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="mb-4">
                  <label className={`block text-xs font-medium mb-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Color Scheme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['blue', 'green', 'purple', 'gray'] as const).map((color) => (
                      <button
                        key={color}
                        onClick={() => setTemplate({ ...template, colorScheme: color })}
                        className={`p-2 rounded text-xs font-medium transition-all flex items-center gap-2 ${
                          template.colorScheme === color
                            ? dark ? 'bg-primary text-white' : 'bg-primary text-white'
                            : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-${color}-500`} style={{ backgroundColor: colorSchemes[color].primary }} />
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="mb-4">
                  <label className={`block text-xs font-medium mb-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Font Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setTemplate({ ...template, fontSize: size })}
                        className={`p-2 rounded text-xs font-medium transition-all ${
                          template.fontSize === size
                            ? dark ? 'bg-primary text-white' : 'bg-primary text-white'
                            : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing */}
                <div className="mb-4">
                  <label className={`block text-xs font-medium mb-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Spacing</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['compact', 'normal', 'relaxed'] as const).map((spacing) => (
                      <button
                        key={spacing}
                        onClick={() => setTemplate({ ...template, spacing: spacing })}
                        className={`p-2 rounded text-xs font-medium transition-all ${
                          template.spacing === spacing
                            ? dark ? 'bg-primary text-white' : 'bg-primary text-white'
                            : dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {spacing.charAt(0).toUpperCase() + spacing.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t ${dark ? 'border-slate-700' : 'border-slate-200'}">
                <Button onClick={handleSave} className="w-full bg-primary hover:opacity-90 text-white">
                  Apply Layout
                </Button>
                <button
                  onClick={handleReset}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                    dark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 flex flex-col">
            <div className={`flex items-center justify-between p-4 border-b ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={generatePreview}
                  disabled={loading}
                  className={`p-2 rounded-lg transition-all ${
                    dark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-white">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : preview ? (
                <div dangerouslySetInnerHTML={{ __html: preview }} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  Preview will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
